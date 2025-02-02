import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

    <Stack
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Stack.Screen
        name="login"
        options={{
          title: 'login',
       
        }}
      />
        <Stack.Screen
        name="registration"
        options={{
          title: 'registration',
       
        }}
      />
        <Stack.Screen
        name="contactus"
        options={{
          title: 'contactus',
       
        }}
      />
        <Stack.Screen
        name="forget"
        options={{
          title: 'forget',
       
        }}
      />
     
      
      
     
    </Stack>
  );
}
