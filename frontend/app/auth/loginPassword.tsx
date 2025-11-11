import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useLocalSearchParams } from "expo-router";
import { auth } from "../../firebaseConfig";
import { MotiView } from "moti";

export default function LoginPassword({ route }: any) {
  const { email } = useLocalSearchParams();
  const userEmail = Array.isArray(email) ? email[0] : email || "";
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
    await signInWithEmailAndPassword(auth, userEmail, password);      router.replace("/board");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back arrow drop-in animation */}
      <MotiView
        from={{ translateY: -40, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: "timing", duration: 500 }}
        style={styles.backButton}
      >
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </MotiView>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1672c9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});