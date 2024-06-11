import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderTitle from '../../components/HeaderTitle';
//import BigButtonDown from '../../components/BigButtonDown';


export default function loginFormScreen() {

    const [isLoginFormVisible, setIsLoginFormVisible] = React.useState(false);
    const [headerTitle, setHeaderTitle] = React.useState('Connexion');
    const [nom, onChangeNom] = React.useState('');
    const [prenom, onChangePrenom] = React.useState('');
    const [dateNaissance, onChangeDateNaissance] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [motDePasse, onChangeMotDePasse] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    function handleLogin() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simple pour validation d'email
      if (emailRegex.test(email) && motDePasse.length > 0) {
        Alert.alert("Succès", "Connexion réussie");
      } else {
        Alert.alert("Échec", "Email non conforme ou mot de passe incorrect");
      }
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderTitle title={headerTitle} />
      </View>
    
      {!isLoginFormVisible && (
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
        )}

      {isLoginFormVisible && (
        <View style={styles.fixedDetailsIns}>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>

            <TextInput
                style={styles.inputNom}
                onChangeText={onChangeNom}
                value={nom}
                placeholder="Nom"
                placeholderTextColor="#BDBDBD"
                autoCapitalize="words"
            />

            <TextInput
                style={styles.inputPrenom}
                onChangeText={onChangePrenom}
                value={prenom}
                placeholder="Prénom"
                placeholderTextColor="#BDBDBD"
            />

          </View>

          <TextInput
          style={styles.input}
          value={dateNaissance}
          onChangeText={onChangeDateNaissance}
          placeholder="Date de naissance"
          placeholderTextColor="#BDBDBD"
          keyboardType="numeric"
        />

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
      )}

      <View style={styles.fixedDetailsBtn}>

        <View style={styles.selectorContainer}>

          <TouchableOpacity style={styles.selectorButton} onPress={() => {
              handleLogin();
            }}>
                <Text style={{color : '#FFF', fontSize : 18, fontWeight: 'bold',}}>{isLoginFormVisible ? 'Inscription' : 'Connexion'}</Text>
            </TouchableOpacity>

        </View>

        <TouchableOpacity>
            <Text style={styles.selectorButtonConnexionText}>
                {isLoginFormVisible ? '' : 'Mot de passe oublié ?'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
        setIsLoginFormVisible(!isLoginFormVisible);
        setHeaderTitle(isLoginFormVisible ? 'Connexion' : 'Inscription');
        }}>
        <Text style={styles.selectorButtonConnexionText}>
            {isLoginFormVisible ? 'Déjà un compte ?' : 'Créer un compte'}
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

  fixedDetailsIns: {
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

  selectorOptions: {
    padding : 10,
    color : '#BDBDBD',
  },

  selectorOptionsText: {
    fontSize : 14,
  },

  selectorButtonConnexion: {
  },

  selectorButtonConnexionText: {
    fontSize : 14,
    color: '#668F80',
    fontWeight: 'bold',
    padding: 5,
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

  inputNom: {
    height: 50,
    width: '35%',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
  },

  inputPrenom: {
    height: 50,
    width: '50%',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
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
