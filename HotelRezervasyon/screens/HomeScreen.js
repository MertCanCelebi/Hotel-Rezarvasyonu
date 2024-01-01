import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

const hotels = [
  {
    id: 1,
    name: 'Hotel A',
    location: 'City A',
    image: require('../assets/kocaali.jpg'),
  },
  {
    id: 2,
    name: 'Hotel B',
    location: 'City B',
    image: require('../assets/kocaali.jpg'),
  },
  {
    id: 3,
    name: 'Hotel C',
    location: 'City C',
    image: require('../assets/kocaali.jpg'),
  },
  {
    id: 4,
    name: 'Hotel D',
    location: 'City D',
    image: require('../assets/kocaali.jpg'),
  },
  {
    id: 5,
    name: 'Hotel E',
    location: 'City E',
    image: require('../assets/kocaali.jpg'),
  },
];

const HomeScreen = () => {


  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {hotels.map((hotel) => (
        <View key={hotel.id} style={styles.hotelCard}>
          <Image source={hotel.image} style={styles.hotelImage} />
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 16,
  },
  hotelCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
