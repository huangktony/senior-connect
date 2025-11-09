import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { Task } from "./types";

interface PopupProps extends Task {
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function Popup({ id, title, body, status, date, onClose, onSave, onDelete }: PopupProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [newStatus, setNewStatus] = useState(status);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [newDate, setNewDate] = useState(date);
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      if (onDelete) {
        onDelete(id);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          status: newStatus,
          date: newDate,
        }),
      });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    onSave({
      id,
      title: newTitle,
      body: newBody,
      status: newStatus,
      date: newDate
    });

    onClose();
  } catch (error) {
    console.error("Error updating task:", error);
  }
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

          <TextInput
            style={styles.input}
            value={newDate}
            onChangeText={setNewDate}
            placeholder="Date"
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
              {["Pending", "Accepted", "Completed"].map((option) => (
                <TouchableOpacity key={option} onPress={() => handleSelect(option)}>
                  <Text style={styles.option}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.buttons}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={onClose} color="gray" />
            <Button title="Delete" onPress={handleDelete} color="red" />
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
