import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

const Mydomain = "https://iistem.com";

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [mapData, setMapData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [region, setRegion] = useState({
    latitude: 16.0774392,
    longitude: 108.2133639,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [currentLocation, setCurrentLocation] = useState(null);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchData();
      setRefreshing(false);
    });
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const fetchData = async () => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get(Mydomain + "/data?page=trangchu"),
        axios.get(Mydomain + "/data?page=trangchu&fuc=map"),
      ]);
      setData(response1.data);
      setMapData(response2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkerPress = (location, id) => {
    setCurrentLocation({ ...location, id });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.dateText}>Th 6, 22 Th 7 2022</Text>
        <View style={styles.infoContainer}>
          <View style={[styles.infoBox, styles.infoBoxPurple]}>
            <Text style={styles.infoText}>{data && data.total_buildings}</Text>
            <Text style={styles.infoLabel}>Khu vực hoạt động</Text>
          </View>
          <View style={[styles.infoBox, styles.infoBoxGreen]}>
            <Text style={styles.infoText}>{data && data.total_jackets}</Text>
            <Text style={styles.infoLabel}>Áo đang hoạt động</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={[styles.infoBox, styles.infoBoxOrange]}>
            <Text style={styles.infoText}>{data && data.alert_status}</Text>
            <Text style={styles.infoLabel}>Cảnh báo</Text>
          </View>
          <View style={[styles.infoBox, styles.infoBoxRed]}>
            <Text style={styles.infoText}>{data && data.danger_status}</Text>
            <Text style={styles.infoLabel}>Nguy hiểm</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tổng quan</Text>

          <TouchableOpacity
            style={styles.fullscreenIcon}
            onPress={toggleFullscreen}
          >
            <MaterialIcons
              name={isFullscreen ? "fullscreen-exit" : "fullscreen"}
              size={35}
              color="#888"
              style={{ alignSelf: "flex-end" }}
            />
          </TouchableOpacity>

          <Text style={styles.chartSubtitle}>
            Bản đồ khu vực đang hoạt động
          </Text>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onPress={() => setCurrentLocation(null)} // Ẩn thông tin khi bấm vào bản đồ
          >
            {mapData &&
              mapData.map((location, index) => {
                const [latitude, longitude] = location.location
                  .split(", ")
                  .map(Number);
                return (
                  <Marker
                    key={location.id}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    title={location.name}
                    description={location.address}
                    onPress={() =>
                      handleMarkerPress(
                        {
                          name: location.name,
                          address: location.address,
                          floors: location.total_floors,
                          rooms: location.total_rooms,
                          people: location.total_people,
                        },
                        location.id
                      )
                    }
                  >
                    <MaterialIcons name="location-on" size={40} color="red" />
                  </Marker>
                );
              })}
          </MapView>
        </View>

        {/* Thông tin chi tiết */}
        {currentLocation && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTextLabel}>Tên:</Text>
              <Text style={styles.detailsText}>{currentLocation.name}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTextLabel}>Địa chỉ:</Text>
              <Text style={styles.detailsText}>{currentLocation.address}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTextLabel}>Số tầng:</Text>
              <Text style={styles.detailsText}>{currentLocation.floors}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTextLabel}>Số phòng:</Text>
              <Text style={styles.detailsText}>{currentLocation.rooms}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTextLabel}>Số người:</Text>
              <Text style={styles.detailsText}>{currentLocation.people}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate("DetailsScreen", {
                  buildingId: currentLocation.id,
                })
              }
            >
              <Text style={styles.detailsButtonText}>Xem thêm</Text>
              <Entypo name="chevron-down" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {isFullscreen && (
        <Modal visible={isFullscreen} transparent={false} animationType="slide">
          <View style={styles.fullscreenMapContainer}>
            <TouchableOpacity
              style={styles.fullscreenExitIcon}
              onPress={toggleFullscreen}
            >
              <MaterialIcons name="fullscreen-exit" size={35} color="#888" />
            </TouchableOpacity>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.fullscreenMap}
              region={region}
            >
              {mapData &&
                mapData.map((location, index) => {
                  const [latitude, longitude] = location.location
                    .split(", ")
                    .map(Number);
                  return (
                    <Marker
                      key={location.id}
                      coordinate={{
                        latitude,
                        longitude,
                      }}
                      title={location.name}
                      description={location.address}
                      onPress={() =>
                        handleMarkerPress({
                          name: location.name,
                          address: location.address,
                          floors: location.total_floors,
                          rooms: location.total_rooms,
                          people: location.total_people,
                        })
                      }
                    >
                      <MaterialIcons name="location-on" size={40} color="red" />
                    </Marker>
                  );
                })}
            </MapView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  dateText: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBox: {
    width: "48%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  infoBoxGreen: {
    backgroundColor: "#4CAF50",
  },
  infoBoxOrange: {
    backgroundColor: "#FF9800",
  },
  infoBoxRed: {
    backgroundColor: "#F44336",
  },
  infoBoxPurple: {
    backgroundColor: "#9C27B0",
  },
  infoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  infoLabel: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  map: {
    height: 300,
    width: "100%",
  },
  fullscreenIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  fullscreenMapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  fullscreenExitIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailsTextLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    width: "30%",
  },
  detailsText: {
    fontSize: 16,
    color: "#555",
    width: "70%",
    textAlign: "right",
  },
  detailsButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 5,
  },
});

export default HomeScreen;
