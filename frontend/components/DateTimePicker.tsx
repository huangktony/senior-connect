// components/DateTimePickerField.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent, Event } from "@react-native-community/datetimepicker";

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  label?: string;
};

export default function DateTimePickerField({
  value,
  onChange,
  mode = "datetime",
  minimumDate,
  maximumDate,
  label = "Select date & time",
}: Props) {
  const [date, setDate] = useState<Date>(value ?? new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  // Display text for the button
  const formatted = (d: Date) =>
    d.toLocaleDateString() + " • " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const open = () => {
    if (mode === "date") {
      setPickerMode("date");
      setShowPicker(true);
    } else if (mode === "time") {
      setPickerMode("time");
      setShowPicker(true);
    } else {
      // datetime: show date first on Android. On iOS we'll show a combined inline if desired.
      if (Platform.OS === "android") {
        setPickerMode("date");
        setShowPicker(true);
      } else {
        // iOS: show inline date/time picker in 'spinner' or default style
        setPickerMode("date");
        setShowPicker(true);
      }
    }
  };

  const onChangeInternal = (event: DateTimePickerEvent, selected?: Date | undefined) => {
    // Android: event.type === "dismissed" when canceled
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (!selected) return;

    if (mode === "datetime") {
      if (pickerMode === "date") {
        // store date and then open time picker (Android only) to complete datetime
        const newDate = new Date(date);
        newDate.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
        setDate(newDate);

        if (Platform.OS === "android") {
          // now open time picker
          setPickerMode("time");
          setShowPicker(true);
          return;
        } else {
          // iOS: we usually get full datetime in one control depending on display, but handle anyway
          onChange(newDate);
          return;
        }
      } else {
        // time selected
        const newDate = new Date(date);
        newDate.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
        setDate(newDate);
        onChange(newDate);
        return;
      }
    } else if (mode === "date") {
      const newDate = new Date(date);
      newDate.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setDate(newDate);
      onChange(newDate);
    } else {
      // mode === "time"
      const newDate = new Date(date);
      newDate.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setDate(newDate);
      onChange(newDate);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={open}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{formatted(date)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeInternal}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  value: {
    marginTop: 6,
    fontSize: 16,
    color: "#111",
  },
});
