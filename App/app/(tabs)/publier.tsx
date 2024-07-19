import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  Publier: {
    titreValid?: boolean,
    titre: string,
    dateValid?: boolean,
    selectedStartDate: string,
    selectedEndDate: string
    descValid?: boolean,
    description: string,
    locValid?: boolean,
    localisation: string,
  };
  Titre: { titre: '' };
  Date: { selectedStartDate: '', selectedEndDate: ''}
  Description: { description: '' };
  Localisation: { localisation: '' };
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
        <Stack.Screen name="Date" component={PubDate}
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
  const [isValid, setIsValid] = useState(false);
  const [titre, setTitre] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [titreValid, setTitreValid] = useState(false);
  const [dateValid, setDateValid] = useState(false);
  const [descValid, setDescValid] = useState(false);
  const [locValid, setLocValid] = useState(false);
  const [localisation, setLocalisation] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const storedTitre = await AsyncStorage.getItem('titre');
      const storedStartDate = await AsyncStorage.getItem('selectedStartDate');
      const storedEndDate = await AsyncStorage.getItem('selectedEndDate');
      const storedDescription = await AsyncStorage.getItem('description');
      const storedTitreValid = await AsyncStorage.getItem('titreValid');
      const storedDateValid = await AsyncStorage.getItem('dateValid');
      const storedDescValid = await AsyncStorage.getItem('descValid');
      const storedLocValid = await AsyncStorage.getItem('locValid');

      if (storedTitre) setTitre(storedTitre);
      if (storedStartDate) setSelectedStartDate(storedStartDate);
      if (storedEndDate) setSelectedEndDate(storedEndDate);
      if (storedDescription) setDescription(storedDescription);
      if (storedTitreValid) setTitreValid(storedTitreValid === 'true');
      if (storedDateValid) setDateValid(storedDateValid === 'true');
      if (storedDescValid) setDescValid(storedDescValid === 'true');
      if (storedLocValid) setLocValid(storedLocValid === 'true');
    };

    loadData();

    const unsubscribe = navigation.addListener('focus', () => {
      const { titreValid, dateValid, descValid, locValid } = route.params || {};
      setIsValid(!!titreValid && !!dateValid && !!descValid && !!locValid);
    });

    return unsubscribe;
  }, [navigation, route.params]);

  useEffect(() => {
    if (route.params?.titre) {
      setTitre(route.params.titre);
      AsyncStorage.setItem('titre', route.params.titre);
    }
    if (route.params?.selectedStartDate) {
      setSelectedStartDate(route.params.selectedStartDate);
      AsyncStorage.setItem('selectedStartDate', route.params.selectedStartDate);
    }
    if (route.params?.selectedEndDate) {
      setSelectedEndDate(route.params.selectedEndDate);
      AsyncStorage.setItem('selectedEndDate', route.params.selectedEndDate);
    }
    if (route.params?.description) {
      setDescription(route.params.description);
      AsyncStorage.setItem('description', route.params.description);
    }
    if (route.params?.localisation) {
      setLocalisation(route.params.localisation);
      AsyncStorage.setItem('localisation', route.params.localisation);
    }
    if (route.params?.titreValid !== undefined) {
      setTitreValid(route.params.titreValid);
      AsyncStorage.setItem('titreValid', route.params.titreValid.toString());
      if (!route.params.titreValid) {
        setTitre('');
        AsyncStorage.removeItem('titre');
      }
    }
    if (route.params?.dateValid !== undefined) {
      setDateValid(route.params.dateValid);
      AsyncStorage.setItem('dateValid', route.params.dateValid.toString());
      if (!route.params.dateValid) {
        setSelectedStartDate('');
        setSelectedEndDate('');
        AsyncStorage.removeItem('selectedStartDate');
        AsyncStorage.removeItem('selectedEndDate');
      }
    }
    if (route.params?.descValid !== undefined) {
      setDescValid(route.params.descValid);
      AsyncStorage.setItem('descValid', route.params.descValid.toString());
      if (!route.params.descValid) {
        setDescription('');
        AsyncStorage.removeItem('description');
      }
    }
    if (route.params?.locValid !== undefined) {
      setLocValid(route.params.locValid);
      AsyncStorage.setItem('locValid', route.params.locValid.toString());
      if (!route.params.locValid) {
        setLocalisation('');
        AsyncStorage.removeItem('localisation');
      }
    }
  }, [route.params]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedDetails}>
        <ListDash buttonText={`Titre : ${titre}`} onPress={() => navigation.navigate('Titre', { titre })} />
        <Ionicons name={titreValid ? 'checkmark-circle' : 'close-circle'} size={24} color={titreValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Date(s) : ${selectedStartDate ? formatDate(selectedStartDate) : ''} - ${selectedEndDate ? formatDate(selectedEndDate) : ''}`} onPress={() => navigation.navigate('Date', { selectedStartDate, selectedEndDate })} />
        <Ionicons name={dateValid ? 'checkmark-circle' : 'close-circle'} size={24} color={dateValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText="Photo(s)" onPress={() => navigation.navigate('Photo(s)')} />
        <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Description : ${description ? '{...}' : ''}`} onPress={() => navigation.navigate('Description', { description })} />
        <Ionicons name={descValid ? 'checkmark-circle' : 'close-circle'} size={24} color={descValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Localisation : ${localisation}`} onPress={() => navigation.navigate('Localisation', { localisation })} />
        <Ionicons name={locValid ? 'checkmark-circle' : 'close-circle'} size={24} color={locValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText="Espèce(s)" onPress={() => navigation.navigate('Espèce(s)')} />
        <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText="Exigence d'entretien (optionel)" onPress={() => navigation.navigate('Entretien')} />
        <Ionicons name={isValid ? 'checkmark-circle' : 'close-circle'} size={24} color={isValid ? "#668F80" : "#828282"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
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
    alignSelf: 'center',
  },
  selectorOptions: {
    padding: 10,
    color: '#BDBDBD',
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