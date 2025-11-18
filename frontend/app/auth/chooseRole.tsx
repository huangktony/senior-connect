import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ChooseRole() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email || "";

  const handleRoleSelect = (role: string) => {
    router.push({ 
      pathname: "/auth/signupPassword", 
      params: { email, role } 
    });
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
        <Text style={styles.title}>Create account as</Text>
        
        <TouchableOpacity 
          style={styles.seniorButton} 
          onPress={() => handleRoleSelect("senior")}
        >
          <Text style={styles.buttonText}>Senior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.volunteerButton} 
          onPress={() => handleRoleSelect("volunteer")}
        >
          <Text style={styles.buttonText}>Volunteer</Text>
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4A1942",
    marginBottom: 30,
    marginTop: 20,
  },
  seniorButton: {
    backgroundColor: "#F5B041",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
    },
  volunteerButton: {
    backgroundColor: "#7B3B7A",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  backButton: {
    position: "absolute",
    bottom: 40,
    left: 36,
    backgroundColor: "#7B3B7A",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});