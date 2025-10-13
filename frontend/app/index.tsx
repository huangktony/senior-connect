// app/index.tsx
import { View, Button } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center", gap:12 }}>
      <Button title="Volunteer Login" onPress={() => router.push("/volunteer_login")} />
      <Button title="Create Volunteer Account" onPress={() => router.push("/volunteer_account_creator")} />
    </View>
  );
}
