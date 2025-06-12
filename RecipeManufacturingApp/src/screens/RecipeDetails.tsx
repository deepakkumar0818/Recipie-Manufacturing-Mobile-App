import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Recipe } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RecipeDetailsScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'RecipeDetails'>;
type RecipeDetailsScreenRouteProp = RouteProp<AppStackParamList, 'RecipeDetails'>;

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation<RecipeDetailsScreenNavigationProp>();
  const route = useRoute<RecipeDetailsScreenRouteProp>();
  const { recipeId } = route.params;

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('recipes');
        if (storedRecipes) {
          const recipes: Recipe[] = JSON.parse(storedRecipes);
          const foundRecipe = recipes.find(r => r.id === recipeId);
          if (foundRecipe) {
            setRecipe(foundRecipe);
          } else {
            Alert.alert('Error', 'Recipe not found');
            navigation.goBack();
          }
        } else {
          Alert.alert('Error', 'No recipes found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        Alert.alert('Error', 'Failed to load recipe');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId, navigation]);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedRecipes = await AsyncStorage.getItem('recipes');
              if (storedRecipes) {
                const recipes: Recipe[] = JSON.parse(storedRecipes);
                const updatedRecipes = recipes.filter(r => r.id !== recipeId);
                await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
                navigation.goBack();
              }
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', 'Failed to delete recipe');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>
          
          <View style={styles.recipeInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Prep Time</Text>
              <Text style={styles.infoValue}>{recipe.preparationTime} mins</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Servings</Text>
              <Text style={styles.infoValue}>{recipe.servings}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={ingredient.id} style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>
                • {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditRecipe', { recipeId: recipe.id })}
          >
            <Text style={styles.actionButtonText}>Edit Recipe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FF6B6B',
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  recipeDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  recipeInfo: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ingredientItem: {
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FF6B6B',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteButtonText: {
    color: '#FF6B6B',
  },
}); 