var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Alert, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import ProfileImagePopup from '../profilnav/ProfileImagePopup';
import Calendrier from '../profilnav/calendar';
import UpdateProfil from '../profilnav/updateProfil';
import Load from '../../components/Loading';
const Stack = createNativeStackNavigator();
function ProfScreen() {
    return (<NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Profil" screenOptions={{
            headerStyle: {
                backgroundColor: '#668F80',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#FFF',
                fontSize: 24,
                fontWeight: 'bold',
            },
        }}>
        <Stack.Screen name="Profil" component={ProfilScreen} options={({ navigation }) => ({
            headerRight: () => (<Pressable onPress={() => navigation.navigate('Calendrier')} style={{ marginRight: 10 }}>
                <Ionicons name="today" size={24} color="#fff"/>
              </Pressable>),
        })}/>
        <Stack.Screen name="Calendrier" component={Calendrier} options={{ headerBackTitleVisible: false }}/>
        <Stack.Screen name="Modification" component={UpdateProfil} options={{ headerBackTitleVisible: false }}/>
      </Stack.Navigator>
    </NavigationContainer>);
}
export function ProfilScreen() {
    var _a;
    const navigation = useNavigation();
    const route = useRoute();
    const [selectedTab, setSelectedTab] = useState('Posts');
    const [profileData, setProfileData] = useState({
        lastName: '',
        firstName: '',
        role: '',
        cityName: '',
        idUser: '',
        address: '',
        phone: '',
        profilePic: ''
    });
    const [posts, setPosts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';
    const fetchProfileData = () => __awaiter(this, void 0, void 0, function* () {
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            }
        };
        try {
            const response = yield fetch(`${apiUrl}/user/profil`, options);
            const data = yield response.json();
            if (data.success) {
                const userId = data.user.idUser;
                setProfileData({
                    lastName: data.user.lastName,
                    firstName: data.user.firstName,
                    role: data.user.role,
                    idUser: userId,
                    cityName: data.user.cityName,
                    address: data.user.address,
                    phone: data.user.phone,
                    profilePic: data.user.photo
                });
                if (userId) {
                    fetchUserPosts(userId);
                    fetchUserFavorites(userId);
                }
                else {
                    console.error('User ID is undefined');
                }
            }
            else {
                console.error('Failed to fetch profile data:', data.message);
            }
        }
        catch (error) {
            console.error('Error fetching profile data:', error);
        }
    });
    const fetchUserPosts = (idUser) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        try {
            const response = yield fetch(`${apiUrl}/post/read/${idUser}`, options);
            const data = yield response.json();
            console.log(response);
            if (data.success) {
                setPosts(data.record);
            }
            else {
                console.error('Failed to fetch posts:', data.message);
            }
        }
        catch (error) {
            console.error('Error fetching user posts:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const fetchUserFavorites = (idUser) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || ''
            }
        };
        try {
            const response = yield fetch(`${apiUrl}/fav/read`, options);
            const data = yield response.json();
            if (data.success) {
                // Ajoutez isFavorite à chaque favori
                const favoritesWithState = data.record.map((fav) => (Object.assign(Object.assign({}, fav), { isFavorite: true })));
                setFavorites(favoritesWithState);
            }
            else {
                console.error('Failed to fetch favorites:', data.message);
            }
        }
        catch (error) {
            console.error('Error fetching user favorites:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleRemoveFavorite = (idPost) => __awaiter(this, void 0, void 0, function* () {
        // Mettre à jour immédiatement l'état local pour refléter la suppression du favori
        setFavorites((prevFavorites) => prevFavorites.map((favorite) => favorite.idPost === idPost ? Object.assign(Object.assign({}, favorite), { isFavorite: false }) : favorite));
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            }
        };
        try {
            const response = yield fetch(`${apiUrl}/fav/delete/${idPost}`, options);
            const data = yield response.json();
            if (!data.success) {
                console.error('Failed to delete favorite:', data.message);
                // Revert state change if API call fails
                setFavorites((prevFavorites) => prevFavorites.map((favorite) => favorite.idPost === idPost ? Object.assign(Object.assign({}, favorite), { isFavorite: true }) : favorite));
            }
        }
        catch (error) {
            console.error('Error deleting favorite:', error);
            // Revert state change if API call fails
            setFavorites((prevFavorites) => prevFavorites.map((favorite) => favorite.idPost === idPost ? Object.assign(Object.assign({}, favorite), { isFavorite: true }) : favorite));
        }
    });
    const handleAddFavorite = (idPost) => __awaiter(this, void 0, void 0, function* () {
        // Mettre à jour immédiatement l'état local pour refléter l'ajout du favori
        setFavorites((prevFavorites) => prevFavorites.map((favorite) => favorite.idPost === idPost ? Object.assign(Object.assign({}, favorite), { isFavorite: true }) : favorite));
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            },
            body: JSON.stringify({ id: idPost })
        };
        try {
            const response = yield fetch(`${apiUrl}/fav/add`, options);
            const data = yield response.json();
            if (!data.success) {
                console.error('Failed to add favorite:', data.message);
                // Revert state change if API call fails
                setFavorites((prevFavorites) => prevFavorites.map((favorite) => favorite.idPost === idPost ? Object.assign(Object.assign({}, favorite), { isFavorite: false }) : favorite));
            }
        }
        catch (error) {
            console.error('Error adding favorite:', error);
            // Revert state change if API call fails
            setFavorites((prevFavorites) => prevFavorites.map((favorite) => favorite.idPost === idPost ? Object.assign(Object.assign({}, favorite), { isFavorite: false }) : favorite));
        }
    });
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).replace(',', ' à');
    };
    useEffect(() => {
        var _a;
        fetchProfileData();
        if ((_a = route.params) === null || _a === void 0 ? void 0 : _a.updated) {
            fetchProfileData();
            navigation.setParams({ updated: false });
        }
    }, [(_a = route.params) === null || _a === void 0 ? void 0 : _a.updated]);
    // Ajouter un useEffect pour surveiller le changement de `selectedTab`
    useEffect(() => {
        if (selectedTab === 'Favorites') {
            const userId = profileData.idUser;
            if (userId) {
                fetchUserFavorites(userId);
            }
        }
    }, [selectedTab]);
    const openMap = (cityName) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName)}`;
        Alert.alert('Confirmation', `Voulez-vous être redirigé vers la carte ?`, [
            { text: 'Non', style: 'cancel' },
            {
                text: 'Oui',
                onPress: () => {
                    Linking.canOpenURL(url)
                        .then((supported) => {
                        if (supported) {
                            return Linking.openURL(url);
                        }
                        else {
                            console.error("Don't know how to open URI: " + url);
                        }
                    })
                        .catch((err) => console.error('An error occurred', err));
                },
            },
        ], { cancelable: false });
    };
    const renderItem = ({ item }) => {
        const formattedDate = formatDateTime(item.publishedAt);
        if (selectedTab === 'Posts') {
            // Affichage pour les posts
            return (<View style={styles.post}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postContent}>{item.description}</Text>
          <Text style={styles.postContent}>Publié le: {formattedDate}</Text>
        </View>);
        }
        else if (selectedTab === 'Favorites') {
            const isFavorite = item.isFavorite !== false;
            return (<View style={styles.post}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postContent}>{item.description}</Text>
          <Text style={styles.postContent}>
            Publié le: {formattedDate} 
          </Text>
          <Pressable onPress={() => isFavorite ? handleRemoveFavorite(item.idPost) : handleAddFavorite(item.idPost)}>
            <Ionicons name="heart" size={25} color={isFavorite ? '#668F80' : '#A9A9A9'} style={styles.postIcon}/>
          </Pressable>
        </View>);
        }
        return null;
    };
    const popupRef = useRef(null);
    if (loading) {
        return (<Load></Load>);
    }
    return (<View style={styles.container}>
      <ProfileImagePopup ref={popupRef} apiUrl={apiUrl} setProfileData={setProfileData}/>
      <View style={styles.header}></View>

      <View style={styles.profileImageContainer}>
        {profileData.profilePic ? (<Pressable onPress={() => popupRef.current.showPopup()}>
            <Image source={{ uri: profileData.profilePic }} style={styles.profileImage}/>
          </Pressable>) : (<Load></Load>)}
      </View>

      <View style={styles.fixedDetails}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{`${profileData.firstName} ${profileData.lastName}`}
            <Pressable onPress={() => navigation.navigate('Modification', profileData)}><Ionicons name="pencil" size={25} color="#668F80"/></Pressable></Text>
          
          <Pressable onPress={() => openMap(profileData.cityName)}>
            <Text style={styles.profileRole}>{profileData.role} | {profileData.cityName}</Text>
          </Pressable>
        </View>

        <View style={styles.selectorContainer}>
          <Pressable style={[styles.selectorButton, selectedTab === 'Posts' && styles.activeButton]} onPress={() => setSelectedTab('Posts')}>
            <Text style={[styles.selectorText, selectedTab === 'Posts' && styles.activeText]}>Posts</Text>
          </Pressable>
          <Pressable style={[styles.selectorButton, selectedTab === 'Favorites' && styles.activeButton]} onPress={() => setSelectedTab('Favorites')}>
            <Text style={[styles.selectorText, selectedTab === 'Favorites' && styles.activeText]}>Favoris</Text>
          </Pressable>
        </View>
      </View>

      {selectedTab === 'Posts' ? (<FlatList data={posts} renderItem={renderItem} keyExtractor={(item) => item.idPost.toString()}/>) : (<FlatList data={favorites} renderItem={renderItem} keyExtractor={(item) => item.idPost.toString()}/>)}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        height: 135,
        backgroundColor: '#668F80',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    profileImageContainer: {
        position: 'absolute',
        top: 35,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    fixedDetails: {
        marginTop: 40,
        alignItems: 'center',
    },
    profileDetails: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileRole: {
        fontSize: 16,
        color: 'gray',
    },
    selectorContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
        overflow: 'hidden',
        width: '90%',
    },
    selectorButton: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#668F80',
    },
    selectorText: {
        fontSize: 16,
        color: '#666',
    },
    activeText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    post: {
        marginBottom: 20,
        paddingHorizontal: 10,
        position: 'relative',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postContent: {
        fontSize: 14,
        color: 'gray',
    },
    postIcon: {
        position: 'absolute',
        right: 25,
        top: '50%',
        transform: [{ translateY: -40 }],
    },
});
export default ProfScreen;
