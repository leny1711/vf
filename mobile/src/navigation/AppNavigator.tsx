import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import CreateMissionScreen from '../screens/client/CreateMissionScreen';
import MissionDetailScreen from '../screens/client/MissionDetailScreen';
import ClientHistoryScreen from '../screens/client/ClientHistoryScreen';

import ProviderHomeScreen from '../screens/provider/ProviderHomeScreen';
import ProviderMissionsScreen from '../screens/provider/ProviderMissionsScreen';
import ProviderHistoryScreen from '../screens/provider/ProviderHistoryScreen';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ClientTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ClientHomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="CreateMission" component={CreateMissionScreen} options={{ title: 'Nouvelle mission' }} />
      <Tab.Screen name="History" component={ClientHistoryScreen} options={{ title: 'Historique' }} />
    </Tab.Navigator>
  );
};

const ProviderTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ProviderHomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Missions" component={ProviderMissionsScreen} options={{ title: 'Missions' }} />
      <Tab.Screen name="History" component={ProviderHistoryScreen} options={{ title: 'Historique' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
          </>
        ) : user.role === 'CLIENT' ? (
          <>
            <Stack.Screen name="ClientMain" component={ClientTabs} options={{ headerShown: false }} />
            <Stack.Screen name="MissionDetail" component={MissionDetailScreen} options={{ title: 'Détail mission' }} />
          </>
        ) : user.role === 'PROVIDER' ? (
          <>
            <Stack.Screen name="ProviderMain" component={ProviderTabs} options={{ headerShown: false }} />
            <Stack.Screen name="MissionDetail" component={MissionDetailScreen} options={{ title: 'Détail mission' }} />
          </>
        ) : user.role === 'ADMIN' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
