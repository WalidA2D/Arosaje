import React, { useEffect } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BigButtonDown from '../../components/BigButtonDown';
import ListDash from '../../components/ListDash';

import PubTitre from '../pubnav/pubtitre';
import PubDate from '../pubnav/pubdate';
import PubPhoto from '../pubnav/pubphoto';
import PubDesc from '../pubnav/pubdesc';
import PubLoca from '../pubnav/publoca';
import PubEspece from '../pubnav/pubespece';
import PubEntretien from '../pubnav/pubentretien';
import StartApp from './index';

const Stack = createNativeStackNavigator();

function PublierScreen({ }) {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Publier"
      screenOptions ={{
        headerStyle:{
          backgroundColor: '#668F80',
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
          color: '#FFF',
          fontSize: 24,
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Publier" component={PublierContent} />
        <Stack.Screen name="Titre" component={PubTitre}
        options={{
          headerBackTitleVisible: false
      }} />
        <Stack.Screen name="Date(s)" component={PubDate}
        options={{
          headerBackTitleVisible: false
      }} />
        <Stack.Screen name="Photo(s)" component={PubPhoto}
        options={{
          headerBackTitleVisible: false
      }} />
        <Stack.Screen name="Description" component={PubDesc}
        options={{
          headerBackTitleVisible: false
      }} />
        <Stack.Screen name="Localisation" component={PubLoca}
        options={{
          headerBackTitleVisible: false
      }} />
        <Stack.Screen name="Espèce(s)" component={PubEspece}
        options={{
          headerBackTitleVisible: false
      }} />
        <Stack.Screen name="Entretien" component={PubEntretien}
        options={{
          headerBackTitleVisible: false
      }} />
      <Stack.Screen name="Index" component={StartApp} options={{ headerBackTitleVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function PublierContent() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const checkUserToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      navigation.navigate('Index');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkUserToken();
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>

    <View style={styles.fixedDetails}>
      <ListDash buttonText="Titre" onPress={() => navigation.navigate('Titre')} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Date(s)" onPress={() => navigation.navigate('Date(s)')} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Photo(s)" onPress={() => navigation.navigate('Photo(s)')} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Description" onPress={() => navigation.navigate('Description')} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Localisation" onPress={() => navigation.navigate('Localisation')} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Espèce(s)" onPress={() => navigation.navigate('Espèce(s)')} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Exigence d'entretien (optionel)" onPress={() => navigation.navigate('Entretien')} />
      <View style={styles.separatorDetails}/>
    </View>
    <BigButtonDown buttonText="Valider" />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 100,
    backgroundColor: '#668F80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    alignItems: 'center',
  },
  fixedDetails: {
    marginTop: 30,
    alignItems: 'flex-start',
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
  separatorDetails: {
    height: 1,
    backgroundColor: '#E8E8E8',
    width: '95%',
    marginVertical: 5,
    alignSelf : 'center',
  },
  selectorOptions: {
    padding : 10,
    color : '#BDBDBD',
  },
  selectorOptionsText: {
    fontSize : 14,
  }
});

export default PublierScreen;