import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, Button, TextInput, RefreshControl } from 'react-native';
import { NavigationContainer, useNavigation, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContentItem from '../../components/navigation/ContentItem';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Filtre from '../actunav/actufiltre';
import BlogFocus from '../actunav/BlogFocus';
import Carte from '../actunav/actumap';

type ActuNavigationProp = StackNavigationProp<RootStackParamList, 'Actualités'>;
type ActuRouteProp = RouteProp<RootStackParamList, 'Actualités'>;

type Post = {
  idPost: number;
  title: string;
  description: string;
  publishedAt: string;
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
  Actualités: { cityName?: string; dateStart?: string; dateEnd?: string; plantOrigin?: string; queryString?: string } | undefined;
  Filtre: undefined;
  Carte: undefined;
  BlogFocus: { id: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const apiUrl = process.env.EXPO_PUBLIC_API_IP;

function HomeScreen({ }) {
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
          options={({ navigation }) => ({
            headerLeft: () =>(
              <Ionicons name="map-outline" size={24} color="#fff" onPress={() => navigation.navigate('Carte')} />
            ),
            headerRight: () => (
              <Ionicons name="funnel" size={24} color="#fff" onPress={() => navigation.navigate('Filtre')} />
            ),
          })}
        />
        <Stack.Screen
          name="Filtre"
          component={Filtre}
          options={{ headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="Carte"
          component={Carte}
          options={{ headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="BlogFocus"
          component={BlogFocus}
          options={({ route }) => ({
            headerBackTitleVisible: false,
            title: route.params?.title || 'BlogFocus',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeContent({ route }: { route: ActuRouteProp }) {
  const navigation = useNavigation<ActuNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ContentItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');
  const [quantite] = useState(5);
  const [filters, setFilters] = useState({
    cityName: route.params?.cityName,
    dateStart: route.params?.dateStart,
    dateEnd: route.params?.dateEnd,
    plantOrigin: route.params?.plantOrigin,
  });
  const sautRef = useRef<number>(0);

  useEffect(() => {
    setFilters({
      cityName: route.params?.cityName,
      dateStart: route.params?.dateStart,
      dateEnd: route.params?.dateEnd,
      plantOrigin: route.params?.plantOrigin,
    });

    setItems([]);
    sautRef.current = 0;

    fetchPosts(true);
  }, [route.params]);

  const fetchPosts = async (isRefreshing: boolean = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const currentSaut = isRefreshing ? 0 : sautRef.current;
    const { cityName, dateStart, dateEnd, plantOrigin } = filters;

    let queryString = `${apiUrl}/post/read?quantite=${quantite}&saut=${currentSaut}`;
  
    if (cityName) queryString += `&cityName=${encodeURIComponent(cityName)}`;
    if (dateStart) queryString += `&dateStart=${dateStart}`;
    if (dateEnd) queryString += `&dateEnd=${dateEnd}`;
    if (plantOrigin) queryString += `&plant=${encodeURIComponent(plantOrigin)}`;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(queryString);
      if (!response.ok) {
        throw new Error('Échec de la réponse du serveur');
      }

      const result = await response.json();
      if (Array.isArray(result.posts)) {
        if (result.posts.length === 0) {
          setError('Plus de poste à charger');
        } else {
          const newItems = result.posts.map((post: Post) => {
            const datePart = post.publishedAt.slice(0, 10);
            const timePart = post.publishedAt.slice(11, 16);
            const formattedDate = `${datePart} ${timePart}`;

            return {
              id: post.idPost.toString(),
              images: [post.image1, post.image2, post.image3].filter(Boolean) as string[],
              title: post.title,
              description: post.description,
              time: formattedDate,
            };
          });

          setItems((prevItems) => (isRefreshing ? newItems : [...prevItems, ...newItems]));
          sautRef.current = sautRef.current + quantite; // Mettre à jour sautRef
          setError('');
        }
      } else {
        setError('Erreur lors de la récupération des postes');
      }
    } catch (error) {
      console.log(error)
      setError("Impossible de charger les postes. Veuillez vérifier votre connexion et réessayer.");
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const loadMoreItems = () => {
    if (!loading && !refreshing && !error) {
      fetchPosts();
    }
  };

  const blogFocusNavigate = (id: string, title: string) => {
    navigation.navigate('BlogFocus', { id, title });
  };

  const onRefresh = () => {
    setFilters({
      cityName: undefined,
      dateStart: undefined,
      dateEnd: undefined,
      plantOrigin: undefined,
    });

    setItems([]);
    sautRef.current = 0;

    fetchPosts(true);
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.scrollViewContent}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContentItem
            id={item.id}
            images={item.images}
            title={item.title}
            description={item.description}
            time={item.time}
            onPress={() => blogFocusNavigate(item.id, item.title)}
          />
        )}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator size="large" color="#668F80" /> : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={'#668F80'}
            colors={['#668F80']}
          />
        }
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#F0F0F0',
    color: '#000',
  },
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
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
});

export default HomeScreen;