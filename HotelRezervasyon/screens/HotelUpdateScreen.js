// AdminHotelUpdateScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage";
import { app, db,storage } from '../firebase';

const AdminHotelUpdateScreen = ({ route, navigation }) => {
    const { hotelId } = route.params;
    const [hotelName, setHotelName] = useState('');
    const [hotelCity, setHotelCity] = useState('');
    const [description, setDescription] = useState('');
    const [personCount, setPersonCount] = useState(0);
    const [price, setPrice] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchHotelData = async () => {
            // Firestore'dan otel bilgilerini al
            const db = getFirestore();
            const hotelRef = doc(db, 'hotels', hotelId);
            const hotelSnapshot = await getDoc(hotelRef);

            if (hotelSnapshot.exists()) {
                const hotelData = hotelSnapshot.data();
                setHotelName(hotelData.hotelName);
                setHotelCity(hotelData.hotelCity);
                setDescription(hotelData.Description);
                setPersonCount(hotelData.personCount);
                setPrice(hotelData.price)
            } else {
                setErrorMessage('Otel bulunamadı.');
            }
        };

        fetchHotelData();
    }, [hotelId]);

    function ProductImage({ hotelName, width, height }) {
        const [imageUrl, setImageUrl] = useState(null);

        useEffect(() => {
            const fetchImage = async () => {
                try {
                    const url = await getDownloadURL(ref(storage, `${hotelName}.jpg`));
                    setImageUrl(url);
                } catch (error) {
                   
                }
            };

            fetchImage();
        }, [hotelName]);

        return (
            <Image source={{ uri: imageUrl }} style={{ width: width, height: height, borderRadius: 30 }} />
        )
    }

    const handleUpdateHotel = async () => {
        if (!hotelName || !hotelCity || !description || !personCount || !price) {
            setErrorMessage('Bilgiler eksik tamamlayınız.');
            return;
        }

        // Firestore'da otel bilgilerini güncelle
        const db = getFirestore();
        const hotelRef = doc(db, 'hotels', hotelId);
        const updatedData = {
            hotelName: hotelName,
            hotelCity: hotelCity,
            Description: description,
            personCount: personCount,
            price: price
        };

        try {
            await updateDoc(hotelRef, updatedData);
            setSuccessMessage('Otel başarıyla güncellendi.');

            // İsteğe bağlı: Ekranı sıfırlayarak başka bir sayfaya yönlendirebilirsiniz.

            navigation.goBack();
            navigation.goBack();
            navigation.navigate('AdminHotelCRUDScreen');
        } catch (error) {
            console.error('Error updating hotel:', error);
            setErrorMessage('Otel güncellenirken bir hata oluştu.');
        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>{hotelName}</Text>
            <View style={styles.productImage}>
            <ProductImage hotelName={hotelName} height={(200)} width={(300) }  />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Otel Adı:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mert Hotel"
                    value={hotelName}
                    onChangeText={(text) => setHotelName(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Konum:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="İstanbul"
                    value={hotelCity}
                    onChangeText={(text) => setHotelCity(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Açıklama:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Lüks tatil köyü"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Kişi Sayısı:</Text>
                <TextInput
                    placeholder="100"
                    style={styles.input}
                    value={personCount.toString()}
                    onChangeText={text => setPersonCount(Number(text))}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ürünün Fiyatı:</Text>
                <TextInput
                    placeholder="200"
                    style={styles.input}
                    value={price.toString()}
                    onChangeText={text => setPrice(Number(text))}
                />
            </View>


            <TouchableOpacity style={styles.button} onPress={handleUpdateHotel}>
                <Text style={styles.buttonText}>Otel Güncelle</Text>
            </TouchableOpacity>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B2DFDB',
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    label: {
      marginRight: 8,
      width: 80,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 8,
    },
    button: {
      backgroundColor: 'blue',
      padding: 12,
      borderRadius: 5,
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    successText: {
      color: 'green',
      marginTop: 8,
    },
    errorText: {
      color: 'red',
      marginTop: 8,
    },
    productImage: {
      marginBottom: 20,
      alignItems: 'center',
    },
  });

export default AdminHotelUpdateScreen;
