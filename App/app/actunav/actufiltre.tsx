import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';

export default function ActuFiltre() {
  const [cityName, setCityName] = useState<string>('');
  const [dateStart, setDateStart] = useState<string | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);
  const [plantOrigin, setPlantOrigin] = useState<string>('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [cities, setCities] = useState<Array<{ label: string, value: string }>>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://api.geonames.org/searchJSON?country=FR&maxRows=1000&username=arosaje');
        const data = await response.json();
        const cityOptions = data.geonames.map((city: any) => ({
          label: city.name,
          value: city.name,
        }));
        setCities(cityOptions);
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        Alert.alert('Erreur', 'Impossible de récupérer la liste des villes.');
      }
    };

    fetchCities();
  }, []);

  const handleSearch = () => {
    if (!cityName && !dateStart && !dateEnd && !plantOrigin) {
      Alert.alert('Erreur', 'Veuillez renseigner au moins un champ.');
      return;
    }

    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    let query = `${apiUrl}/post/read?quantite=5&saut=0`;

    if (cityName) query += `&cityName=${encodeURIComponent(cityName)}`;
    if (dateStart) query += `&dateStart=${dateStart}`;
    if (dateEnd) query += `&dateEnd=${dateEnd}`;
    if (plantOrigin) query += `&plantOrigin=${encodeURIComponent(plantOrigin)}`;
    
    fetch(query)
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  const handleDayPress = (day: DateData, type: 'start' | 'end') => {
    if (type === 'start') {
      setDateStart(day.dateString);
      setShowStartDatePicker(false);
    } else if (type === 'end') {
      setDateEnd(day.dateString);
      setShowEndDatePicker(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.label}>Ville</Text>
          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez une ville', value: null }}
            value={cityName}
            onValueChange={(value) => setCityName(value)}
            items={cities}
            style={pickerSelectStyles}
          />
  
          <Text style={styles.label}>Date de début</Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={[styles.input, dateStart ? styles.selectedDate : {}]}>
              {dateStart ? dateStart.toString() : "Sélectionnez une date"}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <Modal transparent={true} animationType="fade" visible={showStartDatePicker}>
              <TouchableWithoutFeedback onPress={() => setShowStartDatePicker(false)}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerWrapper}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowStartDatePicker(false)}>
                      <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
  
                    <Calendar
                      markedDates={{ [dateStart?.toString().split('T')[0] || '']: { selected: true, selectedColor: '#668F80' } }}
                      onDayPress={(day: DateData) => handleDayPress(day, 'start')}
                      theme={{
                        todayTextColor: '#668F80',
                        selectedDayBackgroundColor: '#668F80',
                        arrowColor: '#668F80',
                        monthTextColor: '#4A6670',
                        textSectionTitleColor: '#4A6670',
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
  
          <Text style={styles.label}>Date de fin</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={[styles.input, dateEnd ? styles.selectedDate : {}]}>
              {dateEnd ? dateEnd.toString() : "Sélectionnez une date"}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <Modal transparent={true} animationType="fade" visible={showEndDatePicker}>
              <TouchableWithoutFeedback onPress={() => setShowEndDatePicker(false)}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerWrapper}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowEndDatePicker(false)}>
                      <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
  
                    <Calendar
                      markedDates={{ [dateEnd?.toString().split('T')[0] || '']: { selected: true, selectedColor: '#668F80' } }}
                      onDayPress={(day: DateData) => handleDayPress(day, 'end')}
                      theme={{
                        todayTextColor: '#668F80',
                        selectedDayBackgroundColor: '#668F80',
                        arrowColor: '#668F80',
                        monthTextColor: '#4A6670',
                        textSectionTitleColor: '#4A6670',
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
  
          <Text style={styles.label}>Origine de la plante</Text>
          <TextInput
            style={styles.input}
            value={plantOrigin}
            onChangeText={setPlantOrigin}
            placeholder="Origine de la plante"
            placeholderTextColor="#4A6670"
          />
  
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Rechercher</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A6670',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#4A6670',
  },
  input: {
    height: 40,
    borderColor: '#4A6670',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#4A6670',
    textAlignVertical: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectedDate: {
    color: '#668F80',
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  datePickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchButton: {
    backgroundColor: '#668F80',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: '#4A6670',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#4A6670',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  inputAndroid: {
    height: 40,
    borderColor: '#4A6670',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#4A6670',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  placeholder: {
    color: '#4A6670',
  },
});
