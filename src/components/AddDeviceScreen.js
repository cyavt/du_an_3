import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const AddDeviceScreen = () => {
  const [selectedArea, setSelectedArea] = useState("A");
  const [devices, setDevices] = useState([
    { id: "1", name: "Thiết bị 1", location: "Khu vực A" },
    { id: "2", name: "Thiết bị 2", location: "Khu vực B" },
    { id: "3", name: "Thiết bị 3", location: "Khu vực C" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDevice, setNewDevice] = useState({
    id: "",
    name: "",
    location: "",
  });

  const addDevice = () => {
    setDevices([...devices, newDevice]);
    setNewDevice({ id: "", name: "", location: "" });
    setModalVisible(false);
  };

  const renderDevice = ({ item }) =>
    item.location === `Khu vực ${selectedArea}` && (
      <View style={styles.deviceRow}>
        <Text style={styles.deviceCell}>{item.id}</Text>
        <Text style={styles.deviceCell}>{item.name}</Text>
        <Text style={styles.deviceCell}>{item.location}</Text>
        <View style={styles.iconCell}>
          <TouchableOpacity>
            <MaterialIcons name="directions" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Chọn khu vực</Text>
      <Picker
        selectedValue={selectedArea}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedArea(itemValue)}
      >
        <Picker.Item label="Khu vực A" value="A" />
        <Picker.Item label="Khu vực B" value="B" />
        <Picker.Item label="Khu vực C" value="C" />
      </Picker>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Tên</Text>
        <Text style={styles.headerCell}>Vị trí</Text>
        <Text style={styles.headerCell}>Chỉ đường</Text>
      </View>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Thêm thiết bị</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={18} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Thêm thiết bị mới</Text>
              <TextInput
                placeholder="ID"
                value={newDevice.id}
                onChangeText={(text) =>
                  setNewDevice({ ...newDevice, id: text })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Tên"
                value={newDevice.name}
                onChangeText={(text) =>
                  setNewDevice({ ...newDevice, name: text })
                }
                style={styles.input}
              />
              <Picker
                selectedValue={newDevice.location}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewDevice({ ...newDevice, location: itemValue })
                }
              >
                <Picker.Item label="Khu vực A" value="Khu vực A" />
                <Picker.Item label="Khu vực B" value="Khu vực B" />
                <Picker.Item label="Khu vực C" value="Khu vực C" />
              </Picker>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.addButton} onPress={addDevice}>
                  <Text style={styles.addButtonText}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  headerCell: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  deviceCell: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  iconCell: {
    flex: 1,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#1d57b5",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#ed7245",
    borderRadius: 20,
    padding: 3,
  },
});

export default AddDeviceScreen;
