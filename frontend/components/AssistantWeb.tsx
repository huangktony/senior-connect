import { Platform } from "react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AssistantNative =
  Platform.OS !== "web" ? require("./Assistant").default : null;

export default function AssistantWeb() {
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ask our AI Assistant for Help</Text>
        <Text style={styles.message}>
          Speech recognition is currently not available on the web platform.
          Please use this feature on iOS or Android devices.
        </Text>
      </View>
    );
  }

  return <AssistantNative />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 90,
  },
  title: {
    fontSize: 24,
    color: "#3250e6ff",
    fontWeight: "600",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});