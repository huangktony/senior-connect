import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../firebaseConfig"; // adjust if your path differs

export default function RootLayout() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (user === undefined) return; // still checking

    if (user === null) {
      router.replace("/"); // go to Login (index.tsx)
    } else {
      router.replace("/(tabs)"); // go to your main board page
    }
  }, [user]);

  if (user === undefined) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
