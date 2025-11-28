import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Alert, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from "react-native";
import AddTask from "./AddTask"; 
import Card from "./Card"; 
import Popup from "./Popup"; 
import { Task, TaskInput } from "./types";
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

// Helper component for separation
const HorizontalRule = () => <View style={styles.hr} />;

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false); // State for Add Task modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State for Task Detail Popup

  // Using useCallback for refreshTasks for dependency consistency
  const refreshTasks = useCallback(async (email?: string | null) => {
    const e = email ?? userEmail;
    if (!e) return;
    try {
      // NOTE: Using the API URL from the second component, but you should verify this is correct.
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
    // Simplified useEffect from the second component, but added cleanup
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email ?? null;
        setUserEmail(email);
        await refreshTasks(email);
      } else {
        setUserEmail(null);
        setTasks([]);
      }
    });
    return unsubscribe;
  }, [refreshTasks]); 

  const handleAddTask = async (newTask: TaskInput) => {
    // optimistic update
    setTasks((prev) => [...prev, newTask]);
    setShowAddTask(false); // Close modal on add
    await refreshTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    // optimistic remove
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask(null); // Close detail popup if open
    await refreshTasks();
  };

  const handleEditTask = async (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => task.id === updatedTask.id ? updatedTask : task)
    );
    // refresh to get authoritative server state
    await refreshTasks();
  };

  const pendingTasks = tasks.filter(task => task.status.toLowerCase() === "pending");
  const acceptedTasks = tasks.filter(task => task.status.toLowerCase() === "accepted");
  const doneTasks = tasks.filter(task => task.status.toLowerCase() === "completed");

  // Re-creating the Task Circle rendering for completed tasks (horizontal scroll)
  const renderTaskCircle = (task: Task) => (
    <TouchableOpacity 
      key={task.id} 
      style={styles.categoryCircle}
      onPress={() => setSelectedTask(task)} // Use the detail popup logic
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
          // Placeholder Image tag - replace with your actual image path
          source={require('../assets/images/Group_5.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <HorizontalRule />
      {/* Create Task Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setShowAddTask(true)}
      >
        <Text style={styles.createButtonText}>Create A Task</Text>
      </TouchableOpacity>
      <HorizontalRule />

      <ScrollView style={styles.scrollView}>
        {/* Current Task Postings (Pending) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Task Postings ({pendingTasks.length})</Text>
        </View>
        {pendingTasks.length > 0 ? (
          pendingTasks.map((task) => (
             <View key={task.id}> 
               <Card
                 id={task.id}
                 title={task.title}
                 body={task.body}
                 status={task.status}
                 date={task.date}
                 category={task.category}
                 volunteerID={task.volunteerID}
                 onEdit={handleEditTask}
                 onDelete={handleDeleteTask}
                 // The Card component's internal logic handles the onPress to open the Popup
               />
             </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No pending tasks</Text>
        )}
        <HorizontalRule />

        {/* In Progress (Accepted) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Progress ({acceptedTasks.length})</Text>
        </View>
        {acceptedTasks.length > 0 ? (
          acceptedTasks.map((task) => (
             <View key={task.id}>
               <Card
                 id={task.id}
                 title={task.title}
                 body={task.body}
                 status={task.status}
                 date={task.date}
                 category={task.category}
                 volunteerID={task.volunteerID}
                 onEdit={handleEditTask}
                 onDelete={handleDeleteTask}
               />
             </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No tasks in progress</Text>
        )}
        <HorizontalRule />

        {/* Completed Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed Tasks ({doneTasks.length})</Text>
        </View>
        {doneTasks.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {doneTasks.map(renderTaskCircle)}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No completed tasks</Text>
        )}
        <HorizontalRule />
      </ScrollView>

      {/* Task Detail Popup (Modal Overlay) - This is for consistency, though Card uses a Popup component */}
      {/* If your Card's Popup component is an overlay, you can remove this block. 
          Keeping it here as it was in the initial styled version. */}
      {selectedTask && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTask.title}</Text>
            <Text style={styles.modalBody}>{selectedTask.body}</Text>
            <Text style={styles.modalDetails}>Date: {selectedTask.date}</Text>
            <Text style={styles.modalDetails}>Category: {selectedTask.category || 'N/A'}</Text>
            <Text style={styles.modalDetails}>Status: {selectedTask.status}</Text>
            <Text style={styles.modalDetails}>Volunteer ID: {selectedTask.volunteerID || 'N/A'}</Text>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedTask(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Add Task Modal (Modal Overlay) */}
      {showAddTask && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* The AddTask component should handle its own form/inputs */}
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
    backgroundColor: "#2C003E", // Dark Purple Background
  },
  header: {
    backgroundColor: "#2C003E",
    paddingVertical: 20,
    alignItems: "center",
    paddingTop: 40, 
  },
  logo: {
    width: 180,
    height: 60,
  },
  hr: {
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  createButton: {
    backgroundColor: "#F5F5F5", // Light Gray Button
    marginHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
    backgroundColor: "#8B5CF6", // Violet Section Header
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  taskCount: { 
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 3,
    borderColor: '#fff',
  },
  categoryLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // These styles are for the Card's appearance/content if rendered inline
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
  // Modal Styles
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
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});