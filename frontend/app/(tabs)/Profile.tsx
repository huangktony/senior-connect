import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Board from "../../components/Board";

export default function Profile() {
  return (
    <PaperProvider>
      <Board />
    </PaperProvider>
  );
}
