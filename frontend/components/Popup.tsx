import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Task } from "./types";

interface PopupProps extends Task {
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function Popup({ id, title, body, status, volunteerID, date, onClose, onSave, onDelete }: PopupProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [newDate, setNewDate] = useState(date);
  const [volunteerInfo, setVolunteerInfo] = useState<any>(null);
  const [loadingVolunteer, setLoadingVolunteer] = useState(false);

  useEffect(() => {
    async function fetchVolunteerInfo() {
      if ((status.toLowerCase() === "accepted" || status.toLowerCase() === "completed") && volunteerID) {
        setLoadingVolunteer(true);
        try {
          const res = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/users/${encodeURIComponent(volunteerID)}`, {
            method: "GET",
            headers: { "ngrok-skip-browser-warning": "69420" }
          });
          const data = await res.json();
          setVolunteerInfo(data);
        } catch {
          setVolunteerInfo(null);
        } finally {
          setLoadingVolunteer(false);
        }
      }
    }
    fetchVolunteerInfo();
  }, [volunteerID, status]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        }
      });
      if (!response.ok) throw new Error("Failed to delete task");
      if (onDelete) onDelete(id);
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "69420" },
        body: JSON.stringify({ title: newTitle, body: newBody, status: status, date: newDate }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      onSave({ id, title: newTitle, body: newBody, status: status, date: newDate, volunteerID });
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };


  const lowerStatus = status.toLowerCase();
  const isEditable = lowerStatus === "pending";
  const showVolunteer = true;
  
  return (
    <Modal transparent animationType="slide" visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Task Details</Text>

          {/* Editable for Pending, read-only for Accepted/Completed */}
          <TextInput
            style={styles.input}
            value={isEditable ? newTitle : title}
            onChangeText={isEditable ? setNewTitle : undefined}
            placeholder="Title"
            editable={isEditable}
          />
          <TextInput
            style={styles.input}
            value={isEditable ? newBody : body}
            onChangeText={isEditable ? setNewBody : undefined}
            placeholder="Description"
            editable={isEditable}
          />
          <TextInput
            style={styles.input}
            value={isEditable ? newDate : date}
            onChangeText={isEditable ? setNewDate : undefined}
            placeholder="Date"
            editable={isEditable}
          />

          <Text style={styles.pendingMsg}>{status}</Text>

          {/* Volunteer info for Accepted/Completed */}
          {(showVolunteer && status.toLowerCase() !== "pending") && (
            <View style={styles.volunteerBox}>
              <Text style={styles.volunteerHeader}>{status == "accepted" ? "Accepted by:" : "Completed by"}</Text>
              {loadingVolunteer ? (
                <ActivityIndicator size="small" />
              ) : volunteerInfo ? (
                <>
                  <Text style={styles.volunteerName}>{volunteerInfo.firstName} {volunteerInfo.lastName}</Text>
                  <Text>Email: {volunteerInfo.email}</Text>
                  <Text>Location: {volunteerInfo.latitude}, {volunteerInfo.longitude}</Text>
                </>
              ) : (
                <Text>Volunteer info not found.</Text>
              )}
            </View>
          )}

          {/* Pending: show message if no volunteer */}
          {isEditable && !volunteerID && (
            <Text style={styles.pendingMsg}>No volunteer has accepted yet.</Text>
          )}

          <View style={styles.buttons}>
            {isEditable && <Button title="Save" onPress={handleSave} />}
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
  statusText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  pendingMsg: {
    color: "#888",
    marginBottom: 10,
    fontStyle: "italic",
  },
  volunteerBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  volunteerHeader: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
