// AdminHotelAddScreen.js

import React, { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage, ref, put, firebase, uploadBytes, getDownloadURL } from '../firebase';
import { TouchableOpacity } from 'react-native'
import { app, db } from '../firebase';
import { getFirestore, collection, addDoc, doc, deleteDoc, getDoc, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';


const AdminHotelAddScreen = ({ navigation, visible, onCancel }) => {
    const [hotelName, sethotelName] = useState('');
    const [hotelCity, sethotelCity] = useState('');
    const [Description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [personCount, setPersonCount] = useState(0);
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const getIdByName = async (name) => {
        try {
            const q = query(collection(db, "hotels"), where("hotelName", "==", name));
            const querySnapshot = await getDocs(q);
            let id = null;
            querySnapshot.forEach((doc) => {
                id = doc.id;
            });

            return id;
        } catch (error) {
            console.error("Error fetching ID: ", error);
        }
    }

    const addProduct = async (hotelName, price, hotelCity, Description, personCount) => {
        try {
            const docRef = await addDoc(collection(db, "hotels"), {
                hotelName: hotelName,
                price: price,
                hotelCity: hotelCity,
                Description: Description,
                personCount: personCount
            });
            await updateDoc(doc(db, "hotels", docRef.id), {
                HotelId: docRef.id,
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    function ProductImage({ hotelName, width, height }) {
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
            <Image source={{ uri: imageUrl }} style={{ width: width, height: height, borderRadius: 30 }} />
        )
    };

    async function uploadImage(imageBase64, filename) {


    };


    const uploadImagesToFirebase = async (name) => {
        setUploading(true);

        const uid = await AsyncStorage.getItem("uid");
        try {
            const storageRef = ref(storage,);

            await Promise.all(
                [image].map(async (image, index) => {
                    const response = await fetch(image);
                    const blob = await response.blob();

                    const fileRef = ref(storageRef, `${name}.jpg`);

                    await uploadBytes(fileRef, blob);
                    const downloadURL = await getDownloadURL(fileRef);
                })
            );

        } catch (error) {
            console.error("Error uploading images to Firebase:", error);
        }
        setUploading(false);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImage(imageUri);
            setBase64Image(await convertImageToBase64(imageUri));
        }
    };

    const handleAddHotel = async () => {
        if (!hotelName) {
            setErrorMessage('Otel adı, şehri ve açıklama zorunlu alanlardır.');
            return;
        }

        // Firestore'a otel bilgilerini kaydedin
        const db = getFirestore();
        const hotelsCollection = collection(db, 'hotels');
        const hotelData = {
            hotelName: hotelName,
            price: price,
            hotelCity: hotelCity,
            Description: Description,
            personCount: personCount
        };

        try {
            await addDoc(hotelsCollection, hotelData);
            setSuccessMessage('Otel başarıyla eklendi.');

            // İsteğe bağlı: Ekranı sıfırlayarak başka bir sayfaya yönlendirebilirsiniz.

            navigation.goBack();
            navigation.goBack();
            navigation.navigate('AdminHotelCRUDScreen');
        } catch (error) {
            console.error('Error adding hotel:', error);
            setErrorMessage('Otel eklenirken bir hata oluştu.');
        }
    };
    async function convertImageToBase64(imageUri) {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const base64WithPrefix = `data:image/jpeg;base64,${base64}`;

        return base64WithPrefix;
    }
    const UploadProduct = async () => {
        if (!hotelName || !price || !image || !hotelCity || !personCount) {
            alert('Bilgiler eksik girilmiş. Lütfen kontrol edip tekrar deneyiniz.');
            return;
        }
        else if (await getIdByName(hotelName) != null) {
            alert('Bu isimde bir ürün zaten var. Lütfen farklı bir isim giriniz.');
            return;
        }

        uploadImagesToFirebase(hotelName);
        addProduct(hotelName, price, hotelCity, Description, personCount);
        Alert.alert('Başarılı', 'Otel eklendi.');
        navigation.navigate('AdminTabs');
    
    }
    const closePage = () => {
        
        setImage(null);
        sethotelName('');
        sethotelCity('');
        setDescription('');
        setPrice(0);
        setPersonCount(0);
        setBase64Image(null);
        navigation.goBack();
    }


    return (

        <Modal
            animationType="slide"
            visible={visible}
        >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" 
      >
            <View style={styles.container}>


                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                <TextInput
                    placeholder="Hotel Adını Giriniz"
                    style={styles.inputStyle}
                    value={hotelName}
                    onChangeText={text => sethotelName(text)}
                />
                <TextInput
                    placeholder="Hotel Şehrini Giriniz"
                    style={styles.inputStyle}
                    value={hotelCity}
                    onChangeText={text => sethotelCity(text)}
                />
                <TextInput
                    placeholder="Hotel Açıklamasını Giriniz"
                    style={styles.inputStyle}
                    value={Description}
                    onChangeText={text => setDescription(text)}
                />
                <TextInput
                    placeholder="Kişi Sayısını Giriniz"
                    style={styles.inputStyle}
                  
                    onChangeText={text => setPersonCount(Number(text))}
                />
                <TextInput
                    placeholder="Ürünün Fiyatını Giriniz"
                    style={styles.inputStyle}
                   
                    onChangeText={text => setPrice(Number(text))}
                />
                <View style={styles.pickBtn}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>Resim Seç</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.uploadBtn}>
                    <TouchableOpacity onPress={UploadProduct} disabled={uploading} >
                        <Text style={styles.buttonText}> Ürün Ekle</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.closeBttn}>
                    <TouchableOpacity onPress={closePage}>
                    <Text style={styles.buttonText}> Geri Dön</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </Modal>

    );
}

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#B2DFDB',
      padding: 15,
    },
    button: {
      width: 100,
      marginHorizontal: 8,
      color: 'red',
    },
    inputStyle: {
      width: '90%',
      height: 50,
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 30,
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: 'black',
      alignItems: 'center',
      textAlign: 'center',
      borderRadius: 5,
    },
    pickBtn: {
      width: '90%',
      height: 50,
      borderWidth: 0.5,
      borderRadius: 10,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: '#32CD32',
    },
    uploadBtn: {
      color: 'white',
      backgroundColor: '#40E0D0',
      width: '90%',
      height: 50,
      borderRadius: 10,
      alignSelf: 'center',
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    closeBttn: {
        color: 'white',
        backgroundColor: 'red',
        width: '90%',
        height: 50,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
      
      },
    buttonText: {
      fontSize: 18,
      color: '#000',
      textAlign: 'center',
    },
    
  });

export default AdminHotelAddScreen;
