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
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TextInput, RefreshControl } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContentItem from '../../components/navigation/ContentItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Filtre from '../actunav/actufiltre';
import BlogFocus from '../actunav/BlogFocus';
import Carte from '../actunav/actumap';
const Stack = createNativeStackNavigator();
const apiUrl = process.env.EXPO_PUBLIC_API_IP;
function HomeScreen({}) {
    return (<NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Actualités" screenOptions={{
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
        <Stack.Screen name="Actualités" component={HomeContent} options={({ navigation }) => ({
            headerLeft: () => (<Ionicons name="map-outline" size={24} color="#fff" onPress={() => navigation.navigate('Carte')}/>),
            headerRight: () => (<Ionicons name="funnel" size={24} color="#fff" onPress={() => navigation.navigate('Filtre')}/>),
        })}/>
        <Stack.Screen name="Filtre" component={Filtre} options={{ headerBackTitleVisible: false }}/>
        <Stack.Screen name="Carte" component={Carte} options={{ headerBackTitleVisible: false }}/>
        <Stack.Screen name="BlogFocus" component={BlogFocus} options={({ route }) => {
            var _a;
            return ({
                headerBackTitleVisible: false,
                title: ((_a = route.params) === null || _a === void 0 ? void 0 : _a.title) || 'BlogFocus',
            });
        }}/>
      </Stack.Navigator>
    </NavigationContainer>);
}
function HomeContent({ route }) {
    var _a, _b, _c, _d;
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [quantite] = useState(5);
    const [filters, setFilters] = useState({
        cityName: (_a = route.params) === null || _a === void 0 ? void 0 : _a.cityName,
        dateStart: (_b = route.params) === null || _b === void 0 ? void 0 : _b.dateStart,
        dateEnd: (_c = route.params) === null || _c === void 0 ? void 0 : _c.dateEnd,
        plantOrigin: (_d = route.params) === null || _d === void 0 ? void 0 : _d.plantOrigin,
    });
    const sautRef = useRef(0);
    useEffect(() => {
        var _a, _b, _c, _d;
        setFilters({
            cityName: (_a = route.params) === null || _a === void 0 ? void 0 : _a.cityName,
            dateStart: (_b = route.params) === null || _b === void 0 ? void 0 : _b.dateStart,
            dateEnd: (_c = route.params) === null || _c === void 0 ? void 0 : _c.dateEnd,
            plantOrigin: (_d = route.params) === null || _d === void 0 ? void 0 : _d.plantOrigin,
        });
        setItems([]);
        sautRef.current = 0;
        fetchPosts(true);
    }, [route.params]);
    const fetchPosts = (...args_1) => __awaiter(this, [...args_1], void 0, function* (isRefreshing = false) {
        if (isRefreshing) {
            setRefreshing(true);
        }
        else {
            setLoading(true);
        }
        const currentSaut = isRefreshing ? 0 : sautRef.current;
        const { cityName, dateStart, dateEnd, plantOrigin } = filters;
        let queryString = `${apiUrl}/post/read?quantite=${quantite}&saut=${currentSaut}`;
        if (cityName)
            queryString += `&cityName=${encodeURIComponent(cityName)}`;
        if (dateStart)
            queryString += `&dateStart=${dateStart}`;
        if (dateEnd)
            queryString += `&dateEnd=${dateEnd}`;
        if (plantOrigin)
            queryString += `&plant=${encodeURIComponent(plantOrigin)}`;
        try {
            yield new Promise(resolve => setTimeout(resolve, 2000));
            const response = yield fetch(queryString);
            if (!response.ok) {
                throw new Error('Échec de la réponse du serveur');
            }
            const result = yield response.json();
            if (Array.isArray(result.posts)) {
                if (result.posts.length === 0) {
                    setError('Plus de poste à charger');
                }
                else {
                    const newItems = result.posts.map((post) => {
                        const datePart = post.publishedAt.slice(0, 10);
                        const timePart = post.publishedAt.slice(11, 16);
                        const formattedDate = `${datePart} ${timePart}`;
                        return {
                            id: post.idPost.toString(),
                            images: [post.image].filter(Boolean),
                            title: post.title,
                            description: post.description,
                            time: formattedDate,
                        };
                    });
                    setItems((prevItems) => (isRefreshing ? newItems : [...prevItems, ...newItems]));
                    sautRef.current = sautRef.current + quantite; // Mettre à jour sautRef
                    setError('');
                }
            }
            else {
                setError('Erreur lors de la récupération des postes');
            }
        }
        catch (error) {
            console.error(error);
            setError("Impossible de charger les postes. Veuillez vérifier votre connexion et réessayer.");
        }
        finally {
            if (isRefreshing) {
                setRefreshing(false);
            }
            else {
                setLoading(false);
            }
        }
    });
    const loadMoreItems = () => {
        if (!loading && !refreshing && !error) {
            fetchPosts();
        }
    };
    const blogFocusNavigate = (id, title) => {
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
    return (<View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Rechercher..." placeholderTextColor="#888" value={searchQuery} onChangeText={(text) => setSearchQuery(text)}/>
      <FlatList refreshing={refreshing} onRefresh={onRefresh} contentContainerStyle={styles.scrollViewContent} data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => (<ContentItem id={item.id} images={item.images} title={item.title} description={item.description} time={item.time} onPress={() => blogFocusNavigate(item.id, item.title)}/>)} onEndReached={loadMoreItems} onEndReachedThreshold={0.5} ListFooterComponent={loading && !refreshing ? <ActivityIndicator size="large" color="#668F80"/> : null} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#668F80'} colors={['#668F80']}/>}/>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>);
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
