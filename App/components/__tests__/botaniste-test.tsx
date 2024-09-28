import React from 'react';
import { render } from '@testing-library/react-native';
import Botaniste from '../../app/optnav/botaniste';

describe('Botaniste Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Botaniste />);
    expect(getByTestId('botaniste-view')).toBeTruthy();
  });
});
