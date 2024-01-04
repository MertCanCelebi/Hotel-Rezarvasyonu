import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { app, db, storage } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage";

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

    function HotelImage({ hotelName, width, height }) {
        const [imageUrl, setImageUrl] = useState(null);

        useEffect(() => {
            const fetchImage = async () => {
                try {
                    const url = await getDownloadURL(ref(storage, `${hotelName}.jpg`));
                    setImageUrl(url);
                } catch (error) {
                    console.error('Resim alınamadı:', error);
                }
            };

            fetchImage();
        }, [hotelName]);

        return (
            <Image source={{ uri: imageUrl }} style={{ width: width, height: height, borderRadius: 10 }} />
        )
    }

    const handleDeleteHotel = async (hotelId) => {
        const reservationsRef = collection(db, "reservations");
        const reservationsSnapshot = await getDocs(reservationsRef);
        const reservationsForHotel = reservationsSnapshot.docs.filter(doc => doc.data().HotelId === hotelId);

        if (reservationsForHotel.length > 0) {
          
            Alert.alert(
                "Otel Silinemiyor",
                "Bu otel rezervasyonlarla ilişkilendirilmiştir. Önce rezervasyonları silin.",
                [{ text: "Tamam", style: "cancel" }]
            );
            return;
        }


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
            <Text style={styles.heading}>Admin Hotel Yönetim Ekranı</Text>
            {hotels.map(hotel => (
                <View key={hotel.id} style={styles.hotelItem}>
                    <HotelImage hotelName={hotel.hotelName} height={200} width={300} />
                    <Text style={styles.hotelInfo}>{`Otel Adı: ${hotel.hotelName}`}</Text>
                    <Text style={styles.hotelInfo}>{`Konum: ${hotel.hotelCity}`}</Text>
                    <Text style={styles.hotelInfo}>{`Açıklama: ${hotel.Description}`}</Text>
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
        backgroundColor: '#B2DFDB', // Yeşil tonlu arka plan rengi
    },
    heading: {
        fontSize: 28,
        marginBottom: 20,
        color: '#0277BD', // Mavi tonlu başlık rengi
        fontWeight: 'bold',
        textAlign: 'center',
    },
    hotelItem: {
        borderWidth: 1,
        borderColor: '#4CAF50', // Yeşil renkli çerçeve rengi
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#E0F7FA', // Cyan tonlu arka plan rengi
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
        color: '#FF5722', // Turuncu renk
        fontSize: 16,
    },
    deleteButton: {
        color: '#F44336', // Kırmızı renk
        fontSize: 16,
    },
    addButton: {
        color: '#311B92', // Mor renk
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#C5CAE9', // Light Purple tonlu arka plan rengi
        borderRadius: 5,
        marginTop: 10,
    },
});

export default AdminHotelCRUDScreen;
