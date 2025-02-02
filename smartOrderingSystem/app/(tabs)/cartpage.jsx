import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { AxiosRequest } from '../axios/AxiosRequest'; // Importing AxiosRequest for API requests
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons for delete icon
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for spinner icon

const CartPage = () => {
  const [users, setUsers] = useState([]); // State to store fetched users
  const [loading, setLoading] = useState(true); // State to handle loading indicator
  const [error, setError] = useState(null); // State to handle any errors
  const [isLoadingIconClicked, setIsLoadingIconClicked] = useState(false); // State to manage icon click
  const [isReloading, setIsReloading] = useState(false); // State to manage reloading state (activity indicator)

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []); // Empty dependency array means this effect runs once on mount

  const fetchUsers = useCallback(() => {
    setLoading(true);
    AxiosRequest.get('/api/auth/users') // Replace with your API endpoint
      .then((response) => {
        setUsers(response.data); // Update state with fetched users
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  }, []);

  // Handle delete user
  const deleteUser = (userId) => {
    AxiosRequest.delete(`/api/auth/users/${userId}`)
      .then(() => {
        // Remove the user from the state after successful deletion
        setUsers(users.filter((user) => user._id !== userId));
        Alert.alert('Success', 'User deleted');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const handleLoadingIconClick = () => {
    // Prevent multiple clicks if reloading is in progress
    if (isReloading || loading) return;
  
    setIsLoadingIconClicked(true); // Set loading state to true when clicked
    setIsReloading(true); // Show the activity indicator
  
    // Fetch users again and reset the loading state once done
    fetchUsers().finally(() => {
      setIsLoadingIconClicked(false); // Reset loading state when fetching is complete
      setIsReloading(false); // Hide the activity indicator when fetching is complete
    });
  };
  
  // If there's an error, show an error message
  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {loading ? (
          // Show loading spinner while fetching data
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : users.length > 0 ? (
          users.map((user) => (
            <View key={user._id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{user.name}</Text>
                <Text style={styles.cardTitle}>{user.role}</Text>
                <Text style={styles.cardText}>Email: {user.email}</Text>
                <Text style={styles.cardText}>Phone: {user.phone}</Text>
                <Text style={styles.cardText}>Address: {user.address}</Text>

              </View>
              <TouchableOpacity onPress={() => deleteUser(user._id)} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noUsersText}>No users found.</Text> // Message if no users are returned
        )}
      </ScrollView>

      {/* Custom Loading Spinner Icon */}
      <TouchableOpacity onPress={handleLoadingIconClick}>
        {isLoadingIconClicked ? (
          <Ionicons name="ios-refresh-circle" size={50} color="white" style={styles.loadingIcon} />
        ) : (
          <MaterialIcons name="cached" size={50} color="white" style={styles.loadingIcon} />
        )}
      </TouchableOpacity>

      {/* Show Activity Indicator in the middle when reloading */}
      {isReloading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#007bff', // Blue background for the whole container
  },
  card: {
    backgroundColor: '#fff', // White background for the cards
    borderRadius: 10,
    marginBottom: 15,
    padding: 20,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  deleteButton: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Add shadow effect for the button
  },
  noUsersText: {
    fontSize: 16,
    color: 'white', // White text color for the "No users found" message
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 60, // Circular background
    padding: 10,
    width: 70, // Add padding to the circle to fit the icon
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartPage;
