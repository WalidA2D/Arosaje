import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Loading from '../../components/Loading';

export default function PubEspece() {
  const [plants, setPlants] = useState<any[]>([]); // Specify type for plants
  const [loading, setLoading] = useState<boolean>(true); // Specify type for loading
  const [error, setError] = useState<string>(''); // Specify type for error

  useEffect(() => {
    // Utilisation d'axios pour faire la requête
    axios.get('https://trefle.io/api/v1/plants?token=48y8dGrqGaAxEOkOWOkDi8z5EjU1XcN9gF1BWFAJmn8')
      .then((response) => {
        setPlants(response.data.data); // Assuming the plants are in the 'data' field
        setLoading(false);
      })
      .catch((error) => {
        setError("Erreur: " + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()} // Assuming each plant has a unique 'id'
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.common_name}</Text> {/* Display the common name of the plant */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});