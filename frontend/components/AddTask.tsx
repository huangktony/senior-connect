import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, View, TextInput, Button } from "react-native";
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// 👇 Define a type for the task (same structure as in Board)
interface TaskInput {
  id: string;
  title: string;
  body: string;
  date: string;
  status: string;
  volunteerID: string;
}

// 👇 Define what props AddTask expects
interface AddTaskProps {
  onAdd: (task: TaskInput) => void;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
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
        "category": "something",
        "latitude": 0,
        "longitude": 0
      })});
      setTitle("");
      setBody("");
      setDate("");
      const data = await response.json();
      onAdd({ id: data.id, title, body, date, status: "Pending" , volunteerID: data.volunteerID});
    } catch(error : any) {
            Alert.alert('Something happend: ' + error.message);
      }
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={body}
        onChangeText={setBody}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Date"
        value={date}
        onChangeText={setDate}
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
    color: "#000",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
});
