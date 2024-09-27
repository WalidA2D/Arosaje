import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import StartApp from '../../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('StartApp', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('opens Connexion modal when Connexion button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Connexion'));
    expect(getByText('Fermer')).toBeTruthy();
  });

  it('opens Inscription modal when Inscription button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Inscription'));
    expect(getByText('Fermer')).toBeTruthy();
  });

  it('closes Connexion modal when Fermer button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Connexion'));
    fireEvent.press(getByText('Fermer'));
    expect(getByText('Connexion')).toBeTruthy(); // Vérifie que le bouton Connexion est de nouveau visible
  });

  it('closes Inscription modal when Fermer button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Inscription'));
    fireEvent.press(getByText('Fermer'));
    expect(getByText('Inscription')).toBeTruthy(); // Vérifie que le bouton Inscription est de nouveau visible
  });

  it('opens Support modal when Support button is pressed in Connexion modal', () => {
    const { getByText } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Connexion'));
    fireEvent.press(getByText('Mot de passe oublié ?'));
    expect(getByText('Fermer')).toBeTruthy(); // Vérifie que le bouton Fermer est visible dans le modal de Support
  });

  it('closes Support modal when Fermer button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <StartApp />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Connexion'));
    fireEvent.press(getByText('Mot de passe oublié ?'));
    fireEvent.press(getByText('Fermer')); // Fermer le modal de Support
    expect(getByText('Connexion')).toBeTruthy(); // Vérifie que le bouton Connexion est de nouveau visible
  });
});
