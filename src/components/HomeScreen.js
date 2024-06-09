import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  // State to manage
  const [refreshing, setRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  //useEffect
  useEffect(() => {
    setRegion({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setLoading(false);
  }, []);

  // Render
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
            <Text style={styles.infoText}>5</Text>
            <Text style={styles.infoLabel}>Khu vực hoạt động</Text>
          </View>
          <View style={[styles.infoBox, styles.infoBoxGreen]}>
            <Text style={styles.infoText}>4</Text>
            <Text style={styles.infoLabel}>Áo đang hoạt động</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={[styles.infoBox, styles.infoBoxOrange]}>
            <Text style={styles.infoText}>1</Text>
            <Text style={styles.infoLabel}>Cảnh báo</Text>
          </View>
          <View style={[styles.infoBox, styles.infoBoxRed]}>
            <Text style={styles.infoText}>1</Text>
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
          />
        </View>
      </ScrollView>

      {/* Fullscreen Map Modal */}
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
            />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default HomeScreen;
