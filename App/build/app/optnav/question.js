import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
export default function Question() {
    const questions = [
        { question: "Comment arroser une plante ?", answer: "Arrosez les plantes lorsque le sol est sec." },
        { question: "Quelle est la meilleure lumière pour les plantes ?", answer: "La lumière indirecte est généralement la meilleure." },
    ];
    return (<View style={styles.container}>
            {questions.map((q, index) => (<View key={index} style={styles.questionContainer}>
                    <Text style={styles.question}>{q.question}</Text>
                    <Text style={styles.answer}>{q.answer}</Text>
                </View>))}
        </View>);
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    questionContainer: {
        marginBottom: 20,
    },
    question: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    answer: {
        fontSize: 14,
        marginTop: 5,
    },
});
