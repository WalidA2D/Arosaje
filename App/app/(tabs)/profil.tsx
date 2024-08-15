import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

import ProfileImagePopup from '../profilnav/ProfileImagePopup';
import Calendrier from '../profilnav/calendar';
import UpdateProfil from '../profilnav/updateProfil';
import Load from '../../components/Loading';

const Stack = createNativeStackNavigator();

function ProfScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Profil"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#668F80',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            color: '#FFF',
            fontSize: 24,
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Profil" 
          component={ProfilScreen} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Calendrier')} style={{ marginRight: 10 }}>
                <Ionicons name="today" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Calendrier" component={Calendrier} options={{ headerBackTitleVisible: false }} />
        <Stack.Screen name="Modification" component={UpdateProfil} options={{ headerBackTitleVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type RootStackParamList = {
  Profil: { updated?: boolean };
  Modification: {
    lastName: string;
    firstName: string;
    address: string;
    phone: string;
    cityName: string;
  };
};

type ProfilScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profil'>;
type ProfilScreenRouteProp = RouteProp<RootStackParamList, 'Profil'>;

interface Post {
  idPosts: number;
  title: string;
  description: string;
  publishedAt: string;
  isFavorite?: boolean; // Ajouter un attribut pour suivre l'état du favori
}

interface Favorite extends Post {}

export function ProfilScreen() {
  const navigation = useNavigation<ProfilScreenNavigationProp>();
  const route = useRoute<ProfilScreenRouteProp>();
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true); 
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  const fetchProfileData = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,

      }
    };

    try {
      const response = await fetch(`${apiUrl}/user/profil`, options);
      const data = await response.json();

      if (data.success) {
        const userId = data.user.idUsers;
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
        } else {
          console.error('User ID is undefined');
        }
      } else {
        console.error('Failed to fetch profile data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchUserPosts = async (idUser: string) => {
    setLoading(true);
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
      const response = await fetch(`${apiUrl}/post/read/${idUser}`, options);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.record);
      } else {
        console.error('Failed to fetch posts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error); 
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async (idUser: string) => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken
      }
    };

    try {
      const response = await fetch(`${apiUrl}/fav/read`, options);
      const data = await response.json();
      if (data.success) {
        // Ajoutez isFavorite à chaque favori
        const favoritesWithState = data.record.map((fav: Favorite) => ({
          ...fav,
          isFavorite: true,
        }));
        setFavorites(favoritesWithState);
      } else {
        console.error('Failed to fetch favorites:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error); 
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (idPost: number) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
      }
    };
  
    try {
      const response = await fetch(`${apiUrl}/fav/delete/${idPost}`, options);
      const data = await response.json();
      if (data.success) {
        // Mettez à jour l'état isFavorite de l'élément dans la liste des favoris
        setFavorites((prevFavorites) =>
          prevFavorites.map((favorite) =>
            favorite.idPosts === idPost ? { ...favorite, isFavorite: false } : favorite
          )
        );
      } else {
        console.error('Failed to delete favorite:', data.message);
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  const handleAddFavorite = async (idPost: number) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken,
      },
      body: JSON.stringify({ id: idPost })
    };
  
    try {
      const response = await fetch(`${apiUrl}/fav/add`, options);
      const data = await response.json();
      if (data.success) {
        // Mettez à jour l'état isFavorite de l'élément dans la liste des favoris
        setFavorites((prevFavorites) =>
          prevFavorites.map((favorite) =>
            favorite.idPosts === idPost ? { ...favorite, isFavorite: true } : favorite
          )
        );
      } else {
        console.error('Failed to add favorite:', data.message);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (route.params?.updated) {
      fetchProfileData();
      navigation.setParams({ updated: false });
    }
  }, [route.params?.updated]);

  const openMap = (cityName: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName)}`;
  
    Alert.alert(
      'Confirmation',
      `Voulez-vous être redirigé vers la carte ?`,
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => {
            Linking.canOpenURL(url)
              .then((supported: boolean) => {
                if (supported) {
                  return Linking.openURL(url);
                } else {
                  console.error("Don't know how to open URI: " + url);
                }
              })
              .catch((err: Error) => console.error('An error occurred', err));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Post | Favorite }) => {
    if (selectedTab === 'Posts') {
      // Affichage pour les posts
      return (
        <View style={styles.post}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postContent}>{item.description}</Text>
          <Text style={styles.postContent}>Publié le: {item.publishedAt}</Text>
        </View>
      );
    } else if (selectedTab === 'Favorites') {
      // Affichage pour les favoris
      const isFavorite = item.isFavorite !== false;
      return (
        <View style={styles.post}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postContent}>{item.description}</Text>
          <Text style={styles.postContent}>
            Publié le: {item.publishedAt} 
          </Text>
          <TouchableOpacity
            onPress={() =>
              isFavorite ? handleRemoveFavorite(item.idPosts) : handleAddFavorite(item.idPosts)
            }
          >
            <Ionicons
              name="heart"
              size={25}
              color={isFavorite ? '#FF4500' : '#A9A9A9'}
              style={styles.postIcon}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const popupRef = useRef<any>(null);

  if (loading) {
    return (
      <Load></Load>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileImagePopup ref={popupRef} apiUrl={apiUrl} setProfileData={setProfileData} />
      <View style={styles.header}></View>

      <View style={styles.profileImageContainer}>
        {profileData.profilePic ? (
          <TouchableOpacity onPress={() => popupRef.current.showPopup()}>
            <Image
              source={{ uri: profileData.profilePic }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        ) : (
          <Load></Load>
        )}
      </View>

      <View style={styles.fixedDetails}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{`${profileData.firstName} ${profileData.lastName}`}
            <TouchableOpacity onPress={() => navigation.navigate('Modification', profileData)}><Ionicons name="pencil" size={25} color="#668F80" /></TouchableOpacity></Text>
          
          <TouchableOpacity onPress={() => openMap(profileData.cityName)}>
            <Text style={styles.profileRole}>{profileData.role} | {profileData.cityName}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[styles.selectorButton, selectedTab === 'Posts' && styles.activeButton]}
            onPress={() => setSelectedTab('Posts')}
          >
            <Text style={[styles.selectorText, selectedTab === 'Posts' && styles.activeText]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, selectedTab === 'Favorites' && styles.activeButton]}
            onPress={() => setSelectedTab('Favorites')}
          >
            <Text style={[styles.selectorText, selectedTab === 'Favorites' && styles.activeText]}>Favoris</Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedTab === 'Posts' ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.idPosts.toString()}
        />
      ) : (
      <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.idPosts.toString()}
        />
      )}
    </View>
  );
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
