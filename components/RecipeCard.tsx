'use client';

import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from '../hooks';
import {
  Clock,
  ChefHat,
  Flame,
  Trash2,
  Heart,
  ShoppingBasket,
  ShoppingCart,
  Utensils,
  Pencil,
  Save,
  X,
  ImageIcon,
  Loader2,
  Check
} from 'lucide-react';

interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  quantity: number;
  recipeId?: string;
  recipeName?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  isSavedView?: boolean;
  onRemove?: (id: string) => void;
  onUpdate?: (updatedRecipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isSavedView = false, onRemove, onUpdate }) => {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(isSavedView);
  const [loading, setLoading] = useState(false);

  // Image Generation State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Shopping List State
  const [shoppingItems, setShoppingItems] = useLocalStorage<ShoppingItem[]>('chef_ai_shopping_list', []);
  const [addedToList, setAddedToList] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);

  // Generate image for this dish
  const generateImage = async () => {
    if (imageLoading || generatedImage) return;

    setImageLoading(true);
    setImageError(false);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: editedRecipe.title,
          description: editedRecipe.description
        })
      });

      const data = await response.json();

      if (data.success && (data.image || data.imageUrl)) {
        setGeneratedImage(data.image || data.imageUrl);
      } else {
        setImageError(true);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      setImageError(true);
    } finally {
      setImageLoading(false);
    }
  };

  // Add ingredients to shopping list
  const addToShoppingList = () => {
    const newItems: ShoppingItem[] = editedRecipe.ingredients.map((ing) => ({
      id: crypto.randomUUID(),
      text: ing,
      checked: false,
      quantity: 1,
      recipeId: recipe.id,
      recipeName: editedRecipe.title,
    }));

    setShoppingItems((prev) => {
      const existingTexts = new Set(prev.map((i) => i.text.toLowerCase()));
      const uniqueNew = newItems.filter(
        (item) => !existingTexts.has(item.text.toLowerCase())
      );
      return [...prev, ...uniqueNew];
    });

    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 2000);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleToggleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isSavedView && onRemove && recipe.id) {
        if (session) {
          await fetch(`/api/user/recipes?id=${recipe.id}`, { method: 'DELETE' });
        } else {
          const localRecipes = JSON.parse(localStorage.getItem('chef_ai_recipes') || '[]');
          const updated = localRecipes.filter((r: Recipe) => r.id !== recipe.id);
          localStorage.setItem('chef_ai_recipes', JSON.stringify(updated));
        }
        onRemove(recipe.id);
        return;
      }

      if (saved) return;

      const recipeToSave = { ...recipe, id: recipe.id || crypto.randomUUID(), createdAt: Date.now() };

      if (session) {
        await fetch('/api/user/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeToSave)
        });
      } else {
        const localRecipes = JSON.parse(localStorage.getItem('chef_ai_recipes') || '[]');
        if (!localRecipes.some((r: Recipe) => r.title === recipeToSave.title)) {
          localRecipes.unshift(recipeToSave);
          localStorage.setItem('chef_ai_recipes', JSON.stringify(localRecipes));
        }
      }
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      if (session) {
        await fetch('/api/user/recipes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedRecipe)
        });
      } else {
        const localRecipes = JSON.parse(localStorage.getItem('chef_ai_recipes') || '[]');
        const updated = localRecipes.map((r: Recipe) => r.id === editedRecipe.id ? editedRecipe : r);
        localStorage.setItem('chef_ai_recipes', JSON.stringify(updated));
      }

      if (onUpdate) onUpdate(editedRecipe);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditedRecipe(recipe);
    setIsEditing(false);
  };

  const updateField = (field: keyof Recipe, value: any) => {
    setEditedRecipe(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newArray = [...editedRecipe[field]];
    newArray[index] = value;
    setEditedRecipe(prev => ({ ...prev, [field]: newArray }));
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mt-6 text-text-main dark:text-white animate-fade-in-up group relative">

      {/* Generated Image */}
      {generatedImage && (
        <div className="relative w-full aspect-square max-h-64 overflow-hidden">
          <img
            src={generatedImage}
            alt={editedRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4 pr-16 relative">
        {isEditing ? (
          <input
            type="text"
            value={editedRecipe.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full text-2xl font-bold p-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent dark:text-white"
          />
        ) : (
          <h2 className="text-2xl font-bold leading-tight">{editedRecipe.title}</h2>
        )}

        {isEditing ? (
          <textarea
            value={editedRecipe.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full mt-2 text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-transparent dark:text-white"
            rows={2}
          />
        ) : (
          <p className="text-text-secondary mt-2 text-sm leading-relaxed">{editedRecipe.description}</p>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          {isSavedView && (
            <button
              onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
              disabled={loading}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isEditing ? 'bg-primary text-text-main' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {isEditing ? <Save size={20} /> : <Pencil size={18} className="text-text-secondary" />}
            </button>
          )}

          {isEditing && (
            <button
              onClick={cancelEdit}
              className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 flex items-center justify-center text-red-600"
            >
              <X size={20} />
            </button>
          )}

          {!isEditing && (
            <button
              onClick={handleToggleSave}
              disabled={loading}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-text-main border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {isSavedView ? <Trash2 size={20} className="text-text-main dark:text-white" /> : <Heart size={20} className={saved ? 'text-red-500 fill-red-500' : 'text-text-main dark:text-white'} />}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 px-6 pb-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 bg-background-light dark:bg-background-dark px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shrink-0">
          <Clock size={18} className="text-text-secondary" />
          <span className="text-sm font-bold">{editedRecipe.cookingTime}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-background-light dark:bg-background-dark px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shrink-0">
          <ChefHat size={18} className="text-text-secondary" />
          <span className="text-sm font-bold">{editedRecipe.difficulty}</span>
        </div>
        {editedRecipe.calories && (
          <div className="flex items-center gap-1.5 bg-background-light dark:bg-background-dark px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shrink-0">
            <Flame size={18} className="text-text-secondary" />
            <span className="text-sm font-bold">{editedRecipe.calories}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-6 pb-6">
        {/* Generate Image Button */}
        <button
          onClick={generateImage}
          disabled={imageLoading || !!generatedImage}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${generatedImage
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : imageLoading
              ? 'bg-gray-100 dark:bg-gray-700 text-text-secondary cursor-wait'
              : 'bg-cyan-soft/30 dark:bg-cyan-soft/10 text-text-main dark:text-white hover:bg-cyan-soft/50'
            }`}
        >
          {imageLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Генерация...
            </>
          ) : generatedImage ? (
            <>
              <Check size={18} />
              Фото готово
            </>
          ) : imageError ? (
            <>
              <ImageIcon size={18} />
              Попробовать снова
            </>
          ) : (
            <>
              <ImageIcon size={18} />
              Создать фото
            </>
          )}
        </button>

        {/* Add to Shopping List Button */}
        <button
          onClick={addToShoppingList}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${addedToList
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-primary/20 text-text-main dark:text-white hover:bg-primary/30'
            }`}
        >
          {addedToList ? (
            <>
              <Check size={18} />
              Добавлено!
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              В список
            </>
          )}
        </button>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700"></div>

      {/* Content */}
      <div className="p-6 pt-6 space-y-8">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShoppingBasket size={20} className="text-primary" />
            Ингредиенты
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {editedRecipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium stagger-item">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                {isEditing ? (
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => updateArrayField('ingredients', i, e.target.value)}
                    className="flex-1 p-1 border-b border-gray-200 dark:border-gray-600 focus:border-primary focus:outline-none bg-transparent"
                  />
                ) : (
                  <span>{ing}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Utensils size={20} className="text-primary" />
            Приготовление
          </h3>
          <div className="space-y-6">
            {editedRecipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-4 stagger-item">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-text-main rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                  {i + 1}
                </span>
                {isEditing ? (
                  <textarea
                    value={step}
                    onChange={(e) => updateArrayField('instructions', i, e.target.value)}
                    className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-transparent"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-text-main/90 dark:text-gray-300">{step}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;