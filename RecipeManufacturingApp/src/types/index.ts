export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  preparationTime: number;
  servings: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  RecipeDetails: { recipeId: string };
  CreateRecipe: undefined;
  EditRecipe: { recipeId: string };
  Profile: undefined;
}; 