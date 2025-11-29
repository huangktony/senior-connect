import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AssistantWeb from "../../components/AssistantWeb";
import { View } from "react-native";

export default function Chat() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <PaperProvider>
        <AssistantWeb />
      </PaperProvider>
    </View>
  );
}