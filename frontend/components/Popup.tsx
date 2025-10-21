import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ViewProps } from "react-native";

export default function Popup() {
    const [modalVisible, setModalVisible] = useState(false);

    const task = {
        title: "Edit Task",
        body: "Date:\nTime:\nLocation:\nCategory:",
    };

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.openButton} onPress={openModal}>
                <Text style={styles.openButtonText}>{task.title}</Text>
            </TouchableOpacity>
        
        <Modal
            animationType="fade" 
            visible={modalVisible} 
            transparent
            onRequestClose={closeModal}
        >

         <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <View style={styles.contentWrap}>
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.field}>Date:</Text>
                <Text style={styles.field}>Time:</Text>
                <Text style={styles.field}>Location:</Text>
                <Text style={styles.field}>Category:</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={closeModal}>
                    <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
  },

  openButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  openButtonText: { color: "#ffffff", fontWeight: "700" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  dialog: {
    width: "92%",
    maxWidth: 1000,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    maxHeight: "80%",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
    textAlign: "left",
  },
  modalText: {
    fontSize: 17,
    lineHeight: 24,
    color: "#222",
    marginBottom: 16,
    textAlign: "left",
  },

  actions: {
  marginTop: 16,
  alignSelf: "stretch",
  flexDirection: "row",
  justifyContent: "flex-end", // keeps Close on the right
  alignItems: "center",
},

  actionText: { color: "#007BFF", fontWeight: "700", fontSize: 16 },

contentWrap: {
  alignSelf: "stretch",       // use full row width
  alignItems: "flex-start",   // left-align children
},
  
field: {
  fontSize: 16,
  lineHeight: 24,
  textAlign: "left",
  color: "#333",
},

  modalContainer: { /* not used */ },
  modalContent: { /* not used */ },
  closeButton: { /* not used */ },
  closeButtonText: { /* not used */ },
});