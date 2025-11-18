import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useLocalSearchParams } from "expo-router";
import { auth } from "../../firebaseConfig";
import { MotiView } from "moti";

export default function LoginPassword() {
  const params = useLocalSearchParams();
  const userEmail = Array.isArray(params.email) ? params.email[0] : params.email || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, userEmail, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      }
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Header */}
      <View style={styles.logoContainer}>
        <MotiView
          from={{ translateX: -40, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.backButton}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </MotiView>

        <Image 
          source={require('../../assets/images/Group_5.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Decorative Shapes - Stacked correctly */}
      <View style={styles.shapesContainer}>
        <View style={[styles.shape, styles.orangeShape]} />
        <View style={[styles.shape, styles.purpleShape]} />
        <View style={[styles.shape, styles.darkPurpleShape]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>{userEmail}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  logoContainer: {
    backgroundColor: "#2C003E",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  logoImage: {
    width: 200,
    height: 80,
    marginTop: 40,
  },
  shapesContainer: {
    height: 280,
    position: "relative",
    overflow: "hidden",
    marginTop: 50,
  },
  shape: {
    position: "absolute",
    height: 120,
  },
  orangeShape: {
    width: "95%",
    backgroundColor: "#FF6B35",
    left: 0,
    top: 0,
    zIndex: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  purpleShape: {
    width: "90%",
    backgroundColor: "#A855F7",
    right: 0,
    top: 60,
    zIndex: 2,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  darkPurpleShape: {
    width: "85%",
    backgroundColor: "#4A1570",
    left: "5%",
    top: 120,
    zIndex: 3,
    borderRadius: 15,
  },
  contentContainer: {
    paddingHorizontal: 36,
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2C003E",
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#2C003E",
    fontSize: 20,
    paddingVertical: 12,
    color: "#2C003E",
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: "#2C003E",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});