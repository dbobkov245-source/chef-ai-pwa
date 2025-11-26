import React, { useState } from 'react';
import { CUISINES } from '../constants';
import { generateFusionRecipe } from '../services/geminiService';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { 
  ArrowLeft, 
  ChevronDown, 
  ArrowRightLeft, 
  Sparkles 
} from 'lucide-react';

const FusionLab: React.FC = () => {
  const [cuisine1, setCuisine1] = useState(CUISINES[0].value);
  const [cuisine2, setCuisine2] = useState(CUISINES[1].value);
  const [creativity, setCreativity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setRecipe(null);
    try {
      const result = await generateFusionRecipe(cuisine1, cuisine2, creativity);
      setRecipe(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCreativityLabel = (val: number) => {
    if (val < 4) return "Традиционный";
    if (val < 8) return "Смелый";
    return "Экспериментальный";
  };

  if (recipe) {
    return (
      <div className="animate-fade-in-up pb-24">
         <button 
           onClick={() => setRecipe(null)}
           className="mb-4 flex items-center gap-2 text-text-secondary hover:text-text-main font-medium"
         >
           <ArrowLeft size={20} />
           Назад к лаборатории
         </button>
         <RecipeCard recipe={recipe} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up pb-24 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-main mb-2">Миксуй вкусы</h2>
        <p className="text-text-secondary">Выберите две кухни для создания уникального рецепта.</p>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        {/* Cuisine 1 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-main ml-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Основная кухня
          </label>
          <div className="relative">
            <select
              value={cuisine1}
              onChange={(e) => setCuisine1(e.target.value)}
              className="w-full appearance-none bg-background-light border-0 rounded-xl px-4 py-4 pr-10 text-text-main font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-shadow cursor-pointer"
            >
              {CUISINES.map((c) => (
                <option key={`c1-${c.value}`} value={c.value}>{c.label}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-text-secondary">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Mixer Icon */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-white border border-gray-100 p-2 rounded-full shadow-sm flex items-center justify-center">
            <ArrowRightLeft className="text-primary rotate-90 md:rotate-0" size={24} />
          </div>
        </div>

        {/* Cuisine 2 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-main ml-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Дополнительная кухня
          </label>
          <div className="relative">
             <select
              value={cuisine2}
              onChange={(e) => setCuisine2(e.target.value)}
              className="w-full appearance-none bg-background-light border-0 rounded-xl px-4 py-4 pr-10 text-text-main font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-shadow cursor-pointer"
            >
              {CUISINES.map((c) => (
                <option key={`c2-${c.value}`} value={c.value}>{c.label}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-text-secondary">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Creativity Slider */}
        <div className="pt-4 space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-sm font-bold text-text-main ml-1">Уровень креативности</label>
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary-dark rounded-md">
              {getCreativityLabel(creativity)}
            </span>
          </div>
          
          <div className="relative h-10 flex items-center">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={creativity} 
              onChange={(e) => setCreativity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary font-medium px-1">
            <span>Классика</span>
            <span>Эксперимент</span>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-24 md:bottom-8 left-4 right-4 max-w-md mx-auto z-20">
         <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full h-14 rounded-2xl font-bold text-lg text-text-main flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 border border-white/20 ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {loading ? (
             <div className="w-6 h-6 border-3 border-text-main border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles size={24} />
              Создать рецепт
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FusionLab;