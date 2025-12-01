import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { Task } from "./types";

type Props = {
  task: Task;
  onBackToTask: () => void;
  onSubmitCompletion: (payload: {
    task: Task;
    photoUri?: string;
    receiptUri?: string;
    comments?: string;
  }) => void;
};

type Step = 1 | 2 | 3;

const PURPLE = "#7a2a86";
const ORANGE = "#fcb045";

const VolunteerCompleteTask: React.FC<Props> = ({
  task,
  onBackToTask,
  onSubmitCompletion,
}) => {
  const [step, setStep] = useState<Step>(1);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [receiptUri, setReceiptUri] = useState<string | undefined>();
  const [comments, setComments] = useState("");

  const goBack = () => {
    if (step === 1) {
      onBackToTask();
    } else {
      setStep((step - 1) as Step);
    }
  };

  const goNext = () => {
    if (step < 3) {
      setStep((step + 1) as Step);
    } else {
      onSubmitCompletion({ task, photoUri, receiptUri, comments });
    }
  };

  const ensureCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera permission required",
        "Please enable camera access in your settings to take a photo."
      );
      return false;
    }
    return true;
  };

  const ensureMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Photo library permission required",
        "Please enable photo library access in your settings to upload a receipt."
      );
      return false;
    }
    return true;
  };

  const handleTakeVolunteerPhoto = async () => {
    const ok = await ensureCameraPermission();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickReceipt = async () => {
    const ok = await ensureMediaLibraryPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.stepTitle}>Upload Photo</Text>
          <Text style={styles.stepSubtitle}>
            Say cheese! Take a photo of you volunteering.
          </Text>
          <Pressable style={styles.box} onPress={handleTakeVolunteerPhoto}>
            {photoUri ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: photoUri }} style={styles.imagePreview} />
                <Text style={styles.boxText}>Tap to retake photo</Text>
              </View>
            ) : (
              <Text style={styles.boxText}>Tap to take a photo</Text>
            )}
          </Pressable>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <Text style={styles.stepTitle}>Receipt</Text>
          <Text style={styles.stepSubtitle}>
            Please upload an image of your receipt. Expect reimbursement in 2–5
            days.
          </Text>
          <Pressable style={styles.box} onPress={handlePickReceipt}>
            {receiptUri ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: receiptUri }}
                  style={styles.imagePreview}
                />
                <Text style={styles.boxText}>Tap to change receipt image</Text>
              </View>
            ) : (
              <Text style={styles.boxText}>Tap to choose a receipt image</Text>
            )}
          </Pressable>
        </>
      );
    }
    return (
      <>
        <Text style={styles.stepTitle}>Comments and concerns</Text>
        <Text style={styles.stepSubtitle}>
          Please include any feedback about your volunteering experience.
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Write your comments here..."
          value={comments}
          onChangeText={setComments}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{task.title}</Text>
      <Text style={styles.headerSubtitle}>Complete task</Text>

      {renderStep()}

      {/* dots */}
      <View style={styles.dotsRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.dot, step === i && styles.dotActive]}
          />
        ))}
      </View>

      {/* footer buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextText}>{step === 3 ? "Submit" : "Next"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VolunteerCompleteTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerSubtitle: { fontSize: 16, marginBottom: 24 },
  stepTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  stepSubtitle: { fontSize: 13, color: "#555", marginBottom: 12 },
  box: {
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    overflow: "hidden",
  },
  boxText: { color: "#777", paddingHorizontal: 16, textAlign: "center" },
  imageWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textArea: {
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: PURPLE },
  footer: {
    flexDirection: "row",
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: PURPLE,
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: ORANGE,
  },
  backText: { color: "white", fontWeight: "600" },
  nextText: { color: "white", fontWeight: "600" },
});