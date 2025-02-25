var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable, Modal } from 'react-native';
import AnimatedCheckbox from 'react-native-checkbox-reanimated';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Loading from '../../components/Loading';
import BigButtonDown from '../../components/BigButtonDown';
export default function PubPlantes() {
    const navigation = useNavigation();
    const route = useRoute();
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSpeciesDetails, setSelectedSpeciesDetails] = useState(null);
    const [checkedId, setCheckedId] = useState(null);
    const flatListRef = useRef(null);
    const PLANTNET = process.env.EXPO_PUBLIC_API_PLANTNET;
    const handleCheckboxPress = (id) => {
        setCheckedId(prev => (prev === id ? null : id));
    };
    const showSpeciesDetails = (id) => {
        const selectedSpecies = species.find(species => species.id === id);
        setSelectedSpeciesDetails(selectedSpecies);
        setModalVisible(true);
    };
    useEffect(() => {
        const fetchSpecies = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.get(`https://my-api.plantnet.org/v2/species?lang=fr&type=kt&pageSize=300&page=1&api-key=${PLANTNET}`);
                const speciesData = response.data
                    .filter((item) => item.commonNames && item.commonNames.length > 0)
                    .map((item) => ({
                    id: item.id || '',
                    common_name: item.commonNames[0] || '',
                    scientific_name: item.scientificNameWithoutAuthor || '',
                    scientific_author: item.scientificNameAuthorship || '',
                    family_common_name: item.gbifId || '',
                    observations: item.powoId || '',
                }));
                const uniqueSpecies = Array.from(new Set(speciesData.map((s) => s.common_name)))
                    .map(common_name => {
                    return speciesData.find((s) => s.common_name === common_name);
                });
                const otherSpecies = { id: -1, common_name: "Autre / Je ne sais pas", image_url: "" };
                setSpecies([otherSpecies, ...uniqueSpecies]);
                setLoading(false);
            }
            catch (error) {
                setError("Erreur: " + error.message);
                setLoading(false);
            }
        });
        fetchSpecies();
    }, []);
    const handleValidation = () => {
        if (checkedId !== null) {
            const selectedSpecies = species.find(species => species.id === checkedId);
            navigation.navigate('Photo', { plaValid: true, plante: selectedSpecies.common_name });
        }
        else {
            navigation.navigate('Photo', { plaValid: false, plante: '' });
        }
    };
    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <Text>{error}</Text>;
    }
    return (<View style={styles.container}>
      <FlatList ref={flatListRef} data={species} keyExtractor={(item, index) => item.id.toString() + index.toString()} ListFooterComponent={<View style={styles.footerPadding}/>} renderItem={({ item }) => (<View style={styles.item}>
            {item.image_url ? (<Image source={{ uri: item.image_url }} style={styles.image}/>) : (<View style={styles.image}/>)}
            <Text>{item.common_name}</Text>
            <View style={styles.itemBtn}>
              {item.id !== -1 && (<Pressable onPress={() => showSpeciesDetails(item.id)}>
                  <Ionicons name="information-circle-outline" size={32} color="black"/>
                </Pressable>)}
              <Pressable onPress={() => handleCheckboxPress(item.id)} style={styles.checkbox}>
                <AnimatedCheckbox checked={checkedId === item.id} highlightColor="#668F80" checkmarkColor="#ffffff" boxOutlineColor="#668F80"/>
              </Pressable>
            </View>
          </View>)}/>
      <Pressable onPress={() => { var _a; return (_a = flatListRef.current) === null || _a === void 0 ? void 0 : _a.scrollToOffset({ offset: 0, animated: true }); }} style={styles.scrollToTopButton}>
            <Ionicons name="arrow-up-outline" size={32} color="#fff"/>
          </Pressable>
      <BigButtonDown buttonText="Choisir" onPress={handleValidation}/>
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        {selectedSpeciesDetails && (<View style={styles.modalContent}>
            <Text style={styles.modalContentTitre}>{selectedSpeciesDetails.common_name}</Text>
            <Text style={styles.modalContentText}>Nom : {selectedSpeciesDetails.common_name}</Text>
            <Text style={styles.modalContentText}>Nom scientifique : {selectedSpeciesDetails.scientific_name}</Text>
            <Text style={styles.modalContentText}>Auteur : {selectedSpeciesDetails.scientific_author}</Text>
            {/*<Text style={styles.modalContentText}>Nom de famille : {selectedSpeciesDetails.family_common_name}</Text>
            <Text style={styles.modalContentText}>Endroits : {selectedSpeciesDetails.observations}</Text>
            <Image source={{ uri: selectedSpeciesDetails.image_url }} style={styles.imageModal} />*/}
            <Image style={styles.imageModal} source={require('../../assets/images/noflower.png')}/>
            <View style={styles.fixedDetailsBtn}>
              <View style={styles.selectorContainer}>
                <Pressable style={[styles.selectorButton, { backgroundColor: '#668F80' }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                    Retour
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>)}
      </Modal>
    </View>);
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
});
