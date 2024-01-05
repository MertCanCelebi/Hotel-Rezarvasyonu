import React from 'react';
import { View, Text, Image, StyleSheet,SafeAreaView,ScrollView } from 'react-native';


const ContactScreen = () => {
  const authors = [
    {
      image: require('../assets/mert.jpg'),
      name: 'Mert Can Çelebi ',
      email: 'mertcancelebi12@gmail.com',
      description: 'Merhaba Ben Mert, Sakaryalıyım. 21 yaşındayım ve şu anda Sakarya Üniversitesinde Bilgisayar Mühendisliği bölümünde okuyorum.',
      
    },
    {
      image: require('../assets/elman.jpg'),
      name: 'Elman Muradov',
      email: 'elmanmuradov@gmail.com',
      description: 'Merhaba Ben Elman, aslen Azerbeycanlıyım fakat uzun süredir Düzce\'de ikamet ediyorum. 21 yaşındayım ve şu anda Sakarya Üniversitesinde Bilgisayar Mühendisliği bölümünde okuyorum.',
      
    },
  ];

  return (
    <ScrollView >
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>   *Bizimle Mail Yoluyla* *İletişime Geçebilirsiniz*</Text>
      {authors.map((author, index) => (
        <View key={index} style={styles.authorContainer}>
          <Image source={author.image} style={styles.authorImage} />
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.authorEmail}>{author.email}</Text>
          <Text style={styles.authorDescription}>{author.description}</Text>
        </View>
      ))}
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 19,
    marginBottom: 50,
    color:'black',
    fontSize:30,
    alignItems: 'center',
  },
  authorContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  authorImage: {
    width: 100, 
    height: 100, 
    borderRadius: 50,
    marginBottom: 8,
  },
  authorName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontSize:20,
  },
  authorEmail: {
    color: 'gray',
    marginBottom: 4,
  },
  authorDescription: {
    textAlign: 'center',
    
  },
});

export default ContactScreen;
