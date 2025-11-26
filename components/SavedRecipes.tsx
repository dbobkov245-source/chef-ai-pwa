import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, AlertCircle } from 'lucide-react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

const SavedRecipes: React.FC = () => {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        if (status === 'authenticated') {
          // Fetch from API
          const res = await fetch('/api/user/recipes');
          if (res.ok) {
            const data = await res.json();
            setRecipes(data);
          }
        } else {
          // Fetch from LocalStorage
          const localData = localStorage.getItem('chef_ai_recipes');
          if (localData) {
            setRecipes(JSON.parse(localData));
          }
        }
      } catch (error) {
        console.error("Failed to load recipes", error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchRecipes();
    }
  }, [status]);

  const handleRemove = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdate = (updatedRecipe: Recipe) => {
    setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Загружаем вашу коллекцию...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-orange-600" />
          Моя коллекция
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          {session 
            ? "Ваши рецепты синхронизированы с облаком." 
            : "Рецепты сохранены только на этом устройстве. Войдите, чтобы сохранить их навсегда."}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <AlertCircle className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-medium text-gray-700">Пока нет сохраненных рецептов</h3>
          <p className="text-gray-500 text-sm mt-1">Создайте или сфотографируйте блюдо, чтобы добавить его сюда.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id || recipe.title} 
              recipe={recipe} 
              isSavedView={true}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;