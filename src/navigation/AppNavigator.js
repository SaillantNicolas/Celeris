import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CreateReportScreen from '../screens/CreateReportScreen';
import SignUpPage from '../screens/SignUpPage';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}/>
      <Stack.Screen 
        name="CreateReport"
        component={CreateReportScreen} 
        options={{ headerShown: false }}/>
      <Stack.Screen 
        name="SignUp"
        component={SignUpPage} 
        options={{ headerShown: false }}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
