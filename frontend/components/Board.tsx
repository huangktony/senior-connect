import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Button, Alert } from "react-native";
import AddTask from "./AddTask";
import Card from "./Card";
import { Task, TaskInput } from "./types";
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect( () => {
    const fetchTasks = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const email = user.email || "";
            const response = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${encodeURIComponent(email)}`); //FIIIX THISS
            const data = await response.json();
            setTasks(data);
          } else {
            console.log("No user is currently signed in.");
          }
        });
      } catch(error : any) {
        Alert.alert('Something happend: ' + error.message);
      }
    }
    fetchTasks();
  }, [])

  const handleAddTask = (newTask: TaskInput) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleEditTask = (updatedTask: Task) => {
    console.log("Editing task:", updatedTask);
  setTasks(prev =>
    prev.map(task => {
      console.log("Comparing", task.id, updatedTask.id);
      return task.id === updatedTask.id ? updatedTask : task;
    })
  );
  };

  return (
    <View style={styles.container}>
      <AddTask onAdd={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            title={item.title}
            body={item.body}
            status={item.status}
            date={item.date}
            onEdit={handleEditTask}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f3f4f6",
  },
});
