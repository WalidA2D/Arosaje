import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfilScreen() {
  const [selectedTab, setSelectedTab] = useState('Posts'); // État pour gérer le sélecteur

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Options</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>Profil</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileImageContainer}>
        <Image
          source={require('@/assets/images/pp_base.jpg')}
          style={styles.profileImage}
        />
      </View>
      
      <View style={styles.fixedDetails}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>Victoria Robertson</Text>
          <Text style={styles.profileRole}>Rôle | Localisation</Text>
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
          {/* Contenu affiché en fonction du sélecteur */}
          {selectedTab === 'Posts' ? (
            <View>
              <View style={styles.post}>
                <Text style={styles.postTitle}>Header</Text>
                <Text style={styles.postContent}>He'll want to use your yacht, and I don't want this thing smelling like fish.</Text>
              </View>
              <View style={styles.post}>
                <Text style={styles.postTitle}>Header</Text>
                <Text style={styles.postContent}>He'll want to use your yacht, and I don't want this thing smelling like fish.</Text>
              </View>
              <View style={styles.post}>
                <Text style={styles.postTitle}>Header</Text>
                <Text style={styles.postContent}>He'll want to use your yacht, and I don't want this thing smelling like fish.</Text>
              </View>
              {/* Ajoutez d'autres posts ici */}
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
              {/* Ajoutez d'autres images ici */}
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
    height: 200,
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
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 10,
    paddingBottom: 50,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 16,
    paddingBottom: 50,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 100,
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
    fontSize: 22,
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
});
