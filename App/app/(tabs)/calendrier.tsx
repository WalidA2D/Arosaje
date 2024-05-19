import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Configuration des noms des jours et des mois en français
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

// Interface pour définir la structure des dates marquées sur le calendrier
interface MarkedDates {
  [key: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
}

// Interface pour définir la structure des événements
interface Event {
  name: string;
  dates: string[];
}

// Définissez le type pour les paramètres de navigation
type RootStackParamList = {
  profil: undefined;
  calendrier: undefined;
};

// Liste des événements avec leurs dates respectives
const events: Event[] = [
  { name: 'Item 1', dates: ['2024-06-01', '2024-06-02', '2024-06-03'] },
  { name: 'Item 2', dates: ['2024-07-10', '2024-07-11', '2024-07-12'] },
  { name: 'Item 3', dates: ['2024-08-20', '2024-08-21'] },
  { name: 'Item 4', dates: ['2024-09-15', '2024-09-16', '2024-09-17', '2024-09-18'] },
  { name: 'Item 5', dates: ['2024-05-19', '2024-05-20', '2024-05-21'] },
  { name: 'Item 6', dates: ['2024-05-18', '2024-05-19', '2024-05-20', '2024-05-21'] },
  { name: 'Item 7', dates: ['2023-05-19', '2023-05-20', '2023-05-21'] },
];

// Fonction pour calculer l'état d'un événement donné
const getEventStatus = (event: Event): string => {
  const today = new Date();
  const startDate = new Date(event.dates[0]);
  const endDate = new Date(event.dates[event.dates.length - 1]);

  // Si l'événement commence aujourd'hui
  if (today.toDateString() === startDate.toDateString()) {
    return "Aujourd'hui";
  } else if (today >= startDate && today <= endDate) {
    return "En cours";
  } else if (today < startDate) {
    const differenceInTime = startDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return `dans ${differenceInDays} jours`;
  } else {
    return "";
  }
};

// Fonction pour trier les événements
const sortEvents = (events: Event[]) => {
  const today = new Date();
  return events.sort((a, b) => {
    const startA = new Date(a.dates[0]);
    const endA = new Date(a.dates[a.dates.length - 1]);
    const startB = new Date(b.dates[0]);
    const endB = new Date(b.dates[b.dates.length - 1]);

    if (today >= startA && today <= endA) return -1; // 'a' est en cours
    if (today >= startB && today <= endB) return 1; // 'b' est en cours

    return startA.getTime() - startB.getTime(); // Trier par date de début
  });
};

export default function CalendarScreen() {
  const [selectedDates, setSelectedDates] = useState<MarkedDates>({});
  const [currentDate, setCurrentDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Définir le type de navigation

  // useEffect pour initialiser la date actuelle au chargement du composant
  useEffect(() => {
    const today = new Date();
    const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`;
    setCurrentDate(initialDate);
  }, []);

  // Fonction pour gérer la sélection d'un événement
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
    setCurrentDate(event.dates[0]); // Met à jour la date actuelle avec la première date de l'événement sélectionné
    setSelectedEvent(event.name); // Mettre à jour l'événement sélectionné
  };

  // Fonction pour obtenir la couleur d'un événement basé sur son index
  const getEventColor = (index: number) => {
    const colors = ['#668F80', '#D8C3A5', '#EAE7DC', '#8E8D8A'];
    return colors[index % colors.length];
  };

  // Filtrer les événements pour ne montrer que ceux qui ne sont pas passés
  const today = new Date();
  const futureEvents = events.filter(event => new Date(event.dates[event.dates.length - 1]) >= today);

  // Trier les événements
  const sortedEvents = sortEvents(futureEvents);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('profil')}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Calendrier</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        <View style={styles.eventsList}>
          {sortedEvents.map((event, index) => {
            const eventStatus = getEventStatus(event);
            if (eventStatus === "") return null; // Ne pas afficher les événements passés
            return (
              <View key={index}>
                <TouchableOpacity 
                  style={[
                    styles.eventItem, 
                    selectedEvent === event.name && styles.selectedEventItem
                  ]} 
                  onPress={() => onEventPress(event)}
                >
                  <View style={[styles.eventIndicator, { backgroundColor: getEventColor(index) }]} />
                  <Text style={styles.eventText}>{event.name}</Text>
                  <Text style={styles.eventDuration}>{eventStatus}</Text>
                </TouchableOpacity>
                {/* Ajouter le séparateur entre les items */}
                {index < sortedEvents.length - 1 && <View style={styles.separatorDetails} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#668F80',
    padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    top: 15,
    right: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
    top: 15,
    marginRight: 20,
  },
  scrollViewContent: {
    padding: 16,
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  eventsList: {
    marginTop: 0,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  selectedEventItem: {
    backgroundColor: '#F6F6F6',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    padding: 15,
  },
  eventIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  eventText: {
    fontSize: 14,
    flex: 1,
  },
  eventDuration: {
    fontSize: 14,
    color: 'gray',
  },
  separatorDetails: {
    height: 1,
    backgroundColor: '#E8E8E8',
    width: '95%',
    marginVertical: 5,
    alignSelf: 'center',
  },
});
