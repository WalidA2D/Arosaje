import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform, Keyboard, Modal, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime';
import Load from '../../components/Loading';

type MessageType = {
  id: string;
  text: string;
  sender: 'left' | 'right';
  timestamp: Date;
  image?: string;
};

const socketUrl = process.env.EXPO_PUBLIC_SOCKET_IP || '';
const socket = io(`${socketUrl}`);

type RootStackParamList = {
  explore: undefined;
  message: { userName: string; idUser: number; conversationId: number; initialMessages: Array<{ id: string; text: string; sender: string; timestamp: string, image?: string }> };
  Profil: { userName: string, idUser: number };
};

type MessageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'message'>;
type MessageScreenRouteProp = RouteProp<RootStackParamList, 'message'>;

const formatDate = (timestamp: Date) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

  if (diffInSeconds < 10) return 'à l\'instant';
  if (diffInSeconds < 60) return `il y a ${diffInSeconds} secondes`;
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heures`;

  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  if (now.getDate() - messageDate.getDate() === 1) return 'hier';
  if (now.getFullYear() !== messageDate.getFullYear()) {
    options.year = 'numeric';
    options.month = 'numeric';
    options.day = 'numeric';
  } else if (now.getMonth() !== messageDate.getMonth()) {
    options.month = 'numeric';
    options.day = 'numeric';
  } else {
    options.day = 'numeric';
  }

  return new Intl.DateTimeFormat('fr-FR', options).format(messageDate);
};

export default function MessageScreen() {
  const navigation = useNavigation<MessageScreenNavigationProp>();
  const route = useRoute<MessageScreenRouteProp>();
  const { userName, idUser, conversationId, initialMessages: initialMessagesRaw } = route.params;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState<boolean>(false);
  const [imageToView, setImageToView] = useState<{ url: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const currentUserId = socket.id;

  useEffect(() => {
    socket.emit('joinConversation', conversationId);
    console.log(`Joining conversation: ${conversationId}`);

    loadMessages(conversationId);

    socket.on('receiveMessage', (message) => {
        if (message.idUser !== idUser) {
            const newMessage: MessageType = { 
                id: uuidv4(), 
                text: message.text, 
                sender: 'left', 
                timestamp: new Date(), 
                image: message.image || undefined 
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    });

    return () => {
        socket.off('receiveMessage');
        socket.emit('leaveConversation', conversationId);
        console.log(`Leaving conversation: ${conversationId}`);
    };
}, [conversationId]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  const loadMessages = async (conversationId: number) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken || '',
        }
    };

    try {
        const response = await fetch(`${apiUrl}/msg/messages/${conversationId}`, options);
        const data = await response.json();

        if (response.ok && data.success) {
            const apiMessages: MessageType[] = [];

            for (const msg of data.record) {
                let formattedTimestamp = msg.publishedAt.replace(' ', 'T');
                formattedTimestamp = formattedTimestamp.replace(' +00:00', '+00:00');
                const timestamp = new Date(formattedTimestamp);

                if (isNaN(timestamp.getTime())) {
                    console.warn(`Invalid timestamp for message ID: ${msg.idMessages}`);
                    continue;
                }

                apiMessages.push({
                    id: msg.idMessages.toString(),
                    text: msg.text,
                    sender: msg.idUser === idUser ? 'left' : 'right',
                    timestamp,
                    image: msg.file || undefined,
                });
            }

            setMessages(apiMessages);
        } else {
            console.error('Failed to load messages from API:', data.msg || 'Unknown error');
        }
    } catch (error) {
        console.error('Error fetching messages from API:', error);
    }
};

  const filteredMessages = messages
    .filter(message => message.text?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setShowSearchBar(!showSearchBar)} style={{ marginRight: 10 }}>
          <Icon name="filter" size={20} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation, showSearchBar]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || selectedImage) {
        const newMessageData: MessageType = {
            id: uuidv4(),
            text: newMessage,
            sender: 'right',  
            timestamp: new Date(),
            image: selectedImage,  
        };

        setMessages(prevMessages => [...prevMessages, newMessageData]);

        socket.emit('sendMessage', { conversationId, message: newMessageData, idUser });

        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const formData = new FormData();

            if (selectedImage) {
                const fileName = selectedImage.split('/').pop();
                const fileType = mime.getType(selectedImage);

                formData.append('file', {
                    uri: selectedImage,
                    name: fileName || 'image.jpg',
                    type: fileType || 'image/jpeg',
                } as any);
                formData.append('text', '');
            } else {
                formData.append('text', newMessage);
            }

            formData.append('idConversation', conversationId.toString());
            formData.append('idUser', idUser.toString());

            const options = {
                method: 'POST',
                headers: {
                    'Authorization': userToken || '',
                },
                body: formData,
            };

            const response = await fetch(`${apiUrl}/msg/add`, options);
            const data = await response.json();

            if (!data.success) {
                console.error('Failed to send message to API:', data.msg);
            } else {
                console.log('Message successfully sent to API');

                if (data.imageUrl) {
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === newMessageData.id ? { ...msg, image: data.imageUrl } : msg
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error sending message to API:', error);
        }

        setNewMessage('');
        setSelectedImage(undefined); 
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }
};

  const handleSendImage = (uri: string) => {
    setSelectedImage(uri);
    handleSendMessage();
  };

  const handleLongPressMessage = (id: string, sender: 'left' | 'right') => {
    if (sender === 'right') {  // Seuls les messages à droite peuvent être sélectionnés
      setIsSelecting(true);
      setSelectedMessages([id]);
      console.log('Long pressed message with id:', id);
    }
  };

  const handleSelectMessage = (id: string, sender: 'left' | 'right') => {
    if (sender === 'right') {  // Seuls les messages à droite peuvent être sélectionnés
      setSelectedMessages(prevSelectedMessages =>
        prevSelectedMessages.includes(id)
          ? prevSelectedMessages.filter(messageId => messageId !== id)
          : [...prevSelectedMessages, id]
      );
      console.log('Selected message with id:', id);
    }
  };

  const deleteMessage = async (idMessage: string) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken || '',
      },
    };

    try {
      const response = await fetch(`${apiUrl}/msg/delete/${idMessage}`, options);
      const data = await response.json();

      if (!data.success) {
        console.error('Failed to delete message:', data.msg);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteMessages = async () => {
    setLoading(true);
    for (const idMessage of selectedMessages) {
      await deleteMessage(idMessage);
    }

    const updatedMessages = messages.filter(message => !selectedMessages.includes(message.id));
    setMessages(updatedMessages);
    setIsSelecting(false);
    setSelectedMessages([]);
    setLoading(false);
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setSelectedMessages([]);
  };

  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      handleSendImage(pickerResult.assets[0].uri);
    }
  };

  const handleImagePress = (uri: string | undefined) => {
    if (uri) {
      setImageToView([{ url: uri }]);
      setIsImageViewerVisible(true);
      console.log('Image pressed:', uri);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedMessages.length === 0) {
      setIsSelecting(false);
    }
  }, [selectedMessages]);

  const hasUserMessages = messages.some(message => message.sender === 'right');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <View style={styles.container}>
        {loading && (
          <Load></Load>
        )}
        {showSearchBar && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Icon name="search" size={20} color="#668F80" style={styles.searchIcon} />
          </View>
        )}
        <Pressable onPress={() => navigation.navigate('Profil', { userName, idUser })}>
          <View style={styles.chatHeader}>
            <Image source={{ uri: 'https://picsum.photos/620/300' }} style={styles.avatar} />
            <Text style={styles.chatName}>{userName}</Text>
          </View>
        </Pressable>
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          {filteredMessages.map(message => (
            <Pressable
              key={message.id}
              onLongPress={() => handleLongPressMessage(message.id, message.sender)}
              onPress={() => isSelecting && handleSelectMessage(message.id, message.sender)}
              style={[
                styles.messageContainer,
                message.sender === 'right' && styles.messageContainerRight,
                selectedMessages.includes(message.id) && styles.messageSelected
              ]}
            >
              <View style={message.sender === 'left' ? styles.messageBubbleLeft : styles.messageBubbleRight}>
                {message.image ? (
                  <Pressable onPress={() => handleImagePress(message.image)}>
                    <Image source={{ uri: message.image }} style={styles.messageImage} />
                  </Pressable>
                ) : (
                  <Text style={message.sender === 'left' ? styles.messageText : styles.messageTextRight}>{message.text}</Text>
                )}
              </View>
              <Text style={styles.timestamp}>{formatDate(new Date(message.timestamp))}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {isSelecting && selectedMessages.length > 0 && (
          <View style={styles.selectionButtonsContainer}>
            <Pressable style={styles.cancelButton} onPress={handleCancelSelection}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDeleteMessages}>
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </Pressable>
          </View>
        )}
        {!hasUserMessages && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>Ne divulguez pas vos informations personnelles</Text>
          </View>
        )}
        <View style={styles.footer}>
          <Pressable style={styles.attachmentButton} onPress={openImagePicker}>
            <Icon name="paperclip" size={24} color="#668F80" />
          </Pressable>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Écrire ici..."
            value={newMessage}
            onChangeText={setNewMessage}
            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          />
          <Pressable style={styles.sendButton} onPress={handleSendMessage}>
            <Icon name="arrow-up" size={15} color="#FFF" />
          </Pressable>
        </View>
        {isImageViewerVisible && (
          <Modal visible={isImageViewerVisible} transparent={true}>
            <ImageViewer imageUrls={imageToView} onClick={() => setIsImageViewerVisible(false)} />
          </Modal>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 40,
    backgroundColor: '#668F80',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  selectionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cancelButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatName: {
    fontSize: 22,
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  messageContainerRight: {
    alignItems: 'flex-end',
  },
  messageSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  messageBubbleLeft: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  messageBubbleRight: {
    backgroundColor: '#668F80',
    alignSelf: 'flex-end',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  messageText: {
    color: '#000',
  },
  messageTextRight: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#668F80',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentButton: {
    padding: 10,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
  },
});
