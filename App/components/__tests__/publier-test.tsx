import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PublierScreen from '../../app/(tabs)/publier';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('PublierScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );
    expect(getByText('Valider')).toBeTruthy(); // Assurez-vous que cet élément existe
  });

  it('handles sending post correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublierScreen />
      </NavigationContainer>
    );

    act(() => {
      fireEvent.press(getByText('Valider')); // Enveloppez l'événement dans act
    });
    // Ajoutez des assertions pour vérifier le comportement d'envoi
  });
});

test('matches snapshot', () => {
  const { toJSON } = render(
    <NavigationContainer>
      <PublierScreen />
    </NavigationContainer>
  );
  expect(toJSON()).toMatchSnapshot();
});
