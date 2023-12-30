// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firebase, db } from '../firebase';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    try {
      var user;
      await firebase.auth().signInWithEmailAndPassword(email, password);
      user = firebase.auth().currentUser;
      setErrorMessage('');
      setSuccessMessage('Giriş başarılı' + ' ' +  user.email);

      const rolll = doc(firestore, 'users', user.uid);
      const roll = await getDoc(rolll);
      
      if (roll.exists()) {
        const userData = roll.data();
        const userRole = userData.rol;
      
        if (userRole === 'kullanici') {
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }, 2000);
        } else {
          // Farklı bir rol ise buraya yönlendirme veya diğer işlemleri ekleyebilirsiniz.
          console.log('Farklı bir rol');
        }
      } else {
        console.warn('Kullanıcı belgesi bulunamadı.');
      }

    } catch (error) {
        setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Register' }],
            })}>
                <Text style={styles.registerLink}>Henüz Bir Hesabınınz Yok Mu? Hemen Kayıt Olun!!</Text>
            </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 16,
      padding: 8,
    },
    button: {
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
   
    successText: {
        color: 'green',
        marginTop: 8,
    },
    errorText: {
        color: 'red',
        marginTop: 8,
    },
    registerLink: {
      marginTop: 16,
      color: 'blue',
    },
  });
  
  export default LoginScreen;