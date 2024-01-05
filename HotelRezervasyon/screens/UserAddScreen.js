import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const UserAddScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [rol, setRol] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async () => {
        if (!username || !phoneNumber || !rol || !email || !password) {
            setErrorMessage('Lütfen alanları doldurunuz.');
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
        if (rol !== 'admin' && rol !== 'kullanici') {
            setErrorMessage('Geçersiz rol. Rol sadece "admin" veya "kullanici" olabilir.');
            return;
        }

        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            
            const usersCollection = collection(db, 'users');
            const userData = {
                username: username,
                email: email.toLowerCase(),
                phoneNumber: phoneNumber,
                password: password,
                rol: rol,
            };

            await addDoc(usersCollection, userData);
            setErrorMessage("");
            setSuccessMessage('Kayıt başarılı ');

            const redirectTimer = setTimeout(() => {
                navigation.navigate('AdminTabs');
            }, 1000);
    
            return () => clearTimeout(redirectTimer);
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
            <Text style={styles.title}>Kullanıcı Ekle</Text>
            <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefon Numarası"
                onChangeText={(text) => setPhoneNumber(text)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Rol"
                onChangeText={(text) => setRol(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Şifre"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Kulanıcı Ekle</Text>
            </TouchableOpacity>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F2F1',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#1A237E',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#4CAF50',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
    },
    button: {
        backgroundColor: '#FF5722',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    successText: {
        color: '#4CAF50',
        marginTop: 8,
    },
    errorText: {
        color: '#F44336',
        marginTop: 8,
    },
});

export default UserAddScreen;
