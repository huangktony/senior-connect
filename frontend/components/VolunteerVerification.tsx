import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";

const STEPS = [
  { id: 0, title: "Scan front of ID" },
  { id: 1, title: "Scan back of ID" },
];

const PURPLE = "#71236b";
const ORANGE = "#ffa74b";
const LIGHT_GRAY = "#f3f3f3";

export default function App() {
  const [step, setStep] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const currentStep = STEPS[step];

  // permissions still loading
  if (!permission) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  // not granted yet
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <Text style={{ textAlign: "center", marginBottom: 16 }}>
          We need access to your camera to scan your ID.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, { width: 160 }]}
          onPress={requestPermission}
        >
          <Text style={styles.buttonPrimaryText}>Grant permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleNext = async () => {
    // take picture
    if (cameraRef.current) {
      try {
        setIsSaving(true);
        const photo = await (cameraRef.current as any).takePictureAsync({
          quality: 0.7,
        });

        // You can upload / process photo.uri here
        console.log(
          step === 0 ? "Front ID photo: " : "Back ID photo: ",
          (photo as any).uri
        );
      } catch (e) {
        console.warn("Error taking picture", e);
      } finally {
        setIsSaving(false);
      }
    }

    // go to next step or finish
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // finished flow
      console.log("Verification flow complete");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}> </Text>
        </View>
        <Text style={styles.appName}>opal</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.subtitle}>Let&apos;s get you verified</Text>
        <Text style={styles.title}>{currentStep.title}</Text>

        {/* Camera preview */}
        <View style={styles.scanBoxWrapper}>
          <CameraView
            style={styles.scanBox}
            facing="back"
            ref={cameraRef}
            ratio="16:9"
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Step dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((s) => (
            <View
              key={s.id}
              style={[styles.dot, step === s.id && styles.dotActive]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonSecondary,
              step === 0 && styles.buttonDisabled,
            ]}
            onPress={goBack}
            disabled={step === 0 || isSaving}
          >
            <Text style={styles.buttonSecondaryText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              isSaving && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={isSaving}
          >
            <Text style={styles.buttonPrimaryText}>
              {isSaving
                ? "Saving..."
                : step === STEPS.length - 1
                ? "Finish"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#222", // background behind "card"
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: PURPLE,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoText: { fontSize: 18 },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  body: {
    marginTop: 90,
    paddingHorizontal: 24,
    width: "100%",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "700",
    color: PURPLE,
    textAlign: "center",
  },
  scanBoxWrapper: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: LIGHT_GRAY,
  },
  scanBox: {
    width: "100%",
    height: 220,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 24,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: PURPLE,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonSecondary: {
    marginRight: 8,
    backgroundColor: PURPLE,
  },
  buttonPrimary: {
    marginLeft: 8,
    backgroundColor: ORANGE,
  },
  buttonSecondaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
