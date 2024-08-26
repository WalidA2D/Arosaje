import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert, Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Bonjour! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

const chatbotOptions: { [key: string]: string } = {
  "Qui êtes vous?": "Nous sommes Arosa-je, nous aidons les particuliers à prendre soin de leurs plantes! Vous pouvez en savoir plus sur nous en cliquant ici.",
  "Comment contacter le support?": "Vous pouvez contacter le support par téléphone au tel:07 69 20 47 49 ou par email à mailto:support@example.com",
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={resetConversation} style={{ marginRight: 10 }}>
            <Icon name="redo" size={20} color="#fff" />
          </Pressable>
        ),
      });
    }, [navigation])
  );

  const resetConversation = () => {
    setMessages(initialMessages);
  };

  const handleUserSelection = (userMessage: string) => {
    const userMessageData: Message = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessageData]);

    setTimeout(() => {
      handleBotResponse(userMessage);
    }, 500);
  };

  const handleBotResponse = (userMessage: string) => {
    const botResponse = chatbotOptions[userMessage] || "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler?";
    const botMessageData: Message = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, botMessageData]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleLinkPress = (text: string) => {
    if (text.includes('tel:')) {
      Alert.alert(
        'Contact Support',
        `Voulez-vous appeler 07 69 20 47 49 ou envoyer un email?`,
        [
          {
            text: 'Appeler',
            onPress: () => Linking.openURL(`tel:07 69 20 47 49`),
          },
          {
            text: 'Envoyer un email',
            onPress: () => Linking.openURL(`mailto:support@example.com`),
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } else if (text.includes('mailto:')) {
      const emailAddress = text.split('mailto:')[1];
      Alert.alert(
        'Contact Support',
        `Voulez-vous envoyer un email à ${emailAddress}?`,
        [
          {
            text: 'Envoyer un email',
            onPress: () => Linking.openURL(`mailto:${emailAddress}`),
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } else if (text.includes('ici')) {
      Alert.alert(
        'Consulter le site',
        `Voulez-vous consulter le site ?`,
        [
          {
            text: 'Consulter',
            onPress: () => navigation.navigate('Histoire'),
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
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

  const chatbotPrompts = Object.keys(chatbotOptions);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          {messages.map(message => (
            <Pressable
              key={message.id}
              onPress={() => message.sender === 'bot' && handleLinkPress(message.text)}
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.messageContainerRight : styles.messageContainerLeft,
              ]}
            >
              <View style={message.sender === 'user' ? styles.messageBubbleRight : styles.messageBubbleLeft}>
                <Text style={message.sender === 'user' ? styles.messageTextRight : styles.messageTextLeft}>
                  {message.text}
                </Text>
              </View>
              <Text style={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.optionsWrapper}>
          <ScrollView
            horizontal
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContentContainer}
            showsHorizontalScrollIndicator={false}
          >
            {chatbotPrompts.map(option => (
              <Pressable key={option} style={styles.optionButton} onPress={() => handleUserSelection(option)}>
                <Text style={styles.optionButtonText}>{option}</Text>
              </Pressable>
            ))}
          </ScrollView>
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
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageContainerLeft: {
    alignItems: 'flex-start',
  },
  messageContainerRight: {
    alignItems: 'flex-end',
  },
  messageBubbleLeft: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
  },
  messageBubbleRight: {
    backgroundColor: '#668F80',
    borderRadius: 10,
    padding: 10,
  },
  messageTextLeft: {
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
  optionsWrapper: {
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
    paddingVertical: 5,
  },
  optionsContainer: {
    height: 40,
  },
  optionsContentContainer: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#668F80',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
});
