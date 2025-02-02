import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { AxiosRequest } from '../axios/AxiosRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../_layout';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { width } = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  code: Yup.string().required('Reset code is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
});

const ResetPassword = (props) => {
  const [email, setEmail] = useState(null); // Add state to store email
  const navigation = useNavigation();

  // Retrieve the email from AsyncStorage when the component mounts
  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('Email');
      setEmail(storedEmail); // Set the email to state
    };
    getEmail();
  }, []);

  const onSubmit = async (values) => {
    if (!email) {
      Alert.alert('Error', 'Email is not available.');
      return;
    }

    try {
      const response = await AxiosRequest.post(
        '/api/auth/reset-password', // Replace with your actual API URL
        { email, code: values.code, newPassword: values.password }
      );
      const data = response.data;

      if (data.status === 'success') {
        Alert.alert('Success', data.message);
        navigationRef.navigate('(Bottoms)', { screen: 'login' });
      } else {
        Alert.alert('Error', data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <LinearGradient colors={['#4a90e2', '#63a4ff']} style={styles.container}>
      <Formik
        initialValues={{ code: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Reset Password</Text>

            {/* Reset Code Input */}
            <View style={styles.inputContainer}>
              <Icon
                name="key"
                style={[styles.inputIcon, { color: props.mode === 'dark' ? 'white' : 'black' }]}
              />
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: props.mode === 'dark' ? '#333' : 'white' },
                ]}
                placeholder="Enter your reset code"
                value={values.code}
                onChangeText={handleChange('code')}
                onBlur={handleBlur('code')}
                placeholderTextColor={props.mode === 'dark' ? 'grey' : 'darkgrey'}
              />
              {touched.code && errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                style={[styles.inputIcon, { color: props.mode === 'dark' ? 'white' : 'black' }]}
              />
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: props.mode === 'dark' ? '#333' : 'white' },
                ]}
                placeholder="Enter your new password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholderTextColor={props.mode === 'dark' ? 'grey' : 'darkgrey'}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </LinearGradient>
  );
};

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
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ResetPassword;
