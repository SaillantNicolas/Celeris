import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import CreateReportScreen from "../screens/CreateReportScreen";
import SignUpPage from "../screens/SignUpPage";
import SignInPage from "../screens/SignInPage";
import DashboardScreen from "../screens/DashboardScreen";
import ReportsListScreen from "../screens/ReportsListScreen";
import ReportDetailScreen from "../screens/ReportDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InterventionListScreen from "../screens/InterventionListScreen";
import CreateInterventionScreen from "../screens/CreateInterventionScreen";
import EditInterventionScreen from "../screens/EditInterventionScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateReport"
        component={CreateReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportsList"
        component={ReportsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InterventionList"
        component={InterventionListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateIntervention"
        component={CreateInterventionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditIntervention"
        component={EditInterventionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
