import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

// 👇 Define a type for the task (same structure as in Board)
interface TaskInput {
  title: string;
  body: string;
  status: string;
}

// 👇 Define what props AddTask expects
interface AddTaskProps {
  onAdd: (task: TaskInput) => void;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title, body, status: "Pending" });
    setTitle("");
    setBody("");
  };

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
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
});
