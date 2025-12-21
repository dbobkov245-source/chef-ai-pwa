'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Recipe } from '../types';
import useLocalStorage from './useLocalStorage';

interface UseRecipesReturn {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    saveRecipe: (recipe: Recipe) => Promise<void>;
    removeRecipe: (id: string) => Promise<void>;
    updateRecipe: (recipe: Recipe) => Promise<void>;
    searchRecipes: (query: string) => Recipe[];
    refreshRecipes: () => Promise<void>;
}

function useRecipes(): UseRecipesReturn {
    const { data: session, status } = useSession();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localRecipes, setLocalRecipes] = useLocalStorage<Recipe[]>('chef_ai_recipes', []);

    // Fetch recipes on mount
    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (status === 'authenticated') {
                const res = await fetch('/api/user/recipes');
                if (res.ok) {
                    const data = await res.json();
                    setRecipes(data);
                } else {
                    throw new Error('Failed to fetch recipes');
                }
            } else if (status === 'unauthenticated') {
                setRecipes(localRecipes);
            }
        } catch (err) {
            setError('Не удалось загрузить рецепты');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [status, localRecipes]);

    useEffect(() => {
        if (status !== 'loading') {
            fetchRecipes();
        }
    }, [status]); // Don't include fetchRecipes to avoid infinite loop

    // Save a new recipe
    const saveRecipe = useCallback(async (recipe: Recipe) => {
        const recipeToSave = {
            ...recipe,
            id: recipe.id || crypto.randomUUID(),
            createdAt: Date.now(),
        };

        try {
            if (session) {
                const res = await fetch('/api/user/recipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipeToSave),
                });
                if (!res.ok) throw new Error('Failed to save recipe');
            } else {
                // Check for duplicates
                if (!localRecipes.some((r) => r.title === recipeToSave.title)) {
                    setLocalRecipes((prev) => [recipeToSave, ...prev]);
                }
            }
            setRecipes((prev) => [recipeToSave, ...prev]);
        } catch (err) {
            setError('Не удалось сохранить рецепт');
            throw err;
        }
    }, [session, localRecipes, setLocalRecipes]);

    // Remove a recipe
    const removeRecipe = useCallback(async (id: string) => {
        try {
            if (session) {
                const res = await fetch(`/api/user/recipes?id=${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete recipe');
            } else {
                setLocalRecipes((prev) => prev.filter((r) => r.id !== id));
            }
            setRecipes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            setError('Не удалось удалить рецепт');
            throw err;
        }
    }, [session, setLocalRecipes]);

    // Update an existing recipe
    const updateRecipe = useCallback(async (updatedRecipe: Recipe) => {
        try {
            if (session) {
                const res = await fetch('/api/user/recipes', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedRecipe),
                });
                if (!res.ok) throw new Error('Failed to update recipe');
            } else {
                setLocalRecipes((prev) =>
                    prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
                );
            }
            setRecipes((prev) =>
                prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
            );
        } catch (err) {
            setError('Не удалось обновить рецепт');
            throw err;
        }
    }, [session, setLocalRecipes]);

    // Search recipes by title or ingredients
    const searchRecipes = useCallback((query: string): Recipe[] => {
        if (!query.trim()) return recipes;

        const lowerQuery = query.toLowerCase();
        return recipes.filter(
            (recipe) =>
                recipe.title.toLowerCase().includes(lowerQuery) ||
                recipe.description.toLowerCase().includes(lowerQuery) ||
                recipe.ingredients.some((ing) => ing.toLowerCase().includes(lowerQuery))
        );
    }, [recipes]);

    return {
        recipes,
        loading,
        error,
        saveRecipe,
        removeRecipe,
        updateRecipe,
        searchRecipes,
        refreshRecipes: fetchRecipes,
    };
}

export default useRecipes;
