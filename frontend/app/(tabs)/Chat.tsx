import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Assistant from "../../components/Assistant";
import {Text} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


export default function Chat() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <PaperProvider>
        <Text>Hi</Text>
      </PaperProvider>
    </SafeAreaView>
  );
}
