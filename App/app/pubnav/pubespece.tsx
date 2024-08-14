import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
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

  const handleCheckboxPress = (id: number) => {
    setCheckedId(prev => (prev === id ? null : id));
  }

  const showSpeciesDetails = async (id: number) => {
    try {
      const response = await axios.get(`https://my-api.plantnet.org/v2/projects/k-southwestern-europe/species/${id}?lang=fr&type=kt&api-key=2b10FKDZzM01FIUFbOcPO6tgF`);
      setSelectedSpeciesDetails(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'espèce:", error);
    }
  };

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get('https://my-api.plantnet.org/v2/species?lang=fr&type=kt&api-key=2b10FKDZzM01FIUFbOcPO6tgF');
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
  }, []);

  const handleValidation = () => {
    if (checkedId !== null) {
      const selectedSpecies = species.find(species => species.id === checkedId);
      navigation.navigate('Publier', { espValid: true, espece: selectedSpecies.common_name });
    } else {
      navigation.navigate('Publier', { espValid: false, espece: '' });
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
      <FlatList
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
            <Text>{item.common_name}</Text>
            <View style={styles.itemBtn}>
              {item.id !== -1 && (
                <TouchableOpacity onPress={() => showSpeciesDetails(item.id)}>
                  <Ionicons name="information-circle-outline" size={32} color="black" />
                </TouchableOpacity>
              )}
              <Pressable onPress={() => handleCheckboxPress(item.id)} style={styles.checkbox}>
                <AnimatedCheckbox
                  checked={checkedId === item.id}
                  highlightColor="#668F80"
                  checkmarkColor="#ffffff"
                  boxOutlineColor="#668F80"
                />
              </Pressable>
            </View>
          </View>
        )}
      />
      <BigButtonDown buttonText="Choisir" onPress={handleValidation} />
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        {selectedSpeciesDetails && (
          <View style={styles.modalContent}>
            <Text style={styles.modalContentText}>Nom : {selectedSpeciesDetails.common_name}</Text>
            <Text style={styles.modalContentText}>Nom scientifique : {selectedSpeciesDetails.scientific_name}</Text>
            <Text style={styles.modalContentText}>Années : {selectedSpeciesDetails.scientific_author}</Text>
            <Text style={styles.modalContentText}>Nom de famille : {selectedSpeciesDetails.family_common_name}</Text>
            <Text style={styles.modalContentText}>Endroits : {selectedSpeciesDetails.observations}</Text>
            <Image source={{ uri: selectedSpeciesDetails.image_url }} style={styles.imageModal} />
            <View style={styles.fixedDetailsBtn}>
              <View style={styles.selectorContainer}>
                <TouchableOpacity style={[styles.selectorButton, { backgroundColor: '#668F80' }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                    Retour
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  checkbox: {
    width: 32,
    height: 32,
    marginLeft: 10
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
});