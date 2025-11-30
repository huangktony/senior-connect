import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import VolunteerVerification from "../../components/VolunteerVerification";
import VolunteerScreen from "../../components/VolunteerScreen";

export default function ProfileTab() {
  const [verified, setVerified] = useState(false);

  return (
    <View style={styles.container}>
      {verified ? (
        // After verification → show main volunteer page
        <VolunteerScreen />
      ) : (
        // Before verification → show camera/ID flow
        <VolunteerVerification onDone={() => setVerified(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});