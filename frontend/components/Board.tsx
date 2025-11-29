import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddTask from "./AddTask";
import Popup from "./Popup";
import { Task, TaskInput } from "./types";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const refreshTasks = useCallback(
    async (email?: string | null) => {
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
    },
    [userEmail]
  );

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
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    await refreshTasks();
  };

  // Filter tasks based on active tab
  const activeTasks = tasks.filter(
    (task) =>
      task.status.toLowerCase() === "pending" ||
      task.status.toLowerCase() === "accepted"
  );
  const historyTasks = tasks.filter(
    (task) => task.status.toLowerCase() === "completed"
  );

  const displayedTasks = activeTab === "active" ? activeTasks : historyTasks;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      Shopping: "cart-outline",
      Transportation: "car-outline",
      "Home Help": "home-outline",
      Technology: "phone-portrait-outline",
      Companionship: "people-outline",
      Other: "ellipsis-horizontal-circle-outline",
      // Keep old ones for backward compatibility
      Errands: "cart-outline",
      Electronics: "phone-portrait-outline",
      Chores: "hammer-outline",
      Events: "calendar-outline",
    };
    return icons[category] || "list-outline";
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "#FF9500";
    if (statusLower === "accepted") return "#34C759";
    if (statusLower === "completed") return "#8E8E93";
    return "#FF9500";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderTaskCard = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => setSelectedTask(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.body}</Text>

        <View style={styles.taskMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{formatTime(item.date)}</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      />
    </TouchableOpacity>
  );

  // If showing AddTask, render it full screen (AFTER all hooks)
  if (showAddTask) {
    return (
      <View style={{ flex: 1 }}>
        <AddTask 
          onAdd={(task) => {
            handleAddTask(task);
            setShowAddTask(false);
          }} 
          task={null}
          onClose={() => setShowAddTask(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Avatar and Tabs */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "active" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("active")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "active" && styles.activeTabText,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "history" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.activeTabText,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={displayedTasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {activeTab === "active"
                ? "No active tasks"
                : "No completed tasks"}
            </Text>
          </View>
        }
      />

      {/* Request Volunteer Button (shown only on active tab) */}
      {activeTab === "active" && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => setShowAddTask(true)}
          >
            <Text style={styles.requestButtonText}>Request Volunteer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task Detail Popup */}
      {selectedTask && (
        <Popup
          id={selectedTask.id}
          title={selectedTask.title}
          body={selectedTask.body}
          status={selectedTask.status}
          date={selectedTask.date}
          category={selectedTask.category}
          volunteerID={selectedTask.volunteerID}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          onSave={handleEditTask}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingBottom: 70, // Account for tab bar
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  avatarContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FF9500",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
  },
  activeTabText: {
    color: "#000",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    flexDirection: "row",
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  taskMeta: {
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  statusIndicator: {
    width: 12,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
  },
  requestButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
});