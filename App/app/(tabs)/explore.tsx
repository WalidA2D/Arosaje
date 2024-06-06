import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import HeaderTitle from '../../components/HeaderTitle';

type RootStackParamList = {
  explore: undefined;
  message: { userName: string; initialMessages: Array<{ id: number; text: string; sender: string; timestamp: string }> };
};

type ExploreScreenNavigationProp = StackNavigationProp<RootStackParamList, 'explore'>;

const users = [
  {
    userName: 'Jean Dupuis',
    avatar: 'https://example.com/avatar1.jpg',
    initialMessages: [
      { id: 1, text: 'Bonjour Jean!', sender: 'left', timestamp: new Date().toISOString() },
      { id: 2, text: 'Salut, comment ça va?', sender: 'right', timestamp: new Date().toISOString() },
    ],
  },
  {
    userName: 'Marie Curie',
    avatar: 'https://example.com/avatar2.jpg',
    initialMessages: [
      { id: 1, text: 'Bonjour Marie!', sender: 'left', timestamp: new Date().toISOString() },
      { id: 2, text: 'Salut, ça va bien?', sender: 'right', timestamp: new Date().toISOString() },
    ],
  },
  // Add more users here
];

export default function ExploreScreen() {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderTitle title="Conversations" />
      </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {filteredUsers.map(user => (
          <TouchableOpacity
            key={user.userName}
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate('message', {
                userName: user.userName,
                initialMessages: user.initialMessages,
              })
            }
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.chatName}>{user.userName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
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
});
