import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../firebase'; // Firebase dosyanızın yolu

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Temizleme fonksiyonunu geri döndükten sonra bu useEffect'i temizle
    return () => unsubscribe();
  }, []);

  const handleUpdateEmail = async () => {
    try {
      await user.updateEmail(newEmail);
      setSuccessMessage('E-posta adresiniz güncellendi.');
    } catch (error) {
      console.error('E-posta güncellenirken bir hata oluştu:', error.message);
    }
  };
  
  const handleUpdatePassword = async () => {
    try {
      await user.updatePassword(newPassword);
      setSuccessMessage('Şifreniz güncellendi.');
    } catch (error) {
      console.error('Şifre güncellenirken bir hata oluştu:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.innerContainer}>
          <Text style={styles.title}>*Profil Bilgileri*</Text>
          <Text style={styles.greeting}>MERHABA,</Text>
          <Text style={styles.email}>{user.email}</Text>
         

          <Text style={styles.label}>Yeni E-posta:</Text>
          <TextInput
            style={styles.input}
            placeholder="Yeni E-posta Adresinizi Girin"
            value={newEmail}
            onChangeText={(text) => setNewEmail(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
            <Text style={styles.buttonText}>E-posta Değiştir</Text>
          </TouchableOpacity>
          <View style={styles.spaccing}/>
          <Text style={styles.label}>Yeni Şifre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Yeni Şifrenizi Girin"
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>Şifre Değiştir</Text>
          </TouchableOpacity>

          <View style={styles.spaccing}/>
          <Button title="Çıkış Yap" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })} />
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>
      ) : (
        <Text>Kullanıcı giriş yapmamış.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F5FF', // Arkaplan rengi
  },
  innerContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff', // İçerik alanı rengi
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 38,
    color: '#333', // Metin rengi
    textAlign:'center',
    marginBottom: 35,
    fontWeight: 'bold',
  },
  greeting: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 12,
    color: 'black', // Metin rengi
  },
  email: {
    fontSize: 18,
    marginBottom: 16,
    color: '#666', // Metin rengi
  },
  label: {
    
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 12,
    color: 'black', // Metin rengi
    
  },
  input: {
    height: 40,
    borderColor: 'black', // Sınır rengi
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
  },
  button: {
    
    backgroundColor: '#4CAF50', // Düğme rengi
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff', // Düğme metni rengi
    textAlign: 'center',
  },
  successText: {
    color: '#4CAF50', // Başarı metni rengi
    marginTop: 8,
    textAlign: 'center',
    
  },

  spaccing: {
    height:15,
  }
});

export default ProfileScreen;
