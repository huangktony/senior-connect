import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

const help_options = [
    "Grocery Pickup",
    "Meal Prep",
    "Household Chores",
    "Yard Work",
    "Car Rides",
    "Tech Help",
    "Other"
];

export default function SeniorOnboarding() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [showPw, setShowPw] = useState<boolean>(false);
    
    const toggle = (item: string) => {
        setSelected((prev) =>
            prev.includes(item)
                ? prev.filter((v) => v !== item)
                : [...prev, item]
        );
    };

    const onSubmit = () => {
        const payload = { username, password, location, selected };
        Alert.alert("Account Created", JSON.stringify(payload, null, 2));
    };

    return (
        <View style={s.container}>
            <Text style={s.title}>Senior - Create Account</Text>

            {/* Username */}
            <View style={s.field}>
                <Text style={s.field}>Username *</Text>
                <TextInput
                    style={s.input}
                    placeholder="Type Username Here"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                />
                <Text style={s.help}>3–24 chars; letters, numbers, . or _</Text>
            </View>

            {/* Password */}
            <View style={s.field}>
                <Text style={s.label}>Password *</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                        style={[s.input, { flex: 1 }]}
                        placeholder="Type Password Here"
                        secureTextEntry={!showPw}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={s.ghostBtn} onPress={() => setShowPw(v => !v)}>
                        <Text style={s.ghostText}>{showPw ? "Hide" : "Show"}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={s.help}>Use at least 8 characters.</Text>
            </View>

            {/* Location */}
            <View style={s.field}>
                <Text style={s.label}>Location</Text>
                <TextInput
                    style={s.input}
                    placeholder="Type Location Here"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>

            {/* Interests checklist */}
            <View style={s.field}>
                <Text style={s.label}>What do you want help with?</Text>
                <FlatList
                data={help_options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                    const checked = selected.includes(item);
                    return (
                    <TouchableOpacity style={s.row} onPress={() => toggle(item)}>
                        <View style={[s.box, checked && s.boxChecked]}>{checked && <Text style={s.check}>✓</Text>}</View>
                        <Text style={s.rowText}>{item}</Text>
                    </TouchableOpacity>
                    );
                }}
                />
            </View>

            {/* Submit */}
            <TouchableOpacity style={s.primary} onPress={onSubmit}>
                <Text style={s.primaryText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#b6d5ffff" },
  title: { fontSize: 22, fontWeight: "700", color: "#000102ff", marginBottom: 12 },
  field: { marginBottom: 14 },
  label: { color: "#000102ff", fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#b6d5ffff",
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 12,
    color: "#000102ff",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  help: { color: "#000102ff", fontSize: 12, marginTop: 4 },
  ghostBtn: { paddingHorizontal: 12, justifyContent: "center", borderWidth: 1, borderColor: "#30364a", borderRadius: 10 },
  ghostText: { color: "#000102ff", fontWeight: "600" },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 },
  rowText: { color: "#000102ff" },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: "#374151", justifyContent: "center", alignItems: "center" },
  boxChecked: { backgroundColor: "#b6d5ffff", borderColor: "#000102ff" },
  check: { color: "green", fontWeight: "900" },

  primary: { backgroundColor: "#b6d5ffff", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginTop: 10 },
  primaryText: { color: "white", fontWeight: "700" },
});   