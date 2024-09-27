import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Inscription from '../../app/Login/inscription';

describe('Inscription', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<Inscription setIsModalVisible={jest.fn()}/>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('registers when button is pressed', () => {
    const { getByText } = render(<Inscription setIsModalVisible={jest.fn()}/>);
    fireEvent.press(getByText('Suivant'));
    expect(getByText('Suivant')).toBeTruthy();
  });
});
