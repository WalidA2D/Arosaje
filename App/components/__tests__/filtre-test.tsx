import React from 'react';
import { render } from '@testing-library/react-native';
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
    const { toJSON } = render(
      <NavigationContainer>
        <ActuFiltre navigation={{}} />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
