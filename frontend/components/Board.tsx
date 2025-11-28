import React, { useCallback, useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import AddTask from "./AddTask";
import Popup from "./Popup";  // Add this import
import { Task, TaskInput } from "./types";
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const refreshTasks = useCallback(async (email?: string | null) => {
    const e = email ?? userEmail;
    if (!e) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/tasks/${encodeURIComponent(e)}`,
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
        await refreshTasks(email);

        const { getFirestore, doc, onSnapshot } = require("firebase/firestore");
        const db = getFirestore();

        metaUnsub = onSnapshot(
          doc(db, "tasksMeta", email),
          (snapshot: any) => {
            if (snapshot.exists()) {
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
    setTasks((prev) => [...prev, newTask]);
    setShowAddTask(false);
    await refreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask(null);
    await refreshTasks();
  };

  const handleEditTask = async (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => task.id === updatedTask.id ? updatedTask : task)
    );
    await refreshTasks();
  };

  const pendingTasks = tasks.filter(task => task.status.toLowerCase() === "pending");
  const acceptedTasks = tasks.filter(task => task.status.toLowerCase() === "accepted");
  const doneTasks = tasks.filter(task => task.status.toLowerCase() === "completed");

  const renderTaskCard = (task: Task) => (
    <TouchableOpacity 
      key={task.id} 
      style={styles.taskCard}
      onPress={() => setSelectedTask(task)}
    >
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDetails}>{task.date}</Text>
    </TouchableOpacity>
  );

  const renderTaskCircle = (task: Task) => (
    <TouchableOpacity 
      key={task.id} 
      style={styles.categoryCircle}
      onPress={() => setSelectedTask(task)}
    >
      <View style={styles.circle} />
      <Text style={styles.categoryLabel}>{task.category || 'Task'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/Group_5.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Create Task Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowAddTask(true)}
      >
        <Text style={styles.createButtonText}>Create A Task</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Current Task Postings (Pending) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Task Postings</Text>
        </View>
        {pendingTasks.length > 0 ? (
          pendingTasks.map(renderTaskCard)
        ) : (
          <Text style={styles.emptyText}>No pending tasks</Text>
        )}

        {/* In Progress (Accepted) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Progress</Text>
        </View>
        {acceptedTasks.length > 0 ? (
          acceptedTasks.map(renderTaskCard)
        ) : (
          <Text style={styles.emptyText}>No tasks in progress</Text>
        )}

        {/* Completed Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
        </View>
        {doneTasks.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {doneTasks.map(renderTaskCircle)}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No completed tasks</Text>
        )}
      </ScrollView>

      {/* Task Detail Popup */}
      {selectedTask && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTask.title}</Text>
            <Text style={styles.modalBody}>{selectedTask.body}</Text>
            <Text style={styles.modalDetails}>Date: {selectedTask.date}</Text>
            <Text style={styles.modalDetails}>Category: {selectedTask.category}</Text>
            <Text style={styles.modalDetails}>Status: {selectedTask.status}</Text>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedTask(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AddTask onAdd={handleAddTask} task={null} />
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAddTask(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C003E",
  },
  header: {
    backgroundColor: "#2C003E",
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 60,
  },
  createButton: {
    backgroundColor: "#F5F5F5",
    marginHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#2C003E",
    fontSize: 20,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  categoriesScroll: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  categoryCircle: {
    alignItems: "center",
    marginRight: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
  },
  categoryLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  taskCard: {
    backgroundColor: "#F5F5F5",
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C003E",
    marginBottom: 8,
  },
  taskDetails: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    opacity: 0.7,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C003E",
    marginBottom: 15,
  },
  modalBody: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    lineHeight: 24,
  },
  modalDetails: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2C003E",
    borderRadius: 30,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});