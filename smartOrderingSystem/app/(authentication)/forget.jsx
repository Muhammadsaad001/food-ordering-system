import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequest } from "../axios/AxiosRequest";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

const ForgetPassword = () => {
  const navigation = useNavigation();

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email address')
      .matches(
        /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com$/,
        'Email domain must be gmail, hotmail, yahoo, or outlook'
      )
      .required('Email is required'),
  });

  const handleForgetPasswordSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await AxiosRequest.post('api/auth/forget-password', { email: values.email });
      const data = response.data;

      console.log('Response data:', data);

      if (data.status === 'success') {
        await AsyncStorage.setItem('Email', values.email);
        navigation.navigate('(authentication)', { screen: 'reset' });
      } else if (data.status === 'user not found') {
        Alert.alert('Error', 'User not found');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      console.error('Error response:', error.response);

      if (error.response) {
        Alert.alert('Error', 'Server error. Please try again later.');
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Trigger the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={['#4a90e2', '#63a4ff']}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('(authentication)', { screen: 'login' })}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="white" />
      </TouchableOpacity>
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Forgot Password</Text>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleForgetPasswordSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#a0a0a0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                <FontAwesome name="envelope" size={20} color="#a0a0a0" style={styles.inputIcon} />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={isSubmitting}>
                <Text style={styles.loginButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('(authentication)', { screen: 'login' })}>
                  <Text style={styles.registerLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </Animated.View>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default ForgetPassword;
