import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from "react-native";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig";

export default function EmailEntry() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!email.trim()) return Alert.alert("Please enter your email.");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);

      if (methods.includes("password")) {
        router.push({ pathname: "/auth/loginPassword", params: { email: normalizedEmail } });
      } else if (methods.length > 0) {
        Alert.alert("This email is linked with another provider.", methods.join(", "));
      } else {
        router.push({ pathname: "/auth/signupPassword", params: { email: normalizedEmail } });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Header */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/Group_5.png')} 
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
        <Text style={styles.title}>Can we get your email?</Text>
        
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="john.bluder@utexas.edu"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleContinue}
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
    marginBottom: 30,
    marginTop: 20,
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