export interface Recipe {
  id?: string; // UUID for saved recipes
  createdAt?: number; // Timestamp
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
  calories?: string;
}

export enum AppMode {
  PHOTO_ANALYSIS = 'PHOTO_ANALYSIS',
  FUSION_LAB = 'FUSION_LAB',
  SAVED_RECIPES = 'SAVED_RECIPES',
}

export interface CuisineOption {
  value: string;
  label: string;
  image?: string;
}