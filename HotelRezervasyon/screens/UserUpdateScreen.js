// UserUpdateScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { app, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker'; // Değişiklik yapılan kısım

const UserUpdateScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [user, setUser] = useState(null);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
    const [updatedRole, setUpdatedRole] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setUpdatedUsername(userData.username);
                    setUpdatedEmail(userData.email);
                    setUpdatedPhoneNumber(userData.phoneNumber);
                    setUpdatedRole(userData.rol);
                } else {
                    console.error("User not found");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleUpdateUser = async () => {
        const phoneNumberRegex = /^\d+$/;
        if (updatedPhoneNumber.length !== 11 || !phoneNumberRegex.test(updatedPhoneNumber)) {
          console.error("Telefon numarası 11 rakamdan oluşmalıdır.");
          return;
        }
    
        // Mail adresinin uygun formatta olup olmadığını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updatedEmail)) {
          console.error("Geçerli bir e-posta adresi giriniz.");
          return;
        }
        
        try {
            
            await updateDoc(doc(db, "users", userId), {
                username: updatedUsername,
                email: updatedEmail,
                phoneNumber: updatedPhoneNumber,
                rol: updatedRole,
            });
            console.log("User updated");

             navigation.reset({
                index: 0,
                routes: [{ name: 'AdminUserCRUDScreen' }],
            })
        } catch (error) {
            console.error("Error updating user: ", error);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>User Update Screen</Text>
            <Text>{`Username: ${user.username}`}</Text>
            <TextInput
                style={styles.input}
                placeholder="Updated Username"
                value={updatedUsername}
                onChangeText={setUpdatedUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Updated Email"
                value={updatedEmail}
                onChangeText={setUpdatedEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Updated Phone Number"
                value={updatedPhoneNumber}
                onChangeText={setUpdatedPhoneNumber}
            />
            <TextInput
                style={styles.input}
                placeholder="Updated rol"
                value={updatedRole}
                onChangeText={setUpdatedRole}
            />
            <Button title="Güncelle" onPress={handleUpdateUser} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default UserUpdateScreen;
