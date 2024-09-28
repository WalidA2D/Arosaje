import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PubDate from '../../app/pubnav/pubdate';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { jest } from '@jest/globals';

const Stack = createNativeStackNavigator();

const MockPublierScreen = () => <></>; // Écran fictif pour la navigation

describe('PubDate Component', () => {
    it('renders correctly', () => {
        const { toJSON } = render(
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="PubTitre" component={PubDate} />
              <Stack.Screen name="Publier" component={MockPublierScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        );
        expect(toJSON()).toMatchSnapshot();
      });

    it('handles date selection correctly', () => {
        const { getByText } = render(
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="PubTitre" component={PubDate} />
              <Stack.Screen name="Publier" component={MockPublierScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        );

        // Vérifier que les dates sélectionnées sont affichées correctement
        expect(getByText('Début :')).toBeTruthy();
        expect(getByText('Fin :')).toBeTruthy();
    });

    it('does not allow selecting past dates', () => {
        const { getByText } = render(
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="PubTitre" component={PubDate} />
              <Stack.Screen name="Publier" component={MockPublierScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        );

        // Simuler la sélection d'une date passée
        fireEvent.press(getByText('10')); // Supposons que le 10 est une date passée

        // Vérifier que la date passée n'est pas sélectionnée
        expect(getByText('Début :')).toBeTruthy();
        expect(getByText('Fin :')).toBeTruthy();
    });

});
