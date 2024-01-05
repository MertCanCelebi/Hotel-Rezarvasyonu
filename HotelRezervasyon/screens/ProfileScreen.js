import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase'; 
import {
  getFirestore,
  where,
  collection,
  query,
  getDocs,
} from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        try {
          const db = getFirestore();
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error retrieving user data from Firestore:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  
  const handleEditProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.card}>
          <Text style={styles.title}>Profil Bilgileri</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Kullanıcı Adı:</Text>
            <Text style={styles.info}>{userData?.username || 'Bilgi Yok'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{userData?.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Telefon Numarası:</Text>
            <Text style={styles.info}>
              {userData?.phoneNumber || 'Bilgi Yok'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}>
            <FontAwesome name="edit" size={20} color="white" />
            <Text style={styles.editButtonText}> Profilini Düzenle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.title}>Kullanıcı Girişi Yapın</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProfileScreen;
