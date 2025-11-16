import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Popup from "./Popup";
import { Task } from "./types";

interface CardProps extends Omit<Task, "body"> {
  body: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function Card({ id, title, body, status, date, category, onEdit, onDelete, volunteerID }: CardProps) {
  const [visible, setVisible] = useState(false);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.status}>Status: {status}</Text>
        <Text style={styles.description}>{body}</Text>
      </TouchableOpacity>

      {visible && (
        <Popup
          id={id}
          title={title}
          body={body}
          status={status}
          date={date}
          volunteerID={volunteerID}
          category={category}
          onClose={() => setVisible(false)}
          onDelete={onDelete}
          onSave={(updatedTask) => {
            onEdit(updatedTask);
            setVisible(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    color: "#666",
    marginBottom: 4,
  },
  description: {
    color: "#444",
  },
});
