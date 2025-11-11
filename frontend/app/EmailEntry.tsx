import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../firebaseConfig";

export default function EmailEntry() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
  if (!email.trim()) return Alert.alert("Please enter your email.");
  setLoading(true);

  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log("📨 Checking Firebase for:", normalizedEmail);
    console.log("🔥 Using Firebase project:", auth.app.options.projectId);
    console.log("🔑 API key:", auth.app.options.apiKey);

    const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
    console.log("✅ Firebase returned methods:", methods);

    if (methods.includes("password")) {
      console.log("✅ Existing account found → going to loginPassword");
      router.push({ pathname: "/auth/loginPassword", params: { email: normalizedEmail } });
    } else if (methods.length > 0) {
      console.log("⚠️ Found other auth providers:", methods);
      Alert.alert("Account exists with another method", methods.join(", "));
    } else {
      console.log("🆕 No account found → going to signupPassword");
      router.push({ pathname: "/auth/signupPassword", params: { email: normalizedEmail } });
    }
  } catch (error: any) {
    console.error("❌ Error fetching methods:", error);
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Can we get your email?</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Checking..." : "Continue"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E6F4FE", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20, color: "#1E3A8A" },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, fontSize: 16, width: "90%", marginBottom: 20 },
  button: { backgroundColor: "#007AFF", paddingVertical: 14, borderRadius: 8, alignItems: "center", width: "90%" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 17 },
});