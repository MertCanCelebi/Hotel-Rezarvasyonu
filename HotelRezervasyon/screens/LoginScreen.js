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
        const userQuery = query(usersRef, where("email", "==",email.toLowerCase()));
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
            }, 1000);
          } else {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "AdminTabs" }],
              });
            }, 1000);
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
          Henüz bir hesabınız yok mu? Hemen Kayıt Olun!!
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
    backgroundColor: "#F5F5F5", // Açık gri arka plan rengi
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#B0C4DE", // Gök mavisi çerçeve rengi
    borderWidth: 2,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF", // Beyaz arka plan rengi
  },
  button: {
    backgroundColor: "#32CD32", // Yeşil düğme rengi
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  successText: {
    color: "#008000", // Yeşil renk
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#FF0000", // Kırmızı renk
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    color: "#4169E1", // Royal mavi renk
    textDecorationLine: "underline",
    fontSize: 14,
  },
});

export default LoginScreen;