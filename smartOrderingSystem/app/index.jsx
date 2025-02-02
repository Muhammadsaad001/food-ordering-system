import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

const HomePage = () => {
  const projectNameAnimation = useRef(new Animated.Value(0)).current; // Project name animation
  const splashAnimation = useRef(new Animated.Value(0)).current; // Splash screen logo animation

  useEffect(() => {
    // Prevent splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();

    // Sequence of animations: splash logo fade in, then text fade in
    Animated.sequence([
      // Logo fade in
      Animated.timing(splashAnimation, {
        toValue: 1, // Fade in splash screen logo
        duration: 1000,
        useNativeDriver: true,
      }),
      // Project name fade in and scale up after the logo
      Animated.timing(projectNameAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hide the splash screen after animations are done
      SplashScreen.hideAsync();

      // Navigate to login page after the animations are complete
      router.push('/(authentication)/login');
    });
  }, [projectNameAnimation, splashAnimation]);

  // Interpolations for project name animation
  const projectNameOpacity = projectNameAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const projectNameScale = projectNameAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <LinearGradient colors={['#4a90e2', '#63a4ff']} style={styles.container}>
      {/* Animated Splash Screen */}
      <Animated.View style={[styles.splashContainer, { opacity: splashAnimation }]}>
        <Image
          source={{
            uri: 'https://play-lh.googleusercontent.com/dR5oRHZkctNt4p7YqMsPDDSTNRUoZ-V92rOoBTSpoB8o2AtuLVpPuwEOfMhpQwKX6wg=w600-h300-pc0xffffff-pd',
          }} // Replace with your Dhaba logo URL
          style={styles.splashLogo}
        />
      </Animated.View>

      {/* Animated Project Name */}
      <Animated.View
        style={[
          styles.projectNameContainer,
          { opacity: projectNameOpacity, transform: [{ scale: projectNameScale }] },
        ]}
      >
        <Text style={styles.projectName}>Smart Ordering System</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContainer: {
    position: 'absolute', // Keep logo in the center
    top: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 400, // Adjust width as per your logo size
    height: 400, // Adjust height as per your logo size
    resizeMode: 'contain',
  },
  projectNameContainer: {
    marginTop: 20, // Margin to space it from the logo
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 150,
  },
});

export default HomePage;
