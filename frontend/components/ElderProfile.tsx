import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function ElderProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
    } catch (error) {
      Alert.alert("Error saving profile");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image
          source={require("../assets/images/Group_5.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />

        <View style={styles.profileRow}>
          <View style={styles.avatarCircle} />
          <View style={styles.buttonColumn}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === "profile" && styles.activeTabButton]}
              onPress={() => setActiveTab("profile")}
            >
              <Text style={[styles.tabButtonText, activeTab === "profile" && styles.activeTabText]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === "payment" && styles.activePaymentButton]}
              onPress={() => setActiveTab("payment")}
            >
              <Text style={[styles.tabButtonText, activeTab === "payment" && styles.activeTabText]}>Payment</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={handleSave}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color="#F5B041"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {activeTab === "profile" ? (
          <>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={profile.firstName}
              onChangeText={(text) => setProfile({ ...profile, firstName: text })}
              placeholder="e.g. Jenelle"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={profile.lastName}
              onChangeText={(text) => setProfile({ ...profile, lastName: text })}
              placeholder="e.g. John"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phoneNumber}
              onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
              placeholder="e.g. 571-222-7629"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={profile.address}
              onChangeText={(text) => setProfile({ ...profile, address: text })}
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
                  onChangeText={(text) => setProfile({ ...profile, state: text })}
                  placeholder="TX"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                  style={styles.input}
                  value={profile.zipCode}
                  onChangeText={(text) => setProfile({ ...profile, zipCode: text })}
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
              onChangeText={(text) => setPayment({ ...payment, cardNumber: text })}
              placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Expiration Date (MM/YY)</Text>
            <TextInput
              style={[styles.input, { width: "50%" }]}
              value={payment.expiration}
              onChangeText={(text) => setPayment({ ...payment, expiration: text })}
              placeholder="e.g. 03/25"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Name on Card</Text>
            <TextInput
              style={styles.input}
              value={payment.nameOnCard}
              onChangeText={(text) => setPayment({ ...payment, nameOnCard: text })}
              placeholder="e.g. Jenelle James"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={[styles.input, { width: "40%" }]}
              value={payment.zipCode}
              onChangeText={(text) => setPayment({ ...payment, zipCode: text })}
              placeholder="77001"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B3B7A",
    paddingBottom: 70,
  },
  headerSection: {
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5B041",
  },
  buttonColumn: {
    marginLeft: 15,
    flex: 1,
  },
  tabButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 6,
    alignItems: "center",
    width: "100%",
  },
  activeTabButton: {
    backgroundColor: "#F5B041",
  },
  activePaymentButton: {
    backgroundColor: "#F5B041",
  },
  tabButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  editIcon: {
    padding: 10,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    width: "100%",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
    width: "100%",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
});