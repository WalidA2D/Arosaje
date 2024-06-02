import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HeaderTitle;