import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MessageScreen from '../convnav/messages';
import ChatbotScreen from '../convnav/bot'; 
import Histoire from '../convnav/botnav/histoire';
import StartApp from './index';

type RootStackParamList = {
  Conversations: undefined;
  Message: { userName: string; initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string }> };
  Chatbot: undefined;
  Histoire: undefined;
};

type ExploreScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Conversations'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function ConvScreen() {
  return (
    <NavigationContainer independent={true}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type User = {
  userName: string;
  avatar: any; 
  initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string }>;
};

const initialUsers: User[] = [
  {
    userName: 'Chatbot',
    avatar: require('../../assets/images/bot.png'), 
    initialMessages: [
      { id: 1, text: 'Bonjour! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui?', sender: 'bot', timestamp: new Date().toISOString() },
    ],
  },
  {
    userName: 'Jean Dupuis',
    avatar: 'https://picsum.photos/620/300',
    initialMessages: [
      { id: 1, text: 'Bonjour Jean!', sender: 'left', timestamp: new Date().toISOString() },
      { id: 2, text: 'Salut, comment ça va?', sender: 'right', timestamp: new Date().toISOString() },
    ],
  },
  {
    userName: 'Marie Curie',
    avatar: 'https://picsum.photos/620/300',
    initialMessages: [
      { id: 1, text: 'Bonjour Marie!', sender: 'left', timestamp: new Date().toISOString() },
      { id: 2, text: 'Salut, ça va bien?', sender: 'right', timestamp: new Date().toISOString() },
    ],
  },
  // Add more users here
];

export function ExploreScreen() {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowSearchBar(!showSearchBar)} style={{ marginRight: 10 }}>
          <Icon name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showSearchBar]);

  const filteredUsers = users.filter((user: User) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setIsSelecting(false);
    }
  }, [selectedUsers]);

  const handleLongPressUser = (userName: string) => {
    if (userName !== 'Chatbot') {
      setIsSelecting(true);
      setSelectedUsers([userName]);
    }
  };

  const handleSelectUser = (userName: string) => {
    if (userName !== 'Chatbot') {
      setSelectedUsers(prevSelectedUsers =>
        prevSelectedUsers.includes(userName)
          ? prevSelectedUsers.filter(name => name !== userName)
          : [...prevSelectedUsers, userName]
      );
    }
  };

  const handleDeleteSelectedUsers = () => {
    Alert.alert(
      'Supprimer les conversations',
      `Êtes-vous sûr de vouloir supprimer les conversations sélectionnées ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setUsers((prevUsers: User[]) => prevUsers.filter(user => !selectedUsers.includes(user.userName)));
            setIsSelecting(false);
            setSelectedUsers([]);
          },
        },
      ],
      { cancelable: true }
    );
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
      <ScrollView>
        {filteredUsers.map((user: User) => (
          <TouchableOpacity
            key={user.userName}
            onLongPress={() => handleLongPressUser(user.userName)}
            onPress={() => isSelecting ? handleSelectUser(user.userName) : user.userName === 'Chatbot' ? navigation.navigate('Chatbot') : navigation.navigate('Message', {
              userName: user.userName,
              initialMessages: user.initialMessages,
            })}
            style={[
              styles.chatItemContainer,
              selectedUsers.includes(user.userName) && styles.userSelected
            ]}
          >
            <View style={styles.chatItem}>
              <Image source={user.userName === 'Chatbot' ? user.avatar : { uri: user.avatar }} style={styles.avatar} />
              <Text style={styles.chatName}>{user.userName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isSelecting && selectedUsers.length > 0 && (
        <View style={styles.selectionButtonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSelection}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelectedUsers}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: '#668F80',
    padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 50,
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
