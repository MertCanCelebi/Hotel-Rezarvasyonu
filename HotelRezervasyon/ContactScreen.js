import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>İletişim Bilgileri</Text>
      <Text>Email: info@otelrezervasyon.com</Text>
      <Text>Telefon: 123-456-7890</Text>
      <Text>Adres: Otel Rezervasyon Merkezi, Şehir, Ülke</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
