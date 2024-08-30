import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import RNPickerSelect from "react-native-picker-select";

import BigButtonDown from '@/components/BigButtonDown';

interface supportProps {
    setIsModalVisible: (isVisible: boolean, type: string) => void;
}

export default function Support({ setIsModalVisible }: supportProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSend = () => {
    if (!email || !subject || !description) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    Alert.alert("Envoyé", "Nous vous enverrons une réponse sous 48H");
    setIsModalVisible(false, 'support');
    // console.log('Email:', email);
    // console.log('Subject:', subject);
    // console.log('Description:', description);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.textTitre}>Contactez-nous</Text>
      <TextInput
        style={styles.input}
        placeholder="A"
        value={"support@arosaje.com"}
        editable={false}
      />
      <Text style={styles.text}>Votre email :</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre email"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.text}>Sujet :</Text>
        <RNPickerSelect
        placeholder={{ label: "Sélectionnez une option", value: null }}
        value={subject}
        onValueChange={(value) => setSubject(value ?? "")}
        items={[
            { label: "Problème avec mot de passe", value: "password_issue" },
            { label: "Contactez-nous", value: "contact_us" },
            { label: "Signaler un/des bugs", value: "report_bug" },
            { label: "Autres", value: "others" },
        ]}
        style={pickerSelectStyles}
        />
        <Text style={styles.text}>Description :</Text>
      <TextInput
        style={styles.inputdesc}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <BigButtonDown buttonText="Envoyer" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  textTitre:{
    fontSize: 32,
    paddingBottom: 10,
  },
  text:{
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  inputdesc: {
    height: 100,
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});