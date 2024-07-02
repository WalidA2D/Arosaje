import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>
      <Text>TEST</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#668F80',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
