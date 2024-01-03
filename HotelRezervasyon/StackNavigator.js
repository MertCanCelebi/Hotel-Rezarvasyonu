// StackNavigator.js
import { StyleSheet, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import LogOutScreen from "./screens/LogOutScreen";
import ContactScreen from "./screens/ContactScreen";
import AdminScreen from "./screens/AdminScreen";
import AdminHotelCRUDScreen from "./screens/AdminHotelCRUDScreen";
import AdminUserCRUDScreen from "./screens/AdminUserCRUDScreen";
import UserUpdateScreen from "./screens/UserUpdateScreen";
import UserAddScreen from "./screens/UserAddScreen";
import UserChangePasswordScreen from "./screens/UserChangePasswordScreen";
import HotelAddScreen from "./screens/HotelAddScreen";
import HotelUpdateScreen from "./screens/HotelUpdateScreen";
import HotelDetailsScreen from "./screens/HotelDetailsScreen";
import FavoriteHotelsScreen from "./screens/FavoriteHotelsScreen";
import MakeReservationScreen from "./screens/MakeReservationScreen";
import MyReservationScreen from "./screens/MyReservationScreen";

const StackNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="FavoriteHotels"
          component={FavoriteHotelsScreen}
          options={{
            tabBarLabel: "Favorites",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="heart" size={24} color="black" />
              ) : (
                <Entypo name="heart-outlined" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="MyReservations"
          component={MyReservationScreen}
          options={{
            tabBarLabel: "MyReservations",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="checksquare" size={24} color="black" />
              ) : (
                <AntDesign name="checksquareo" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            tabBarLabel: "Contact",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="contacts"
                  size={24}
                  color="black"
                />
              ) : (
                <MaterialCommunityIcons
                  name="contacts-outline"
                  size={24}
                  color="black"
                />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="black" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="LogOut"
          component={LogOutScreen}
          options={{
            tabBarLabel: "LogOut",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="logout" size={24} color="black" />
              ) : (
                <MaterialIcons name="logout" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  function AdminTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarLabel: "Admin",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="black" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="LogOut"
          component={LogOutScreen}
          options={{
            tabBarLabel: "LogOut",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="logout" size={24} color="black" />
              ) : (
                <MaterialIcons name="logout" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MyTabs} />
        <Stack.Screen name="HotelDetailsScreen" component={HotelDetailsScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="FavoriteHotelsScreen" component={FavoriteHotelsScreen} />
        <Stack.Screen name="MakeReservationScreen" component={MakeReservationScreen} />
        <Stack.Screen name="MyReservationScreen" component={MyReservationScreen} />
        <Stack.Screen name="AdminUserCRUDScreen" component={AdminUserCRUDScreen} />
        <Stack.Screen name="UserAddScreen" component={UserAddScreen} />
        <Stack.Screen name="AdminHotelCRUDScreen" component={AdminHotelCRUDScreen} />
        <Stack.Screen name="UserUpdateScreen" component={UserUpdateScreen} />
        <Stack.Screen name="HotelAddScreen" component={HotelAddScreen} />
        <Stack.Screen name="HotelUpdateScreen" component={HotelUpdateScreen} />
        <Stack.Screen name="UserChangePasswordScreen" component={UserChangePasswordScreen} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});