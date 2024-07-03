import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, ScrollView, TextInput } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ContentItem from '../../components/navigation/ContentItem';
import Filtre from '../actunav/actufiltre';
import StartApp from './index';

type RootStackParamList = {
  Actualités: undefined;
  Filtre: undefined;
  Index: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ }) {
  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator
      initialRouteName="Actualités"
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
    <Stack.Screen
      name="Actualités"
      component={HomeContent}
      options={({ navigation }) => ({
        headerRight: () => (
          <Button
            onPress={() => navigation.navigate('Filtre')}
            title="Filtre"
            color="#fff"
          />
        ),
      })}
    />
    <Stack.Screen
      name="Filtre"
      component={Filtre}
      options={{ headerBackTitleVisible: false }}
    />
      <Stack.Screen name="Index" component={StartApp} options={{ headerBackTitleVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const checkUserToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log(userToken)
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkUserToken();
    });

    return unsubscribe;
  }, []);

  return (
      <View style={styles.container}>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.body}>
            <ContentItem
              images={[
                'https://picsum.photos/600/300',
                'https://picsum.photos/610/300',
                'https://picsum.photos/620/300',
              ]}
              title="Titre du slider"
              description="Description du slider"
              time="Il y a 8 minutes"
            />
            <ContentItem
              images={[
                'https://picsum.photos/590/300',
              ]}
              title="Titre du slider"
              description="Description du slider"
              time="Il y a 18 minutes"
            />
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#F0F0F0',
    color: '#000',
  },
  scrollViewContent: {
    paddingTop: 20,
  },
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
});

export default HomeScreen;
