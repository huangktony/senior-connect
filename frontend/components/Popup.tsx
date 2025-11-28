import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Task } from "./types";
import DateTimePickerField from "./DateTimePicker";
import { Picker } from '@react-native-picker/picker';

// Define the new color palette for consistency
const COLORS = {
  primary: '#4CAF50', // Green for Save/Primary action
  danger: '#FF3B30', // Red for Delete
  secondary: '#FF9800', // Orange accent (not used here, but available)
  background: '#F0F4F7', // Light gray/blue for muted backgrounds
  card: '#FFFFFF', // White for the modal container
  text: '#37474F', // Dark, readable text
  border: '#DCE0E3', // Soft gray border
  placeholder: '#90A4AE', // Muted color for placeholders
  accepted: '#2196F3', // Blue for Accepted status
  completed: '#4CAF50', // Green for Completed status
  pending: '#FF9800', // Orange for Pending status
  gray: '#9E9E9E', // Gray for Cancel button
};

interface PopupProps extends Task {
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function Popup({ id, title, body, status, volunteerID, date, category, onClose, onSave, onDelete }: PopupProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [newDate, setNewDate] = useState(date);
  const [newCategory, setNewCategory] = useState(category);
  const [volunteerInfo, setVolunteerInfo] = useState<any>(null);
  const [loadingVolunteer, setLoadingVolunteer] = useState(false);

  useEffect(() => {
    async function fetchVolunteerInfo() {
      if ((status.toLowerCase() === "accepted" || status.toLowerCase() === "completed") && volunteerID) {
        setLoadingVolunteer(true);
        try {
          const res = await fetch(`http://127.0.0.1:5000/users/${encodeURIComponent(volunteerID)}`, {
            method: "GET"
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
      const response = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
      const response = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ title: newTitle, body: newBody, status: status, date: newDate, category: newCategory}),
      });
      if (!response.ok) throw new Error("Failed to update task");
      onSave({ id, title: newTitle, body: newBody, status: status, date: newDate, volunteerID, category: newCategory});
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };


  const lowerStatus = status.toLowerCase();
  const isEditable = lowerStatus === "pending";
  const showVolunteer = true;

  const getStatusStyle = () => {
    switch(lowerStatus) {
      case 'accepted':
        return { backgroundColor: COLORS.accepted, color: COLORS.card };
      case 'completed':
        return { backgroundColor: COLORS.completed, color: COLORS.card };
      case 'pending':
      default:
        return { backgroundColor: COLORS.pending, color: COLORS.card };
    }
  };

  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Task Details</Text>

          <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text style={styles.statusText}>{status.toUpperCase()}</Text>
          </View>

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, !isEditable && styles.readOnlyInput]}
            value={isEditable ? newTitle : title}
            onChangeText={isEditable ? setNewTitle : undefined}
            placeholder="Task Title"
            editable={isEditable}
            placeholderTextColor={COLORS.placeholder}
          />
          
          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, !isEditable && styles.readOnlyInput]}
            value={isEditable ? newBody : body}
            onChangeText={isEditable ? setNewBody : undefined}
            placeholder="Task Description"
            editable={isEditable}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={COLORS.placeholder}
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          {isEditable ? (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={newCategory}
                onValueChange={(itemValue) => setNewCategory(itemValue)}
                style={styles.picker}
                itemStyle={{ color: COLORS.text }}
              >
                  <Picker.Item label="Errands" value="Errands" />
                  <Picker.Item label="Electronics" value="Electronics" />
                  <Picker.Item label="Chores" value="Chores" />
                  <Picker.Item label="Events" value="Events" />
              </Picker>
            </View>
          ) : (
             <Text style={[styles.readOnlyInput, styles.readOnlyText]}>{category}</Text>
          )}
          
          {/* Date Picker */}
          <Text style={styles.label}>Due Date</Text>
          <View style={styles.datePickerWrapper}>
            <DateTimePickerField
              value={new Date(date)}
              onChange={(jDate: Date) => {
                setNewDate(jDate.toString());
              }}
            />
          </View>
          
          {/* Volunteer info for Accepted/Completed */}
          {(showVolunteer && status.toLowerCase() !== "pending") && (
            <View style={styles.volunteerBox}>
              <Text style={styles.volunteerHeader}>{status.toLowerCase() === "accepted" ? "Accepted by:" : "Completed by:"}</Text>
              {loadingVolunteer ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : volunteerInfo ? (
                <>
                  <Text style={styles.volunteerName}>{volunteerInfo.firstName} {volunteerInfo.lastName}</Text>
                  <Text style={styles.volunteerDetail}>Email: {volunteerInfo.email}</Text>
                  <Text style={styles.volunteerDetail}>Phone: {volunteerInfo.phoneNumber}</Text>
                </>
              ) : (
                <Text style={styles.volunteerDetail}>Volunteer info not found or task is pending acceptance.</Text>
              )}
            </View>
          )}

          <View style={styles.buttons}>
            {isEditable && (
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay for better focus
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%", // Slightly smaller width
    height: "95%",
    maxWidth: 380, // Slightly smaller max width
    backgroundColor: COLORS.card,
    borderRadius: 15, // Increased border radius
    padding: 20, // Reduced padding
    elevation: 10,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: COLORS.background, // Light background for inputs
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 16,
    color: COLORS.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  datePickerWrapper: {
    marginBottom: 15,
    // Style wrapper if needed to distinguish the date picker area
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  statusText: {
    fontWeight: "bold",
    color: COLORS.card,
    fontSize: 12,
  },
  volunteerBox: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accepted, // Use a primary color for emphasis
  },
  volunteerHeader: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 6,
    color: COLORS.text,
  },
  volunteerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  volunteerDetail: {
    fontSize: 14,
    color: COLORS.text,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.card,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
});