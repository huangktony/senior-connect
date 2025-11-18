import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#7B3B7A",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={32} />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="sparkles" color={color} size={32} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={32} />
          ),
        }}
      />
    </Tabs>
  );
}