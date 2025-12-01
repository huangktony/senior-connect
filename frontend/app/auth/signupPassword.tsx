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
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";


export default function SignupPassword({ route }: any) {
  const { email } = useLocalSearchParams();
  const userEmail = Array.isArray(email) ? email[0] : email || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const user = userCredential.user;

      // Create a basic user entry in Firestore
      await setDoc(doc(db, "users", userEmail), {
        email: userEmail,
        createdAt: new Date().toISOString(),
        uid: user.uid,
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Header */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/Group_5.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Decorative Shapes */}
      <View style={styles.shapesContainer}>
        <View style={[styles.shape, styles.orangeShape]} />
        <View style={[styles.shape, styles.purpleShape]} />
        <View style={[styles.shape, styles.darkPurpleShape]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create your password</Text>
        <Text style={styles.subtitle}>{userEmail}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter a password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextButtonText}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    backgroundColor: "#7B3B7A",
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 210,
    height: 90,
  },
  shapesContainer: {
    height: 280,
    position: "relative",
    overflow: "hidden",
    marginTop: 70,
  },
  shape: {
    position: "absolute",
    height: 120,
  },
  orangeShape: {
    width: "75%",
    backgroundColor: "#F5B041",
    left: 0,
    top: 0,
    zIndex: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  purpleShape: {
    width: "75%",
    backgroundColor: "#7B3B7A",
    right: 0,
    top: 60,
    zIndex: 2,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  darkPurpleShape: {
    width: "75%",
    backgroundColor: "#4A1942",
    left: "12.5%",
    top: 120,
    zIndex: 3,
    borderRadius: 15,
  },
  contentContainer: {
    paddingHorizontal: 36,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4A1942",
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 3,
    borderBottomColor: "#4A1942",
    fontSize: 20,
    paddingVertical: 5,
    color: "#4A1942",
    marginBottom: 35,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#7B3B7A",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#F5B041",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});