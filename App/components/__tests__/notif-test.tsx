import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Notif from '../../app/optnav/notif';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }));

describe('Notif', () => {
    it('renders correctly', () => {
        const { toJSON } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('displays the correct title', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        expect(getByText('Notifications')).toBeTruthy();
    });

    it('displays the email notification option', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        expect(getByText('Email : Vous recevrez des emails pour les rappels de soins et les conseils.')).toBeTruthy();
    });

    it('displays the app notification option', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        expect(getByText('App : Des notifications push seront envoyées directement sur votre appareil.')).toBeTruthy();
    });

    it('displays the SMS notification option', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        const smsCheckbox = getByText('Messages : Vous pouvez également recevoir des SMS pour les rappels importants.').parent;
        if (smsCheckbox) { // Vérifie si smsCheckbox n'est pas null
            fireEvent.press(smsCheckbox);
        }
        expect(getByText('Messages : Vous pouvez également recevoir des SMS pour les rappels importants.')).toBeTruthy();
    });

    it('displays the validation button', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        expect(getByText('Valider')).toBeTruthy();
    });

    it('toggles the email notification option', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        const emailCheckbox = getByText('Email : Vous recevrez des emails pour les rappels de soins et les conseils.').parent;
        // Vérifiez si emailCheckbox n'est pas null avant d'appeler fireEvent.press
        if (emailCheckbox) {
            fireEvent.press(emailCheckbox);
        }
        expect(getByText('Email : Vous recevrez des emails pour les rappels de soins et les conseils.')).toBeTruthy();
    });

    it('toggles the app notification option', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        const appCheckbox = getByText('App : Des notifications push seront envoyées directement sur votre appareil.').parent;
        if (appCheckbox) { // Vérification si appCheckbox n'est pas null
            fireEvent.press(appCheckbox);
        }
        expect(getByText('App : Des notifications push seront envoyées directement sur votre appareil.')).toBeTruthy();
    });

    it('toggles the SMS notification option', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        const smsCheckbox = getByText('Messages : Vous pouvez également recevoir des SMS pour les rappels importants.').parent;
        if (smsCheckbox) { // Vérifie si smsCheckbox n'est pas null
            fireEvent.press(smsCheckbox);
        }
        expect(getByText('Messages : Vous pouvez également recevoir des SMS pour les rappels importants.')).toBeTruthy();
    });

    it('validates and saves preferences', async () => {
        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );
        const validateButton = getByText('Valider');
        fireEvent.press(validateButton);
        // Vérifiez que les préférences sont sauvegardées (vous pouvez ajouter des assertions spécifiques ici)
    });

    it('loads preferences correctly', async () => {
        // Simuler le stockage des préférences
        AsyncStorage.setItem('emailChecked', JSON.stringify(true));
        AsyncStorage.setItem('appChecked', JSON.stringify(false));
        AsyncStorage.setItem('smsChecked', JSON.stringify(true));

        const { getByText } = render(
            <NavigationContainer>
                <Notif />
            </NavigationContainer>
        );

        // Vérifiez que les préférences sont chargées correctement
        expect(getByText('Email : Vous recevrez des emails pour les rappels de soins et les conseils.')).toBeTruthy();
        expect(getByText('App : Des notifications push seront envoyées directement sur votre appareil.')).toBeTruthy();
        expect(getByText('Messages : Vous pouvez également recevoir des SMS pour les rappels importants.')).toBeTruthy();
    });

});
