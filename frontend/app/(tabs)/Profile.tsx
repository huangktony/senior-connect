import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ElderProfile from "../../components/ElderProfile";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <PaperProvider>
        <ElderProfile />
      </PaperProvider>
    </SafeAreaView>
  );
}
