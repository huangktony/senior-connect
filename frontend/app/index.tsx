import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { fetchSignInMethodsForEmail } from "firebase/auth";import { router } from "expo-router";
import { auth } from "../firebaseConfig";

export default function EmailEntry() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!email.trim()) return Alert.alert("Enter your email.");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log("Fetching methods for:", normalizedEmail);
      const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
      console.log("Result:", methods);
      console.log("Sign-in methods for", email, ":", methods);

      // Case 1: account exists with password
      console.log("Methods:", methods);
      if (methods && methods.includes("password")) {
        router.push({ pathname: "/auth/loginPassword", params: { email } });
      } 
      // Case 2: account exists but through another provider (like Google)
      else if (methods && methods.length > 0) {
        Alert.alert(
          "Account already exists",
          `This email is linked with ${methods.join(", ")}. Please sign in using that method.`
        );
        setLoading(false);
      } 
      // Case 3: no account found — double-check existence
      // Case 3: no account found
      else {
        router.push({ pathname: "/auth/signupPassword", params: { email } });
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
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