import { Text, View } from "react-native";
import CaregiverAccountCreator from "./pages/CaregiverAccountCreator"
import CareGiverLogin from "./pages/CaregiverLogin";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CaregiverAccountCreator />
      <CareGiverLogin />
    </View>
  );
}
