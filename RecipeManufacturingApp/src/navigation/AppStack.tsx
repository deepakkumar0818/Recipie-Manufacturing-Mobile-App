import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';

// Import screens
import Home from '../screens/Home';
import RecipeDetails from '../screens/RecipeDetails';
import CreateRecipe from '../screens/CreateRecipe';
import EditRecipe from '../screens/EditRecipe';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
      <Stack.Screen name="CreateRecipe" component={CreateRecipe} />
      <Stack.Screen name="EditRecipe" component={EditRecipe} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
} 