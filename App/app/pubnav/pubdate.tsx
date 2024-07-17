import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calendar, LocaleConfig } from 'react-native-calendars';

type RootStackParamList = {
  Titre: { titre: '' };
  Publier: { titreValid?: boolean, titre: string };
  Date: { dateValid?: boolean, date: undefined};
};

type UpdateDateNavigationProp = StackNavigationProp<RootStackParamList, 'Date'>;
type UpdateDateRouteProp = RouteProp<RootStackParamList, 'Date'>;

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ],
  monthNamesShort: [
    'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin.',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
  ],
  dayNames: [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi',
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

interface MarkedDates {
  [key: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
}

export default function PubDate() {
  const navigation = useNavigation<UpdateDateNavigationProp>();
  const route = useRoute<UpdateDateRouteProp>();
  const [selectedDates, setSelectedDates] = useState<MarkedDates>({});
  const [currentDate, setCurrentDate] = useState('');
  const [dateCompleted, setDateCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const today = new Date();
    const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`;
    setCurrentDate(initialDate);
  }, []);

  const onEventPress = (event: Event) => {
    let newSelectedDates: MarkedDates = {};

    event.dates.forEach((date, index) => {
      if (index === 0) {
        newSelectedDates[date] = { startingDay: true, color: '#9DB58B', textColor: 'white' };
      } else if (index === event.dates.length - 1) {
        newSelectedDates[date] = { endingDay: true, color: '#9DB58B', textColor: 'white' };
      } else {
        newSelectedDates[date] = { color: '#9DB58B', textColor: 'white' };
      }
    });

    setSelectedDates(newSelectedDates);
    setCurrentDate(event.dates[0]);
  };

  const getEventColor = (index: number) => {
    const colors = ['#668F80', '#D8C3A5', '#EAE7DC', '#8E8D8A'];
    return colors[index % colors.length];
  };

    return (
      <View style={styles.container}>
          {currentDate && (
          <Calendar
            key={currentDate} // Ajout de la clé pour forcer la mise à jour du composant
            current={currentDate}
            style={styles.calendar}
            theme={{
              backgroundColor: '#668F80',
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: '#000000',
              selectedDayBackgroundColor: '#668F80',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#668F80',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#668F80',
              monthTextColor: '#000000',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            markingType={'period'}
            markedDates={selectedDates}
            onMonthChange={(month) => setCurrentDate(`${month.year}-${month.month.toString().padStart(2, '0')}-01`)}
          />
        )}
        </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    input: {
      height: 40,
      width: '80%',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 20,
    },
    clearButton: {
      fontSize: 16,
      color: 'red',
      marginTop: 20,
    },
    calendar: {
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 10,
    },
  });