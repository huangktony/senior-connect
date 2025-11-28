import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { MotiView } from "moti";
import { useLocalSearchParams } from "expo-router";

export default function SignupPassword({ route }: any) {
  const { email, role } = useLocalSearchParams();
  const userEmail = Array.isArray(email) ? email[0] : email || "";
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleCreate = async () => {
      try {
        console.log("Creating record...");
        const response = await fetch(
          "http://127.0.0.1:5000/users",
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({email: userEmail, type: role}),
          }
        );
        console.log(response.text());
        console.log("User created.")
      } catch (error) {
        Alert.alert("Error saving profile");
      }
    };

  const handleSignup = async () => {
    try {
      console.log("creating user...");
      await handleCreate();
      await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      // Create a basic user entry in Firestore
      console.log("created user");
      
      
    } catch (error: any) {
      console.error(error);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated back arrow */}
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

      <Text style={styles.title}>Create your password</Text>
      <Text style={styles.subtitle}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
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