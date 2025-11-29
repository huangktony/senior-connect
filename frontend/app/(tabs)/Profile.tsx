import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ElderProfile from "../../components/ElderProfile";
import { View } from "react-native";

export default function Profile() {
  return (
    <View style={{ flex: 1, backgroundColor: "#7B3B7A" }}>
      <PaperProvider>
        <ElderProfile />
      </PaperProvider>
    </View>
  );
}