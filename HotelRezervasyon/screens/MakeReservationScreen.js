import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db,auth } from '../firebase'; // Import Firestore related functions
import { getFirestore, collection, addDoc, doc, deleteDoc, getDoc, query, where, getDocs, updateDoc, increment } from 'firebase/firestore';


const MakeReservationScreen = ({ navigation, route }) => {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [personCount, setPersonCount] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const { hotelName, hotelCity, description, price, hotelPersonCount, HotelId } = route.params;



  const handleReservation = async () => {

    const userId = auth.currentUser.uid;

    if (!fullName || !email || !phone || !checkInDate || !checkOutDate || !personCount) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Uyarı', 'Geçerli bir e-posta adresi giriniz.');
      return;
    }

    // Phone number validation
    const phoneRegex = /^\d{11}$/; // Assumes a 10-digit phone number
    if (!phoneRegex.test(phone)) {
      Alert.alert('Uyarı', 'Geçerli bir telefon numarası giriniz.');
      return;
    }

    // Date validation (basic check for YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkInDate) || !dateRegex.test(checkOutDate)) {
      Alert.alert('Uyarı', 'Geçerli bir tarih formatı (YYYY-MM-DD) giriniz.');
      return;
    }

    // Check if check-out date is later than check-in date
    const checkInDateTime = new Date(checkInDate).getTime();
    const checkOutDateTime = new Date(checkOutDate).getTime();
    if (checkOutDateTime <= checkInDateTime) {
      Alert.alert('Uyarı', 'Çıkış tarihi, giriş tarihinden sonra olmalıdır.');
      return;
    }

    // Check if the number of persons is valid (you can adjust the condition as needed)
    if (personCount <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir kişi sayısı giriniz.');
      return;
    }
    // Check if the person count exceeds the hotel's person count
    if (personCount > hotelPersonCount) {
      Alert.alert('Uyarı', 'Girilen kişi sayısı, otelin kişi sayısını aşıyor.');
      return;
    }


    const reservationsQuery = query(collection(db, 'reservations'), 
    where('HotelId', '==', HotelId)
  );

  const existingReservations = await getDocs(reservationsQuery);

  let isOverlapping = false; // Flag to check for overlapping reservations

  existingReservations.forEach((doc) => {
    const reservation = doc.data();
    const existingCheckInDate = new Date(reservation.checkInDate).getTime();
    const existingCheckOutDate = new Date(reservation.checkOutDate).getTime();

    const newCheckInDate = new Date(checkInDate).getTime();
    const newCheckOutDate = new Date(checkOutDate).getTime();

    // Check for overlapping date ranges
    if (
      (newCheckInDate >= existingCheckInDate && newCheckInDate <= existingCheckOutDate) ||
      (newCheckOutDate >= existingCheckInDate && newCheckOutDate <= existingCheckOutDate)
    ) {
      isOverlapping = true;
      Alert.alert('Uyarı', 'Bu tarihler arasında oda müsait değil!! Başka tarih yazınız...');
    }
  });

  if (isOverlapping) {
    return; // Stop the function if there is an overlapping reservation
  }

    // Continue with the reservation process
    try {
      // Add reservation information to Firestore
      const reservationsCollection = collection(db, 'reservations');
      const reservationData = {
        fullName: fullName,
        email: email,
        phone: phone,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        personCount: personCount,
        hotelName: hotelName,
        hotelCity: hotelCity,
        price: price,
        HotelId: HotelId,
        userId: userId
      };

      await addDoc(reservationsCollection, reservationData);

      // Display success message and optional navigation
      Alert.alert('Başarılı', 'Rezervasyonunuz başarıyla oluşturuldu.');
      navigation.navigate('MyReservationScreen');
    } catch (error) {
      console.error('Error adding reservation:', error);
      Alert.alert('Hata', 'Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rezervasyon Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefon"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Kişi Sayısı"
        keyboardType="phone-pad"
        onChangeText={text => setPersonCount(Number(text))}
      />

      <TextInput
        style={styles.input}
        placeholder="Giriş Tarihi (YYYY-MM-DD)"
        value={checkInDate}
        onChangeText={(text) => setCheckInDate(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Çıkış Tarihi (YYYY-MM-DD)"
        value={checkOutDate}
        onChangeText={(text) => setCheckOutDate(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleReservation}>
        <Text style={styles.buttonText}>Rezervasyon Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonText}>Geri Dön</Text>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  backButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default MakeReservationScreen;