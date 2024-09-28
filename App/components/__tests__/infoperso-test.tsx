import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import InfoPerso from '../../app/optnav/infoperso';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      user: {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        cityName: 'Anytown'
      }
    }),
    headers: new Headers(),
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn()
  })
);

describe('InfoPerso Component', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
  });

  it('renders correctly and fetches profile data', async () => {
    const { getByPlaceholderText } = render(<InfoPerso />);

    await waitFor(() => {
      expect(getByPlaceholderText('Nom').props.value).toBe('John');
      expect(getByPlaceholderText('Prénom').props.value).toBe('Doe');
      expect(getByPlaceholderText('Email').props.value).toBe('john.doe@example.com');
      expect(getByPlaceholderText('Numéro de téléphone').props.value).toBe('********90');
      expect(getByPlaceholderText('Adresse').props.value).toBe('123 Main St');
      expect(getByPlaceholderText('Ville').props.value).toBe('Anytown');
    });
  });
});
