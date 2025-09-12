import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: "To Do",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checklist.checked" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timetracker"
        options={{
          title: "Time Tracker",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checklist.checked" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
