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
          placeholderTextColor="#666"
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
    fontSize: 32,
    fontWeight: "700",
    color: "#4A1942",
    marginBottom: 30,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 3,
    borderBottomColor: "#4A1942",
    fontSize: 20,
    color: "#4A1942",
    marginBottom: 35,
  },
  nextButton: {
    backgroundColor: "#7B3B7A",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});