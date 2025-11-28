import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Board from "../../components/Board";
import { View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <PaperProvider>
        <Board />
      </PaperProvider>
    </View>
  );
}