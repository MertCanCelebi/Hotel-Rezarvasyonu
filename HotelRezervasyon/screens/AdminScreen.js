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
        <Text style={styles.buttonText}>Kullanıcılar Yönetimi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleHotelButtonClick}>
        <Text style={styles.buttonText}>Otel Yönetimi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
  },
  heading: {
    fontSize: 28,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3498db', 
    padding: 15,
    width: 250,
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    elevation: 3, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
