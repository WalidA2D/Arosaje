import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox } from '@rneui/themed';
import HeaderTitle from '../../components/HeaderTitle';

  interface ConnexionScreenProps {
    setIsModalVisible: (isVisible: boolean, type: string) => void;
}

type RootStackParamList = {
  'connexion': undefined;
  '(tabs)': undefined;
  'support': undefined;
  'inscription': undefined;
};

export default function ConnexionScreen({ setIsModalVisible }: ConnexionScreenProps) {
    const [email, onChangeEmail] = React.useState('');
    const [motDePasse, onChangeMotDePasse] = React.useState('');
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

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
            console.log("data : ",data);
            if (data.success && data.user) {
                await AsyncStorage.setItem('userToken', data.user.uid);
                await AsyncStorage.setItem('userId', data.user.idUser.toString());
                await AsyncStorage.setItem('role', data.user.role);
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
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');

            if (storedEmail && storedEmail) {
                handleLogin();
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
              <CheckBox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
                title="Se souvenir de moi"
                checkedColor='#668F80'
                uncheckedColor='#668F80'
                center
                size={32}
              />
            </View>

        </View>
    

    <View style={styles.fixedDetailsBtn}>

        <View style={styles.selectorContainer}>

            <Pressable style={styles.selectorButton} onPress={() => { handleLogin(); }}>
                <Text style={{color : '#FFF', fontSize : 18, fontWeight: 'bold',}}>Connexion</Text>
            </Pressable>

        </View>

        <Pressable onPress={() => {
            setIsModalVisible(false, 'connexion');
            setIsModalVisible(true, 'support');
        }}>
            <Text style={styles.selectorButtonConnexionText}>
                Mot de passe oublié ?
            </Text>
        </Pressable>

        <Pressable onPress={() => {
            setIsModalVisible(false, 'connexion');
            setIsModalVisible(true, 'inscription');
        }}>
            <Text style={styles.selectorButtonConnexionText}>
                Créer un compte
            </Text>
        </Pressable>

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
