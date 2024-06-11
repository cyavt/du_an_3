import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Modal, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DetailModal from './DetailModal';

const initialFloors = [
  {
    id: '1',
    name: 'Tầng 1',
    image: require('../../assets/nha2d.png'),
    icons: [
      { position: { x: 50, y: 0 }, color: 'red' },
      { position: { x: 120, y: 200 }, color: 'blue' },
    ],
  },
  {
    id: '2',
    name: 'Tầng 2',
    image: require('../../assets/nha2d.png'),
    icons: [
      { position: { x: 140, y: 250 }, color: 'green' },
      { position: { x: 160, y: 300 }, color: 'orange' },
    ],
  },
  {
    id: '3',
    name: 'Tầng 3',
    image: require('../../assets/nha2d.png'),
    icons: [
      { position: { x: 180, y: 350 }, color: 'purple' },
      { position: { x: 200, y: 400 }, color: 'yellow' },
    ],
  },
  {
    id: '4',
    name: 'Tầng 4',
    image: require('../../assets/nha2d.png'),
    icons: [
      { position: { x: 220, y: 450 }, color: 'cyan' },
      { position: { x: 240, y: 500 }, color: 'magenta' },
    ],
  },
  {
    id: '5',
    name: 'Tầng 5',
    image: require('../../assets/nha2d.png'),
    icons: [
      { position: { x: 260, y: 550 }, color: 'brown' },
      { position: { x: 280, y: 600 }, color: 'black' },
    ],
  },
];

const AreaBuid = () => {
  const [floors, setFloors] = useState(initialFloors);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const closeModal = () => {
    setSelectedFloor(null);
  };

  const constrainPosition = (position, imageWidth, imageHeight) => {
    const constrainedX = Math.max(0, Math.min(position.x, imageWidth - 32)); // 32 is the icon size
    const constrainedY = Math.max(0, Math.min(position.y, imageHeight - 32));
    return { x: constrainedX, y: constrainedY };
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Giả sử bạn đang tải lại dữ liệu từ một nguồn nào đó
    setTimeout(() => {
      setFloors([
        {
          id: '1',
          name: 'Tầng 1',
          image: require('../../assets/nha2d.png'),
          icons: [
            { position: { x: 0, y: 0 }, color: 'red' },
            { position: { x: 120, y: 200 }, color: 'blue' },
          ],
        },
        {
          id: '2',
          name: 'Tầng 2',
          image: require('../../assets/nha2d.png'),
          icons: [
            { position: { x: 140, y: 250 }, color: 'green' },
            { position: { x: 160, y: 300 }, color: 'orange' },
          ],
        },
        {
          id: '3',
          name: 'Tầng 3',
          image: require('../../assets/nha2d.png'),
          icons: [
            { position: { x: 180, y: 350 }, color: 'purple' },
            { position: { x: 200, y: 400 }, color: 'yellow' },
          ],
        },
        {
          id: '4',
          name: 'Tầng 4',
          image: require('../../assets/nha2d.png'),
          icons: [
            { position: { x: 220, y: 450 }, color: 'cyan' },
            { position: { x: 240, y: 500 }, color: 'magenta' },
          ],
        },
        {
          id: '5',
          name: 'Tầng 5',
          image: require('../../assets/nha2d.png'),
          icons: [
            { position: { x: 260, y: 550 }, color: 'brown' },
            { position: { x: 280, y: 600 }, color: 'black' },
          ],
        },
      ]);
      setRefreshing(false);
    }, 2000); // Giả sử tải lại dữ liệu mất 2 giây
  }, []);

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <Text style={styles.headerText}>Hiển thị số tầng trong tòa nhà</Text>
      <FlatList
        data={floors}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.floorContainer} onPress={() => setSelectedFloor(item)}>
            <MaterialIcons name="location-city" size={32} color="white" />
            <Text style={styles.floorText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <DetailModal visible={!!selectedFloor} onClose={closeModal} selectedFloor={selectedFloor} />
    
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    fontFamily: 'sans-serif',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  floorContainer: {
    width: '100%',
    padding: 20,
    marginVertical: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorText: {
    fontSize: 24,
    marginLeft: 15,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    position: 'absolute',
  },
});

export default AreaBuid;
