import React, { useCallback, useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Button, Alert, Text, ScrollView } from "react-native";
import AddTask from "./AddTask";
import Card from "./Card";
import { Task, TaskInput } from "./types";
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const refreshTasks = useCallback(async (email?: string | null) => {
  const e = email ?? userEmail;
  if (!e) return;

  try {
    const response = await fetch(
      `https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${encodeURIComponent(e)}`,
      {
        method: "GET",
        headers: new Headers({ "ngrok-skip-browser-warning": "69420" }),
      }
    );

    const data = await response.json();
    const normalized = data.map((t: any) => ({
      ...t,
      status: (t.status || "").toString(),
    }));

    setTasks(normalized);
  } catch (error: any) {
    Alert.alert("Something happened: " + (error.message || error));
  }
}, [userEmail]);


useEffect(() => {
  let authUnsub: any;
  let metaUnsub: any;

  authUnsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const email = user.email ?? null;
      setUserEmail(email);

      // initial load
      await refreshTasks(email);

      // real-time subscription to Firestore metadata
      const { getFirestore, doc, onSnapshot } = require("firebase/firestore");
      const db = getFirestore();

      metaUnsub = onSnapshot(
        doc(db, "tasksMeta", email),
        (snapshot: any) => {
          if (snapshot.exists()) {
            // metadata changed → tasks updated → refresh
            refreshTasks(email);
          }
        }
      );
    } else {
      setUserEmail(null);
      setTasks([]);
      if (metaUnsub) metaUnsub();
    }
  });

  return () => {
    if (authUnsub) authUnsub();
    if (metaUnsub) metaUnsub();
  };
}, [refreshTasks]);

  const handleAddTask = async (newTask: TaskInput) => {
    // optimistic update
    setTasks((prev) => [...prev, newTask]);
    // refresh from server to ensure authoritative state (will noop if userEmail missing)
    await refreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    // optimistic remove
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    // refresh from server
    await refreshTasks();
  };

  const handleEditTask = async (updatedTask: Task) => {
    console.log("Editing task:", updatedTask);
    setTasks((prev) =>
      prev.map((task) => {
        console.log("Comparing", task.id, updatedTask.id);
        return task.id === updatedTask.id ? updatedTask : task;
      })
    );
    // refresh to get authoritative server state
    await refreshTasks();
  };

  const pendingTasks = tasks.filter(task => task.status.toLowerCase() === "pending");
  const acceptedTasks = tasks.filter(task => task.status.toLowerCase() === "accepted");
  const doneTasks = tasks.filter(task => task.status.toLowerCase() === "completed");

  const renderTaskList = (sectionTasks: Task[], sectionTitle: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <Text style={styles.taskCount}>{sectionTasks.length}</Text>
      </View>
      <FlatList
        data={sectionTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            title={item.title}
            body={item.body}
            status={item.status}
            date={item.date}
            volunteerID={item.volunteerID}
            category={item.category}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <AddTask
        onAdd={handleAddTask} 
        task={null}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderTaskList(pendingTasks, "Pending Tasks")}
        {renderTaskList(acceptedTasks, "Accepted Tasks")}
        {renderTaskList(doneTasks, "Completed Tasks")}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContainer: {
    padding: 12,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
  },
  taskCount: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    color: '#4b5563',
    fontSize: 14,
  },
});
