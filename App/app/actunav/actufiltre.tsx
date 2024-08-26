import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import RNPickerSelect from "react-native-picker-select";

export default function ActuFiltre({ navigation }: { navigation: any }) {
  const [cityName, setCityName] = useState<string>("");
  const [dateStart, setDateStart] = useState<string | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);
  const [plantOrigin, setPlantOrigin] = useState<string>("");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [cities, setCities] = useState<Array<{ label: string; value: string }>>(
    []
  );
  const [plantOrigins, setPlantOrigins] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);
  const [loadingField, setLoadingField] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://api.geonames.org/searchJSON?country=FR&maxRows=1000&username=arosaje"
        );
        const data = await response.json();
        const cityOptions = data.geonames.map((city: any) => ({
          label: city.name,
          value: city.name,
        }));
        setCities(cityOptions);
      } catch (error) {
        console.error("Erreur lors de la récupération des villes:", error);
        Alert.alert("Erreur", "Impossible de récupérer la liste des villes.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPlantOrigins = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://my-api.plantnet.org/v2/species?lang=fr&type=kt&api-key=2b10FKDZzM01FIUFbOcPO6tgF"
        );
        const data = await response.json();
        const originOptions = data.map((plant: any) => ({
          label:
            plant.commonNames.join(", ") || plant.scientificNameWithoutAuthor,
          value:
            plant.commonNames.join(", ") || plant.scientificNameWithoutAuthor,
        }));
        setPlantOrigins(originOptions);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des origines des plantes:",
          error
        );
        Alert.alert(
          "Erreur",
          "Impossible de récupérer la liste des origines des plantes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
    fetchPlantOrigins();
  }, []);

  const handleSearch = () => {
    if (!cityName && !dateStart && !dateEnd && !plantOrigin) {
      Alert.alert("Erreur", "Veuillez renseigner au moins un champ.");
      return;
    }

    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    let queryString = `${apiUrl}/post/read?quantite=5&saut=0`;

    if (cityName) queryString += `&cityName=${encodeURIComponent(cityName)}`;
    if (dateStart) queryString += `&dateStart=${dateStart}`;
    if (dateEnd) queryString += `&dateEnd=${dateEnd}`;
    if (plantOrigin)
      queryString += `&plantOrigin=${encodeURIComponent(plantOrigin)}`;

    navigation.navigate("Actualités", {
      cityName,
      dateStart,
      dateEnd,
      plantOrigin,
    });
  };

  const handleDayPress = (day: DateData, type: "start" | "end") => {
    if (type === "start") {
      setDateStart(day.dateString);
      setShowStartDatePicker(false);
    } else if (type === "end") {
      setDateEnd(day.dateString);
      setShowEndDatePicker(false);
    }
  };

  const handleSelectChange = (value: string | null) => {
    setLoadingSelect(true);
    setPlantOrigin(value ?? "");
    setTimeout(() => setLoadingSelect(false), 3000);
  };

  const handleFieldClick = () => {
    if (!loadingField) {
      setLoadingField(true);
      setShowPicker(true);

      setTimeout(() => {
        setLoadingField(false);
      }, 3000);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.label}>Ville</Text>
          <RNPickerSelect
            placeholder={{ label: "Sélectionnez une Ville", value: null }}
            value={cityName}
            onValueChange={(value) => setCityName(value ?? "")}
            items={cities}
            style={pickerSelectStyles}
          />

          <Text style={styles.label}>Date de début</Text>
          <Pressable onPress={() => setShowStartDatePicker(true)}>
            <Text style={[styles.input, dateStart ? styles.selectedDate : {}]}>
              {dateStart ? dateStart.toString() : "Sélectionnez une date"}
            </Text>
          </Pressable>
          {showStartDatePicker && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showStartDatePicker}
            >
              <TouchableWithoutFeedback
                onPress={() => setShowStartDatePicker(false)}
              >
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerWrapper}>
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setShowStartDatePicker(false)}
                    >
                      <Text style={styles.closeButtonText}>×</Text>
                    </Pressable>

                    <Calendar
                      markedDates={{
                        [dateStart?.toString().split("T")[0] || ""]: {
                          selected: true,
                          selectedColor: "#668F80",
                        },
                      }}
                      onDayPress={(day: DateData) =>
                        handleDayPress(day, "start")
                      }
                      theme={{
                        todayTextColor: "#668F80",
                        selectedDayBackgroundColor: "#668F80",
                        arrowColor: "#668F80",
                        monthTextColor: "#4A6670",
                        textSectionTitleColor: "#4A6670",
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          <Text style={styles.label}>Date de fin</Text>
          <Pressable onPress={() => setShowEndDatePicker(true)}>
            <Text style={[styles.input, dateEnd ? styles.selectedDate : {}]}>
              {dateEnd ? dateEnd.toString() : "Sélectionnez une date"}
            </Text>
          </Pressable>
          {showEndDatePicker && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showEndDatePicker}
            >
              <TouchableWithoutFeedback
                onPress={() => setShowEndDatePicker(false)}
              >
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerWrapper}>
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setShowEndDatePicker(false)}
                    >
                      <Text style={styles.closeButtonText}>×</Text>
                    </Pressable>

                    <Calendar
                      markedDates={{
                        [dateEnd?.toString().split("T")[0] || ""]: {
                          selected: true,
                          selectedColor: "#668F80",
                        },
                      }}
                      onDayPress={(day: DateData) => handleDayPress(day, "end")}
                      theme={{
                        todayTextColor: "#668F80",
                        selectedDayBackgroundColor: "#668F80",
                        arrowColor: "#668F80",
                        monthTextColor: "#4A6670",
                        textSectionTitleColor: "#4A6670",
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          <Text style={styles.label}>Plante</Text>
          <View style={styles.pickerContainer}>
            <Pressable
              onPress={handleFieldClick}
              disabled={loadingField}
            >
              <RNPickerSelect
                placeholder={{ label: "Sélectionnez une Plante", value: null }}
                value={plantOrigin}
                onValueChange={handleSelectChange}
                items={plantOrigins}
                style={pickerSelectStyles}
              />
            </Pressable>
            {loadingField && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#668F80" />
              </View>
            )}
            {loadingSelect && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#668F80" />
              </View>
            )}
          </View>

          <Pressable style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Rechercher</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dropdown: {
    height: 40,
    borderColor: "#4A6670",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    position: "relative",
    marginBottom: 10,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: 10,
    borderColor: "#4A6670",
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedDate: {
    backgroundColor: "#f0f0f0",
  },
  searchButton: {
    backgroundColor: "#668F80",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: "#4A6670",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: "#4A6670",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  placeholder: {
    color: "#4A6670",
  },
});
