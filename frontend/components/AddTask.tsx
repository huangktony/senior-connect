import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function AddCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [createdCard, setCreatedCard] = useState<any>(null);

  const handleCreate = () => {
    if (!title || !description || !location || !requestedDate) {
      alert("Please fill out all fields before creating a card.");
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      title,
      description,
      location,
      requestedDate,
    };

    setCreatedCard(newCard);
    console.log("New card created:", newCard);

    // clear inputs
    setTitle("");
    setDescription("");
    setLocation("");
    setRequestedDate("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Card</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Requested Date"
        value={requestedDate}
        onChangeText={setRequestedDate}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>

      {createdCard && (
        <View style={styles.cardPreview}>
          <Text style={styles.previewHeader}>Created Card Object:</Text>
          <Text>{JSON.stringify(createdCard, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  cardPreview: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
  },
  previewHeader: { fontWeight: "bold", marginBottom: 5 },
});
