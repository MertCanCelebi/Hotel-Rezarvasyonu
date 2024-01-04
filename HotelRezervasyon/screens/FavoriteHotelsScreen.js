import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getDocs, collection, where, query, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadString } from 'firebase/storage';
import { app, db, storage, auth } from '../firebase';

const FavoriteHotelsScreen = ({ navigation }) => {
  const [favoriteHotels, setFavoriteHotels] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);

  const fetchFavoriteHotels = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const favoriteHotelRef = collection(db, 'favoritehotel');
        const querySnapshot = await getDocs(query(favoriteHotelRef, where('userId', '==', userId)));
        const favoriteHotelsData = [];

        querySnapshot.forEach((doc) => {
          favoriteHotelsData.push(doc.data().hotelId);
        });

        setFavoriteHotels(favoriteHotelsData);
        await fetchHotelsData(favoriteHotelsData);
      }
    } catch (error) {
      console.error('Favori otelleri getirme hatası:', error);
    }
  };

  const fetchHotelsData = async (hotelIds) => {
    try {
      const hotelsRef = collection(db, 'hotels');
      const hotelsData = [];

      for (const hotelId of hotelIds) {
        const hotelDoc = doc(hotelsRef, hotelId);
        const hotelDocSnapshot = await getDoc(hotelDoc);

        if (hotelDocSnapshot.exists()) {
          hotelsData.push(hotelDocSnapshot.data());
        }
      }

      setHotelsData(hotelsData);
    } catch (error) {
      console.error('Otelleri getirme hatası:', error);
    }
  };

  const removeFavoriteHotel = async (hotelId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        Alert.alert(
          'Favori Oteli Sil',
          'Bu oteli favorilerden silmek istediğinize emin misiniz?',
          [
            {
              text: 'İptal',
              style: 'cancel',
            },
            {
              text: 'Sil',
              onPress: async () => {
                const favoriteHotelRef = collection(db, 'favoritehotel');
                const userFavoriteHotelQuery = query(
                  favoriteHotelRef,
                  where('userId', '==', userId),
                  where('hotelId', '==', hotelId)
                );

                const querySnapshot = await getDocs(userFavoriteHotelQuery);

                querySnapshot.forEach(async (doc) => {
                  await deleteDoc(doc.ref);
                });

                // Favori oteli sildikten sonra tüm otelleri tekrar getir ve güncelle
                await fetchFavoriteHotels();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Favori otel silme hatası:', error);
    }
  };

  useEffect(() => {
    // Favori otelleri getirme işlemini buraya al
    fetchFavoriteHotels();
  }, []);

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

    return <Image source={{ uri: imageUrl }} style={{ width: width, height: height, borderRadius: 10 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Favori Oteller</Text>

      {hotelsData.map((item) => (
        <View key={item.HotelId} style={styles.hotelItem}>
          <ProductImage hotelName={item.hotelName} height={200} width={300} />
          <Text style={styles.hotelInfo}>{`Hotel Name: ${item.hotelName}`}</Text>
          <Text style={styles.hotelInfo}>{`Location: ${item.hotelCity}`}</Text>
          <Text style={styles.hotelInfo}>{`Description: ${item.Description}`}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => removeFavoriteHotel(item.HotelId)} style={styles.removeButton}>
              <Text style={styles.buttonText}>Favorilerden Kaldır</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'MakeReservationScreen',
                      params: {
                        hotelName: item.hotelName,
                        hotelCity: item.hotelCity,
                        description: item.Description,
                        price: item.price,
                        hotelPersonCount: item.personCount,
                        HotelId: item.HotelId,
                      },
                    },
                  ],
                })
              }
              style={styles.bookButton}
            >
              <Text style={styles.buttonText}>Rezervasyon Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
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
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default FavoriteHotelsScreen;
