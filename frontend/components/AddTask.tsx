import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, View, TextInput, Button } from "react-native";
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

export default function AddTask({ onAdd, task }: AddTaskProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [body, setBody] = useState(task?.body ?? "");
  const [date, setDate] = useState(task?.date ?? (new Date()).toString());
  const [category, setCategory] = useState("(Select category)");
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
    if (!title.trim()) return;
    try {
    
    const response = await fetch("https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420',
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
      })});
      setTitle("");
      setBody("");
      setDate("");
      const data = await response.json();
      onAdd({ id: data.id, title, body, date, status: "Pending" , volunteerID: data.volunteerID, category});
    } catch(error : any) {
            Alert.alert('Something happend: ' + error.message);
      }
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor='black'
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor='black'
        placeholder="Task Description"
        value={body}
        onChangeText={setBody}
      />
      <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Errands" value="Errands" />
            <Picker.Item label="Electronics" value="Electronics" />
            <Picker.Item label="Chores" value="Chores" />
            <Picker.Item label="Events" value="Events" />
      </Picker>
      <DateTimePicker
        value={new Date()}
        onChange={(jDate: Date) => setDate(jDate.toString())}
      />
      <Button title="Add Task" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: 'black',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: 'black',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  }
});
