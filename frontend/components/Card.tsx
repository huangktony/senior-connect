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
  
  // Helper to determine background color for status pill
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return { background: '#ffc107', text: '#333' }; // Yellow
    if (s === "accepted") return { background: '#17a2b8', text: '#fff' }; // Blue (In Progress)
    if (s === "completed") return { background: '#28a745', text: '#fff' }; // Green
    return { background: '#ccc', text: '#333' };
  };

  const statusStyle = getStatusColor(status);

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity 
        onPress={() => setVisible(true)}
        style={styles.cardTouchArea} // Apply touch area padding
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{body.length > 50 ? `${body.substring(0, 50)}...` : body}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.category}>{category || 'N/A'}</Text>
        </View>

        <Text style={[styles.statusPill, { backgroundColor: statusStyle.background, color: statusStyle.text }]}>
          {status.toUpperCase()}
        </Text>
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
  // ** Based on styles.taskCard from Board **
  cardWrapper: {
    // Note: marginHorizontal is applied in the Board component when rendering this Card
    backgroundColor: "#F5F5F5", // Light Gray Card Background
    borderRadius: 20, // Rounded corners
    marginBottom: 15, // Space between cards
    marginHorizontal: 40, // Added margin here for standalone use, adjust if Board handles this
    
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  cardTouchArea: {
    padding: 20, // Inner padding for content
  },
  // ** Based on styles.taskTitle from Board **
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C003E", // Dark Purple Text
    marginBottom: 8,
  },
  // New style for the brief description
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  // ** Based on styles.taskDetails from Board **
  date: {
    fontSize: 14,
    color: "#666", // Gray detail text
    fontWeight: "600",
  },
  category: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  // New style for the status pill
  statusPill: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start', // Keeps the pill size to the text length
    marginTop: 5,
  }
});