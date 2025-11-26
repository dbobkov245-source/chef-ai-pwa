import { Recipe } from '../types';

export const generateRecipeFromPhoto = async (base64Image: string, mimeType: string = "image/png"): Promise<Recipe> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'PHOTO_ANALYSIS',
        image: base64Image,
        mimeType
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing photo:", error);
    throw error;
  }
};

export const generateFusionRecipe = async (cuisine1: string, cuisine2: string, creativity: number): Promise<Recipe> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'FUSION_LAB',
        cuisine1,
        cuisine2,
        creativity
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating fusion recipe:", error);
    throw error;
  }
};