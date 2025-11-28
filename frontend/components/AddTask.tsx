import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, View, TextInput, Button, Platform } from "react-native";
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import DateTimePicker from './DateTimePicker';
import { Picker } from '@react-native-picker/picker';

interface TaskInput {
  id: string;
  title: string;
  body: string;
  date: string;
  status: string;
  volunteerID: string;
  category: string;
}

interface AddTaskProps {
  onAdd: (task: TaskInput) => void;
  task: TaskInput | null;
}

// Define the new color palette
const COLORS = {
  primary: '#4CAF50', // A fresh green for the main action/buttons
  secondary: '#FF9800', // An orange accent color
  background: '#F4F7F9', // Light, airy background
  card: '#FFFFFF', // White for cards/containers
  text: '#37474F', // Dark, readable text
  border: '#CFD8DC', // Light gray border
  placeholder: '#90A4AE', // Muted color for placeholders
};

export default function AddTask({ onAdd, task }: AddTaskProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [body, setBody] = useState(task?.body ?? "");
  const [date, setDate] = useState(task?.date ?? (new Date()).toString());
  const [category, setCategory] = useState("Select category"); // Changed initial value
  const [userEmail, setUserEmail] = useState<String | null>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  });

  const handleSubmit = async () => {
    if (!title.trim() || category === "Select category") {
      Alert.alert('Missing Info', 'Please provide a task title and select a category.');
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/tasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "body": body,
          "date": date,
          "elderID": userEmail,
          "status": "pending",
          "title": title,
          "category": category,
          "latitude": 0,
          "longitude": 0
        })
      });
      
      const data = await response.json();
      onAdd({ id: data.id, title, body, date, status: "Pending", volunteerID: data.volunteerID, category });

      // Clear the form fields after successful submission
      setTitle("");
      setBody("");
      setDate((new Date()).toString());
      setCategory("Select category");

    } catch (error: any) {
      Alert.alert('Error Submitting Task', 'Something happened: ' + error.message);
    }
  }
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.placeholder}
        placeholder="Task Title (e.g., Pick up groceries)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholderTextColor={COLORS.placeholder}
        placeholder="Task Description (Details about the task)"
        value={body}
        onChangeText={setBody}
        multiline={true}
        numberOfLines={4}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Select category" value="Select category" color={COLORS.placeholder} />
          <Picker.Item label="Errands" value="Errands" color={COLORS.text} />
          <Picker.Item label="Electronics" value="Electronics" color={COLORS.text} />
          <Picker.Item label="Chores" value="Chores" color={COLORS.text} />
          <Picker.Item label="Events" value="Events" color={COLORS.text} />
        </Picker>
      </View>
      
      <View style={styles.datePickerWrapper}>
        <DateTimePicker
          value={new Date(date)}
          onChange={(jDate: Date) => setDate(jDate.toString())}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button 
          title="Add Task" 
          onPress={handleSubmit} 
          color={COLORS.primary} // Use the primary color for the button
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: COLORS.card,
    borderRadius: 12, // More rounded corners
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: COLORS.background, // Light background for input fields
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top', // Ensures text starts at the top on Android
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden', // Ensures picker boundary respects border radius
    backgroundColor: COLORS.background,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50, // Standard height for Android, better visibility for iOS
    width: '100%',
    color: COLORS.text,
  },
  pickerItem: {
    // Styling for Picker items (mostly controlled by OS on mobile)
    fontSize: 16,
    height: Platform.OS === 'ios' ? 150 : undefined,
  },
  datePickerWrapper: {
    marginBottom: 15,
    // Add styling specific to the DateTimePicker wrapper if needed
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden', // Ensures button background color adheres to border radius
  }
});