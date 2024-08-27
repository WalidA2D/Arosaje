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
});
