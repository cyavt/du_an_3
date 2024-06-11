import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../components/LoginScreen";
import HomeScreen from "../components/HomeScreen";
import AddDeviceScreen from "../components/AddDeviceScreen";
import TrackLocationScreen from "../components/TrackLocationScreen";
import CustomDrawerContent from "../components/CustomDrawerContent";
import DetailsScreen from "../components/DetailsScreen"; // Import DetailsScreen

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // State to manage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // variable
  const { height } = Dimensions.get("window");
  const headerHeight = Platform.OS === "ios" ? height * 0.12 : height * 0.1;

  // Function
  const startTokenTimer = () => {
    setTimeout(async () => {
      await AsyncStorage.removeItem("userToken");
      setIsLoggedIn(false);
    }, 60000); // 1 minute
  };

  //useEffect
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token);
      if (token) {
        startTokenTimer();
      }
    };

    checkLoginStatus();
  }, []);

  // Main

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "AddDevice") {
            iconName = "add-circle";
          } else if (route.name === "TrackLocation") {
            iconName = "location-on";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        header: ({ navigation }) => (
          <View style={[styles.header, { height: headerHeight }]}>
            <TouchableOpacity>
              <MaterialIcons
                name="menu"
                size={30}
                color="black"
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/envican.png")}
                style={styles.logo}
              />
            </View>
            <TouchableOpacity>
              <MaterialIcons
                name="search"
                size={30}
                color="black"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        ),
        tabBarActiveTintColor: '#0284c9',
        tabBarInactiveTintColor: '#606060',
        tabBarStyle: {
          backgroundColor: '#f0f0f0',
          paddingBottom: 5,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          bottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ"}}
      />
      <Tab.Screen
        name="AddDevice"
        component={AddDeviceScreen}
        options={{ title: "Thêm thiết bị"}}
      />
      <Tab.Screen
        name="TrackLocation"
        component={TrackLocationScreen}
        options={{ title: "Theo dõi vị trí"}}
      />
    </Tab.Navigator>
  );

  const MainDrawer = () => (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({ navigation }) => (
          <View style={[styles.header, { height: headerHeight }]}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <MaterialIcons
                name="menu"
                size={30}
                color="black"
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/envican.png")}
                style={styles.logo}
              />
            </View>
            <MaterialIcons
              name="search"
              size={30}
              color="black"
              style={styles.searchIcon}
            />
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ" }}
      />
      <Drawer.Screen
        name="AddDevice"
        component={AddDeviceScreen}
        options={{ title: "Thêm thiết bị" }}
      />
      <Drawer.Screen
        name="TrackLocation"
        component={TrackLocationScreen}
        options={{ title: "Theo dõi vị trí" }}
      />
    </Drawer.Navigator>
  );

  // render

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Main" : "Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Đăng nhập", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Main"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailsScreen"
          component={DetailsScreen}
          options={{ title: "Chi tiết" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 30,
    paddingVertical: 40,
    paddingBottom: 0,
    marginBottom: 0,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 80,
    resizeMode: "contain",
  },
  menuIcon: {
    marginRight: "auto", // Push the icon to the left
  },
  searchIcon: {
    marginLeft: "auto", // Push the icon to the right
  },
});

export default AppNavigator;
