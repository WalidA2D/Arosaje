import React from 'react';
import { render } from '@testing-library/react-native';
import Question from '../../app/optnav/question';

describe('Question', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<Question />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('displays the correct number of questions', () => {
        const { getAllByText } = render(<Question />);
        const questions = getAllByText(/Comment arroser une plante ?|Quelle est la meilleure lumière pour les plantes ?/);
        expect(questions.length).toBe(2);
    });

    it('displays the correct answers', () => {
        const { getByText } = render(<Question />);
        expect(getByText('Arrosez les plantes lorsque le sol est sec.')).toBeTruthy();
        expect(getByText('La lumière indirecte est généralement la meilleure.')).toBeTruthy();
    });
});
