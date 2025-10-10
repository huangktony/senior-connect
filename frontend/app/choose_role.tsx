// app/choose-role.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ChooseRole() {
  const router = useRouter();

  const pick = (role: "senior" | "volunteer" | "caregiver") => {
  router.push(`/roles/${role}`);

  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Who are you?</Text>

      <TouchableOpacity style={s.btn} onPress={() => pick("senior")}>
        <Text style={s.btnText}>I’m a Senior</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={() => pick("volunteer")}>
        <Text style={s.btnText}>I’m a Volunteer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={() => pick("caregiver")}>
        <Text style={s.btnText}>I’m a Caregiver</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 16, backgroundColor: "#b6d5ffff" },
  title: { color: "#000102ff", fontSize: 22, fontWeight: "700", marginBottom: 8 },
  btn: { width: "80%", backgroundColor: "#1d70e4ff", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "white", fontWeight: "700" },
});
