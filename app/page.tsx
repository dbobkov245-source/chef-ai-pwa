'use client';

import React, { useState } from 'react';
import PhotoAnalysis from '../components/PhotoAnalysis';
import FusionLab from '../components/FusionLab';
import SavedRecipes from '../components/SavedRecipes';
import { AppMode } from '../types';
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ArrowLeft,
  MoreVertical,
  Camera,
  FlaskConical,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<AppMode>(AppMode.PHOTO_ANALYSIS);
  const { data: session } = useSession();

  const getTitle = () => {
    switch (mode) {
      case AppMode.PHOTO_ANALYSIS: return "Сфоткай. Готовь. Твори.";
      case AppMode.FUSION_LAB: return "Создайте Свой Фьюжн";
      case AppMode.SAVED_RECIPES: return "Коллекция Рецептов";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-sans text-text-main">
      {/* Minimal Header */}
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 z-10 bg-background-light/90 backdrop-blur-sm">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cyan-soft/20 transition-colors text-text-main">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h1 className="text-lg font-bold text-text-main tracking-tight">{getTitle()}</h1>
        <div className="w-10 flex justify-end">
          {session ? (
            <button onClick={() => signOut()} className="w-10 h-10 rounded-full bg-cyan-soft flex items-center justify-center overflow-hidden shadow-sm">
              <span className="text-xs font-bold text-text-main">{session.user?.name?.charAt(0) || "U"}</span>
            </button>
          ) : (
            <button onClick={() => signIn()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cyan-soft/20 transition-colors text-text-main">
              <MoreVertical size={24} strokeWidth={2} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-2 overflow-hidden flex flex-col">
        {mode === AppMode.PHOTO_ANALYSIS && <PhotoAnalysis />}
        {mode === AppMode.FUSION_LAB && <FusionLab />}
        {mode === AppMode.SAVED_RECIPES && <SavedRecipes />}
      </main>

      {/* Bottom Navigation (Floating on Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-cyan-soft/20 px-6 py-4 flex justify-around z-30 safe-area-pb">
        <button
          onClick={() => setMode(AppMode.PHOTO_ANALYSIS)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${mode === AppMode.PHOTO_ANALYSIS ? 'text-text-main scale-110' : 'text-text-secondary hover:text-text-main'}`}
        >
          <Camera
            size={24}
            className={mode === AppMode.PHOTO_ANALYSIS ? "fill-cyan-soft text-text-main" : ""}
            strokeWidth={mode === AppMode.PHOTO_ANALYSIS ? 2 : 2}
          />
        </button>

        <button
          onClick={() => setMode(AppMode.FUSION_LAB)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${mode === AppMode.FUSION_LAB ? 'text-text-main scale-110' : 'text-text-secondary hover:text-text-main'}`}
        >
          <FlaskConical
            size={24}
            className={mode === AppMode.FUSION_LAB ? "fill-cyan-soft text-text-main" : ""}
            strokeWidth={mode === AppMode.FUSION_LAB ? 2 : 2}
          />
        </button>

        <button
          onClick={() => setMode(AppMode.SAVED_RECIPES)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${mode === AppMode.SAVED_RECIPES ? 'text-text-main scale-110' : 'text-text-secondary hover:text-text-main'}`}
        >
          <BookOpen
            size={24}
            className={mode === AppMode.SAVED_RECIPES ? "fill-cyan-soft text-text-main" : ""}
            strokeWidth={mode === AppMode.SAVED_RECIPES ? 2 : 2}
          />
        </button>
      </div>
    </div>
  );
}