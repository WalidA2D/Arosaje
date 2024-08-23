import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Load from '../../components/Loading';

type RootStackParamList = {
  ProfileConsult: { idUser: number };
};

type ProfileConsultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileConsult'>;
type ProfileConsultScreenRouteProp = RouteProp<RootStackParamList, 'ProfileConsult'>;

interface Post {
  title: string;
  description: string;
  publishedAt: string;
}

export default function ProfileConsultView() {
  
  const navigation = useNavigation<ProfileConsultScreenNavigationProp>();
  const route = useRoute<ProfileConsultScreenRouteProp>();
  const { idUser } = route.params;
  const [selectedTab, setSelectedTab] = useState('Posts');
  const [profileData, setProfileData] = useState({
    lastName: '',
    firstName: '',
    role: '',
    cityName: '',
    idUser: '',
    profilePic: ''
  });
  const [posts, setPosts] = useState<Post[]>([
    { title: 'Post 1', description: 'Description for Post 1', publishedAt: '2023-06-25' },
    { title: 'Post 2', description: 'Description for Post 2', publishedAt: '2023-06-24' },
    { title: 'Post 3', description: 'Description for Post 3', publishedAt: '2023-06-23' },
  ]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  const fetchProfileData = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
      const response = await fetch(`${apiUrl}/user/read/${idUser}`, options);
      const data = await response.json();

      if (data.success) {
        setProfileData({
          lastName: data.user.lastName,
          firstName: data.user.firstName,
          role: data.user.role,
          idUser: data.user.idUser,
          cityName: data.user.cityName,
          profilePic: data.user.profilePic
        });

        if (idUser) {
          fetchUserPosts(idUser.toString());
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

  useEffect(() => {
    fetchProfileData();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return (
        <Load></Load>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>

      <View style={styles.profileImageContainer}>
        {profileData.profilePic ? (
          <Image
            source={{ uri: profileData.profilePic }}
            style={styles.profileImage}
          />
        ) : (
          <Text style={styles.errorText}>Image non disponible</Text>
        )}
      </View>

      <View style={styles.fixedDetails}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{`${profileData.firstName} ${profileData.lastName}`}</Text>
          
          <TouchableOpacity onPress={() => openMap(profileData.cityName)}>
            <Text style={styles.profileRole}>{profileData.role} | {profileData.cityName}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectorContainer}>
            <Text style={[styles.selectorText, selectedTab === 'Posts' && styles.activeText]}>Posts</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.body}>
            <View>
              {posts.map((post, index) => (
                <View key={index} style={styles.post}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent}>{post.description}</Text>
                  <Text style={styles.postContent}>Publié le: {post.publishedAt}</Text>
                </View>
              ))}
            </View>
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
  scrollViewContent: {
    paddingTop: 20,
  },
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  selectorContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: '#668F80',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '90%',
    alignSelf: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
});
