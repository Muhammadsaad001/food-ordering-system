import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AxiosRequest } from '../axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup'; 
import { Formik } from 'formik';

const { width } = Dimensions.get('window');

// Define validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Name must only contain letters') // Strict letter validation
    .required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  role: Yup.string().oneOf(['user', 'staff']).required('Role is required'),
  department: Yup.string().when('role', {
    is: 'staff',
    then: Yup.string().required('Department is required for staff'),
  }),
});

export default function Users() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('user'); // Default role
  const [department, setDepartment] = useState('');
  
  // For the side-to-side animation
  const moveAnim = useState(new Animated.Value(width))[0]; // Start from right outside the screen

  // Animate the container to slide from right to left
  const moveContainer = () => {
    Animated.timing(moveAnim, {
      toValue: 0, // Move to the center of the screen
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    moveContainer(); // Start the side-to-side movement when the component mounts

    // Fetch users after registration
    AxiosRequest.get('/api/auth/users')
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error(error);
        Alert.alert('Error fetching users');
      });
  }, []);

  // Handle User Registration
  const handleRegister = async (values) => {
    const { name, email, phone, address, role, department } = values;

    try {
      const userData = { name, email, phone, address, role, department };
      const response = await AxiosRequest.post('/api/auth/register', userData);
      Alert.alert('Success', 'User registered successfully');
    } catch (error) {
      Alert.alert('Error', error.response ? error.response.data : 'An error occurred');
    }
  };

  return (
    <LinearGradient colors={['#4a90e2', '#63a4ff']} style={styles.container}>
      <Animated.View
        style={[ 
          styles.formContainer, 
          { 
            transform: [
              {
                translateX: moveAnim, // Apply the side-to-side animation
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Staff Data</Text>

        {/* Formik for handling form state and validation */}
        <Formik
          initialValues={{ name: '', email: '', phone: '', address: '', role: 'user', department: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              {/* User Registration Form */}
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange('name')}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={values.phone}
                onChangeText={handleChange('phone')}
              />
              {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Address"
                value={values.address}
                onChangeText={handleChange('address')}
              />
              {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

              {/* Role Selection */}
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.roleButton, values.role === 'staff' && styles.selectedRole]}
                  onPress={() => handleChange('role')('staff')}
                >
                  <Text style={styles.roleButtonText}>Staff</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleButton, values.role === 'user' && styles.selectedRole]}
                  onPress={() => handleChange('role')('user')}
                >
                  <Text style={styles.roleButtonText}>User</Text>
                </TouchableOpacity>
              </View>

              {/* Conditionally render department input for staff only */}
              {values.role === 'staff' && (
                <TextInput
                  style={styles.input}
                  placeholder="Department"
                  value={values.department}
                  onChangeText={handleChange('department')}
                />
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register User</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </Animated.View>
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
    color: '#4a90e2',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#f8f9fa',
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
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
