import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import HeaderTitle from '../../components/HeaderTitle';

  interface ConnexionScreenProps {
    setIsModalVisible: (isVisible: boolean, type: string) => void;
}

export default function ConnexionScreen({ setIsModalVisible }: ConnexionScreenProps) {
    const [email, onChangeEmail] = React.useState('a@b.com');
    const [motDePasse, onChangeMotDePasse] = React.useState('Azerty12345!');
    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);

    useEffect(() => {
        const checkRememberMe = async () => {
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');
            if (storedEmail && storedPassword) {
                setRememberMe(true);
            } else {
              setRememberMe(false);
          }
        };

        checkRememberMe();
    }, []);

    const apiUrl = process.env.EXPO_PUBLIC_API_IP;

    const navigation = useNavigation();

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

            if (rememberMe) {
              await AsyncStorage.setItem('email', email);
              await AsyncStorage.setItem('password', motDePasse);
          } else {
              await AsyncStorage.removeItem('email');
              await AsyncStorage.removeItem('password');
          }

            const response = await fetch(`${apiUrl}/user/login`, options);
            const data = await response.json();

            if (data.success && data.user) {
                await AsyncStorage.setItem('userToken', data.user.uid);
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
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');

            if (userToken) {
                setIsModalVisible(false, 'connexion');
                navigation.navigate('(tabs)');
            } else if (storedEmail && storedPassword) {
            onChangeEmail(storedEmail);
            onChangeMotDePasse(storedPassword);
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
                autoCapitalize='words'
                placeholder="Mot de passe"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPassword}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right:30 }}>
                {showPassword ? <Ionicons name="eye" size={24} color="#668F80" /> : <Ionicons name="eye-off-outline" size={24} color="black" />}
            </Pressable>

            </View>

            <View style={styles.rememberMeContainer}>
              <Pressable onPress={() => setRememberMe(!rememberMe)} style={{ justifyContent: 'center', height:32, width:32, flexDirection: 'row', alignItems: 'center' }}>
                <AnimatedCheckbox
                  checked={rememberMe}
                  highlightColor="#668F80"
                  checkmarkColor="#ffffff"
                  boxOutlineColor="#668F80"
                />
              </Pressable>
          <Text style={{fontSize: 14, paddingLeft: 5}}>Se souvenir de moi</Text>
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
    rememberMeContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
  });
  