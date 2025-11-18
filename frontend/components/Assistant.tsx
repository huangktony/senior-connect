import { useState, useEffect } from "react";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Conditionally import speech recognition
let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = () => {};

if (Platform.OS !== 'web') {
  try {
    const speechModule = require("expo-speech-recognition");
    ExpoSpeechRecognitionModule = speechModule.ExpoSpeechRecognitionModule;
    useSpeechRecognitionEvent = speechModule.useSpeechRecognitionEvent;
  } catch (e) {
    console.log('Speech recognition not available');
  }
}

export default function Assistant() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        if (user.email) await fetchUserInfo(user.email);
      } else setUserEmail(null);
    });
    return unsubscribe;
  }, []);

  const fetchUserInfo = async (email: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/users/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: { "ngrok-skip-browser-warning": "69420" },
        }
      );
      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  // Only use speech events if module is available
  if (ExpoSpeechRecognitionModule) {
    useSpeechRecognitionEvent("start", () => setRecognizing(true));
    useSpeechRecognitionEvent("end", () => {
      if (recognizing) {
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: false,
          continuous: true,
        });
      }
    });

    useSpeechRecognitionEvent("result", (event: any) => {
      const text = event.results[0].transcript;
      setTranscript(transcript + text);
    });

    useSpeechRecognitionEvent("error", (event: any) => {
      console.log("Speech error:", event.error, event.message);
    });
  }

  const handleStart = async () => {
    if (!ExpoSpeechRecognitionModule) {
      Alert.alert("Speech recognition not available in Expo Go. Use a development build.");
      return;
    }

    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      Alert.alert("Microphone access is required.");
      return;
    }

    setTranscript("");
    setRecognizing(true);

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: false,
      continuous: true,
    });
  };

  const handleStop = async () => {
    setRecognizing(false);
    if (ExpoSpeechRecognitionModule) {
      await ExpoSpeechRecognitionModule.stop();
    }

    if (!transcript.trim()) return;
    console.log(transcript);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            transcript,
            elderID: userEmail,
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        }
      );
      console.log("Task submitted:", response.status);
      Alert.alert("✅ Task created successfully!");
    } catch (error: any) {
      Alert.alert("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask our AI Assistant for Help</Text>
      <Text style={styles.description}>
        Tell our assistant what task you want to add
      </Text>
      <TouchableOpacity
        style={[
          styles.micButton,
          recognizing ? styles.stopButton : styles.startButton,
        ]}
        onPress={recognizing ? handleStop : handleStart}
      >
        <Ionicons
          name={recognizing ? "stop-circle" : "mic-circle"}
          size={90}
          color={recognizing ? "#E74C3C" : "#2ECC71"}
        />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.transcript}>
          {transcript || "Say something..."}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  micButton: {
    marginBottom: 30,
  },
  startButton: {},
  stopButton: {},
  scrollView: {
    width: "100%",
    paddingHorizontal: 10,
  },
  transcript: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
  },
  title: {
    fontSize: 24,
    color: "#3250e6ff",
    fontWeight: "600",
  },
  description: {
    marginTop: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "300",
  },
});