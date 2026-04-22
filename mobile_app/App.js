import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import RegisterScreen      from './screens/RegisterScreen';
import UserLoginScreen     from './screens/UserLoginScreen';
import AdminLoginScreen    from './screens/AdminLoginScreen';
import UserDashboardScreen from './screens/UserDashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PredictScreen       from './screens/PredictScreen';
import ResultDetailScreen  from './screens/ResultDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="UserLogin"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Register"      component={RegisterScreen} />
        <Stack.Screen name="UserLogin"     component={UserLoginScreen} />
        <Stack.Screen name="AdminLogin"    component={AdminLoginScreen} />

        {/* User Screens */}
        <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
        <Stack.Screen name="Predict"       component={PredictScreen} />
        <Stack.Screen name="ResultDetail"  component={ResultDetailScreen} />

        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
