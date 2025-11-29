import React, { useState, useRef } from 'react';
import { generateRecipeFromPhoto } from '../services/geminiService';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  RefreshCcw,
  Sparkles,
  UtensilsCrossed,
  History
} from 'lucide-react';

const PhotoAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for different inputs
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setRecipe(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
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
        <h2 className="text-3xl font-bold leading-tight text-text-main mb-3">
          Что у вас на кухне?
        </h2>
        <p className="text-text-secondary text-base leading-relaxed">
          Наведите камеру на ингредиенты или блюдо, чтобы найти рецепты.
        </p>
      </div>

      {/* Main Scanner Interaction */}
      <div className="relative flex flex-col items-center justify-center mb-10 w-full">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-cyan-soft/20 rounded-full animate-pulse-slow scale-110 blur-3xl pointer-events-none"></div>

        {/* Main Button / Preview */}
        <button
          onClick={() => image ? handleAnalyze() : cameraInputRef.current?.click()}
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
              <Camera size={64} className="text-text-main" strokeWidth={2} />
              <span className="text-lg font-bold text-text-main block">Нажмите для скана</span>
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
        {/* Camera specific input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Secondary Actions */}
      {!image && (
        <div className="flex items-center gap-16 mb-12">
          <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 group w-20">
            <div className="size-16 bg-cyan-soft/20 rounded-full flex items-center justify-center shadow-sm group-hover:bg-cyan-soft/30 transition-colors">
              <ImageIcon size={28} className="text-text-main" />
            </div>
            <span className="text-sm font-medium text-text-main">Галерея</span>
          </button>

          <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 group w-20">
            <div className="size-16 bg-cyan-soft/20 rounded-full flex items-center justify-center shadow-sm group-hover:bg-cyan-soft/30 transition-colors">
              <RefreshCcw size={28} className="text-text-main" />
            </div>
            <span className="text-sm font-medium text-text-main">Переключить</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Action Button (Confirm) */}
      {/* Removed - main button now handles analyze */}

      {/* Recent Findings Placeholder */}
      <div className="w-full max-w-md mt-auto">
        <h3 className="text-lg font-bold text-text-main mb-4 px-2">Ваши недавние находки</h3>
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-cyan-soft/50 p-8 text-center bg-cyan-soft/5">
          <div className="relative">
            <History size={40} className="text-cyan-soft/60" />
            {/* Overlay X or similar if needed, keeping simple for now */}
          </div>
          <p className="text-text-secondary text-sm font-medium">
            Ваши сканированные фото появятся здесь
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalysis;