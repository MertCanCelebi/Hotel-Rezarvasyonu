// AdminUserCRUDScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { app, db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AdminUserCRUDScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, "users");
            const snapshot = await getDocs(usersRef);
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = (userId) => {
        
        Alert.alert(
            "Kullanıcı Sil",
            "Bu kullanıcıyı silmek istediğinize emin misiniz?",
            [
                {
                    text: "Hayır",
                    style: "cancel",
                },
                {
                    text: "Evet",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "users", userId));
                            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                            console.log("Kullanıcı Silindi.");
                        } catch (e) {
                            console.error("Kullanıcı silme hatası: ", e);
                        }
                    },
                },
            ]
        );
    };

    const handleUpdateUser = (userId) => {
        // Güncelleme ekranına yönlendir
        navigation.navigate('UserUpdateScreen', { userId });
    };

    const handleAddUser = () => {
        // Kullanıcı ekleme ekranına yönlendir
        navigation.navigate('UserAddScreen');
    };

    const handleChangePassword = (userId) => {
        // Şifre değiştirme ekranına yönlendir
        navigation.navigate('UserChangePasswordScreen', { userId });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Admin Kullanıcı Yönetim Ekranı</Text>
            {users.map(user => (
                <View key={user.id} style={styles.userItem}>
                    <Text style={styles.userInfo}>{`Kullanıcı Adı: ${user.username}`}</Text>
                    <Text style={styles.userInfo}>{`Email: ${user.email}`}</Text>
                    <Text style={styles.userInfo}>{`Telefon: ${user.phoneNumber}`}</Text>
                    <Text style={styles.userInfo}>{`Rol: ${user.rol}`}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => handleUpdateUser(user.id)}>
                            <Text style={styles.updateButton}>Güncelle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleChangePassword(user.id)}>
                            <Text style={styles.changePasswordButton}>Şifre Değiştir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteUser(user.id)}>
                            <Text style={styles.deleteButton}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <TouchableOpacity onPress={handleAddUser}>
                <Text style={styles.addButton}>Kullanıcı Ekle</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#B2DFDB',
    },
    heading: {
        fontSize: 28,
        marginBottom: 20,
        color: '#0277BD',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    userItem: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#E0F7FA',
    },
    userInfo: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    updateButton: {
        color: '#FF5722',
        fontSize: 16,
    },
    deleteButton: {
        color: '#F44336',
        fontSize: 16,
    },
    addButton: {
        color: '#311B92',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#C5CAE9',
        borderRadius: 5,
        marginTop: 10,
    },
    changePasswordButton: {
        color: '#D84315',
        fontSize: 16,
    },
});

export default AdminUserCRUDScreen;
