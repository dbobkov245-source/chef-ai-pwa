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
    switch(mode) {
      case AppMode.PHOTO_ANALYSIS: return "Сфоткай. Готовь. Твори.";
      case AppMode.FUSION_LAB: return "Создайте Свой Фьюжн";
      case AppMode.SAVED_RECIPES: return "Коллекция Рецептов";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Minimal Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-10 bg-background-light/80 backdrop-blur-md">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
           <ArrowLeft size={24} className="text-text-main" />
        </button>
        <h1 className="text-lg font-bold text-text-main">{getTitle()}</h1>
        <div className="w-10 flex justify-end">
           {session ? (
             <button onClick={() => signOut()} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold">{session.user?.name?.charAt(0) || "U"}</span>
             </button>
           ) : (
             <button onClick={() => signIn()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                <MoreVertical size={24} className="text-text-main" />
             </button>
           )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-2 overflow-hidden">
        {mode === AppMode.PHOTO_ANALYSIS && <PhotoAnalysis />}
        {mode === AppMode.FUSION_LAB && <FusionLab />}
        {mode === AppMode.SAVED_RECIPES && <SavedRecipes />}
      </main>

      {/* Bottom Navigation (Floating on Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around md:hidden z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] safe-area-pb">
        <button 
          onClick={() => setMode(AppMode.PHOTO_ANALYSIS)}
          className={`flex flex-col items-center gap-1 transition-colors ${mode === AppMode.PHOTO_ANALYSIS ? 'text-text-main' : 'text-gray-400'}`}
        >
          <Camera 
            size={24} 
            className={mode === AppMode.PHOTO_ANALYSIS ? "fill-current" : ""} 
            strokeWidth={mode === AppMode.PHOTO_ANALYSIS ? 2.5 : 2}
          />
        </button>
        
        <button 
          onClick={() => setMode(AppMode.FUSION_LAB)}
          className={`flex flex-col items-center gap-1 transition-colors ${mode === AppMode.FUSION_LAB ? 'text-text-main' : 'text-gray-400'}`}
        >
          <FlaskConical 
            size={24} 
            className={mode === AppMode.FUSION_LAB ? "fill-current" : ""}
            strokeWidth={mode === AppMode.FUSION_LAB ? 2.5 : 2}
          />
        </button>

        <button 
          onClick={() => setMode(AppMode.SAVED_RECIPES)}
          className={`flex flex-col items-center gap-1 transition-colors ${mode === AppMode.SAVED_RECIPES ? 'text-text-main' : 'text-gray-400'}`}
        >
          <BookOpen 
            size={24} 
            className={mode === AppMode.SAVED_RECIPES ? "fill-current" : ""}
            strokeWidth={mode === AppMode.SAVED_RECIPES ? 2.5 : 2}
          />
        </button>
      </div>
    </div>
  );
}