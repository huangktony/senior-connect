import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AssistantWeb from "../../components/AssistantWeb";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text} from "react-native";


export default function Chat() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <PaperProvider>
        <AssistantWeb></AssistantWeb>
      </PaperProvider>
    </SafeAreaView>
  );
}
