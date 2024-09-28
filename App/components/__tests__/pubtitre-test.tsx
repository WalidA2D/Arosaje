import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PubTitre from '../../app/pubnav/pubtitre';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const Stack = createNativeStackNavigator();

const MockPublierScreen = () => <></>; // Écran fictif pour la navigation

describe('PubTitre', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PubTitre" component={PubTitre} />
          <Stack.Screen name="Publier" component={MockPublierScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('loads and displays the saved title from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('Titre Sauvegardé');
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PubTitre" component={PubTitre} />
          <Stack.Screen name="Publier" component={MockPublierScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("Titre : Titre Sauvegardé")).toBeTruthy();
    });
  });

  it('validates the title correctly', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PubTitre" component={PubTitre} />
          <Stack.Screen name="Publier" component={MockPublierScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const input = getByPlaceholderText('Entrez le titre');
    await act(async () => {
      fireEvent.changeText(input, 'Nouveau Titre');
      fireEvent.press(getByText('Valider'));
    });

    await waitFor(() => {
        expect(input.props.value).toBe('Nouveau Titre');
    });
  });

  it('clears the title correctly', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('Titre Sauvegardé');
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PubTitre" component={PubTitre} />
          <Stack.Screen name="Publier" component={MockPublierScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByText('Vider le titre'));
    });

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('savedTitre');
    });
  });
});
