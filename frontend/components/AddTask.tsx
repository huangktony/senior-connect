import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import DateTimePicker from "./DateTimePicker";

interface TaskInput {
  id: string;
  title: string;
  body: string;
  date: string;
  status: string;
  volunteerID: string;
  category: string;
}

interface AddTaskProps {
  onAdd: (task: TaskInput) => void;
  task: TaskInput | null;
  onClose?: () => void;
}

const CATEGORIES = [
  { label: "Shopping", value: "Shopping", icon: "cart-outline" },
  { label: "Transportation", value: "Transportation", icon: "car-outline" },
  { label: "Home Help", value: "Home Help", icon: "home-outline" },
  { label: "Technology", value: "Technology", icon: "phone-portrait-outline" },
  { label: "Companionship", value: "Companionship", icon: "people-outline" },
  { label: "Other", value: "Other", icon: "ellipsis-horizontal-circle-outline" },
];

export default function AddTask({ onAdd, task, onClose }: AddTaskProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(task?.title ?? "");
  const [body, setBody] = useState(task?.body ?? "");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [urgency, setUrgency] = useState<"now" | "later">("later");
  const [category, setCategory] = useState(task?.category ?? "");
  const [requiresPayment, setRequiresPayment] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!category) {
        Alert.alert("Required", "Please select a category");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!title.trim() || !body.trim()) {
        Alert.alert("Required", "Please fill in both title and description");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      if (requiresPayment === null) {
        Alert.alert("Required", "Please select whether payment is required");
        return;
      }
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStep(6);

    try {
      const taskData = {
        body: body,
        date: urgency === "now" ? new Date().toISOString() : selectedDate.toISOString(),
        elderID: userEmail,
        status: "pending",
        title: title,
        category: category,
        latitude: 0,
        longitude: 0,
      };

      const response = await fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      onAdd({
        id: data.id,
        title,
        body,
        date: urgency === "now" ? new Date().toString() : selectedDate.toString(),
        status: "Pending",
        volunteerID: data.volunteerID || "",
        category,
      });

      setTimeout(() => {
        Alert.alert("Success", "Task created successfully!");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "Something happened: " + error.message);
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View
            key={dot}
            style={[
              styles.progressDot,
              dot === step && styles.progressDotActive,
              dot < step && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Let's Get Started</Text>
            <Text style={styles.subtitle}>We need a few details{'\n'}before we get you matched</Text>
            
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>image or illustration</Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Choose a Category</Text>
            <Text style={styles.sublabel}>What kind of help do you need?</Text>

            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryBox,
                    category === cat.value && styles.categoryBoxActive,
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={38}
                    color={category === cat.value ? "#fff" : "#555"}
                  />
                  <Text
                    style={[
                      styles.categoryBoxText,
                      category === cat.value && styles.categoryBoxTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Task Details</Text>
            
            <Text style={styles.label}>Title of Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Description</Text>
            <Text style={styles.sublabel}>Please briefly describe the help you need</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description..."
              placeholderTextColor="#999"
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>When Do You Need Help?</Text>
            <Text style={styles.sublabel}>Choose when you'd like this task completed</Text>

            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === "now" && styles.urgencyButtonActive,
              ]}
              onPress={() => setUrgency("now")}
            >
              <Text
                style={[
                  styles.urgencyButtonText,
                  urgency === "now" && styles.urgencyButtonTextActive,
                ]}
              >
                Now
              </Text>
              {urgency === "now" && (
                <View style={styles.urgencyIndicator}>
                  <Text style={styles.urgencyIndicatorText}>R</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === "later" && styles.urgencyButtonActive,
              ]}
              onPress={() => setUrgency("later")}
            >
              <Text
                style={[
                  styles.urgencyButtonText,
                  urgency === "later" && styles.urgencyButtonTextActive,
                ]}
              >
                Later
              </Text>
              {urgency === "later" && (
                <View style={styles.urgencyIndicator}>
                  <Text style={styles.urgencyIndicatorText}>R</Text>
                </View>
              )}
            </TouchableOpacity>

            {urgency === "later" && (
              <View style={{ marginTop: 20 }}>
                <DateTimePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                />
              </View>
            )}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Payment Information</Text>
            <Text style={styles.sublabel}>Does this task require your volunteer{'\n'}to purchase anything?</Text>

            <TouchableOpacity
              style={[
                styles.paymentButton,
                requiresPayment === true && styles.paymentButtonActive,
              ]}
              onPress={() => setRequiresPayment(true)}
            >
              <Text
                style={[
                  styles.paymentButtonText,
                  requiresPayment === true && styles.paymentButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentButton,
                requiresPayment === false && styles.paymentButtonActive,
              ]}
              onPress={() => setRequiresPayment(false)}
            >
              <Text
                style={[
                  styles.paymentButtonText,
                  requiresPayment === false && styles.paymentButtonTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>Finding you a volunteer{'\n'}This will just take a moment...</Text>
            
            <View style={styles.matchingContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#34C759" />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onClose && step === 1 && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {renderStep()}

      {step !== 6 && renderProgressDots()}

      {step !== 6 && (
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, step === 1 && { flex: 1 }]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {step === 5 ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  closeButton: {
    padding: 5,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    lineHeight: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  sublabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  imagePlaceholder: {
    fontSize: 14,
    color: "#999",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  categoryBox: {
    width: "44%",
    aspectRatio: 1,
    margin: 7,
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryBoxActive: {
    backgroundColor: "#7C3B7A",
    borderColor: "#7C3B7A",
  },
  categoryBoxText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  categoryBoxTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  urgencyButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyButtonActive: {
    backgroundColor: "#7C3B7A",
  },
  urgencyButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  urgencyButtonTextActive: {
    color: "#fff",
  },
  urgencyIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5A2B5A",
    justifyContent: "center",
    alignItems: "center",
  },
  urgencyIndicatorText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  paymentButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  paymentButtonActive: {
    backgroundColor: "#7C3B7A",
  },
  paymentButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  paymentButtonTextActive: {
    color: "#fff",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
  },
  progressDotActive: {
    backgroundColor: "#FF9500",
  },
  progressDotCompleted: {
    backgroundColor: "#7C3B7A",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 15,
    gap: 15,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#7C3B7A",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  matchingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});