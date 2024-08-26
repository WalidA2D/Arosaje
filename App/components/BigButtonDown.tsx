import React from 'react';
import { View, Pressable, Text, StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const BigButtonDown = ({ buttonText, onPress, disabled, bgColor }: { buttonText: string, onPress?: () => void, disabled?: boolean, bgColor?: string }) => {
  return (
    <View style={styles.fixedDetailsBtn}>
    <View style={[styles.selectorContainer, { backgroundColor: bgColor || '#E0E0E0' }]}>
      <Pressable style={styles.selectorButton} onPress={onPress} disabled={disabled}>
        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
            {buttonText}
        </Text>
      </Pressable>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    fixedDetailsBtn: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
});

export default BigButtonDown;