import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Actualités: undefined;
  Filtre: undefined;
  Carte: undefined;
  BlogFocus: { id: string };
};

type BlogNavigationProp = StackNavigationProp<RootStackParamList, 'BlogFocus'>;
type BlogFocusRouteProp = RouteProp<RootStackParamList, 'BlogFocus'>;

interface CommentData {
  idComments: number;
  text: string;
  note: number;
  publishedAt: string;
  idUser: number;
  userName?: string;
}

interface BlogData {
  post?: {
    title?: string;
    description?: string;
    image1?: string;
    image2?: string;
    image3?: string;
  };
  comments?: Array<CommentData>;
}

export default function BlogFocus() {
  const route = useRoute<BlogFocusRouteProp>();
  const { id } = route.params;
  const apiUrl = process.env.EXPO_PUBLIC_API_IP;

  const [blogData, setBlogData] = useState<BlogData>({ post: undefined, comments: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`${apiUrl}/post/${id}`);
        const data = await response.json();

        if (data.success) {
          const commentsWithUserNames = await Promise.all(
            data.comments.map(async (comment: CommentData) => {
              try {
                const userResponse = await fetch(`${apiUrl}/user/read/${comment.idUser}`);
                const userData = await userResponse.json();

                if (userData.success) {
                  comment.userName = `${userData.user.firstName} ${userData.user.lastName}`;
                } else {
                  comment.userName = 'Utilisateur inconnu';
                }
              } catch (error) {
                comment.userName = 'Utilisateur inconnu';
              }
              return comment;
            })
          );

          setBlogData({
            post: data.post,
            comments: commentsWithUserNames || [],
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
        <ActivityIndicator size="large" color="#2d3436" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const { post, comments = [] } = blogData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {post ? (
        <>
          <View style={styles.postContainer}>
            <Text style={styles.title}>{post.title}</Text>
            {post.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{post.description}</Text>
              </View>
            )}
            {(post.image1 || post.image2 || post.image3) && (
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imageScrollContainer}
                >
                  {post.image1 && (
                    <Image source={{ uri: post.image1 }} style={styles.image} />
                  )}
                  {post.image2 && (
                    <Image source={{ uri: post.image2 }} style={styles.image} />
                  )}
                  {post.image3 && (
                    <Image source={{ uri: post.image3 }} style={styles.image} />
                  )}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Commentaires:</Text>
            {comments.length > 0 ? (
              comments.map((comment, index) => {
                const datePart = comment.publishedAt.slice(0, 10);
                const timePart = comment.publishedAt.slice(11, 16);
                const formattedDate = `${datePart} à ${timePart}`;
  
                return (
                  <View key={index} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{comment.userName}</Text>
                      <Text style={styles.commentDate}>{formattedDate}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <View style={styles.commentFooter}>
                      <Text style={styles.commentNote}>Note: {comment.note}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noCommentsText}>Aucun commentaire disponible.</Text>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>Aucune donnée disponible pour ce blog.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7f9',
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#2d3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    padding: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1e272e',
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
  },
  description: {
    fontSize: 18,
    color: '#636e72',
  },
  imageContainer: {
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#2d3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  commentsSection: {
    marginBottom: 20,
  },
  commentsHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1e272e',
  },
  commentCard: {
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#b2bec3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    color: '#0984e3',
    fontWeight: '500',
  },
  commentDate: {
    fontSize: 14,
    color: '#95a5a6',
  },
  commentText: {
    fontSize: 16,
    color: '#2d3436',
    marginBottom: 8,
  },
  commentFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
    paddingTop: 8,
  },
  commentNote: {
    fontSize: 14,
    color: '#6c5ce7',
  },
  noCommentsText: {
    fontSize: 18,
    color: '#636e72',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 20,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#2d3436',
  },
});

