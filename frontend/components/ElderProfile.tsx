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
import { onAuthStateChanged } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';

export default function ElderProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState("Name");
  const [profileImage, setProfileImage] = useState<string | null>(null);
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
      const data = await response.json();
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
      Alert.alert("Profile saved!");
      if (profile.firstName) {
        setUserName(profile.firstName);
      }
    } catch (error) {
      Alert.alert("Error saving profile");
    }
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera roll permissions to change your profile picture.");
      return;
    }

    // Launch image picker
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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color="#FFA353" />
            )}
          </TouchableOpacity>
          <View style={styles.nameAndTabs}>
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
      </View>

      {/* Form Section */}
      <ScrollView 
        style={styles.formSection}
        contentContainerStyle={styles.formContent}
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
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameAndTabs: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
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
    padding: 8,
  },
  formSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  halfInput: {
    flex: 1,
  },
});