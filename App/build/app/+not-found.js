import { StyleSheet, View, Text } from 'react-native';
export default function NotFoundScreen() {
    return (<View style={styles.container}>
      <Text>Erreur 404</Text>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#668F80',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
