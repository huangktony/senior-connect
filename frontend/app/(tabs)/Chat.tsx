import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Assistant from "../../components/Assistant";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text} from "react-native";


export default function Chat() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <PaperProvider>
        <Assistant></Assistant>
      </PaperProvider>
    </SafeAreaView>
  );
}
