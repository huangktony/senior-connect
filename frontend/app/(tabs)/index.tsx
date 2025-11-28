import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Board from "../../components/Board";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <PaperProvider>
        <Board />
      </PaperProvider>
    </SafeAreaView>
  );
}
