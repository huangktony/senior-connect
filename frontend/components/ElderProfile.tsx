import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button, ActivityIndicator, TextInput, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';

export default function ElderProfile() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [taskStats, setTaskStats] = useState({ total: 0, pending: 0, accepted: 0, done: 0 });
  const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        if (user.email) {
          await fetchTaskStats(user.email);
          await fetchUserInfo(user.email);
        }
      } else setUserEmail(null);

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchUserInfo = async (email: string) => {
    try {
      const response = await fetch(
        `https://strivingly-proadoption-bronwyn.ngrok-free.dev/users/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );
      const data = await response.json();
      setUserInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchTaskStats = async (email: string) => {
    try {
      const response = await fetch(
        `https://strivingly-proadoption-bronwyn.ngrok-free.dev/tasks/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );
      const data = await response.json();
      const pending = data.filter((t: any) => t.status.toLowerCase() === "pending").length;
      const accepted = data.filter((t: any) => t.status.toLowerCase() === "accepted").length;
      const done = data.filter((t: any) => t.status.toLowerCase() === "completed").length;
      setTaskStats({ total: data.length, pending, accepted, done });
    } catch (err) {
      console.error("Error fetching task stats:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/Login");
  };

  const handleSave = async () => {
    if (!userEmail) return;
    try {
      const response = await fetch(`https://strivingly-proadoption-bronwyn.ngrok-free.dev/users/${encodeURIComponent(userEmail)}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      Alert.alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err: any) {
      Alert.alert("Error updating profile", err.message);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: auth.currentUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
        style={styles.avatar}
      />

      {editMode ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={userInfo.firstName}
            onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={userInfo.lastName}
            onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            keyboardType="numeric"
            value={userInfo.latitude.toString()}
            onChangeText={(text) => setUserInfo({ ...userInfo, latitude: parseFloat(text) || 0 })}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            keyboardType="numeric"
            value={userInfo.longitude.toString()}
            onChangeText={(text) => setUserInfo({ ...userInfo, longitude: parseFloat(text) || 0 })}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" color="red" onPress={() => setEditMode(false)} />
        </>
      ) : (
        <>
          <Text style={styles.name}>{userInfo.firstName + " " + userInfo.lastName}</Text>
          <Text style={styles.email}>{userEmail}</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.stat}>Total Tasks: {taskStats.total}</Text>
            <Text style={styles.stat}>Pending: {taskStats.pending}</Text>
            <Text style={styles.stat}>Accepted: {taskStats.accepted}</Text>
            <Text style={styles.stat}>Completed: {taskStats.done}</Text>
          </View>

          <View style={styles.buttons}>
            <Button title="Edit Profile" onPress={() => setEditMode(true)} />
            <Button title="Logout" onPress={handleLogout} color="red" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#f3f4f6", paddingTop: 40 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold" },
  email: { color: "#555", marginBottom: 20 },
  statsContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "85%", marginBottom: 30, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  stat: { fontSize: 16, marginBottom: 6 },
  buttons: { width: "85%", gap: 10 },
  input: { width: "85%", padding: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, marginBottom: 10, backgroundColor: "#fff" },
});
