import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { Task } from "./types";

interface PopupProps extends Task {
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function Popup({ id, title, body, status, onClose, onSave }: PopupProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [newStatus, setNewStatus] = useState(status);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSave = () => {
    onSave({ id, title: newTitle, body: newBody, status: newStatus });
  };

  const handleSelect = (option: string) => {
    setNewStatus(option);
    setDropdownVisible(false);
  };

  return (
    <Modal transparent animationType="slide" visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Edit Task</Text>

          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Title"
          />

          <TextInput
            style={styles.input}
            value={newBody}
            onChangeText={setNewBody}
            placeholder="Description"
          />

          {/* Dropdown trigger */}
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            style={[styles.input, styles.dropdownTrigger]}
          >
            <Text>{newStatus || "Select Status"}</Text>
          </TouchableOpacity>

          {/* Dropdown menu */}
          {dropdownVisible && (
            <View style={styles.dropdown}>
              {["Pending", "In Progress", "Done"].map((option) => (
                <TouchableOpacity key={option} onPress={() => handleSelect(option)}>
                  <Text style={styles.option}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.buttons}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  dropdownTrigger: {
    justifyContent: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
});
