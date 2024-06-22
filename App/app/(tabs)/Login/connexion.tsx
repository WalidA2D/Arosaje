import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderTitle from '../../../components/HeaderTitle';

// Définir les types des paramètres de navigation
type RootStackParamList = {
    ConnexionScreen: undefined;
    actu: undefined;
  };
  
  // Définir le type de navigation pour l'écran de profil
  type ConnexionScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ConnexionScreen'
  >;

  interface ConnexionScreenProps {
    setIsModalVisible: (isVisible: boolean, type: string) => void;
}

export default function ConnexionScreen({ setIsModalVisible }: ConnexionScreenProps) {
    const [email, onChangeEmail] = React.useState('a@a.com');
    const [motDePasse, onChangeMotDePasse] = React.useState('123');
    const [showPassword, setShowPassword] = React.useState(false);

    const navigation = useNavigation<ConnexionScreenNavigationProp>();

    function handleLogin() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email) && motDePasse.length > 0) {
          setIsModalVisible(false, 'connexion');
          navigation.navigate('actu');
        } else {
          Alert.alert("Échec", "Email non conforme ou mot de passe incorrect");
        }
      }

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

            <TouchableOpacity style={styles.selectorButton} onPress={() => {
            handleLogin();
            }}>
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
  