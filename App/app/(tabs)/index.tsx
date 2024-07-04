import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { DevSettings } from 'react-native';

interface Restart {
  setIsModalVisible: (isVisible: boolean, type: string) => void;
}

export default function App({ setIsModalVisible }: Restart) {
  const handleRestart = () => {
    setIsModalVisible(false, 'index');
    DevSettings.reload();
  };
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/deco.png')} style={[styles.logo, {width: 250, height: 250,}]}/>
      <View style={styles.fixedDetailsBtn}>
        <View style={styles.selectorContainer}>
          <TouchableOpacity style={styles.selectorButton} onPress={handleRestart}>
              <Text style={{ color: '#668F80', fontSize: 14, fontWeight: 'bold' }}>
                Reconnectez vous
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
    backgroundColor: '#668F80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedDetailsBtn: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
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
    backgroundColor: '#FFF',
  },
  logo:{
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  }
});
