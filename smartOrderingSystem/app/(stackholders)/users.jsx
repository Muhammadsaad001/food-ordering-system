import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AxiosRequest } from '../axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { width } = Dimensions.get('window');

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Name must only contain letters') // Only letters allowed
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
  const [animation] = useState(new Animated.Value(0)); // Animation for the container

  // Handle User Registration
  const handleRegister = async (values) => {
    const { name, email, phone, address, role, department } = values;

    const userData = { name, email, phone, address, role, department };

    try {
      const response = await AxiosRequest.post('/api/auth/register', userData);
      Alert.alert('Success', 'User registered successfully');
    } catch (error) {
      Alert.alert('Error', error.response ? error.response.data : 'An error occurred');
    }
  };

  // Fetch users after registration
  useEffect(() => {
    AxiosRequest.get('/api/auth/users')
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error(error);
        Alert.alert('Error fetching users');
      });

    // Trigger fade-in animation when component mounts
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={['#4a90e2', '#63a4ff']} style={styles.container}>
      <Animated.View style={[styles.formContainer, { opacity: animation }]}>
        <Text style={styles.title}>Users Data</Text>

        {/* Formik Form with Validation */}
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            address: '',
            role: 'user',
            department: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                style={[styles.input, touched.name && errors.name && styles.errorInput]}
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                style={[styles.input, touched.email && errors.email && styles.errorInput]}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={[styles.input, touched.phone && errors.phone && styles.errorInput]}
                placeholder="Phone"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
              />
              {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <TextInput
                style={[styles.input, touched.address && errors.address && styles.errorInput]}
                placeholder="Address"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
              />
              {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

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

              <TextInput
                style={[styles.input, touched.department && errors.department && styles.errorInput]}
                placeholder="Department (Staff Only)"
                value={values.department}
                onChangeText={handleChange('department')}
                onBlur={handleBlur('department')}
                editable={values.role === 'staff'}
              />
              {touched.department && errors.department && <Text style={styles.errorText}>{errors.department}</Text>}

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
    transition: 'all 0.3s ease-in-out',
  },
  inputFocus: {
    borderColor: '#4a90e2',
    transform: [{ scale: 1.05 }],
  },
  errorInput: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
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
    transition: 'all 0.3s ease-in-out',
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
    transform: [{ scale: 1 }],
    transition: 'all 0.3s ease-in-out',
  },
  submitButtonHover: {
    transform: [{ scale: 1.1 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userListContainer: {
    marginTop: 20,
    width: '100%',
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ scale: 1 }],
    transition: 'all 0.3s ease-in-out',
  },
  userCardHover: {
    transform: [{ scale: 1.05 }],
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
});
