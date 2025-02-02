import React, { useRef } from 'react';
import { Tabs } from 'expo-router';
import { Platform, Animated, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter();

  const homeAnimation = useRef(new Animated.Value(1)).current;
  const cartAnimation = useRef(new Animated.Value(1)).current;
  const searchAnimation = useRef(new Animated.Value(1)).current;
  const accountAnimation = useRef(new Animated.Value(1)).current;

  const handlePress = (animationRef, routeName) => {
    if (route.name === routeName) {
      return;
    }

    Animated.sequence([
      Animated.timing(animationRef, {
        toValue: 1.5, // Scale up
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(animationRef, {
        toValue: 1, 
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(routeName); 
    });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Hide header globally for all tabs
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: 20,
            marginHorizontal: 10,
            marginBottom: 10,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
          default: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
        }),
      }}
    >
         <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TouchableWithoutFeedback onPress={() => handlePress(accountAnimation, 'account')}>
              <Animated.View
                style={{
                  transform: [
                    { scale: accountAnimation },
                    {
                      rotate: accountAnimation.interpolate({
                        inputRange: [1, 1.5],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
              >
                <MaterialIcons name="account-circle" size={size} color={color} />
              </Animated.View>
            </TouchableWithoutFeedback>
          ),
          tabBarLabel: 'Stakeholders',
          headerShown: false,  // Ensure header is hidden for this tab
        }}
      />
      {/* Cart Tab */}
      <Tabs.Screen
        name="cartpage"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TouchableWithoutFeedback onPress={() => handlePress(cartAnimation, 'cartpage')}>
              <Animated.View
                style={{
                  transform: [
                    { scale: cartAnimation },
                    {
                      rotate: cartAnimation.interpolate({
                        inputRange: [1, 1.5],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
              >
                <MaterialIcons name="group" size={size} color={color} />
              </Animated.View>
            </TouchableWithoutFeedback>
          ),
          tabBarLabel: 'Data',
          headerShown: false,  // Ensure header is hidden for this tab
        }}
      />

    

      {/* Account Tab */}
   
    </Tabs>
  );
}
