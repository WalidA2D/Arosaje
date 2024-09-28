import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ActuFiltre from '../../app/actunav/actufiltre';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('ActuFiltre', () => {
  it('renders correctly', () => {
    const { toJSON, getByText } = render(
      <NavigationContainer>
        <ActuFiltre navigation={{}} />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Ville')).toBeTruthy();
    expect(getByText('Date de début')).toBeTruthy();
    expect(getByText('Date de fin')).toBeTruthy();
    expect(getByText('Plante')).toBeTruthy();
  });

  it('handles search button press', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ActuFiltre navigation={{ navigate: jest.fn() }} />
      </NavigationContainer>
    );
    fireEvent.press(getByText('Rechercher'));
    expect(getByText('Rechercher')).toBeTruthy();
  });
});
