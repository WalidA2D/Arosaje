import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import Loading from '../../components/Loading';
import HeaderTitle from '../../components/HeaderTitle';

export default function InscriptionScreen() {
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
        <View style={styles.header}>
              <HeaderTitle title='Inscription' />
          </View>
        <View style={{ flex: 1 }}>
            {loading && <Loading />}
            <WebView
                source={{ uri: 'https://www.google.com' }}
                onLoad={() => setLoading(false)}
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
    flex: 1,
    backgroundColor: '#FFF', 
    paddingBottom: 10,
    },

    header: {
    height: 100,
    backgroundColor: '#668F80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
    },
});