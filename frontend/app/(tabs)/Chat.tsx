import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Board from "../../components/Board";

export default function Chat() {
  return (
    <PaperProvider>
      <Board />
    </PaperProvider>
  );
}
