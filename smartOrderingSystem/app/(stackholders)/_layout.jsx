import { Stack } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function layout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Hide header for all screens by default
      }}
    >
      <Stack.Screen
        name="admin"
        options={{
          title: 'Admin',
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name="staff"
        options={{
          title: 'Staff',
          headerShown: false, // Ensure header is hidden for this screen
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: 'Users',
          headerShown: false, // Ensure header is hidden for this screen
        }}
      />
    </Stack>
  );
}
