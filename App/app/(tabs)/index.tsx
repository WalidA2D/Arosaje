import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, FlatList, Image } from 'react-native';
import ContentItem from '../../components/navigation/ContentItem';


export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Accueil</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Filtrer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.body}>
            <ContentItem
              images={[
                'https://picsum.photos/600/300',
                'https://picsum.photos/610/300',
                'https://picsum.photos/620/300',
              ]}
              title="Titre du slider"
              description="Description du slider"
              time="Il y a 8 minutes"
            />
            <ContentItem
              images={[
                'https://picsum.photos/590/300',
              ]}
              title="Titre du slider"
              description="Description du slider"
              time="Il y a 18 minutes"
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 100,
    backgroundColor: '#668F80',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  headerButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#F0F0F0',
    color: '#000',
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
});
