import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Keyboard, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

type RootStackParamList = {
  explore: undefined;
  message: { userName: string; initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string, image?: string }> };
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
  const { userName, initialMessages: initialMessagesRaw } = route.params;

  const initialMessages = initialMessagesRaw.map(message => ({
    ...message,
    timestamp: new Date(message.timestamp)
  }));

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState<boolean>(false);
  const [imageToView, setImageToView] = useState<{ url: string }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const filteredMessages = messages
    .filter(message => message.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowSearchBar(!showSearchBar)} style={{ marginRight: 10 }}>
          <Icon name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showSearchBar]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageData = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'right',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessageData]);
      setNewMessage('');
      setHasSentMessage(true);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSendImage = (uri: string) => {
    const newMessageData = {
      id: messages.length + 1,
      text: '',
      image: uri,
      sender: 'right',
      timestamp: new Date(),
    };
    setMessages([...messages, newMessageData]);
    setHasSentMessage(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleLongPressMessage = (id: number) => {
    setIsSelecting(true);
    setSelectedMessages([id]);
  };

  const handleSelectMessage = (id: number) => {
    setSelectedMessages(prevSelectedMessages =>
      prevSelectedMessages.includes(id)
        ? prevSelectedMessages.filter(messageId => messageId !== id)
        : [...prevSelectedMessages, id]
    );
  };

  const handleDeleteMessages = () => {
    setMessages(prevMessages =>
      prevMessages.filter(message => !selectedMessages.includes(message.id))
    );
    setIsSelecting(false);
    setSelectedMessages([]);
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setSelectedMessages([]);
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      handleSendImage(result.assets[0].uri);
    }
  };

  const handleImagePress = (uri?: string) => {
    if (uri) {
      setImageToView([{ url: uri }]);
      setIsImageViewerVisible(true);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
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

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        setMessages(prevMessages => [...prevMessages]);
      }, 40000); // Mettre à jour toutes les 40 secondes
      return () => clearInterval(interval);
    }, [])
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <View style={styles.container}>
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
        <View style={styles.chatHeader}>
          <Image source={{ uri: 'https://picsum.photos/620/300' }} style={styles.avatar} />
          <Text style={styles.chatName}>{userName}</Text>
        </View>
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          {filteredMessages.map(message => (
            <TouchableOpacity
              key={message.id}
              onLongPress={() => handleLongPressMessage(message.id)}
              onPress={() => isSelecting && handleSelectMessage(message.id)}
              style={[
                styles.messageContainer,
                message.sender === 'right' && styles.messageContainerRight,
                selectedMessages.includes(message.id) && styles.messageSelected
              ]}
            >
              <View style={message.sender === 'left' ? styles.messageBubbleLeft : styles.messageBubbleRight}>
                {message.image ? (
                  <TouchableOpacity onPress={() => handleImagePress(message.image)}>
                    <Image source={{ uri: message.image }} style={styles.messageImage} />
                  </TouchableOpacity>
                ) : (
                  <Text style={message.sender === 'left' ? styles.messageText : styles.messageTextRight}>{message.text}</Text>
                )}
              </View>
              <Text style={styles.timestamp}>{formatDate(new Date(message.timestamp))}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {isSelecting && selectedMessages.length > 0 && (
          <View style={styles.selectionButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSelection}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMessages}>
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        {!hasSentMessage && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>Ne divulguez pas vos informations personnelles</Text>
          </View>
        )}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.attachmentButton} onPress={openImagePicker}>
            <Icon name="paperclip" size={24} color="#668F80" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Écrire ici..."
            value={newMessage}
            onChangeText={setNewMessage}
            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Icon name="arrow-up" size={15} color="#FFF" />
          </TouchableOpacity>
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
  messageText: {
    color: '#333',
  },
  messageTextRight: {
    color: '#FFF',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
  },
  warningContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF0F0',
    borderTopColor: '#FF0000',
    borderTopWidth: 1,
  },
  warningText: {
    color: '#FF0000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#668F80',
    borderRadius: 20,
    padding: 10,
  },
  attachmentButton: {
    marginRight: 10,
  },
});
