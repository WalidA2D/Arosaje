import React from 'react';
import { WebView } from 'react-native-webview';


export default function InfoLeg() {

    return <WebView source={{ uri: 'https://support.google.com/websearch' }} />;

  }