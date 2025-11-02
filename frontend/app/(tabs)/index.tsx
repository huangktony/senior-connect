import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Board from "../../components/Board";



export default function App() {
  return (
      <PaperProvider>
        <Board />
      </PaperProvider>
  );
}
