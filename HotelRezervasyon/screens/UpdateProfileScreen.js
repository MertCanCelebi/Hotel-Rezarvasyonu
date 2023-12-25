// UpdateProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UpdateProfileScreen = ({ route, navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const { userData } = route.params;
    const [newName, setNewName] = useState(userData.name || '');
    const [newEmail, setNewEmail] = useState(userData.email || '');

    const handleUpdateProfile = async () => {
        try {
            // Kullanıcı adını ve e-postayı güncelle
            await updateProfile(user, { displayName: newName });
            await user.updateEmail(newEmail);

            // Firestore'da kullanıcı bilgilerini güncelle
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { name: newName, email: newEmail }, { merge: true });

            Alert.alert('Başarı', 'Profil bilgileri güncellendi.');
            navigation.goBack(); // Profil sayfasına geri dön
        } catch (error) {
            console.error('Profil güncelleme hatası:', error.message);
            Alert.alert('Hata', 'Profil güncelleme hatası: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil Güncelleme</Text>
            <TextInput
                style={styles.input}
                placeholder="Ad"
                value={newName}
                onChangeText={(text) => setNewName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={newEmail}
                onChangeText={(text) => setNewEmail(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default UpdateProfileScreen;