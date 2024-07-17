import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BigButtonDown from '../../components/BigButtonDown';
import ListDash from '../../components/ListDash';

import PubTitre from '../pubnav/pubtitre';
import PubDate from '../pubnav/pubdate';
import PubPhoto from '../pubnav/pubphoto';
import PubDesc from '../pubnav/pubdesc';
import PubLoca from '../pubnav/publoca';
import PubEspece from '../pubnav/pubespece';
import PubEntretien from '../pubnav/pubentretien';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Titre: { titre: string };
  Publier: { titreValid?: boolean, titre: string };
};

type UpdatePublierNavigationProp = StackNavigationProp<RootStackParamList, 'Publier'>;
type UpdatePublierRouteProp = RouteProp<RootStackParamList, 'Publier'>;

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function PublierContent() {
  const navigation = useNavigation<UpdatePublierNavigationProp>();
  const route = useRoute<UpdatePublierRouteProp>();
  const [isValid] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.titreValid) {
        navigation.setParams({titreValid: true});
      } else {
        navigation.setParams({ titreValid: false });
      }
    });

    return unsubscribe;
  }, [route.params?.titreValid]);

  return (
    <View style={styles.container}>

    <View style={styles.fixedDetails}>
      <ListDash buttonText={`Titre : ${route.params?.titre || ''}`} onPress={() => navigation.navigate('Titre', { titre: route.params?.titre || '' })} />
      <Ionicons name={route.params?.titreValid ? 'checkmark-circle' : 'close-circle'} size={24} color={route.params?.titreValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Date(s)" onPress={() => navigation.navigate('Date(s)')} />
      <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Photo(s)" onPress={() => navigation.navigate('Photo(s)')} />
      <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Description" onPress={() => navigation.navigate('Description')} />
      <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Localisation" onPress={() => navigation.navigate('Localisation')} />
      <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Espèce(s)" onPress={() => navigation.navigate('Espèce(s)')} />
      <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
      <ListDash buttonText="Exigence d'entretien (optionel)" onPress={() => navigation.navigate('Entretien')} />
      <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#828282"} style={styles.iconValid} />
      <View style={styles.separatorDetails}/>
    </View>
    <View style={styles.fixedDetailsBtn}>
    <View style={styles.selectorContainer}>
    <TouchableOpacity style={[styles.selectorButton, { backgroundColor: isValid ? '#668F80' : '#828282' }]} disabled={!isValid}>
        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
             Valider
        </Text>
      </TouchableOpacity>
      </View>
    </View>
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
  },
  fixedDetailsBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    overflow: 'hidden',
    width: '90%',
    alignItems: 'center',
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconValid: {
    paddingHorizontal: 10,
  }
});

export default PublierScreen;