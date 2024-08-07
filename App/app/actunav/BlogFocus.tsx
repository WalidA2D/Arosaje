import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Actualités: undefined;
  Filtre: undefined;
  BlogFocus: { id: string }; // Ajout d'un paramètre d'ID pour BlogFocus
};

type BlogNavigationProp = StackNavigationProp<RootStackParamList, 'BlogFocus'>;
type BlogFocusRouteProp = RouteProp<RootStackParamList, 'BlogFocus'>;

export default function BlogFocus() {
  const route = useRoute<BlogFocusRouteProp>(); // Utiliser useRoute pour accéder aux paramètres de navigation
  const { id } = route.params; // Extraire l'ID des paramètres

  // Exemple de gestion de l'état pour les données du blog
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Exemple de requête pour récupérer les détails du blog avec l'ID
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`https://votre-api.com/posts/${id}`);
        const data = await response.json();
        setBlogData(data);
      } catch (error) {
        console.error('Erreur lors du chargement du blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  if (loading) {
    return (
      <View>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View>
      {blogData ? (
        <>
          <Text>{blogData.title}</Text>
          <Text>{blogData.content}</Text>
        </>
      ) : (
        <Text>Aucune donnée disponible pour ce blog.</Text>
      )}
    </View>
  );
}
