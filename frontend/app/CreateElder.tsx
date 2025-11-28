import React from "react";
import { useLocalSearchParams } from "expo-router";
import ElderCreateAccount from "../components/CreateElderProfile";

export default function CreateElderPage() {
  const { email } = useLocalSearchParams();
  const elderEmail = Array.isArray(email) ? email[0] : email ?? "";
  return <ElderCreateAccount elderEmail={elderEmail} />;
}
