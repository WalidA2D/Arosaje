import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListDash = ({ buttonText, onPress }: { buttonText: string, onPress?: () => void }) => {
  return (
    <Pressable style={[styles.selectorOptions, { width: '100%' }]} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.selectorOptionsText}>{buttonText}</Text>
        <Ionicons name="chevron-forward-outline" size={18} color="black" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    selectorOptions: {
      padding : 10,
      color : '#BDBDBD',
    },
    selectorOptionsText: {
        fontSize : 14,
      },
  });

export default ListDash;