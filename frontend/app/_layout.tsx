import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user logged in");
        setInitializing(false);
        // Navigation will happen after render
        setTimeout(() => router.replace("/"), 0);
        return;
      }
      
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/users/${encodeURIComponent(user.email!)}`
        );
        const profile = await res.json();
        console.log(profile);
        setInitializing(false);
        
        // Navigate after state update
        setTimeout(() => {
          if (profile.type === "senior") {
            if (!profile.hasInfo) {
              router.push(`/CreateElder?email=${encodeURIComponent(profile.email)}`);
            } else {
              router.replace("/(elderTabs)");
            }
          } else {
            router.replace("/(volunteerTabs)");
          }
        }, 0);
      } catch (err) {
        console.error("Profile fetch error", err);
        setInitializing(false);
      }
    });

    return unsub;
  }, []);

  // Always render Stack, but don't show content until initialized
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {initializing && (
        <Stack.Screen
          name="loading"
          options={{ headerShown: false }}
        />
      )}
    </Stack>
  );
}