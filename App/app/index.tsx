import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Modal } from 'react-native';

import ConnexionScreen from './Login/connexion';
import InscriptionScreen from './Login/inscription';
import Support from './Login/mdpoublie';

export default function StartApp() {
  const [modalType, setModalType] = useState('');

  const setModalVisible = (isVisible: boolean, modalType: string) => {
    if (isVisible) {
      setModalType(modalType);
    } else {
      setModalType('');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Arosaje.png')} style={[styles.logo, {width: 250, height: 250,}]}/>
      <View style={styles.fixedDetailsBtn}>
        <View style={styles.selectorContainer}>
          <Pressable style={styles.selectorButton} onPress={() => setModalVisible(true, 'connexion')}>
            <Text style={{ color: '#668F80', fontSize: 14, fontWeight: 'bold' }}>
              Connexion
            </Text>
          </Pressable>
        </View>
        <View style={styles.selectorContainer}>
          <Pressable style={styles.selectorButton} onPress={() => setModalVisible(true, 'inscription')}>
            <Text style={{ color: '#668F80', fontSize: 14, fontWeight: 'bold' }}>
              Inscription
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={modalType === 'connexion'} animationType="slide">
        <ConnexionScreen setIsModalVisible={(isVisible, type) => setModalVisible(isVisible, type)} />
        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false, 'connexion')}>
            <Text style={{ color: '#fff' }}>Fermer</Text>
          </Pressable>
      </Modal>

      <Modal visible={modalType === 'inscription'} animationType="slide">
        <InscriptionScreen setIsModalVisible={(isVisible, type) => setModalVisible(isVisible, type)} />
        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false, 'inscription')}>
          <Text style={{ color: '#fff' }}>Fermer</Text>
        </Pressable>
      </Modal>

      <Modal visible={modalType === 'support'} animationType="slide">
        <Support setIsModalVisible={(isVisible, type) => setModalVisible(isVisible, type)} />
        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false, 'support')}>
          <Text style={{ color: '#fff' }}>Fermer</Text>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#668F80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:{
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF'
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
    backgroundColor: '#FFF',
  },
  fixedDetailsBtn: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#668F80',
    padding: 15,
    borderRadius: 15,
    marginBottom: 50,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});