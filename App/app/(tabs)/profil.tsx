import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

export function ProfilScreen() {
  const navigation = useNavigation<ProfilScreenNavigationProp>();
  const route = useRoute<ProfilScreenRouteProp>();
  const [selectedTab, setSelectedTab] = useState('Posts');
  const [profileData, setProfileData] = useState({ lastName: '', firstName: '', role: '', cityName: '', idUser: '', address: '', phone: '', profilePic: '' });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); 
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  const fetchProfileData = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : userToken,
      }
    };

    fetch(`${apiUrl}/user/profil`, options)
      .then(response => response.json())
      .then(data => {
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
          } else {
            console.error('User ID is undefined');
          }
          
        }
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
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
        setPosts(data.body);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error); 
    } finally {
      setLoading(false);
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
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(url);
                } else {
                  console.error("Don't know how to open URI: " + url);
                }
              })
              .catch(err => console.error('An error occurred', err));
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.description}</Text>
      <Text style={styles.postContent}>Publié le: {item.publishedAt}</Text>
    </View>
  );

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
            style={[styles.selectorButton, selectedTab === 'Images' && styles.activeButton]}
            onPress={() => setSelectedTab('Images')}
          >
            <Text style={[styles.selectorText, selectedTab === 'Images' && styles.activeText]}>Images</Text>
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
        <View style={styles.imagesContainer}>
          <Image source={require('@/assets/images/plante1.jpg')} style={styles.imageContent} />
          <Image source={require('@/assets/images/plante2.jpg')} style={styles.imageContent} />
          <Image source={require('@/assets/images/plante3.jpg')} style={styles.imageContent} />
        </View>
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
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
    paddingBottom: 80,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 14,
    paddingBottom: 50,
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
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
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
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
    color: 'gray',
  },
  image: {
    marginBottom: 20,
  },
  imageContent: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  imagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

export default ProfScreen;
