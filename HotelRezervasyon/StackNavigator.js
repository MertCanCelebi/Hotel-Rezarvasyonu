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
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="AdminUserCRUDScreen" component={AdminUserCRUDScreen} />
        <Stack.Screen name="UserAddScreen" component={UserAddScreen} />
        <Stack.Screen name="AdminHotelCRUDScreen" component={AdminHotelCRUDScreen} />
        <Stack.Screen name="UserUpdateScreen" component={UserUpdateScreen} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});