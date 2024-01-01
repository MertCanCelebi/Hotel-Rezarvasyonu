// AdminHotelCRUDScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { app, db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AdminHotelCRUDScreen = ({ navigation }) => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            const hotelsRef = collection(db, "hotels");
            const snapshot = await getDocs(hotelsRef);
            const hotelsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHotels(hotelsData);
        };

        fetchHotels();
    }, []);

    const handleDeleteHotel = (hotelId) => {
        // Silme işlemi öncesinde kullanıcıya bir onay mesajı göster
        Alert.alert(
            "Otel Sil",
            "Bu oteli silmek istediğinize emin misiniz?",
            [
                {
                    text: "Hayır",
                    style: "cancel",
                },
                {
                    text: "Evet",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "hotels", hotelId));
                            setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));
                            console.log("Hotel deleted");
                        } catch (e) {
                            console.error("Error deleting hotel: ", e);
                        }
                    },
                },
            ]
        );
    };

    const handleUpdateHotel = (hotelId) => {
        // Güncelleme ekranına yönlendir
        navigation.navigate('HotelUpdateScreen', { hotelId });
    };

    const handleAddHotel = () => {
        // Otel ekleme ekranına yönlendir
        navigation.navigate('HotelAddScreen');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Admin Hotel CRUD Screen</Text>
            {hotels.map(hotel => (
                <View key={hotel.id} style={styles.hotelItem}>
                    <Text style={styles.hotelInfo}>{`Hotel Name: ${hotel.hotelName}`}</Text>
                    <Text style={styles.hotelInfo}>{`Location: ${hotel.hotelCity}`}</Text>
                    <Text style={styles.hotelInfo}>{`Description: ${hotel.Description}`}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => handleUpdateHotel(hotel.id)}>
                            <Text style={styles.updateButton}>Güncelle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteHotel(hotel.id)}>
                            <Text style={styles.deleteButton}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <TouchableOpacity onPress={handleAddHotel}>
                <Text style={styles.addButton}>Otel Ekle</Text>
            </TouchableOpacity>
        </ScrollView>
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
    hotelItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    hotelInfo: {
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
        color: 'blue',
        fontSize: 16,
    },
    deleteButton: {
        color: 'red',
        fontSize: 16,
    },
    addButton: {
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginTop: 10,
    },
});

export default AdminHotelCRUDScreen;
