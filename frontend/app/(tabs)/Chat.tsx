import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Assistant from "../../components/Assistant";

export default function Chat() {
  return (
    <PaperProvider>
      <Assistant />
    </PaperProvider>
  );
}
