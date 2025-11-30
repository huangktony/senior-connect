import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import type { Task } from "./types";

type Props = {
  task: Task;
  onBackToTask: () => void;
  onSubmitCompletion: (payload: {
    task: Task;
    photoNote?: string;
    receiptNote?: string;
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
  const [photoNote, setPhotoNote] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
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
      onSubmitCompletion({ task, photoNote, receiptNote, comments });
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.stepTitle}>Upload Photo</Text>
          <Text style={styles.stepSubtitle}>
            Say cheese! Upload a photo of you volunteering.
          </Text>
          <Pressable
            style={styles.box}
            onPress={() => {
              // TODO: hook up expo-image-picker or camera here
              setPhotoNote("Photo attached (mock)");
            }}
          >
            <Text style={styles.boxText}>
              {photoNote ? photoNote : "Tap to attach a photo (later)"}
            </Text>
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
          <Pressable
            style={styles.box}
            onPress={() => {
              // TODO: hook up receipt image picker
              setReceiptNote("Receipt attached (mock)");
            }}
          >
            <Text style={styles.boxText}>
              {receiptNote ? receiptNote : "Tap to attach a receipt (later)"}
            </Text>
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
            style={[
              styles.dot,
              step === i && styles.dotActive,
            ]}
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
  },
  boxText: { color: "#777", paddingHorizontal: 16, textAlign: "center" },
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