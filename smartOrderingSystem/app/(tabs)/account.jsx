import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
const { width } = Dimensions.get('window');

export default function account() {
 

  const routeUsers = () => {
     router.push('/users');
  };

 const routeStaff = () => {
  router.push('/staff');
};

  return (
    <LinearGradient colors={['#4a90e2', '#63a4ff']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Dashboard </Text>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={routeUsers} // Use the patrouh you want to navigate to
        >
          <Text style={styles.buttonText}>Users</Text>
        </TouchableOpacity>
    
        <TouchableOpacity
          style={styles.footerButton}
          onPress={routeStaff} // Use the path you want to navigate to
        >
          <Text style={styles.buttonText}>Staff Members</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a90e2',
    textAlign: 'center',
  },
  footerButton: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
