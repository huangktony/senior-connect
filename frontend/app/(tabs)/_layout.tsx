import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabsLayout() {
  
  return (
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabelStyle: {fontSize: 10, },
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
            
          }}
        />
        <Tabs.Screen
          name="Chat"
          options={{
            title: "Voice Assitant",
            tabBarLabelStyle: {fontSize: 10, },
            tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarLabelStyle: {fontSize: 10, },
            tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          }}
        />
      </Tabs>
  );
}
