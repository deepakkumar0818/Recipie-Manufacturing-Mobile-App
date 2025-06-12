import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Ingredient, Recipe } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EditRecipeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'EditRecipe'>;
type EditRecipeScreenRouteProp = RouteProp<AppStackParamList, 'EditRecipe'>;

export default function EditRecipe() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const navigation = useNavigation<EditRecipeScreenNavigationProp>();
  const route = useRoute<EditRecipeScreenRouteProp>();
  const { recipeId } = route.params;

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('recipes');
        if (storedRecipes) {
          const recipes: Recipe[] = JSON.parse(storedRecipes);
          const foundRecipe = recipes.find(r => r.id === recipeId);
          
          if (foundRecipe) {
            setName(foundRecipe.name);
            setDescription(foundRecipe.description);
            setPreparationTime(foundRecipe.preparationTime.toString());
            setServings(foundRecipe.servings.toString());
            setIngredients(foundRecipe.ingredients);
            setSteps(foundRecipe.steps);
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

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', quantity: 0, unit: '' }
    ]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(
      ingredients.map(ingredient => 
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    }
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!name || !description || !preparationTime || !servings) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (ingredients.some(ingredient => !ingredient.name || !ingredient.quantity || !ingredient.unit)) {
      Alert.alert('Error', 'Please fill in all ingredient details');
      return false;
    }

    if (steps.some(step => !step)) {
      Alert.alert('Error', 'Please fill in all recipe steps');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setSaving(true);
    
    try {
      // Get existing recipes
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        const recipes: Recipe[] = JSON.parse(storedRecipes);
        
        // Find the recipe to update
        const recipeIndex = recipes.findIndex(r => r.id === recipeId);
        
        if (recipeIndex !== -1) {
          // Update the recipe
          const updatedRecipe: Recipe = {
            ...recipes[recipeIndex],
            name,
            description,
            ingredients,
            steps,
            preparationTime: parseInt(preparationTime, 10),
            servings: parseInt(servings, 10),
            updatedAt: new Date().toISOString(),
          };
          
          recipes[recipeIndex] = updatedRecipe;
          
          // Save the updated recipes
          await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
          
          // Navigate back to recipe details
          Alert.alert('Success', 'Recipe updated successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } else {
          Alert.alert('Error', 'Recipe not found');
        }
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      Alert.alert('Error', 'Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Recipe</Text>
          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Recipe Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter recipe description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Prep Time (mins) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 30"
                value={preparationTime}
                onChangeText={setPreparationTime}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Servings *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4"
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredient}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {ingredients.map((ingredient, index) => (
            <View key={ingredient.id} style={styles.ingredientRow}>
              <View style={styles.ingredientInputGroup}>
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Qty"
                  value={ingredient.quantity ? ingredient.quantity.toString() : ''}
                  onChangeText={(text) => updateIngredient(ingredient.id, 'quantity', parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={[styles.input, styles.unitInput]}
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChangeText={(text) => updateIngredient(ingredient.id, 'unit', text)}
                />
                
                <TextInput
                  style={[styles.input, styles.ingredientNameInput]}
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChangeText={(text) => updateIngredient(ingredient.id, 'name', text)}
                />
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeIngredient(ingredient.id)}
                  disabled={ingredients.length <= 1}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TouchableOpacity onPress={addStep}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              
              <TextInput
                style={[styles.input, styles.stepInput]}
                placeholder={`Step ${index + 1}`}
                value={step}
                onChangeText={(text) => updateStep(index, text)}
                multiline
              />
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeStep(index)}
                disabled={steps.length <= 1}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabledButton: {
    backgroundColor: '#ffb5b5',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ingredientRow: {
    marginBottom: 10,
  },
  ingredientInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 0.2,
    marginRight: 5,
  },
  unitInput: {
    flex: 0.2,
    marginRight: 5,
  },
  ingredientNameInput: {
    flex: 0.6,
    marginRight: 5,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#999',
    fontSize: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepInput: {
    flex: 1,
    marginRight: 5,
  },
  spacer: {
    height: 100,
  },
}); 