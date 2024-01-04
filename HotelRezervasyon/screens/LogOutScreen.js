import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const LogOutScreen = ({ navigation }) => {
    const handleLogout = async () => {
        const auth = getAuth();

        try {
            await signOut(auth);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Çıkış Yapma Hatası:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Çıkış Yapmak İstediğinizden Emin Misiniz?</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Çıkış Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red', // Gri tonlu arka plan rengi
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#fff', // Metin rengi
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#E57373', // Kırmızı tonlu buton rengi
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff', // Beyaz renkli metin
        textAlign: 'center',
        fontSize: 18,
    },
});

export default LogOutScreen;
