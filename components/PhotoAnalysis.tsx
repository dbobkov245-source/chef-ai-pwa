'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateRecipeFromPhoto } from '../services/geminiService';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { useLocalStorage } from '../hooks';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Sparkles,
  History,
  ExternalLink,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface ScanHistoryItem {
  id: string;
  image: string;
  timestamp: number;
  recipeName?: string;
}

const PhotoAnalysis: React.FC = () => {
  const [isTelegramWebView, setIsTelegramWebView] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useLocalStorage<ScanHistoryItem[]>('chef_ai_scan_history', []);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress image to reduce payload size
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxSize = 1200;
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Create thumbnail for history
  const createThumbnail = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = imageData;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
        setRecipe(null);
        setError(null);
      } catch (err) {
        setError("Не удалось обработать изображение");
      }
    }
  };

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isTelegram = userAgent.includes('Telegram');
    setIsTelegramWebView(isTelegram);
  }, []);

  const openInBrowser = () => {
    const url = window.location.href;
    window.open(url, '_system');
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const result = await generateRecipeFromPhoto(base64Data, mimeType);
      setRecipe(result);

      // Save to history
      const thumbnail = await createThumbnail(image);
      const historyItem: ScanHistoryItem = {
        id: crypto.randomUUID(),
        image: thumbnail,
        timestamp: Date.now(),
        recipeName: result.title,
      };
      setScanHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10

    } catch (err) {
      setError("Не удалось распознать фото. Попробуйте другое изображение.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setRecipe(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const removeHistoryItem = (id: string) => {
    setScanHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  if (recipe) {
    return (
      <div className="animate-fade-in-up pb-24">
        <button
          onClick={clearImage}
          className="mb-4 flex items-center gap-2 text-text-secondary hover:text-text-main font-medium"
        >
          <ArrowLeft size={20} />
          Назад к сканеру
        </button>
        <RecipeCard recipe={recipe} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in-up h-full pb-24 px-4">

      {/* Header Info */}
      <div className="text-center mt-4 mb-8 max-w-sm">
        <h2 className="text-3xl font-bold leading-tight text-text-main dark:text-white mb-3">
          Что у вас на кухне?
        </h2>
        <p className="text-text-secondary dark:text-gray-400 text-base leading-relaxed">
          Наведите камеру на ингредиенты или блюдо, чтобы найти рецепты.
        </p>
      </div>

      {/* Telegram WebView Warning */}
      {isTelegramWebView && (
        <div className="w-full max-w-md mb-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-4 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-1">Доступ к камере ограничен</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                Telegram не позволяет использовать камеру. Откройте сайт в браузере (Safari, Chrome) для полного доступа.
              </p>
              <button
                onClick={openInBrowser}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-amber-700 transition-colors"
              >
                <ExternalLink size={16} />
                Открыть в браузере
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Scanner Interaction */}
      <div className="relative flex flex-col items-center justify-center mb-10 w-full">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-cyan-soft/20 rounded-full animate-pulse-slow scale-110 blur-3xl pointer-events-none"></div>

        {/* Main Button / Preview */}
        <button
          onClick={() => image ? handleAnalyze() : galleryInputRef.current?.click()}
          disabled={loading}
          className="relative group w-72 h-72 rounded-full overflow-hidden shadow-2xl shadow-cyan-soft/30 transition-transform active:scale-95 focus:outline-none z-10 bg-cyan-soft flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {image ? (
            <div className="w-full h-full relative">
              <img src={image} alt="Scan preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                {loading ? (
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="bg-white/90 text-text-main px-6 py-3 rounded-full font-bold text-sm shadow-lg backdrop-blur-md flex items-center gap-2">
                    <Sparkles size={20} />
                    Готовить
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-main hover:bg-cyan-soft/90 transition-colors gap-4">
              <ImageIcon size={64} className="text-text-main" strokeWidth={2} />
              <span className="text-lg font-bold text-text-main block">Выбрать фото</span>
            </div>
          )}
        </button>

        {/* Hidden Inputs */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple={false}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Secondary Actions */}
      {!image && (
        <div className="flex items-center gap-16 mb-12">
          <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 group w-20">
            <div className="size-16 bg-cyan-soft/20 dark:bg-cyan-soft/10 rounded-full flex items-center justify-center shadow-sm group-hover:bg-cyan-soft/30 transition-colors">
              <Camera size={28} className="text-text-main dark:text-white" />
            </div>
            <span className="text-sm font-medium text-text-main dark:text-white">Камера</span>
          </button>

          <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 group w-20">
            <div className="size-16 bg-cyan-soft/20 dark:bg-cyan-soft/10 rounded-full flex items-center justify-center shadow-sm group-hover:bg-cyan-soft/30 transition-colors">
              <ImageIcon size={28} className="text-text-main dark:text-white" />
            </div>
            <span className="text-sm font-medium text-text-main dark:text-white">Галерея</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Recent Findings - Now with Real Data */}
      <div className="w-full max-w-md mt-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-text-main dark:text-white">Ваши недавние находки</h3>
          {scanHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-text-secondary hover:text-red-500 transition-colors"
            >
              Очистить
            </button>
          )}
        </div>

        {scanHistory.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-cyan-soft/50 dark:border-gray-700 p-8 text-center bg-cyan-soft/5 dark:bg-surface-dark">
            <History size={40} className="text-cyan-soft/60 dark:text-gray-600" />
            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">
              Ваши сканированные фото появятся здесь
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {scanHistory.map((item) => (
              <div
                key={item.id}
                className="relative flex-shrink-0 w-20 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                  <img
                    src={item.image}
                    alt={item.recipeName || 'Scan'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-1 text-xs text-text-secondary dark:text-gray-400 truncate text-center">
                  {item.recipeName?.split(' ').slice(0, 2).join(' ') || 'Скан'}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); removeHistoryItem(item.id); }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoAnalysis;