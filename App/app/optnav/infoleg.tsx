import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import Loading from '../../components/Loading';

export default function InfoLeg() {
    const [loading, setLoading] = useState(true);

    return (
        <View style={{ flex: 1 }}>
            {loading && <Loading />}
            <WebView
                source={{ uri: 'https://support.google.com/websearch' }}
                onLoad={() => setLoading(false)}
            />
        </View>
    );
}