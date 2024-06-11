import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const DetailModal = ({ visible, onClose, selectedFloor }) => {
  const constrainPosition = (position, imageWidth, imageHeight) => {
    const constrainedX = Math.max(0, Math.min(position.x, imageWidth - 32)); // 32 is the icon size
    const constrainedY = Math.max(0, Math.min(position.y, imageHeight - 32));
    return { x: constrainedX, y: constrainedY };
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFloor && (
              <>
                <Text style={styles.detailText}>{selectedFloor.name}</Text>
                <View style={styles.imageContainer}>
                  <Image source={selectedFloor.image} style={styles.image} resizeMode="contain" />
                  {selectedFloor.icons.map((icon, index) => {
                    const constrainedPosition = constrainPosition(
                      icon.position,
                      Dimensions.get('window').width * 0.8,
                      Dimensions.get('window').height * 0.5
                    );
                    return (
                      <FontAwesome
                        key={index}
                        name="user"
                        size={32}
                        color={icon.color}
                        style={[
                          styles.icon,
                          {
                            top: constrainedPosition.y,
                            left: constrainedPosition.x,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default DetailModal;
