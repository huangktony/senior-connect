import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { ActivityIndicator, View } from "react-native";

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
    if (user === undefined) return; 

    if (user === null) {
      // not logged in
      router.replace("/Login");
    } else {
      // logged in
      router.replace("/(tabs)");
    }
  }, [user]);

  // loading screen while checking auth
  if (user === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Still render your app structure so Stack is defined
  return <Stack />;
}
