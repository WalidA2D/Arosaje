import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConnexionScreen from '../../app/Login/connexion';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('ConnexionScreen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ConnexionScreen setIsModalVisible={() => {}} />
      </NavigationContainer>
    );

    // Générer le snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
