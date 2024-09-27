import React from 'react';
import { render } from '@testing-library/react-native';
import InfoLeg from '../../app/optnav/infoleg';

describe('InfoLeg', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<InfoLeg />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('displays the correct title', () => {
        const { getByText } = render(<InfoLeg />);
        expect(getByText('Informations Légales')).toBeTruthy();
    });

    it('displays the legal information text', () => {
        const { getByText } = render(<InfoLeg />);
        expect(getByText(/Ceci est un exemple d'informations légales pour votre application de garde de plante./)).toBeTruthy();
        expect(getByText(/Veuillez consulter un professionnel pour obtenir des informations légales précises et adaptées à votre situation./)).toBeTruthy();
    });
});
