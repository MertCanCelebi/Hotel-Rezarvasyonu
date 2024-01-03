// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [rol, setRol] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleRegister = async () => {
        if (!username || !phoneNumber) {
            setErrorMessage('Kullanıcı adı ve telefon numarası zorunlu alanlardır.');
            return;
        }

        if (!/^\d+$/.test(phoneNumber)) {
            setErrorMessage('Telefon numarası sadece rakamlardan oluşmalıdır.');
            return;
        }

        if (phoneNumber.length !== 11) {
            setErrorMessage('Telefon numarası tam olarak 11 karakter olmalıdır.');
            return;
        }

        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firestore'a kullanıcı bilgilerini kaydedin
            const usersCollection = collection(db, 'users');
            const userData = {
                username: username,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                rol:'kullanici'
            };

            await addDoc(usersCollection, userData);
            setErrorMessage("");
            setSuccessMessage('Kayıt başarılı, hoş geldiniz ' + username);

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }, 1000);
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setErrorMessage('Bu e-posta adresi zaten kullanımda.');
                        break;
                    case 'auth/invalid-email':
                        setErrorMessage('Geçersiz e-posta adresi.');
                        break;
                    case 'auth/weak-password':
                        setErrorMessage('Şifre en az 6 karakterden oluşmalıdır.');
                        break;
                    default:
                        setErrorMessage('Hata:', error.message);
                }
            } else {
                setErrorMessage('Hata:', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kayıt Ol</Text>

            <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                onChangeText={(text) => setUsername(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Telefon Numarası"
                onChangeText={(text) => setPhoneNumber(text)}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Şifre"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
                <Text style={styles.loginLink}>Zaten hesabınız var mı? Giriş Yapın</Text>
            </TouchableOpacity>

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFD700', // Altın sarısı bir arka plan rengi
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#8A2BE2', // Koyu mor çerçeve rengi
        borderWidth: 2,
        marginBottom: 20,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#FFFAF0', // İnci beyazı arka plan rengi
    },
    button: {
        backgroundColor: '#32CD32', // Yeşil düğme rengi
        padding: 15,
        borderRadius: 8,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginLink: {
        marginTop: 20,
        color: '#4169E1', // Royal mavi renk
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    successText: {
        color: '#008000', // Yeşil renk
        marginTop: 12,
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#FF0000', // Kırmızı renk
        marginTop: 12,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default RegisterScreen;
