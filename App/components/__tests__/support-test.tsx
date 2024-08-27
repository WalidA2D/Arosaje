import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Support from '../../app/Login/mdpoublie';

describe('Support', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <Support setIsModalVisible={() => {}} />
      </NavigationContainer>
    );

    // Générer le snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
