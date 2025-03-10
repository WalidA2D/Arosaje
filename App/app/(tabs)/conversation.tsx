import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessageScreen from '../convnav/messages';
import ChatbotScreen from '../convnav/bot';
import Histoire from '../convnav/botnav/histoire';
import Profil from '../convnav/profilconsulte';

type RootStackParamList = {
  Conversations: undefined;
  Message: {
    userName: string;
    idUser: number;
    conversationId: number;
    initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string }>;
  };
  Profil: { idUser: number };
  Chatbot: undefined;
  Histoire: undefined;
};

type ExploreScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Conversations'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function ConvScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Conversations"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#668F80',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#FFF',
          fontSize: 24,
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Conversations" component={ExploreScreen} />
      <Stack.Screen name="Message" component={MessageScreen} options={{ headerBackTitleVisible: false }} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ headerBackTitleVisible: false }} />
      <Stack.Screen name="Histoire" component={Histoire} options={{ headerBackTitleVisible: false }} />
      <Stack.Screen name="Profil" component={Profil} options={{ headerBackTitleVisible: false }} />
    </Stack.Navigator>
  );
}

type User = {
  id: number;
  idUser: number;
  userName: string;
  avatar: any;
  initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string }>;
};

export function ExploreScreen() {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  const fetchConversations = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken || '',
      },
    };

    try {
      const response = await fetch(`${apiUrl}/conv/read/${userId}`, options);
      const data = await response.json();

      if (data.success) {
        const apiUsers = data.conversations.map((conv: any) => ({
          id: conv.Conversation.idConversation,
          idUser: conv.Conversation.UsersConversations[0].User.idUser,
          userName: `${conv.Conversation.UsersConversations[0].User.firstName} ${conv.Conversation.UsersConversations[0].User.lastName}`,
          avatar: conv.Conversation.UsersConversations[0].User.photo,
          initialMessages: [],
        }));
        const chatbotUser: User = {
          id: 0,
          idUser: 0,
          userName: 'Chatbot',
          avatar: require('../../assets/images/bot.png'),
          initialMessages: [
            {
              id: 1,
              text: 'Bonjour! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui?',
              sender: 'bot',
              timestamp: new Date().toISOString(),
            },
          ],
        };

        setUsers([chatbotUser, ...apiUsers]);
      } else {
        console.error('No conversations found or data.success is false');
        setUsers([
          {
            id: 0,
            idUser: 0,
            userName: 'Chatbot',
            avatar: require('../../assets/images/bot.png'),
            initialMessages: [
              {
                id: 1,
                text: 'Bonjour! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui?',
                sender: 'bot',
                timestamp: new Date().toISOString(),
              },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const filteredUsers = users.filter((user: User) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setShowSearchBar(!showSearchBar)} style={{ marginRight: 10 }}>
          <Icon name="filter" size={20} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation, showSearchBar]);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setIsSelecting(false);
    }
  }, [selectedUsers]);

  const handleLongPressUser = (id: number) => {
    if (id !== 0) {
      setIsSelecting(true);
      setSelectedUsers([id]);
    }
  };

  const handleSelectUser = (id: number) => {
    if (id !== 0) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.includes(id)
          ? prevSelectedUsers.filter((convId) => convId !== id)
          : [...prevSelectedUsers, id]
      );
    }
  };

  const handleDeleteSelectedUsers = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    const deleteConversations = async () => {
        for (const convId of selectedUsers) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken || '',
                },
            };

            try {
                const response = await fetch(`${apiUrl}/conv/delete/${convId}`, options);
                const data = await response.json();

                if (data.success) {
                    console.log(`✅ Conversation avec l'ID ${convId} supprimée avec succès.`);
                } else {
                    console.error(`❌ Échec de la suppression de la conversation avec l'ID ${convId}:`, data.message);
                }
            } catch (error) {
                console.error(`❌ Erreur lors de la suppression de la conversation avec l'ID ${convId}:`, error);
            }
        }

        setUsers((prevUsers: User[]) =>
            prevUsers.filter((user) => !selectedUsers.includes(user.id))
        );
        setIsSelecting(false);
        setSelectedUsers([]);
    };

    //  Mobile : Afficher une alerte avant la suppression
    if (Platform.OS !== 'web') {
        Alert.alert(
            'Supprimer les conversations',
            `Êtes-vous sûr de vouloir supprimer les conversations sélectionnées ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: deleteConversations },
            ],
            { cancelable: true }
        );
    } else {
        //  Web : Supprime directement sans alerte
        await deleteConversations();
    }
};

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setSelectedUsers([]);
  };

  return (
    <View style={styles.container}>
      {showSearchBar && (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon name="search" size={20} color="#668F80" style={styles.searchIcon} />
        </View>
      )}
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredUsers.map((user: User) => (
          <Pressable
            key={user.id}
            onLongPress={() => handleLongPressUser(user.id)}
            onPress={() =>
              isSelecting
                ? handleSelectUser(user.id)
                : user.userName === 'Chatbot'
                ? navigation.navigate('Chatbot')
                : navigation.navigate('Message', {
                    userName: user.userName,
                    idUser: user.idUser,
                    conversationId: user.id,
                    initialMessages: user.initialMessages,
                  })
            }
            style={[
              styles.chatItemContainer,
              selectedUsers.includes(user.id) && styles.userSelected,
            ]}
          >
            <View style={styles.chatItem}>
              <Image
                source={user.userName === 'Chatbot' ? user.avatar : { uri: user.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.chatName}>{user.userName}</Text>
              {user.userName !== 'Chatbot' && (
                <Pressable
                  onPress={() => navigation.navigate('Profil', { idUser: user.idUser })}
                >
                  <Icon name="user" size={20} color="#668F80" style={{ marginLeft: 10 }} />
                </Pressable>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {isSelecting && selectedUsers.length > 0 && (
        <View style={styles.selectionButtonsContainer}>
          <Pressable style={styles.cancelButton} onPress={handleCancelSelection}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDeleteSelectedUsers}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchBar: {
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
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatName: {
    fontSize: 18,
    color: '#333',
  },
  userSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
});

export default ConvScreen;
