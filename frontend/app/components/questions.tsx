import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface QuestionProps {
  question: string;
  emptyText: string;
  value: string;
  onChange: (text: string) => void;
  id: string | number;
}

export default function Question({
  question,
  emptyText,
  value,
  onChange,
  id,
}: QuestionProps) {
  return (
    <View style={styles.container} key={id}>
      <Text style={styles.label}>{question}</Text>
      <TextInput
        style={styles.input}
        placeholder={emptyText}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
