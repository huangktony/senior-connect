import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Board from "../../components/Board";

export default function BoardPage() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fullScreen}>
          <Board />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  fullScreen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
