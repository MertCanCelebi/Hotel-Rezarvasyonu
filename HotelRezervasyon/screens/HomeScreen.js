import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image ,TextInput} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { app, db, storage } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadString } from "firebase/storage";

const HomeScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
      const fetchHotels = async () => {
          const hotelsRef = collection(db, "hotels");
          const snapshot = await getDocs(hotelsRef);
          const hotelsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHotels(hotelsData);
      };

      fetchHotels();
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

      return (
          <Image source={{ uri: imageUrl }} style={{ width: width, height: height, borderRadius: 30 }} />
      )
  }

  const filteredHotels = hotels.filter(hotel => {
    const searchText = search.toLowerCase();
    return (
        hotel.hotelName.toLowerCase().includes(searchText) ||
        hotel.Description.toLowerCase().includes(searchText) ||
        hotel.hotelCity.toLowerCase().includes(searchText)
        
    );
});
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Oteller</Text>

        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Ara..."
                onChangeText={setSearch}
                value={search}
            />
        </View>

        {filteredHotels.map(hotel => (
          <TouchableOpacity
          key={hotel.id}
          style={styles.hotelItem}
          onPress={() => navigation.navigate('HotelDetailsScreen', { hotel })}
        >
            <View key={hotel.id} style={styles.hotelItem}>
                <Text style={styles.hotelInfo}>{`${hotel.hotelName}`}</Text>
                <ProductImage hotelName={hotel.hotelName} height={200} width={270} />
                <Text style={styles.hotelInfo}>{`${hotel.Description}`}</Text>

                <Text style={styles.hotelInfo}>{`Şehir: ${hotel.hotelCity}`}</Text>
                <Text style={styles.hotelInfo}>{`Ücret: ${hotel.price}`}</Text>
            </View>
            </TouchableOpacity>
        ))}
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
searchContainer: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
},
searchInput: {
    fontSize: 16,
    color: '#333',
},
});

export default HomeScreen;