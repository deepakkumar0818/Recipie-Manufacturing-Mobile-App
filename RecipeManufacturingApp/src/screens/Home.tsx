import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Recipe } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

// Sample recipe data
const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Chocolate Cake',
    description: 'Delicious chocolate cake with creamy frosting',
    ingredients: [
      { id: '1', name: 'Flour', quantity: 2, unit: 'cups' },
      { id: '2', name: 'Sugar', quantity: 1.5, unit: 'cups' },
      { id: '3', name: 'Cocoa Powder', quantity: 0.75, unit: 'cups' },
    ],
    steps: [
      'Preheat oven to 350°F (175°C)',
      'Mix dry ingredients in a bowl',
      'Add wet ingredients and mix well',
      'Pour into cake pans and bake for 30-35 minutes',
    ],
    preparationTime: 60,
    servings: 8,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Pasta Carbonara',
    description: 'Classic Italian pasta dish with eggs and cheese',
    ingredients: [
      { id: '1', name: 'Spaghetti', quantity: 1, unit: 'pound' },
      { id: '2', name: 'Eggs', quantity: 3, unit: 'large' },
      { id: '3', name: 'Parmesan Cheese', quantity: 1, unit: 'cup' },
    ],
    steps: [
      'Cook pasta according to package directions',
      'Whisk eggs and cheese in a bowl',
      'Drain pasta and immediately toss with egg mixture',
      'Serve with extra cheese and black pepper',
    ],
    preparationTime: 25,
    servings: 4,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Greek Salad',
    description: 'Fresh and healthy Mediterranean salad',
    ingredients: [
      { id: '1', name: 'Cucumber', quantity: 1, unit: 'large' },
      { id: '2', name: 'Tomatoes', quantity: 2, unit: 'medium' },
      { id: '3', name: 'Feta Cheese', quantity: 0.5, unit: 'cup' },
      { id: '4', name: 'Olives', quantity: 0.25, unit: 'cup' },
    ],
    steps: [
      'Chop vegetables into bite-sized pieces',
      'Crumble feta cheese',
      'Mix with olive oil and lemon dressing',
      'Season with salt and oregano',
    ],
    preparationTime: 15,
    servings: 4,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    // In a real app, you would fetch recipes from a backend
    // For demo purposes, we'll use sample data
    const loadRecipes = async () => {
      try {
        // Check if we have stored recipes
        const storedRecipes = await AsyncStorage.getItem('recipes');
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        } else {
          // Use sample data for first load
          setRecipes(sampleRecipes);
          await AsyncStorage.setItem('recipes', JSON.stringify(sampleRecipes));
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        setRecipes(sampleRecipes);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const filteredRecipes = searchQuery
    ? recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recipes;

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
    >
      <View style={styles.recipeContent}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeInfoText}>{item.preparationTime} mins</Text>
          <Text style={styles.recipeInfoText}>•</Text>
          <Text style={styles.recipeInfoText}>{item.servings} servings</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateRecipe')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : (
        filteredRecipes.length > 0 ? (
          <FlatList
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.recipeList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recipes found</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateRecipe')}
            >
              <Text style={styles.createButtonText}>Create New Recipe</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeList: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeContent: {
    padding: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeInfoText: {
    fontSize: 12,
    color: '#999',
    marginRight: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 