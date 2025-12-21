'use client';

import React, { useState } from 'react';
import PhotoAnalysis from '../components/PhotoAnalysis';
import FusionLab from '../components/FusionLab';
import SavedRecipes from '../components/SavedRecipes';
import { AppMode } from '../types';
import { useSession, signIn, signOut } from "next-auth/react";
import { useDarkMode } from '../hooks';
import {
  ArrowLeft,
  MoreVertical,
  Camera,
  FlaskConical,
  BookOpen,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<AppMode>(AppMode.PHOTO_ANALYSIS);
  const { data: session } = useSession();
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getTitle = () => {
    switch (mode) {
      case AppMode.PHOTO_ANALYSIS: return "Сфоткай. Готовь. Твори.";
      case AppMode.FUSION_LAB: return "Создайте Свой Фьюжн";
      case AppMode.SAVED_RECIPES: return "Коллекция Рецептов";
      default: return "";
    }
  };

  const navItems = [
    { mode: AppMode.PHOTO_ANALYSIS, icon: Camera, label: 'Скан' },
    { mode: AppMode.FUSION_LAB, icon: FlaskConical, label: 'Фьюжн' },
    { mode: AppMode.SAVED_RECIPES, icon: BookOpen, label: 'Рецепты' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-sans text-text-main dark:text-text-main transition-theme">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cyan-soft/20 transition-colors text-text-main">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>

        <h1 className="text-lg font-bold text-text-main tracking-tight">{getTitle()}</h1>

        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cyan-soft/20 transition-colors text-text-main"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Menu */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-sm hover:bg-primary-dark transition-colors"
              >
                <span className="text-xs font-bold text-text-main">
                  {session.user?.name?.charAt(0) || "U"}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-text-secondary truncate">{session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => { signOut(); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600"
                  >
                    <LogOut size={16} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cyan-soft/20 transition-colors text-text-main"
            >
              <MoreVertical size={24} strokeWidth={2} />
            </button>
          )}
        </div>
      </header>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-2 overflow-hidden flex flex-col">
        {mode === AppMode.PHOTO_ANALYSIS && <PhotoAnalysis />}
        {mode === AppMode.FUSION_LAB && <FusionLab />}
        {mode === AppMode.SAVED_RECIPES && <SavedRecipes />}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-t border-cyan-soft/20 dark:border-gray-700 px-6 py-4 flex justify-around z-30 safe-area-pb">
        {navItems.map(({ mode: itemMode, icon: Icon, label }) => {
          const isActive = mode === itemMode;
          return (
            <button
              key={itemMode}
              onClick={() => setMode(itemMode)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 px-4 py-1 rounded-xl ${isActive
                  ? 'text-text-main bg-primary/20 scale-105'
                  : 'text-text-secondary hover:text-text-main'
                }`}
            >
              <Icon
                size={24}
                className={isActive ? "text-primary" : ""}
                strokeWidth={2}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}