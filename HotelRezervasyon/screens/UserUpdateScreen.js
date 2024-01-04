// UserUpdateScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { app, db } from '../firebase';
import { doc, getDoc, updateDoc,getDocs,query,collection,where,isEmpty } from 'firebase/firestore';

const UserUpdateScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [user, setUser] = useState(null);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
    const [updatedRole, setUpdatedRole] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const [successMessage, setSuccessMessage] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setUpdatedUsername(userData.username);
                    setUpdatedEmail(userData.email);
                    setUpdatedPhoneNumber(userData.phoneNumber);
                    setUpdatedRole(userData.rol);
                } else {
                    console.error("User not found");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleUpdateUser = async () => {
        const phoneNumberRegex = /^\d+$/;
        if (updatedPhoneNumber.length !== 11 || !phoneNumberRegex.test(updatedPhoneNumber)) {
            setErrorMessages(["Telefon numarası 11 rakamdan oluşmalıdır."]);
            return;
        }
    
        // Mail adresinin uygun formatta olup olmadığını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updatedEmail)) {
            setErrorMessages(["Geçerli bir e-posta adresi giriniz."]);
            return;
        }
        const existingUserQuery = await getDocs(query(collection(db, 'users'), where('email', '==', updatedEmail)));
        if (existingUserQuery.docs.length !== 0 && existingUserQuery.docs[0].id !== userId) {
            setErrorMessages(["Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor."]);
            return;
        }
        try {
            await updateDoc(doc(db, "users", userId), {
                username: updatedUsername,
                email: updatedEmail,
                phoneNumber: updatedPhoneNumber,
                rol: updatedRole,
            });
            
            setSuccessMessage(["Kullanıcı başarıyla güncellendi."]);
            setErrorMessages([]); // Clear error messages
    
            const timer = setTimeout(() => {
                // Şifre değiştirme işlemi tamamlandıktan sonra başka bir sayfaya yönlendirme yapabilirsiniz.
                navigation.goBack();
                navigation.goBack();
                navigation.navigate('AdminUserCRUDScreen');
              }, 1000);
          
              return () => clearTimeout(timer);
        } catch (error) {
            console.error("Error updating user: ", error);
            setErrorMessages(["Kullanıcı güncelleme sırasında bir hata oluştu"]);
        }
    };
    

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Kullanıcı Güncelle</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Updated Username"
                value={updatedUsername}
                onChangeText={setUpdatedUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Updated Email"
                value={updatedEmail}
                onChangeText={setUpdatedEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Updated Phone Number"
                value={updatedPhoneNumber}
                onChangeText={setUpdatedPhoneNumber}
            />
            <TextInput
                style={styles.input}
                placeholder="Updated rol"
                value={updatedRole}
                onChangeText={setUpdatedRole}
            />
            <Button title="Güncelle" onPress={handleUpdateUser} />
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
        backgroundColor: '#E0F7FA', // Açık Mavi tonlu arka plan rengi
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        color: '#1565C0', // Koyu Mavi tonlu başlık rengi
    },
    input: {
        borderWidth: 1,
        borderColor: '#4CAF50', // Yeşil renkli çerçeve rengi
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    errorMessage: {
        color: '#F44336', // Kırmızı renk
        marginTop: 10,
    },
    successMessage: {
        color: '#4CAF50', // Yeşil renk
        marginTop: 10,
    },
});

export default UserUpdateScreen;
