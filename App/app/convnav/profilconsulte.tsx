import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Load from '../../components/Loading';

type RootStackParamList = {
  ProfileConsult: { userName: string };
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
  const { userName } = route.params;
  const [selectedTab, setSelectedTab] = useState('Posts');
  const [profileData, setProfileData] = useState({
    lastName: 'Doe',
    firstName: 'John',
    role: 'Admin',
    cityName: 'Paris',
    idUser: '12345',
    address: '123 Street',
    phone: '123-456-7890',
    profilePic: 'https://picsum.photos/120'
  });
  const [posts, setPosts] = useState<Post[]>([
    { title: 'Post 1', description: 'Description for Post 1', publishedAt: '2023-06-25' },
    { title: 'Post 2', description: 'Description for Post 2', publishedAt: '2023-06-24' },
    { title: 'Post 3', description: 'Description for Post 3', publishedAt: '2023-06-23' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
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

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.body}>
          {selectedTab === 'Posts' ? (
            <View>
              {posts.map((post, index) => (
                <View key={index} style={styles.post}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent}>{post.description}</Text>
                  <Text style={styles.postContent}>Publié le: {post.publishedAt}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <View style={styles.image}>
                <Image source={require('@/assets/images/plante1.jpg')} style={styles.imageContent} />
              </View>
              <View style={styles.image}>
                <Image source={require('@/assets/images/plante2.jpg')} style={styles.imageContent} />
              </View>
              <View style={styles.image}>
                <Image source={require('@/assets/images/plante3.jpg')} style={styles.imageContent} />
              </View>
            </View>
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
