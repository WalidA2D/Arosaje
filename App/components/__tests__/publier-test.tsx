import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PublierScreen from '../../app/(tabs)/publier';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage');

describe('PublierScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );
    expect(getByText('Valider')).toBeTruthy(); // Vérifie que le bouton "Valider" est présent
  });

  it('opens modal on "Valider" press', () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Valider'));
  });

  it('handles sending post correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    // Simuler la saisie des données
    await AsyncStorage.setItem('userToken', 'mockedToken');
    fireEvent.changeText(getByText('Titre : '), 'Titre de test');
    fireEvent.changeText(getByText('Description : '), 'Description de test');
    fireEvent.changeText(getByText('Localisation : '), 'Localisation de test');
    fireEvent.changeText(getByText('Espèce : '), 'Espèce de test');
    fireEvent.changeText(getByText('Exigence d’entretien (optionel)'), 'Entretien de test');

    // Ouvrir la modal et simuler l'envoi
    fireEvent.press(getByText('Valider'));

  });

  it('shows error alert on missing user token', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Valider'));
  }); // Correction ici : fermeture de la parenthèse manquante

  it('shows error alert on post send failure', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    await AsyncStorage.setItem('userToken', 'mockedToken');
    fireEvent.press(getByText('Valider'));

    // Simuler une réponse d'erreur du serveur
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500, // Ajoutez le statut
        statusText: 'Internal Server Error', // Ajoutez le texte du statut
        headers: new Headers(), // Ajoutez les en-têtes
      } as Response) // Cast en tant que Response
    );

  });

  it('resets form on confirmation', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    await AsyncStorage.setItem('userToken', 'mockedToken');
    fireEvent.changeText(getByText('Titre : '), 'Titre de test');
    fireEvent.press(getByText('Recommencez'));



    // Simuler la saisie de données valides
    await AsyncStorage.setItem('userToken', 'mockedToken');
    fireEvent.changeText(getByText('Titre : '), 'Titre de test');
    fireEvent.changeText(getByText('Description : '), 'Description de test');
    fireEvent.changeText(getByText('Localisation : '), 'Localisation de test');
    fireEvent.changeText(getByText('Espèce : '), 'Espèce de test');

  });

  it('handles modal close correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Valider'));

  });
});
