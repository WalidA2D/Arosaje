import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import BigButtonDown from '../../components/BigButtonDown';

type RootStackParamList = {
  Publier: {
    dateValid?: boolean,
    selectedStartDate: string,
    selectedEndDate: string };
  Date : { selectedStartDate: '', selectedEndDate: ''}
};

type UpdateDateNavigationProp = StackNavigationProp<RootStackParamList, 'Date'>;
type UpdateDateRouteProp = RouteProp<RootStackParamList, 'Date'>;

export default function PubDate() {
  const navigation = useNavigation<UpdateDateNavigationProp>();
  const route = useRoute<UpdateDateRouteProp>();
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const onDayPress = (day: { dateString: string }) => {
    if (new Date(day.dateString) < new Date(today)) {
      return; // Ne pas permettre la sélection de dates avant aujourd'hui
    }

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
    } else if (new Date(day.dateString) >= new Date(selectedStartDate)) {
      if (day.dateString === selectedStartDate) {
        setSelectedEndDate(''); // Si la date de début et de fin sont les mêmes, réinitialiser la date de fin
      } else {
        setSelectedEndDate(day.dateString);
      }
    } else {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
    }
  };

  const markedDates: { [key: string]: any } = {};

  if (selectedStartDate) {
    markedDates[selectedStartDate] = { startingDay: true, endingDay: !selectedEndDate, color: '#9DB58B', textColor: 'white' };
  }
  if (selectedEndDate && selectedEndDate !== selectedStartDate) {
    markedDates[selectedEndDate] = { endingDay: true, color: '#9DB58B', textColor: 'white' };
  }
  if (selectedStartDate && selectedEndDate && selectedEndDate !== selectedStartDate) {
    let currentDate = new Date(selectedStartDate);
    while (currentDate <= new Date(selectedEndDate)) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (dateString !== selectedStartDate && dateString !== selectedEndDate) {
        markedDates[dateString] = { color: '#9DB58B', textColor: 'white' };
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const handleValidation = () => {
    if (selectedStartDate.trim() !== '' && selectedEndDate.trim() !== '') {
      navigation.navigate('Publier', { dateValid: true, selectedStartDate, selectedEndDate });
    } else {
      navigation.navigate('Publier', { dateValid: false, selectedStartDate: '', selectedEndDate: '' });
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'period'}
        minDate={today} // Empêcher la sélection de dates avant aujourd'hui
        theme={{
          arrowColor: '#668F80',
        }}
      />
      <Text style={styles.selectedDateText}>Début : {selectedStartDate ? formatDate(selectedStartDate) : ''}</Text>
      <Text style={styles.selectedDateText}>Fin : {selectedEndDate ? formatDate(selectedEndDate) : (selectedStartDate ? formatDate(selectedStartDate) : '')}</Text>
      <BigButtonDown buttonText="Choisir" onPress={handleValidation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10
  },
});