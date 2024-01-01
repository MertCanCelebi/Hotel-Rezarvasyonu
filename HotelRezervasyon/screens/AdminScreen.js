// AdminScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdminScreen = () => {
  const navigation = useNavigation();

  const handleUserButtonClick = () => {
    navigation.navigate('AdminUserCRUDScreen');
  };

  const handleHotelButtonClick = () => {
    navigation.navigate('AdminHotelCRUDScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Panel</Text>
      <TouchableOpacity style={styles.button} onPress={handleUserButtonClick}>
        <Text style={styles.buttonText}>Kullanıcılar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleHotelButtonClick}>
        <Text style={styles.buttonText}>Hoteller</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Arka plan rengi
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333', // Başlık rengi
  },
  button: {
    backgroundColor: '#3498db', // Buton rengi
    padding: 15,
    width: 200,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff', // Buton metni rengi
    fontSize: 18,
  },
});

export default AdminScreen;
