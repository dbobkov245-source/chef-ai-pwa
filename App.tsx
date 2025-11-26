import React, { useState } from 'react';
import { Camera, FlaskConical, ChefHat } from 'lucide-react';
import PhotoAnalysis from './components/PhotoAnalysis';
import FusionLab from './components/FusionLab';
import { AppMode } from './types';
import { APP_NAME } from './constants';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.PHOTO_ANALYSIS);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center md:justify-start gap-2">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <ChefHat size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">{APP_NAME}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {mode === AppMode.PHOTO_ANALYSIS ? <PhotoAnalysis /> : <FusionLab />}
      </main>

      {/* Mobile Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-around md:hidden z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setMode(AppMode.PHOTO_ANALYSIS)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mode === AppMode.PHOTO_ANALYSIS ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Camera size={24} />
          <span className="text-xs font-medium">Анализ фото</span>
        </button>
        
        <button 
          onClick={() => setMode(AppMode.FUSION_LAB)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mode === AppMode.FUSION_LAB ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FlaskConical size={24} />
          <span className="text-xs font-medium">Фьюжн</span>
        </button>
      </div>

      {/* Desktop Toggle (Visible only on md+) */}
      <div className="hidden md:flex justify-center mb-8">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
          <button 
            onClick={() => setMode(AppMode.PHOTO_ANALYSIS)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === AppMode.PHOTO_ANALYSIS 
                ? 'bg-orange-100 text-orange-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Анализ фото
          </button>
          <button 
            onClick={() => setMode(AppMode.FUSION_LAB)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === AppMode.FUSION_LAB 
                ? 'bg-purple-100 text-purple-700 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Фьюжн-лаборатория
          </button>
        </div>
      </div>
    </div>
  );
}
