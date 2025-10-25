import React from "react";
import { SafeAreaView } from "react-native";
import AddCard from "../../components/AddTask"; // adjust path if needed
import Card from "../../components/Card";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <AddCard />
      </SafeAreaView>
      <Card title="Ffr" body="Frfr" status="frfr"></Card>
    </ScrollView>
  );
}
