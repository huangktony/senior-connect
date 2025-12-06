// frontend/components/VolunteerVerification.tsx
import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions, 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 0, title: "Scan front of ID", component: "camera" },
  { id: 1, title: "Scan back of ID", component: "camera" },
  { id: 2, title: "Select your skills", component: "skills" }, 
];

const SKILL_CATEGORIES = [
    "Groceries", 
    "Electric", 
    "Gardening", 
    "Meal prep",
    "Pet care",
    "Household chores",
    "Driving",
];

const PURPLE = "#71236b";
const ORANGE = "#ffa74b";
const LIGHT_GRAY = "#f3f3f3";
const DARK_BACKGROUND = "#222";

type Props = {
  onDone?: () => void;
};

const VolunteerOnboarding: React.FC<Props> = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const router = useRouter(); 

  const currentStep = STEPS[step];

  if (currentStep.component === 'camera' && !permission) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (currentStep.component === 'camera' && !permission.granted) {
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
    if (step > 0 && !isSaving) setStep(step - 1);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prevSkills => {
        if (prevSkills.includes(skill)) {
            return prevSkills.filter(s => s !== skill);
        } else {
            return [...prevSkills, skill];
        }
    });
  };

  const handleNext = async () => {
    if (isSaving) return;

    if (currentStep.component === 'camera' && cameraRef.current) {
      try {
        setIsSaving(true);
        const photo = await (cameraRef.current as any).takePictureAsync({
          quality: 0.7,
          videoOrientation: 2, 
        });

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
    
    if (currentStep.component === 'skills') {
        console.log("Selected Skills:", selectedSkills);
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Onboarding flow complete. Navigating to Volunteer tab.");
      onDone?.();
      router.replace("/(tabs)/Volunteer"); 
    }
  };

  const renderContent = () => {
    if (currentStep.component === 'camera') {
      return (
        <View style={styles.scanBoxWrapper}>
          <CameraView
            style={styles.scanBox}
            facing="back"
            ref={cameraRef}
            ratio="16:9" 
          />
        </View>
      );
    } else if (currentStep.component === 'skills') {
      return (
        <View style={styles.skillsWrapper}>
          {/* VERBATIM TEXT FOR SUBTITLE */}
          <Text style={styles.skillsSubtitleVerbatim}> 
            You'll get matched with tasks in these categories
          </Text>
          <View style={styles.skillsContainer}>
            {SKILL_CATEGORIES.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                    <TouchableOpacity
                        key={skill}
                        style={[
                            styles.skillTag, 
                            { 
                                backgroundColor: isSelected ? PURPLE : ORANGE,
                            }
                        ]}
                        onPress={() => toggleSkill(skill)}
                    >
                        <Text style={styles.skillTagText}>{skill}</Text>
                    </TouchableOpacity>
                );
            })}
          </View>
        </View>
      );
    }
    return <View style={styles.scanBoxWrapper} />;
  };

  // Conditional rendering of the main subtitle based on step
  const mainSubtitle = currentStep.component === 'skills' 
    ? ' ' // Blank for the skills page as the main title/subtitle structure is different in the screenshot
    : 'Let\'s get you verified';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card}>
        
        {/* Header */}
        <View style={styles.header}>
          {/* Use different logo style for skills step (larger, to mimic complex avatar) */}
          <View 
            style={
              currentStep.component === 'skills' ? styles.logoCircleSkills : styles.logoCircle
            }
          >
            {/* The icon */}
          </View>
          <Text style={styles.appName}>opal</Text>
        </View>

        {/* Body - Contains step-specific content */}
        <View style={styles.body}>
          
          <Text style={styles.subtitle}>{mainSubtitle}</Text>
          
          {/* Use different styling for the title on the skills page */}
          <Text 
            style={[
              styles.title, 
              currentStep.component === 'skills' && styles.titleSkills,
            ]}
          >
            {currentStep.title}
          </Text>
          
          {renderContent()}

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
                (step === 0 || isSaving) && styles.buttonDisabled,
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
                {isSaving ? "Saving..." : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VolunteerOnboarding;

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
    backgroundColor: DARK_BACKGROUND, 
    alignItems: "center",
    justifyContent: "flex-start", 
    width: '100%', 
  },
  card: {
    flex: 1, 
    width: "100%", 
    maxWidth: 400, 
    backgroundColor: "#fff", 
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16, 
    backgroundColor: PURPLE,
    paddingTop: 50, 
  },
  // Default logo style (small circle)
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    padding: 0,
  },
  // Logo style for skills page (larger, to mimic complex avatar)
  logoCircleSkills: {
    width: 44, 
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    padding: 0,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  body: {
    paddingHorizontal: 24,
    flexGrow: 1, 
    paddingTop: 24, 
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 4, 
  },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "700",
    color: PURPLE,
    textAlign: "center",
  },
  // Style adjustment for the skills title
  titleSkills: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000', // Black title color on skill page
    marginTop: 0, // Remove top margin
    marginBottom: 10,
  },
  // HORIZONTAL CAMERA STYLES (Kept from previous fix)
  scanBoxWrapper: {
    marginTop: 24,
    borderRadius: 8, 
    overflow: "hidden",
    backgroundColor: LIGHT_GRAY,
    marginBottom: 16, 
    height: (width * 0.9 / 16) * 9, 
    width: '100%',
  },
  scanBox: {
    width: "100%",
    height: '100%',
  },
  
  // SKILLS STYLES
  skillsWrapper: {
    flex: 1, 
    marginTop: 10,
    alignItems: 'center', 
    paddingTop: 10, // Add padding to push content down slightly
  },
  // New style for the verbatim subtitle text
  skillsSubtitleVerbatim: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    // Verbatim Text: "You'll get matched with tasks in these categories"
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'center', 
  },
  skillTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: ORANGE, 
    margin: 6, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillTagText: {
      color: '#fff',
      fontWeight: '600',
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40, 
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24, 
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ORANGE, 
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: PURPLE, 
    borderColor: PURPLE,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8, 
    alignItems: "center",
  },
  buttonSecondary: {
    marginRight: 16, 
    backgroundColor: PURPLE,
  },
  buttonPrimary: {
    marginLeft: 16, 
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