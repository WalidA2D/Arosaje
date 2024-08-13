import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Actualités: undefined;
  Filtre: undefined;
  BlogFocus: { id: string }; // Ajout d'un paramètre d'ID pour BlogFocus
};

type BlogNavigationProp = StackNavigationProp<RootStackParamList, 'BlogFocus'>;
type BlogFocusRouteProp = RouteProp<RootStackParamList, 'BlogFocus'>;

// Définir le type pour les données du blog
interface BlogData {
  post?: {
    title?: string;
    description?: string;
    image1?: string;
    image2?: string;
    image3?: string;
  };
  comments?: Array<{ text: string }>;
}

export default function BlogFocus() {
  const route = useRoute<BlogFocusRouteProp>(); // Utiliser useRoute pour accéder aux paramètres de navigation
  const { id } = route.params; // Extraire l'ID des paramètres
  const apiUrl = process.env.EXPO_PUBLIC_API_IP;

  // Exemple de gestion de l'état pour les données du blog
  const [blogData, setBlogData] = useState<BlogData>({ post: undefined, comments: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`${apiUrl}/post/${id}`);
        const data = await response.json();

        if (data.success) {
          setBlogData({
            post: data.post,
            comments: data.comments || [], // Assurez-vous que comments est défini comme un tableau
          });
        } else {
          console.error('Erreur dans la réponse de l\'API:', data);
        }
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const { post, comments = [] } = blogData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {post ? (
        <>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>
          {post.image1 || post.image2 || post.image3 ? (
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageScrollContainer}
              >
                {post.image1 && (
                  <Image
                    source={{ uri: post.image1 }}
                    style={styles.image}
                  />
                )}
                {post.image2 && (
                  <Image
                    source={{ uri: post.image2 }}
                    style={styles.image}
                  />
                )}
                {post.image3 && (
                  <Image
                    source={{ uri: post.image3 }}
                    style={styles.image}
                  />
                )}
              </ScrollView>
            </View>
          ) : null}
          <Text style={styles.commentsHeader}>Commentaires:</Text>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>Aucun commentaire disponible.</Text>
          )}
        </>
      ) : (
        <Text style={styles.noDataText}>Aucune donnée disponible pour ce blog.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 20,
    marginBottom: 16,
    color: '#666',
  },
  imageContainer: {
    marginBottom: 16, // Espace entre les images et les commentaires
  },
  imageScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Assure que les images sont centrées
  },
  image: {
    width: 320,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 12,
    marginRight: 12, // Espacement entre les images
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  commentsHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  comment: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commentText: {
    fontSize: 18,
    color: '#444',
  },
  noCommentsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginTop: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#000',
  },
});
