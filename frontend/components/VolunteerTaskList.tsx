import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import type { Task } from "./types";

type Props = {
  onSelectTask: (task: Task) => void;
};

// TODO: replace this with real data from backend
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Pick up groceries",
    body: "Please pick up milk and eggs from the grocery store.",
    status: "available",
    date: "2025-11-12T16:00:00Z",
    category: "Groceries",
    volunteerID: "",
    address: "1202 Random Street",
    startTime: "2025-11-12T16:00:00Z",
    endTime: "2025-11-12T19:00:00Z",
    elderName: "James John",
  },
  {
    id: "2",
    title: "Yard work",
    body: "Help rake leaves and tidy the front yard.",
    status: "available",
    date: "2025-11-13T18:00:00Z",
    category: "Gardening",
    volunteerID: "",
    address: "88 Maple Lane",
    startTime: "2025-11-13T18:00:00Z",
    endTime: "2025-11-13T20:00:00Z",
    elderName: "Mary Smith",
  },
];

const VolunteerTaskList: React.FC<Props> = ({ onSelectTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: fetch from backend instead of mockTasks
    setTasks(mockTasks);
  }, []);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* purple header with avatar + search bar */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>O</Text>
        </View>
        <TextInput
          placeholder="search for tasks..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>Popular Task Categories</Text>
      <View style={styles.categoriesRow}>
        <View style={styles.categoryBubble}>
          <Text style={styles.categoryText}>Groceries</Text>
        </View>
        <View style={styles.categoryBubble}>
          <Text style={styles.categoryText}>Electrical</Text>
        </View>
        <View style={styles.categoryBubble}>
          <Text style={styles.categoryText}>Gardening</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.tabTextActive]}>In Progress</Text>
        <Text style={styles.tabText}>Complete Now</Text>
      </View>
      <View style={styles.tabUnderline} />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => onSelectTask(item)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody} numberOfLines={2}>
              {item.body}
            </Text>
            <Text style={styles.cardMeta}>
              {new Date(item.date).toLocaleDateString()} ·{" "}
              {item.address ?? "Address TBD"}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default VolunteerTaskList;

const PURPLE = "#7a2a86";
const ORANGE = "#fcb045";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: PURPLE,
    paddingTop: 36,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoLetter: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  categoryBubble: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: ORANGE,
    alignItems: "center",
  },
  categoryText: {
    fontWeight: "500",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 4,
  },
  tabText: { fontSize: 14, color: "#777" },
  tabTextActive: { color: PURPLE, fontWeight: "600" },
  tabUnderline: {
    height: 3,
    width: "25%",
    marginLeft: 16,
    backgroundColor: ORANGE,
    borderRadius: 999,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardBody: { fontSize: 14, marginBottom: 8 },
  cardMeta: { fontSize: 12, color: "#666" },
});