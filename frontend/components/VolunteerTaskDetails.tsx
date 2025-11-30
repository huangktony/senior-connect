import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import type { Task } from "./types";

type Props = {
  task: Task;
  onBack: () => void;
  onAccept: (task: Task) => void;
};

const PURPLE = "#7a2a86";
const ORANGE = "#fcb045";

const VolunteerTaskDetail: React.FC<Props> = ({ task, onBack, onAccept }) => {
  const start = task.startTime ? new Date(task.startTime) : new Date(task.date);
  const end = task.endTime ? new Date(task.endTime) : undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>O</Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
        </View>

        <Text style={styles.subtitle}>Complete task</Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>{task.body}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>
            {start.toLocaleDateString()}
          </Text>

          <Text style={[styles.metaLabel, { marginTop: 8 }]}>Time</Text>
          <Text style={styles.metaValue}>
            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {end
              ? ` - ${end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : ""}
          </Text>

          <Text style={[styles.metaLabel, { marginTop: 8 }]}>Location</Text>
          <Text style={styles.metaValue}>
            {task.address ?? "Address to be shared"}
          </Text>

          <Text style={[styles.metaLabel, { marginTop: 8 }]}>Elder</Text>
          <Text style={styles.metaValue}>
            {task.elderName ?? "Assigned elder"}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.acceptButton}
          onPress={() => onAccept(task)}
        >
          <Text style={styles.acceptText}>Accept Task</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VolunteerTaskDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { padding: 16, paddingBottom: 120 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoLetter: { color: "white", fontWeight: "700", fontSize: 18 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 16, marginVertical: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardText: { fontSize: 14 },
  metaLabel: { fontSize: 13, color: "#777" },
  metaValue: { fontSize: 14, fontWeight: "500" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: PURPLE,
  },
  acceptButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: ORANGE,
  },
  backText: { color: "white", fontWeight: "600" },
  acceptText: { color: "white", fontWeight: "600" },
});