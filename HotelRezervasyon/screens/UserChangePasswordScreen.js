import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { app, db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';

const ChangePasswordScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessages([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [errorMessages]);

  const handleChangePassword = async () => {
    const errors = [];

    if (newPassword.length < 6) {
      errors.push("Şifre en az 6 karakter içermelidir.");
    }

    if (newPassword !== confirmNewPassword) {
      errors.push("Yeni şifre ve şifre onayı eşleşmiyor.");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        password: newPassword,
      });
      console.log("Şifre güncellendi");

      setSuccessMessage(["Şifre başarıyla güncellendi."]);

      const timer = setTimeout(() => {
        navigation.goBack();
        navigation.goBack();
        navigation.navigate('AdminUserCRUDScreen');
      }, 1000);
  
      return () => clearTimeout(timer);

    } catch (error) {
      console.error("Şifre Değiştirilirken hata oluştu: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Şifre Değiştirme Ekranı</Text>
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifre"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifre Onayı"
        secureTextEntry={true}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />

      <Button title="Şifreyi Değiştir" onPress={handleChangePassword} />
      {errorMessages.length > 0 && (
        <View>
          {errorMessages.map((errorMessage, index) => (
            <Text key={index} style={styles.errorMessage}>
              {errorMessage}
            </Text>
          ))}
        </View>
      )}
      {successMessage.length > 0 && (
        <View>
          {successMessage.map((successMessage, index) => (
            <Text key={index} style={styles.successMessage}>
              {successMessage}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E0F7FA',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1565C0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4CAF50', 
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorMessage: {
    color: '#F44336', 
    marginTop: 10,
  },
  successMessage: {
    color: '#4CAF50',
    marginTop: 10,
  },
});

export default ChangePasswordScreen;
