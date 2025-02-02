import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { AxiosRequest } from "../axios/AxiosRequest";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com$/,
      'Email domain must be gmail, hotmail, yahoo, or outlook'
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

const LoginForm = () => {
  const imageAnimation = useRef(new Animated.Value(0)).current;
  const formContainerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(imageAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(formContainerAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await AxiosRequest.post('/api/auth/login', values);
      const data = response.data;
  
      if (data.token && data.user) {
        await AsyncStorage.setItem('jwt', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        router.push('/(tabs)/account');
        Alert.alert('Success', 'Successfully logged in!');
      } else {
        Alert.alert('Error', data.error || 'An error occurred while logging in.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response && error.response.status === 400) {
        // Check for specific error messages and show the appropriate message
        const errorMessage = error.response.data.error;
        if (errorMessage === 'User with this email does not exist') {
          Alert.alert('Error', 'User with this email already exists. Please log in or choose another email.');
        } else {
          Alert.alert('Error', errorMessage || 'Invalid credentials.');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  const imageScale = imageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const imageOpacity = imageAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const formContainerWidth = formContainerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.8, width * 0.9],
  });

  const formContainerHeight = formContainerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 600], // Increase the height to 600 for better display of content
  });
  

  return (
    <LinearGradient
      colors={['#4a90e2', '#63a4ff']}
      style={styles.container}
    >
      <View style={styles.container}>
        <Animated.View
          style={[styles.formContainer, { width: formContainerWidth, height: formContainerHeight }]}
        >
          <Animated.Image
            source={require('../../images/ecommerce.png')}
            style={[styles.image, { opacity: imageOpacity, transform: [{ scale: imageScale }] }]}
          />
          <Text style={styles.title}>Smart Ordering System</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                  />
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder="Password"
                    secureTextEntry
                    left={<TextInput.Icon icon="lock" />}
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={isSubmitting}>
                  <Text style={styles.loginButtonText}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <TouchableOpacity onPress={() => router.push('/forget')} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/registration')}>
              <Text style={styles.registerLink}>Register here</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

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
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
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
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
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
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#4a90e2',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#333',
  },
  registerLink: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: 'bold',
  },
});

export default LoginForm;
