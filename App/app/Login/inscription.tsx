import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';

export default function InscriptionScreen() {
    const [step, setStep] = useState(1);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cityName, setCityName] = useState('');
    
    const handleNext = () => {
        if (step === 1 && lastName && firstName && email) {
            setStep(2);
        } else if (step === 2 && address && cityName) {
            setStep(3);
        } else if (step === 3 && phone) {
            setStep(4);
        }
    };

    const apiUrl = process.env.EXPO_PUBLIC_API_IP;

    const handleConfirm = () => {
        if (step === 4) {
            const userData = {
                'lastName': lastName,
                'firstName': firstName,
                'email': email,
                'address': address,
                'phone': phone,
                'cityName': cityName,
                'password': password
            };

            fetch(`${apiUrl}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data=>{
                console.log(data)
            })
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <HeaderTitle title='Inscription' />
            </View>
            {step === 1 && (
                <View>
                    <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
                    <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
                    <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                    <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} />
                    <Button title="Next" onPress={handleNext} />
                </View>
            )}
            {step === 2 && (
                <View>
                    <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
                    <TextInput placeholder="City Name" value={cityName} onChangeText={setCityName} style={styles.input} />
                    <Button title="Next" onPress={handleNext} />
                </View>
            )}
            {step === 3 && (
                <View>
                    <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />
                    <Button title="Next" onPress={handleNext} />
                </View>
            )}
            {step === 4 && (
                <View>
                    <Text>Last Name: {lastName}</Text>
                    <Text>First Name: {firstName}</Text>
                    <Text>Email: {email}</Text>
                    <Text>Address: {address}</Text>
                    <Text>City Name: {cityName}</Text>
                    <Text>Phone: {phone}</Text>
                    <Text>Password: {password}</Text>
                    <Button title="Confirmer" onPress={handleConfirm} />
                    <Button title="Modifier" onPress={() => setStep(1)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBottom: 10,
    },
    header: {
        height: 100,
        backgroundColor: '#668F80',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    input: {
        backgroundColor: '#F0F0F0',
        margin: 5,
        padding: 10,
        width: '100%',
        borderRadius: 5,
    },
});