socket.on('sendMessage', async (data) => {
  const { conversationId, message } = data;
  console.log(`Message received from ${socket.id} in conversation ${conversationId}:`, message);

  // Enregistrez le message dans la base de données via votre API REST
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${apiUrl}/msg/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userToken, // Remplacez par le token approprié
      },
      body: JSON.stringify({
        text: message.text,
        idConversation: conversationId,
        idUser: message.senderId,
        file: message.image || null,
      }),
    });

    const result = await response.json();
    if (!result.success) {
      console.error('Failed to save message to API:', result.msg);
    }
  } catch (error) {
    console.error('Error saving message to API:', error);
  }

  // Ensuite, envoyez le message aux autres clients connectés à cette conversation
  io.to(conversationId).emit('receiveMessage', message);
});
