import React from "react";
import { SafeAreaView } from "react-native";
import AddCard from "../components/AddTask"; // adjust path if needed

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AddCard />
    </SafeAreaView>
  );
}
