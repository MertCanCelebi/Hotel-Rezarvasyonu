// LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  where,
  collection,
  query,
  getDocs,
} from "firebase/firestore";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(userQuery);
        let role = "";

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          isAdmin = data.rol;
          console.log(data.rol);
          console.log("role::", isAdmin);
          setErrorMessage("");
          setSuccessMessage("Giriş başarılı" + " " + user.email);

          if (isAdmin === "kullanici") {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Main" }],
              });
            }, 2000);
          } else {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "AdminTabs" }],
              });
            }, 2000);
          }
        }

        console.log(
          "User hotels and photos retrieved from Firestore successfully"
        );
        console.log(role);

        return role;
      } catch (error) {
        console.error(
          "Error retrieving user hotels and photos from Firestore:",
          error
        );
        throw error;
      }
    } catch (error) {
      setErrorMessage("Kullanıcı Adı  veya şifre hatalı");
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
      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Register" }],
          })
        }
      >
        <Text style={styles.registerLink}>
          Henüz Bir Hesabınınz Yok Mu? Hemen Kayıt Olun!!
        </Text>
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },

  successText: {
    color: "green",
    marginTop: 8,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  registerLink: {
    marginTop: 16,
    color: "blue",
  },
});

export default LoginScreen;