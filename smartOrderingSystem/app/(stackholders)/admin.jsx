import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';
import { AxiosRequest } from '../axios/AxiosRequest';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [department, setDepartment] = useState('');
  const navigation = useNavigation();

  // Validate form fields
  const validateForm = () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Validation Error', 'All fields are required');
      return false;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    // Validate phone number (basic check for 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate department if role is staff
    if (role === 'staff' && !department) {
      Alert.alert('Validation Error', 'Department is required for staff');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const userData = { name, email, phone, address, role, department };

    try {
      const response = await AxiosRequest.post('/api/auth/register', userData);
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('UserList');
    } catch (error) {
      Alert.alert('Error', error.response ? error.response.data : 'An error occurred');
    }
  };

  return (
    <LinearGradient colors={['#4a90e2', '#63a4ff']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Admin Register User</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'user' && styles.selectedRole]}
            onPress={() => setRole('user')}
          >
            <Text style={styles.roleButtonText}>User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'staff' && styles.selectedRole]}
            onPress={() => setRole('staff')}
          >
            <Text style={styles.roleButtonText}>Staff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.selectedRole]}
            onPress={() => setRole('admin')}
          >
            <Text style={styles.roleButtonText}>Admin</Text>
          </TouchableOpacity>
        </View>

        {role === 'staff' && (
          <TextInput
            style={styles.input}
            placeholder="Department (Staff Only)"
            value={department}
            onChangeText={setDepartment}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register User</Text>
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
    padding: 25,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    width: '100%',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
  },
  selectedRole: {
    backgroundColor: '#4a90e2',
  },
  roleButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
