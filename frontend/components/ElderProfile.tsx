import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";

export default function ElderProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState("Name");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiration: "",
    nameOnCard: "",
    zipCode: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        if (user.email) await fetchProfile(user.email);
      }
    });
    return unsubscribe;
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/users/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: { "ngrok-skip-browser-warning": "69420" },
        }
      );
      
      if (!response.ok) {
        console.log("Profile not found, using defaults");
        return;
      }
      
      const text = await response.text();
      if (!text) {
        console.log("Empty response, using defaults");
        return;
      }
      
      const data = JSON.parse(text);
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
      });
      if (data.firstName) {
        setUserName(data.firstName);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Just use empty defaults if profile doesn't exist yet
    }
  };

  const handleSave = async () => {
    try {
      await fetch(
        `http://127.0.0.1:5000/users/${encodeURIComponent(userEmail || "")}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify(profile),
        }
      );
      Alert.alert("Success", "Profile saved!");
      if (profile.firstName) {
        setUserName(profile.firstName);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save profile");
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera roll permissions to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/");
            } catch (error) {
              Alert.alert("Error", "Failed to logout");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Orange Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={45} color="#FFA353" />
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <Text style={styles.nameText}>{userName}</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "profile" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("profile")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "profile" && styles.tabButtonTextActive,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "payment" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("payment")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "payment" && styles.tabButtonTextActive,
                ]}
              >
                Payment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editIcon} onPress={handleSave}>
          <Ionicons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* White Content Section with Rounded Top */}
      <ScrollView 
        style={styles.contentSection}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "profile" ? (
          <>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={profile.firstName}
              onChangeText={(text) =>
                setProfile({ ...profile, firstName: text })
              }
              placeholder="e.g. Jenelle"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={profile.lastName}
              onChangeText={(text) =>
                setProfile({ ...profile, lastName: text })
              }
              placeholder="e.g. John"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phoneNumber}
              onChangeText={(text) =>
                setProfile({ ...profile, phoneNumber: text })
              }
              placeholder="e.g. 571-222-7629"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={profile.address}
              onChangeText={(text) =>
                setProfile({ ...profile, address: text })
              }
              placeholder="e.g. 1028 Street Street"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={profile.city}
              onChangeText={(text) => setProfile({ ...profile, city: text })}
              placeholder="e.g. Houston"
              placeholderTextColor="#999"
            />

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={profile.state}
                  onChangeText={(text) =>
                    setProfile({ ...profile, state: text })
                  }
                  placeholder="TX"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                  style={styles.input}
                  value={profile.zipCode}
                  onChangeText={(text) =>
                    setProfile({ ...profile, zipCode: text })
                  }
                  placeholder="77001"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={payment.cardNumber}
              onChangeText={(text) =>
                setPayment({ ...payment, cardNumber: text })
              }
              placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Expiration Date (MM/YY)</Text>
            <TextInput
              style={styles.input}
              value={payment.expiration}
              onChangeText={(text) =>
                setPayment({ ...payment, expiration: text })
              }
              placeholder="e.g. 03/25"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Name on Card</Text>
            <TextInput
              style={styles.input}
              value={payment.nameOnCard}
              onChangeText={(text) =>
                setPayment({ ...payment, nameOnCard: text })
              }
              placeholder="e.g. Jenelle James"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              value={payment.zipCode}
              onChangeText={(text) =>
                setPayment({ ...payment, zipCode: text })
              }
              placeholder="77001"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </>
        )}
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 70,
  },
  header: {
    backgroundColor: "#FFA353",
    paddingTop: 70,
    paddingBottom: 55,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  headerRight: {
    justifyContent: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#7C3B7A",
  },
  tabButtonText: {
    color: "#7C3B7A",
    fontSize: 14,
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "#fff",
  },
  editIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 8,
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
    marginTop: 5,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  halfInput: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#DC3545",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 27,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});