'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, AlertCircle, Search, X } from 'lucide-react';
import { useRecipes } from '../hooks';
import RecipeCard from './RecipeCard';
import { RecipeCardSkeleton } from './ui/Skeleton';

const SavedRecipes: React.FC = () => {
  const { data: session } = useSession();
  const { recipes, loading, error, removeRecipe, updateRecipe, searchRecipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recipes based on search
  const filteredRecipes = useMemo(() => {
    return searchRecipes(searchQuery);
  }, [searchRecipes, searchQuery]);

  const handleRemove = async (id: string) => {
    try {
      await removeRecipe(id);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const handleUpdate = async (updatedRecipe: any) => {
    try {
      await updateRecipe(updatedRecipe);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up pb-24">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-24">
      {/* Header Card */}
      <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
          <BookOpen className="text-primary" />
          Моя коллекция
        </h2>
        <p className="text-text-secondary dark:text-gray-400 mt-2 text-sm">
          {session
            ? "Ваши рецепты синхронизированы с облаком."
            : "Рецепты сохранены только на этом устройстве. Войдите, чтобы сохранить их навсегда."}
        </p>
      </div>

      {/* Search Bar */}
      {recipes.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            placeholder="Поиск рецептов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl text-text-main dark:text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Empty State */}
      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <AlertCircle className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
          <h3 className="text-lg font-medium text-text-main dark:text-white">Пока нет сохраненных рецептов</h3>
          <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">
            Создайте или сфотографируйте блюдо, чтобы добавить его сюда.
          </p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Search className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
          <h3 className="text-lg font-medium text-text-main dark:text-white">Ничего не найдено</h3>
          <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">
            Попробуйте изменить поисковый запрос
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredRecipes.map((recipe, index) => (
            <div key={recipe.id || recipe.title} className="stagger-item">
              <RecipeCard
                recipe={recipe}
                isSavedView={true}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;