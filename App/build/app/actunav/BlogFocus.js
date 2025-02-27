var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Pressable, TextInput, Button, Alert, Platform, Modal, } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
export default function BlogFocus() {
    const route = useRoute();
    const { id } = route.params;
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    const [blogData, setBlogData] = useState({
        post: undefined,
        comments: [],
    });
    const [loading, setLoading] = useState(true);
    const [isFav, setIsFav] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentNote, setCommentNote] = useState(0);
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [role, setRole] = useState(null);
    useEffect(() => {
        const fetchBlogData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield AsyncStorage.getItem("userToken");
                const userId = yield AsyncStorage.getItem("userId");
                const response = yield fetch(`${apiUrl}/post/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                console.log('token : ' + token + '\nuserId : ' + userId);
                const data = yield response.json();
                if (data.success) {
                    const commentsWithUserNames = yield Promise.all(data.comments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const userResponse = yield fetch(`${apiUrl}/user/read/${comment.idUser}`);
                            const userData = yield userResponse.json();
                            if (userData.success) {
                                comment.userName = `${userData.user.firstName} ${userData.user.lastName}`;
                            }
                            else {
                                comment.userName = "Utilisateur inconnu";
                            }
                        }
                        catch (error) {
                            comment.userName = "Utilisateur inconnu";
                        }
                        return comment;
                    })));
                    setBlogData({
                        post: Object.assign(Object.assign({}, data.post), { idUser: data.post.idUser }),
                        comments: commentsWithUserNames || [],
                    });
                    setIsFav(data.isFav);
                }
                else {
                    console.error("Erreur dans la réponse de l'API:", data);
                }
            }
            catch (error) {
                console.error("Erreur lors du chargement du blog:", error);
            }
            finally {
                setLoading(false);
            }
        });
        const fetchRole = () => __awaiter(this, void 0, void 0, function* () {
            const userRole = yield AsyncStorage.getItem("role");
            setRole(userRole);
        });
        fetchBlogData();
        fetchRole();
    }, [id]);
    const toggleFavorite = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield AsyncStorage.getItem("userToken");
            const url = isFav ? `${apiUrl}/fav/delete/${id}` : `${apiUrl}/fav/add`;
            const method = isFav ? "DELETE" : "POST";
            const response = yield fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ id }),
            });
            const result = yield response.json();
            if (result.success) {
                setIsFav(!isFav);
            }
            else {
                console.error("Erreur dans la gestion des favoris:", result.message);
            }
        }
        catch (error) {
            console.error("Erreur lors de la gestion des favoris:", error);
        }
    });
    const addComment = () => __awaiter(this, void 0, void 0, function* () {
        if (commentText.length < 1) {
            Alert.alert("Il n'est pas possible d'ajouter un commentaire vide.");
            return;
        }
        try {
            const token = yield AsyncStorage.getItem("userToken");
            const response = yield fetch(`${apiUrl}/comment/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    text: commentText,
                    note: commentNote,
                    idPost: id,
                }),
            });
            const result = yield response.json();
            if (result.success) {
                const newComment = result.record;
                if (newComment) {
                    const userResponse = yield fetch(`${apiUrl}/user/read/${newComment.idUser}`);
                    const userData = yield userResponse.json();
                    newComment.userName = userData.success
                        ? `${userData.user.firstName} ${userData.user.lastName}`
                        : "Utilisateur inconnu";
                    setBlogData((prevData) => (Object.assign(Object.assign({}, prevData), { comments: [...(prevData.comments || []), newComment] })));
                }
                setCommentText("");
                setCommentNote(0);
            }
            else {
                Alert.alert("Erreur lors de l'ajout du commentaire:", result.error);
            }
        }
        catch (error) {
            console.error("Erreur lors de l'ajout du commentaire:", error);
        }
    });
    const handleSendMessage = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = yield AsyncStorage.getItem("userToken");
            const userId = yield AsyncStorage.getItem("userId");
            if (!userId || !((_a = blogData.post) === null || _a === void 0 ? void 0 : _a.idUser)) {
                Alert.alert("Erreur", "Impossible d'envoyer le message. Informations manquantes.");
                return;
            }
            const convResponse = yield fetch(`${apiUrl}/conv/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    idUser1: userId,
                    idUser2: blogData.post.idUser
                }),
            });
            const convResult = yield convResponse.json();
            if (!convResult.success) {
                Alert.alert("Erreur lors de la création de la conversation", convResult.msg);
                return;
            }
            const idConversation = convResult.idConv;
            if (!idConversation) {
                Alert.alert("Erreur", "Impossible de récupérer l'id de la conversation.");
                return;
            }
            const msgResponse = yield fetch(`${apiUrl}/msg/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    text: messageText,
                    idConversation: idConversation,
                }),
            });
            const msgResult = yield msgResponse.json();
            if (msgResult.success) {
                Alert.alert("Message envoyé avec succès !");
                setMessageText("");
                setShowMessageInput(false);
            }
            else {
                Alert.alert("Erreur lors de l'envoi du message", msgResult.msg);
            }
        }
        catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
        }
    });
    if (loading) {
        return (<View style={styles.container}>
        <ActivityIndicator size="large" color="#2d3436"/>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>);
    }
    const { post, comments = [] } = blogData;
    return (<ScrollView contentContainerStyle={styles.container}>
      {post ? (<>
          <View style={styles.postContainer}>
            <View style={styles.headCardContainer}>
              <Text style={styles.title}>{post.title}</Text>
              <Pressable onPress={toggleFavorite} style={styles.favoriteButton}>
                <Icon name={isFav ? "star" : "star-o"} size={24} color={isFav ? "#f1c40f" : "#ccc"}/>
              </Pressable>
            </View>
            {post.description && (<View style={styles.descriptionContainer}>
                <Text style={styles.description}>{post.description}</Text>
              </View>)}
            {(post.image) && (<View style={styles.imageContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScrollContainer}>
                  {post.image && (<Image source={{ uri: post.image }} style={styles.image}/>)}
                </ScrollView>
                <Button title="Contacter" onPress={() => setShowMessageInput(true)}/>
              </View>)}
          </View>
          <Modal visible={showMessageInput} transparent={true} animationType="slide" onRequestClose={() => setShowMessageInput(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Message</Text>
                <TextInput style={styles.messageInput} placeholder="Votre message" value={messageText} onChangeText={setMessageText} multiline={true}/>
                <Button title="Envoyer" onPress={handleSendMessage}/>
                <Button title="Annuler" onPress={() => setShowMessageInput(false)}/>
              </View>
            </View>
          </Modal>

          {role !== "Utilisateur" && (<View style={styles.addCommentSection}>
              <Text style={styles.addCommentHeader}>
                Ajouter un commentaire :
              </Text>

              <Text style={styles.inputLabel}>Commentaire :</Text>
              <TextInput style={styles.commentInput} placeholder="Votre commentaire" value={commentText} onChangeText={setCommentText}/>

              <Text style={styles.inputLabel}>Note (0 à 5) :</Text>
              <TextInput style={styles.noteInput} placeholder="Note (0 à 5)" value={commentNote.toString()} onChangeText={(text) => {
                    const sanitizedText = text
                        .replace(",", ".")
                        .replace(/[^0-9.]/g, "");
                    let note = Number(sanitizedText);
                    if (note > 5) {
                        note = 5;
                    }
                    setCommentNote(note);
                }} keyboardType="numeric"/>

              <Button title="Envoyer" onPress={addComment}/>
            </View>)}

          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Commentaires:</Text>
            {comments.length > 0 ? (comments.map((comment, index) => {
                const datePart = comment.publishedAt.slice(0, 10);
                const timePart = comment.publishedAt.slice(11, 16);
                const formattedDate = `${datePart} à ${timePart}`;
                return (<View key={index} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{comment.userName}</Text>
                      <Text style={styles.commentDate}>{formattedDate}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <View style={styles.commentFooter}>
                      <Text style={styles.commentNote}>
                        Note: {comment.note}
                      </Text>
                    </View>
                  </View>);
            })) : (<Text style={styles.noCommentsText}>
                Aucun commentaire disponible.
              </Text>)}
          </View>
        </>) : (<Text style={styles.noDataText}>
          Aucune donnée disponible pour ce blog.
        </Text>)}
    </ScrollView>);
}
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    messageInput: {
        borderWidth: 1,
        borderColor: "#dfe6e9",
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        marginBottom: 12,
        minHeight: 100,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 6,
        color: "#1e272e",
    },
    messageInputContainer: {
        padding: 16,
        backgroundColor: "#f1f2f6",
        borderRadius: 8,
        marginBottom: 16,
    },
    messageInputLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2d3436",
        marginBottom: 8,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f5f7f9",
    },
    favoriteButton: {
        padding: 10,
        borderRadius: 5,
        alignSelf: "flex-end",
        marginBottom: 16,
    },
    headCardContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    postContainer: Object.assign(Object.assign({ marginBottom: 20, backgroundColor: "#ffffff", borderRadius: 10 }, Platform.select({
        ios: {
            shadowColor: "#2d3436",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        android: {
            elevation: 4,
        },
        web: {
            boxShadow: "0px 4px 8px rgba(45, 52, 54, 0.2)",
        },
    })), { padding: 15 }),
    title: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 10,
        color: "#1e272e",
    },
    descriptionContainer: {
        marginBottom: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#dfe6e9",
    },
    description: {
        fontSize: 18,
        color: "#636e72",
    },
    imageContainer: {
        marginBottom: 20,
        overflow: "hidden",
        borderRadius: 10,
        backgroundColor: "#ffffff",
        paddingVertical: 10,
    },
    imageScrollContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: Object.assign({ width: 300, height: 180, resizeMode: "cover", borderRadius: 10, marginRight: 10 }, Platform.select({
        ios: {
            shadowColor: "#2d3436",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
        },
        android: {
            elevation: 3,
        },
        web: {
            boxShadow: "0px 4px 6px rgba(45, 52, 54, 0.3)",
        },
    })),
    commentsSection: {
        marginBottom: 20,
    },
    commentsHeader: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 15,
        color: "#1e272e",
    },
    commentCard: {
        padding: 15,
        marginBottom: 12,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#b2bec3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    commentUser: {
        fontSize: 14,
        color: "#0984e3",
        fontWeight: "500",
    },
    commentDate: {
        fontSize: 14,
        color: "#95a5a6",
    },
    commentText: {
        fontSize: 16,
        color: "#2d3436",
        marginBottom: 8,
    },
    commentFooter: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#dfe6e9",
        paddingTop: 8,
    },
    commentNote: {
        fontSize: 14,
        color: "#6c5ce7",
    },
    noCommentsText: {
        fontSize: 18,
        color: "#636e72",
        textAlign: "center",
    },
    noDataText: {
        fontSize: 20,
        color: "#95a5a6",
        textAlign: "center",
        marginTop: 24,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: "#2d3436",
    },
    addCommentSection: {
        marginTop: 30,
        marginBottom: 30,
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#2d3436",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    addCommentHeader: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 15,
        color: "#1e272e",
    },
    commentInput: {
        height: 40,
        borderColor: "#dfe6e9",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#f1f3f6",
    },
    noteInput: {
        height: 40,
        borderColor: "#dfe6e9",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#f1f3f6",
    },
});
