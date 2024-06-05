import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import HeaderTitle from '../../components/HeaderTitle';

type RootStackParamList = {
  explore: undefined;
  message: { userName: string; initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string }> };
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

  // Convert timestamps from string to Date
  const initialMessages = initialMessagesRaw.map(message => ({
    ...message,
    timestamp: new Date(message.timestamp)
  }));

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const filteredMessages = messages
    .filter(message => message.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('explore')}>
            <Text style={styles.headerText}>Retour</Text>
          </TouchableOpacity>
          <HeaderTitle title="Message" />
          <TouchableOpacity onPress={() => setShowSearchBar(prev => !prev)}>
            <Text style={styles.headerText}>Filtrer</Text>
          </TouchableOpacity>
        </View>
        {showSearchBar && (
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
                <Text style={message.sender === 'left' ? styles.messageText : styles.messageTextRight}>{message.text}</Text>
              </View>
              <Text style={styles.timestamp}>{formatDate(new Date(message.timestamp))}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {isSelecting && selectedMessages.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMessages}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        )}
        {!hasSentMessage && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>Ne divulguez pas vos informations personnelles</Text>
          </View>
        )}
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Écrire ici..."
            value={newMessage}
            onChangeText={setNewMessage}
            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 40, // Increased padding to make the header larger
    backgroundColor: '#668F80',
  },
  headerText: {
    color: 'white',
    fontSize: 18, // Adjusted font size
  },
  headerTitle: {
    fontSize: 24, // Adjusted font size
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center align
    padding: 20, // Increased padding to make the chat header larger
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
    fontSize: 22, // Adjusted font size
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'column', // Changed to column to stack the timestamp below the message
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
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
