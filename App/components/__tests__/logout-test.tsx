import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Logout from '../../app/(tabs)/logout';

describe('Logout', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<Logout setIsModalVisible={jest.fn()} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls the logout function when button is pressed', () => {
    const mockLogout = jest.fn();
    const { getByText } = render(<Logout setIsModalVisible={mockLogout} />);
    fireEvent.press(getByText('Reconnectez vous'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
