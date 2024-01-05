import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase'; 
import { 
    updateDoc, 
    doc, 
    collection,  
    getFirestore,
    where,
    query,
    getDocs,
} from 'firebase/firestore';

const UpdateProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const usersRef = collection(db, "users");
                    const userQuery = query(usersRef, where("email", "==", user.email));
                    const querySnapshot = await getDocs(userQuery);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setNewUsername(userData.username || '');
                        setNewPhoneNumber(userData.phoneNumber || '');
                    }
                } catch (error) {
                    console.error('Kullanıcı bilgileri gelirken hata oluştu:', error);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            await updateProfile(user, {
                displayName: newUsername,
            });

            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", user.email)); 
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                console.error("Kullanıcı bulunamadı");
                return;
            }

            const userDocRef = doc(db, "users", querySnapshot.docs[0].id);

            await updateDoc(userDocRef, {
                username: newUsername,
                phoneNumber: newPhoneNumber,
            });

            setErrorMessage('');
            navigation.goBack();

        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            setErrorMessage('Profil güncelleme sırasında bir hata oluştu.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profilini Güncelle</Text>
            <TextInput
                style={styles.input}
                placeholder="Yeni Kullanıcı Adı"
                onChangeText={(text) => setNewUsername(text)}
                value={newUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Yeni Telefon Numarası"
                onChangeText={(text) => setNewPhoneNumber(text)}
                value={newPhoneNumber}
            />
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
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
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 8,
    },
});

export default UpdateProfileScreen;
