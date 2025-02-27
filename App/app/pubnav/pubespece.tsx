import React, { useEffect, useState, useRef } from 'react';
import { Platform, StyleSheet, View, Text, FlatList, Image, Pressable, Modal, TextInput } from 'react-native';
import { CheckBox, Icon } from '@rneui/themed';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Loading from '../../components/Loading';
import BigButtonDown from '../../components/BigButtonDown';

type RootStackParamList = {
  Publier: { espValid?: boolean, espece: string };
  Espece: { espece: '' };
};

type UpdateEspeceNavigationProp = StackNavigationProp<RootStackParamList, 'Espece'>;
type UpdateEspeceRouteProp = RouteProp<RootStackParamList, 'Espece'>;

export default function PubEspece() {
  const navigation = useNavigation<UpdateEspeceNavigationProp>();
  const route = useRoute<UpdateEspeceRouteProp>();
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSpeciesDetails, setSelectedSpeciesDetails] = useState<any | null>(null);
  const [checkedId, setCheckedId] = useState<number | null>(null);
  const [customSpecies, setCustomSpecies] = useState<string>(''); // Champ texte pour Web
  const flatListRef = useRef<FlatList>(null);
  const PLANTNET = process.env.EXPO_PUBLIC_API_PLANTNET;

  const handleCheckboxPress = (id: number) => {
    setCheckedId(prev => (prev === id ? null : id));
  };

  const showSpeciesDetails = (id: number) => {
    const selectedSpecies = species.find(species => species.id === id);
    setSelectedSpeciesDetails(selectedSpecies);
    setModalVisible(true);
  };

  useEffect(() => {
    if (Platform.OS !== 'web') { // Ne pas appeler l'API si on est sur Web
      const fetchSpecies = async () => {
        try {
          const response = await axios.get(`https://my-api.plantnet.org/v2/species?lang=fr&type=kt&pageSize=300&page=1&api-key=${PLANTNET}`);
          const speciesData = response.data
            .filter((item: any) => item.commonNames && item.commonNames.length > 0)
            .map((item: any) => ({
              id: item.id || '',
              common_name: item.commonNames[0] || '',
              scientific_name: item.scientificNameWithoutAuthor || '',
              scientific_author: item.scientificNameAuthorship || '',
              family_common_name: item.gbifId || '',
              observations: item.powoId || '',
            }));

          const uniqueSpecies = Array.from(new Set(speciesData.map((s: { common_name: string }) => s.common_name)))
            .map(common_name => {
              return speciesData.find((s: { common_name: string }) => s.common_name === common_name);
            });

          const otherSpecies = { id: -1, common_name: "Autre / Je ne sais pas", image_url: "" };
          setSpecies([otherSpecies, ...uniqueSpecies]);
          setLoading(false);
        } catch (error: any) {
          setError("Erreur: " + (error as Error).message);
          setLoading(false);
        }
      };

      fetchSpecies();
    } else {
      setLoading(false); // Sur Web, pas besoin d'attendre l'API
    }
  }, []);

  const handleValidation = () => {
    if (Platform.OS === 'web') {
      // Validation sur Web : Envoi du texte entré par l'utilisateur
      navigation.navigate('Publier', { espValid: true, espece: customSpecies });
    } else {
      // Validation sur Mobile : Utilisation de l'espèce sélectionnée
      if (checkedId !== null) {
        const selectedSpecies = species.find(species => species.id === checkedId);
        navigation.navigate('Publier', { espValid: true, espece: selectedSpecies.common_name });
      } else {
        navigation.navigate('Publier', { espValid: false, espece: '' });
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        // 🎯 Affichage du champ texte sur Web
        <View style={styles.webInputContainer}>
          <Text style={styles.label}>Entrez le nom de l'espèce :</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Rosa gallica"
            value={customSpecies}
            onChangeText={setCustomSpecies}
          />
        </View>
      ) : (
        // 📱 Version Mobile inchangée : Liste des espèces depuis l'API
        <FlatList
          ref={flatListRef}
          data={species}
          keyExtractor={(item, index) => item.id.toString() + index.toString()}
          ListFooterComponent={<View style={styles.footerPadding} />}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <View style={styles.image} />
              )}
              <View style={styles.itemBtn}>
                {item.id !== -1 && (
                  <Icon
                    onPress={() => showSpeciesDetails(item.id)}
                    color='black'
                    size={32}
                    name="information-circle-outline"
                    type="ionicon"
                    iconStyle={{ paddingTop: 15 }}
                    containerStyle={{ backgroundColor: '#f9f9f9' }}
                  />
                )}
                <CheckBox
                  checked={checkedId === item.id}
                  onPress={() => handleCheckboxPress(item.id)}
                  title={item.common_name}
                  checkedColor='#668F80'
                  uncheckedColor='#668F80'
                  size={32}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  iconRight
                  containerStyle={{ backgroundColor: '#f9f9f9' }}
                />
              </View>
            </View>
          )}
        />
      )}

      <BigButtonDown buttonText="Choisir" onPress={handleValidation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  itemBtn: {
    padding: 20,
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  modalContentText: {
    padding: 5,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContentTitre: {
    padding: 5,
    marginBottom: 10,
    fontSize: 32,
    fontWeight: 'bold',
  },
  fixedDetailsBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 50,
    backgroundColor: '#E0E0E0',
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
  },
  imageModal: {
    width: 250,
    height: 250,
  },
  footerPadding: {
    height: 100,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#668F80',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
  webInputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});