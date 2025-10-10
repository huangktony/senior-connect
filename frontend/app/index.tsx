import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
      }}
    >
      <Text>Home</Text>
      <Link
        href="/choose_role"
        style={{ backgroundColor: "#4f46e5", 
          color: "white", 
          padding: 12, 
          borderRadius: 10 }}
      >
        Choose Your Role
      </Link>
    </View>
  );
}
