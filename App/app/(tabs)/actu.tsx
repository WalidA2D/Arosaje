import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContentItem from '../../components/navigation/ContentItem';

type Post = {
  idPosts: number;
  title: string;
  description: string;
  publishedAt: Date;
  image1: string | null;
  image2: string | null;
  image3: string | null;
};

type ContentItemData = {
  id: string;
  images: string[];
  title: string;
  description: string;
  time: string;
};

type RootStackParamList = {
  Actualités: undefined;
  Filtre: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const apiUrl = process.env.EXPO_PUBLIC_API_IP;

function HomeScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Actualités"
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
          name="Actualités"
          component={HomeContent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeContent() {
  const [items, setItems] = useState<ContentItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saut, setSaut] = useState<number>(0);
  const quantite = 5;

  const fetchPosts = async () => {
    if (loading) return; // Éviter de lancer plusieurs requêtes simultanément
  
    setLoading(true);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const response = await fetch(`${apiUrl}/post/read?quantite=${quantite}&saut=${saut}`);
      console.log(response);
      console.log(`${apiUrl}/post/read?quantite=${quantite}&saut=${saut}`);
  
      if (!response.ok) {
        throw new Error('Échec de la réponse du serveur');
      }
  
      const result = await response.json();
  
      if (Array.isArray(result.posts)) {
        if (result.posts.length === 0) {
          if (items.length > 0 && !error) {
            setError('Aucun poste supplémentaire à charger.');
          }
        } else {
          const newItems = result.posts.map((post: Post) => ({
            id: post.idPosts.toString(),
            images: [post.image1, post.image2, post.image3].filter(Boolean) as string[],
            title: post.title,
            description: post.description,
            time: new Date(post.publishedAt).toLocaleTimeString(),
          }));
  
          setItems((prevItems) => [...prevItems, ...newItems]);
          setSaut((prevSaut) => prevSaut + quantite);
          setError('');
        }
      } else {
        console.error('La réponse du serveur ne contient pas de tableau de posts');
        setError('Erreur lors de la récupération des postes');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des postes:', error);
      setError("Impossible de charger les postes. Veuillez vérifier votre connexion et réessayer.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const loadMoreItems = () => {
    if (!loading && !error) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContentItem
              images={item.images}
              title={item.title}
              description={item.description}
              time={item.time}
            />
          )}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#668F80" /> : null}
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
  scrollViewContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    margin: 20,
  },
});

export default HomeScreen;
