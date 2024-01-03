import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db,auth } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

const MyReservationsScreen = ({ navigation, route }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Bu kullanıcının rezervasyonlarını getir
    const fetchReservations = async () => {
        const userId = auth.currentUser.uid;

      

      const reservationsQuery = query(collection(db, 'reservations'), where('userId', '==', userId));

      const reservationsSnapshot = await getDocs(reservationsQuery);

      const reservationsData = reservationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReservations(reservationsData);
    };

    fetchReservations();
  }, []); // Boş dependency array ile sadece bir kere çağrılır

  const cancelReservation = (reservationId) => {
    Alert.alert(
      'Rezervasyonu İptal Et',
      'Bu rezervasyonu iptal etmek istediğinizden emin misiniz?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              // Rezervasyonu sil
              const reservationRef = doc(db, 'reservations', reservationId);
              await deleteDoc(reservationRef);
  
              // Rezervasyonları güncelle
              setReservations((prevReservations) =>
                prevReservations.filter((reservation) => reservation.id !== reservationId)
              );
  
              Alert.alert('Başarılı', 'Rezervasyon iptal edildi.');
            } catch (error) {
              console.error('Error cancelling reservation:', error);
              Alert.alert('Hata', 'Rezervasyon iptal edilirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rezervasyonlarım</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reservationItem}>
            <Text>{item.hotelName}</Text>
            <Text>Check-In: {item.checkInDate}</Text>
            <Text>Check-Out: {item.checkOutDate}</Text>
            <Text>Person Count: {item.personCount}</Text>
            <TouchableOpacity onPress={() => cancelReservation(item.id)}>
              <Text style={styles.cancelButton}>Rezarvasyonu İptal Et</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  reservationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingBottom: 10,
  },
  cancelButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default MyReservationsScreen;
