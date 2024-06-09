import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  RefreshControl,
} from "react-native";

import { TextInput, Button, Text, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Thực hiện các hoạt động cần thiết để tải lại dữ liệu
    wait(2000).then(() => {
      setRefreshing(false);
      // Cập nhật dữ liệu mới ở đây nếu cần
    });
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem("userToken", email);
      navigation.replace("Main");
    } catch (e) {
      console.error("Failed to save the data to the storage", e);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Title
              title="USER AUTHENTICATION"
              titleStyle={{ textAlign: "center", width: "100%", fontSize: 20}}
            />
            <Card.Content>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
              >
                Login
              </Button>
            </Card.Content>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#e88317",
  },
});

export default LoginScreen;
