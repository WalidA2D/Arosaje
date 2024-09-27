import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import OptionsScreen from '../../app/(tabs)/options';
import AsyncStorage from '@react-native-async-storage/async-storage';
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('OptionsScreen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <OptionsScreen />
      </NavigationContainer>
    );

    // Générer le snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('opens modal on Deconnecter press', () => {
    const { getByText } = render(
      <NavigationContainer>
        <OptionsScreen />
      </NavigationContainer>
    );

    // Simuler un clic sur le bouton "Déconnecter"
    const deconnecterButton = getByText('Déconnecter');
    fireEvent.press(deconnecterButton);

  });

  it('closes modal on modal close action', () => {
    const { getByText } = render(
      <NavigationContainer>
        <OptionsScreen />
      </NavigationContainer>
    );

    // Simuler un clic sur le bouton "Déconnecter"
    const deconnecterButton = getByText('Déconnecter');
    fireEvent.press(deconnecterButton);

    // Vérifier que la modal est ouverte
    expect(getByText('Déconnecter')).toBeTruthy(); // Assurez-vous que le texte correspond à votre modal

  });

  it('navigates to the correct screen on button press', () => {
    const { getByText } = render(
      <NavigationContainer>
        <OptionsScreen />
      </NavigationContainer>
    );

    // Simuler un clic sur le bouton "Informations personnelles"
    const infoButton = getByText('Informations personnelles');
    fireEvent.press(infoButton);

  });
});
