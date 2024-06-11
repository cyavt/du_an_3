import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Modal, ScrollView, RefreshControl, Animated, TouchableWithoutFeedback } from "react-native";
import axios from "axios";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const DetailsScreen = ({ route }) => {
  const { buildingId } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedJacket, setSelectedJacket] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({});
  const blinkAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchDetails();
    startBlinking();
  }, [buildingId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://iistem.com/data?page=details&building_id=${buildingId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDetails();
  };

  const handleFloorSelect = (floorNumber) => {
    setSelectedFloor(floorNumber);
    setTooltipVisible(false);
  };

  const handleJacketPress = (jacket, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedJacket(jacket);
    setTooltipPosition({ left: pageX - 50, top: pageY - 70 }); //top: pageY - 100 
    setTooltipVisible(true);
  };

  const renderFloorPlan = () => {
    const floor = data.find((f) => f.floor_number === selectedFloor);
    if (!floor) return null;

    return (
      <View style={styles.floorPlanContainer}>
        <Image source={{ uri: floor.url_image }} style={styles.floorImage} />
        {floor.rooms.map((room) => (
          room.jackets.length > 0 && (
            <View key={room.room_number} style={[styles.roomMarker, { left: `${room.x_coordinate}%`, top: `${room.y_coordinate}%` }]}>
              {room.jackets.map((jacket, index) => (
                <TouchableOpacity
                  key={jacket.id}
                  style={[
                    styles.jacketIcon,
                    getStatusStyle(jacket.user_status),
                    getAdjustedPosition(index)
                  ]}
                  onPress={(event) => handleJacketPress(jacket, event)}
                >
                  <MaterialIcons name="person" size={16} color="white" />
                </TouchableOpacity>
              ))}
            </View>
          )
        ))}
      </View>
    );
  };

  const getAdjustedPosition = (index) => {
    const offset = 15; // Adjust the offset to spread out the icons more
    const positions = [
      { top: -offset, left: -offset },
      { top: -offset, left: offset },
      { top: offset, left: -offset },
      { top: offset, left: offset },
      { top: 0, left: -offset },
      { top: 0, left: offset },
      { top: -offset, left: 0 },
      { top: offset, left: 0 },
    ];

    return positions[index % positions.length];
  };

  const getStatusStyle = (userStatus) => {
    switch (userStatus) {
      case 0:
        return { backgroundColor: 'green' };
      case 1:
        return { backgroundColor: 'yellow' };
      case 2:
        return { backgroundColor: 'red', opacity: blinkAnimation };
      default:
        return {};
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.floorList}>
            {data.length > 0 ? data.map((floor) => (
              <TouchableOpacity
                key={floor.floor_number}
                onPress={() => handleFloorSelect(floor.floor_number)}
                style={[
                  styles.floorButton,
                  selectedFloor === floor.floor_number && styles.disabledFloorButton
                ]}
                disabled={selectedFloor === floor.floor_number}
              >
                <Text style={styles.floorButtonText}>Tầng {floor.floor_number}</Text>
              </TouchableOpacity>
            )) : <Text>Không có dữ liệu</Text>}
          </View>
          {selectedFloor && renderFloorPlan()}
        </ScrollView>

        {tooltipVisible && (
          <View style={[styles.tooltip, tooltipPosition]}>
            <View style={styles.tooltipTriangle} />
            <View style={styles.tooltipContent}>
              <Text style={styles.tooltipText}>Temp: {selectedJacket.temperature}°C</Text>
              <Text style={styles.tooltipText}>Heart Rate: {selectedJacket.heart_rate} bpm</Text>
              <Text style={styles.tooltipText}>Gas: {selectedJacket.gas_concentration} %</Text>
              <Text style={styles.tooltipText}>Status: {selectedJacket.user_status === 0 ? 'Normal' : selectedJacket.user_status === 1 ? 'Warning' : 'Critical'}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floorList: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  floorButton: {
    backgroundColor: "#0288D1",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    elevation: 2, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  disabledFloorButton: {
    backgroundColor: "#B0BEC5", // Disable button color
  },
  floorButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  floorPlanContainer: {
    position: "relative",
    width: "100%",
    height: 400, // Adjust height as needed
    backgroundColor: "#EEE",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    overflow: 'hidden', // To make sure the image is clipped within the container
  },
  floorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Cover to make sure the image covers the container
  },
  roomMarker: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Ensure markers are above the image
  },
  jacketIcon: {
    width: 30,  // Smaller icon size
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    elevation: 3, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  '@keyframes blinking': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 3, // Ensure tooltip is above all other elements
  },
  tooltipContent: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    elevation: 4, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  tooltipTriangle: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: '80%', // Adjust width as needed
    elevation: 5, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#0288D1",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default DetailsScreen;
