import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import VolunteerTaskList from "./VolunteerTaskList";
import VolunteerTaskDetails from "./VolunteerTaskDetails";
import VolunteerCompleteTask from "./VolunteerCompleteTask";
import type { Task } from "./types";

const VolunteerScreen: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [mode, setMode] = useState<"list" | "detail" | "complete">("list");

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setMode("detail");
  };

  const handleAccept = async (task: Task) => {
    // TODO: call backend to mark task as accepted
    // await api.acceptTask(task.id);
    setMode("complete");
  };

  const handleSubmitCompletion = async (payload: {
    task: Task;
    photoNote?: string;
    receiptNote?: string;
    comments?: string;
  }) => {
    // TODO: call backend to complete task
    // await api.completeTask(payload);
    console.log("Task completed:", payload);
    setSelectedTask(null);
    setMode("list");
  };

  return (
    <View style={styles.root}>
      {mode === "list" && (
        <VolunteerTaskList onSelectTask={handleSelectTask} />
      )}

      {mode === "detail" && selectedTask && (
        <VolunteerTaskDetails
          task={selectedTask}
          onBack={() => setMode("list")}
          onAccept={handleAccept}
        />
      )}

      {mode === "complete" && selectedTask && (
        <VolunteerCompleteTask
          task={selectedTask}
          onBackToTask={() => setMode("detail")}
          onSubmitCompletion={handleSubmitCompletion}
        />
      )}
    </View>
  );
};

export default VolunteerScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
});