import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = (props) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      props.navigation.replace("Login");
    } catch (e) {
      console.error("Failed to clear the async storage.", e);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    margin: 10,
    marginLeft: 25,
    marginRight: 25,
    alignItems: 'center',
    borderRadius: 10,
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
