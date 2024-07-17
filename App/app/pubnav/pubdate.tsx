import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Titre: { titre: '' };
  Publier: { titreValid?: boolean, titre: string };
  Date: { dateValid?: boolean, date: undefined};
};

type UpdateDateNavigationProp = StackNavigationProp<RootStackParamList, 'Date'>;
type UpdateDateRouteProp = RouteProp<RootStackParamList, 'Date'>;

export default function PubDate() {
  const navigation = useNavigation<UpdateDateNavigationProp>();
  const route = useRoute<UpdateDateRouteProp>();
  const [date, setDate] = useState('');
  const [dateCompleted, setDateCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

    return (
      <View>
      </View>
    );
  }