import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Support from '@/app/Login/mdpoublie';

describe('Support Component', () => {
  const setIsModalVisibleMock = jest.fn();

  it('should render correctly', () => {
    const { getByText } = render(<Support setIsModalVisible={setIsModalVisibleMock} />);
    expect(getByText('Contactez-nous')).toBeTruthy();
  });

  it('should show alert when fields are empty', () => {
    const { getByText } = render(<Support setIsModalVisible={setIsModalVisibleMock} />);
    fireEvent.press(getByText('Envoyer'));
    expect(setIsModalVisibleMock).not.toHaveBeenCalled();
    // Vous pouvez ajouter une vérification pour l'alerte ici si nécessaire
  });

  // Ajoutez d'autres tests selon vos besoins
});
