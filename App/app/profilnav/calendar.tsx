import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration des noms des jours et des mois en français
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin.', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
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
    borderRadius?: number;
    borderTopRightRadius?: number;
    borderTopLeftRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
  };
}

interface Event {
  name: string;
  dates: string[];
  acceptedBy: string;
}

const initialEvents: Event[] = [
  { name: 'Chargement...', dates: [], acceptedBy: '' },
];

export default function CalendarScreen() {
  const [selectedDates, setSelectedDates] = useState<MarkedDates>({});
  const [currentDate, setCurrentDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);


  useEffect(() => {
    const today = new Date();
    const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`;
    setCurrentDate(initialDate);
  }, []);

  const onEventPress = (event: Event) => {
    let newSelectedDates: MarkedDates = {};

    newSelectedDates[event.dates[0]] = {
      startingDay: true,
      color: '#9DB58B',
      textColor: 'white',
      borderRadius: 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    };

    newSelectedDates[event.dates[event.dates.length - 1]] = {
      endingDay: true,
      color: '#9DB58B',
      textColor: 'white',
      borderRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    };

    if (event.dates.length > 1) {
      let currentDate = new Date(event.dates[0]);
      const endDate = new Date(event.dates[event.dates.length - 1]);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== event.dates[0] && dateString !== event.dates[event.dates.length - 1]) {
          newSelectedDates[dateString] = { color: '#9DB58B', textColor: 'white' };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    setSelectedDates(newSelectedDates);
    setCurrentDate(event.dates[0]);
    setSelectedEvent(event.name);
  };

  const getEventColor = (index: number) => {
    const colors = ['#668F80', '#D8C3A5', '#EAE7DC', '#8E8D8A'];
    return colors[index % colors.length];
  };

  const getEventStatus = (event: Event): string => {
    const today = new Date();
    const startDate = new Date(event.dates[0]);
    const endDate = new Date(event.dates[event.dates.length - 1]);

    if (today.toDateString() === startDate.toDateString()) {
      return "Aujourd'hui";
    } else if (today >= startDate && today <= endDate) {
      return "En cours";
    } else if (today < startDate) {
      const differenceInTime = startDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return `dans ${differenceInDays} jours`;
    } else {
      return "Passée";
    }
  };

  const sortEvents = (events: Event[]) => {
    const today = new Date();
    return events.sort((a, b) => {
      const startA = new Date(a.dates[0]);
      const endA = new Date(a.dates[a.dates.length - 1]);
      const startB = new Date(b.dates[0]);
      const endB = new Date(b.dates[b.dates.length - 1]);

      if (today >= startA && today <= endA) return -1;
      if (today >= startB && today <= endB) return 1;

      return startA.getTime() - startB.getTime();
    });
  };

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${apiUrl}/post/missions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken || '',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }

        const data = await response.json();
        const fetchedEvents = data.missions.map((event: any) => ({
          name: `${event.title}`,
          dates: [event.dateStart, event.dateEnd],
          acceptedBy: event.acceptedBy,
        }));

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    };

    fetchEvents();
  }, []);

  const today = new Date();
  const filteredEvents = showPastEvents
    ? events.filter(event => new Date(event.dates[event.dates.length - 1]) < today)
    : events.filter(event => new Date(event.dates[event.dates.length - 1]) >= today);
  
  const sortedEvents = sortEvents(filteredEvents);
  

  return (
    <View style={styles.container}>
      {currentDate && (
        <Calendar
          key={currentDate}
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
          onMonthChange={(month: { year: any; month: { toString: () => string; }; }) => setCurrentDate(`${month.year}-${month.month.toString().padStart(2, '0')}-01`)}
        />
      )}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Pressable onPress={() => setShowPastEvents(!showPastEvents)} style={styles.historyButton}>
          <Text style={styles.historyButtonText}>{showPastEvents ? 'Retour aux missions' : 'Historique des missions'}</Text>
        </Pressable>
        <View style={styles.eventsList}>
          {sortedEvents.length === 0 ? (
            <Text style={styles.noEventsText}>
              {showPastEvents ? 'Aucune mission passée.' : "Vous n'avez pas accepté de missions"}
            </Text>
          ) : (
            sortedEvents.map((event, index) => {
              const eventStatus = getEventStatus(event);
              if (!showPastEvents && eventStatus === "") return null;
              return (
                <View key={index}>
                  <Pressable
                    style={[styles.eventItem, selectedEvent === event.name && styles.selectedEventItem]}
                    onPress={() => onEventPress(event)}
                  >
                    <View style={[styles.eventIndicator, { backgroundColor: getEventColor(index) }]} />
                    <Text style={styles.eventText}>{event.name}</Text>
                    <Text style={styles.eventDuration}>{eventStatus}</Text>
                  </Pressable>
                  {index < sortedEvents.length - 1 && <View style={styles.separatorDetails} />}
                </View>
              );
            })
          )}
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
  noEventsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  historyButton: {
    backgroundColor: '#668F80',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});