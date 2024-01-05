import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { storage, auth, db } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import FavoriteHotelsScreen from './FavoriteHotelsScreen';
import MakeReservationScreen from './MakeReservationScreen'

const HotelDetails = ({ route, navigation }) => {
  const { hotel } = route.params;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await getDownloadURL(ref(storage, `${hotel.hotelName}.jpg`));
        setImageUrl(url);
      } catch (error) {
        console.error('Resim alınamadı:', error);
      }
    };

    fetchImage();
  }, [hotel.hotelName]);

  const addToFavorites = async () => {
    try {
     
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;

        
        const favoriteHotelRef = collection(db, 'favoritehotel');

        
        const querySnapshot = await getDocs(query(favoriteHotelRef, where('userId', '==', userId), where('hotelId', '==', hotel.id)));

        if (querySnapshot.size === 0) {
          
          await addDoc(favoriteHotelRef, {
            userId: userId,
            hotelId: hotel.id,
          });

          Alert.alert('Başarılı', 'Otel favorilere eklendi.');

          const timer = setTimeout(() => {
                navigation.goBack();
                navigation.navigate('Main');
              }, 1000);
          
              return () => clearTimeout(timer);

        } else {
          
          Alert.alert('Uyarı', 'Otel zaten favorilerinizde bulunuyor.');
        }
      } else {
        
        Alert.alert('Uyarı', 'Favorilere otel ekleyebilmek için giriş yapmalısınız.', [
          {
            text: 'Giriş Yap',
            onPress: () => navigation.navigate('Login'), 
          },
          {
            text: 'İptal',
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      console.error('Favorilere ekleme hatası:', error);
    }
  };

  const makeReservation = () => {
    navigation.navigate('MakeReservationScreen', {
      hotelName: hotel.hotelName,
      hotelCity: hotel.hotelCity,
      description: hotel.Description,
      price: hotel.price,
      hotelPersonCount: hotel.personCount,
      HotelId: hotel.HotelId
     
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{hotel.hotelName}</Text>
      <Image source={{ uri: imageUrl }} style={styles.hotelImage} />
      <Text style={styles.hotelInfo}>{hotel.Description}</Text>
      <Text style={styles.hotelInfo}>{`Şehir: ${hotel.hotelCity}`}</Text>
      <Text style={styles.hotelInfo}>{`Ücret: ${hotel.price}`}</Text>
      <Text style={styles.hotelInfo}>{`Kişi Sayısı: ${hotel.personCount}`}</Text>

      <TouchableOpacity style={styles.button} onPress={addToFavorites}>
        <Text style={styles.buttonText}>Favorilere Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={makeReservation}>
        <Text style={styles.buttonText}>Rezervasyon Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  hotelInfo: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HotelDetails;
