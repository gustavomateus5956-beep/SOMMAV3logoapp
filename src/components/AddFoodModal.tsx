import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Utensils, Check, Flame, ChevronRight, Calculator } from 'lucide-react';
import { SOLID_FOOD_DATABASE } from '../data/dietData';
import { FoodItem, MealFoodEntry } from '../types';

interface AddFoodModalProps {
  mealName: string;
  onClose: () => void;
  onAddFood: (entry: MealFoodEntry) => void;
}

const CATEGORIES = ['Todos', 'Proteínas', 'Carboidratos', 'Gorduras Boas', 'Frutas & Vegetais', 'Laticínios', 'Suplementos'];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  mealName,
  onClose,
  onAddFood
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionGrams, setPortionGrams] = useState<number>(100);

  const filteredFoods = useMemo(() => {
    return SOLID_FOOD_DATABASE.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'Todos' || food.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setPortionGrams(food.servingSize);
  };

  // Calculate scaled macros based on chosen portion
  const calculatedMacros = useMemo(() => {
    if (!selectedFood) return { cal: 0, prot: 0, carb: 0, fat: 0 };
    const ratio = portionGrams / selectedFood.servingSize;
    return {
      cal: Math.round(selectedFood.calories * ratio),
      prot: parseFloat((selectedFood.protein * ratio).toFixed(1)),
      carb: parseFloat((selectedFood.carbs * ratio).toFixed(1)),
      fat: parseFloat((selectedFood.fats * ratio).toFixed(1))
    };
  }, [selectedFood, portionGrams]);

  const handleConfirmAdd = () => {
    if (!selectedFood) return;
    const entry: MealFoodEntry = {
      id: `mfe-${Date.now()}`,
      foodId: selectedFood.id,
      name: selectedFood.name,
      portion: portionGrams,
      portionDisplay: `${portionGrams}${selectedFood.servingUnit}`,
      calories: calculatedMacros.cal,
      protein: calculatedMacros.prot,
      carbs: calculatedMacros.carb,
      fats: calculatedMacros.fat
    };
    onAddFood(entry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#14181f] border border-[#262a30] rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262a30]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Adicionar Alimento</h3>
              <p className="text-xs text-[#8c90a1]">Para: <strong className="text-white">{mealName}</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If no food selected, show search & browse */}
        {!selectedFood ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c90a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar alimento (ex: Frango, Arroz, Ovo, Whey, Batata)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs sm:text-sm placeholder-[#8c90a1] focus:border-[#0066ff] outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0066ff] text-white'
                      : 'bg-[#181c21] text-[#8c90a1] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food items list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar max-h-[380px]">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="bg-[#181c21] hover:bg-[#1d2229] border border-[#262a30] rounded-2xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-[#8c90a1] font-semibold">{food.category}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#4edea3] transition-colors">
                      {food.name}
                    </h4>
                    <span className="text-[11px] text-[#8c90a1] mt-0.5">
                      Base: {food.servingSize}{food.servingUnit} • {food.calories} kcal
                    </span>
                  </div>

                  {/* Quick Macro chips */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end text-[10px]">
                      <span className="font-bold text-[#b3c5ff]">P: {food.protein}g</span>
                      <span className="text-[#8c90a1]">C: {food.carbs}g • G: {food.fats}g</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-[#262a30] text-[#c2c6d8] group-hover:bg-[#0066ff] group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Food Portion Customizer */
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="bg-[#181c21] p-4 rounded-2xl border border-[#262a30] flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4edea3] uppercase tracking-wider">
                {selectedFood.category}
              </span>
              <h4 className="text-base font-black text-white">{selectedFood.name}</h4>
              <p className="text-xs text-[#8c90a1]">
                Tabela de referência: {selectedFood.servingSize}{selectedFood.servingUnit} ({selectedFood.calories} kcal)
              </p>
            </div>

            {/* Portion Adjuster */}
            <div className="bg-[#101419] p-4 rounded-2xl border border-[#262a30] flex flex-col gap-3">
              <label className="text-xs font-bold text-[#8c90a1] uppercase flex items-center justify-between">
                <span>Quantidade / Porção ({selectedFood.servingUnit})</span>
                <span className="text-white font-extrabold text-sm">{portionGrams} {selectedFood.servingUnit}</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPortionGrams((p) => Math.max(10, p - 25))}
                  className="w-11 h-11 rounded-xl bg-[#262a30] text-white font-bold text-lg hover:bg-[#31353b]"
                >
                  -
                </button>
                <input
                  type="number"
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Math.max(1, Number(e.target.value) || 0))}
                  className="flex-1 h-11 text-center bg-[#181c21] border border-[#262a30] rounded-xl text-white font-extrabold text-base focus:border-[#0066ff] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPortionGrams((p) => p + 25)}
                  className="w-11 h-11 rounded-xl bg-[#262a30] text-white font-bold text-lg hover:bg-[#31353b]"
                >
                  +
                </button>
              </div>

              {/* Quick portion presets */}
              <div className="flex gap-2 pt-1">
                {[50, 100, 150, 200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPortionGrams(preset)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      portionGrams === preset
                        ? 'bg-[#0066ff]/20 text-[#b3c5ff] border-[#0066ff]'
                        : 'bg-[#181c21] text-[#8c90a1] border-[#262a30] hover:text-white'
                    }`}
                  >
                    {preset}{selectedFood.servingUnit}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Macros Result */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#8c90a1] uppercase block">Calorias</span>
                <span className="text-base font-black text-white">{calculatedMacros.cal}</span>
                <span className="text-[9px] text-[#8c90a1]">kcal</span>
              </div>
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#0066ff] uppercase block">Proteínas</span>
                <span className="text-base font-black text-[#b3c5ff]">{calculatedMacros.prot}</span>
                <span className="text-[9px] text-[#8c90a1]">g</span>
              </div>
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#4edea3] uppercase block">Carbos</span>
                <span className="text-base font-black text-[#4edea3]">{calculatedMacros.carb}</span>
                <span className="text-[9px] text-[#8c90a1]">g</span>
              </div>
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#ffb59d] uppercase block">Gorduras</span>
                <span className="text-base font-black text-[#ffb59d]">{calculatedMacros.fat}</span>
                <span className="text-[9px] text-[#8c90a1]">g</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="flex-1 h-12 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Voltar à Lista
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 h-12 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#0066ff]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar à Refeição</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
