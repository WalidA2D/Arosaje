import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderTitle from '../../components/HeaderTitle';
import HomeScreen from '../(tabs)/actu';

type RootStackParamList = {
    ConnexionScreen: undefined;
    actu: undefined;
  };

  type ConnexionScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ConnexionScreen'
  >;

  interface ConnexionScreenProps {
    setIsModalVisible: (isVisible: boolean, type: string) => void;
}

export default function ConnexionScreen({ setIsModalVisible }: ConnexionScreenProps) {
    const [email, onChangeEmail] = React.useState('a@s.d');
    const [motDePasse, onChangeMotDePasse] = React.useState('mdp');
    const [showPassword, setShowPassword] = React.useState(false);
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;

    const navigation = useNavigation<ConnexionScreenNavigationProp>();

    const handleLogin = async () => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: motDePasse,
                }),
            };

            const response = await fetch(`http://172.16.2.17:3000/api/user/connexion`, options);
            const data = await response.json();

            if (data.success) {
                await AsyncStorage.setItem('userToken', data.body.token);
                setIsModalVisible(false, 'connexion');
                navigation.navigate('(tabs)');
            } else {
                Alert.alert("Échec", "Email ou mot de passe incorrect");
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de la connexion:', error);
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                setIsModalVisible(false, 'connexion');
                navigation.navigate('(tabs)');
            }
        };

        checkToken();
    }, []);

    return (
        <View style={styles.container}>
          <View style={styles.header}>
                <HeaderTitle title='Connexion' />
            </View>

            <View style={styles.fixedDetailsCo}>

            <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#BDBDBD"
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' }}>

            <TextInput
                style={styles.inputMdp}
                onChangeText={onChangeMotDePasse}
                value={motDePasse}
                placeholder="Mot de passe"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right:30 }}>
                {showPassword ? <Ionicons name="eye" size={24} color="#668F80" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
            </TouchableOpacity>

            </View>

        </View>
    

    <View style={styles.fixedDetailsBtn}>

        <View style={styles.selectorContainer}>

            <TouchableOpacity style={styles.selectorButton} onPress={() => { handleLogin(); }}>
                <Text style={{color : '#FFF', fontSize : 18, fontWeight: 'bold',}}>Connexion</Text>
            </TouchableOpacity>

        </View>

        <TouchableOpacity>
            <Text style={styles.selectorButtonConnexionText}>
                Mot de passe oublié ?
            </Text>
        </TouchableOpacity>

        <TouchableOpacity>
            <Text style={styles.selectorButtonConnexionText}>
                Créer un compte
            </Text>
        </TouchableOpacity>

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
  
    fixedDetailsCo: {
      marginTop: 30,
      alignItems: 'flex-start',
    },
  
    fixedDetailsBtn: {
      paddingTop : 100,
      marginTop: 100,
      alignItems: 'center',
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
      backgroundColor: '#668F80',
    },
  
    selectorButtonConnexionText: {
      fontSize : 14,
      color: '#668F80',
      fontWeight: 'bold',
      padding: 15,
    },
  
    input: {
      height: 50,
      width: '90%',
      margin: 10,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#F6F6F6',
      alignSelf: 'center',
    },
    
    inputMdp: {
      height: 50,
      width: '90%',
      margin: 10,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#F6F6F6',
    },
  });
  