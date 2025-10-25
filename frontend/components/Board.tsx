import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AddTask from "./AddTask";
import Card from "./Card";
import { Task, TaskInput } from "./types";

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Buy groceries", body: "Milk, Eggs, Bread", status: "Pending" },
    { id: "2", title: "Call doctor", body: "Schedule appointment", status: "Done" },
  ]);

  const handleAddTask = (newTask: TaskInput) => {
    setTasks((prev) => [...prev, { ...newTask, id: Date.now().toString() }]);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
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
