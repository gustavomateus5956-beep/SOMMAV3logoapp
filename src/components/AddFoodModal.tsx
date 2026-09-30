import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Plus, Utensils, Check, Flame, ChevronRight, Calculator } from 'lucide-react';
import type { MealFoodEntry } from '../types';
import type { Food } from '../features/nutrition/food';
import { NutritionCatalogService, nutritionCatalogService } from '../features/nutrition/NutritionCatalogService';
import { toLegacyFoodItem, toLegacyMacros, toMealFoodEntry, displayNutrient, type CatalogFoodItem } from '../features/nutrition/legacyFoodAdapter';

interface AddFoodModalProps {
  mealName: string;
  onClose: () => void;
  onAddFood: (entry: MealFoodEntry) => void;
  service?: NutritionCatalogService;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  mealName,
  onClose,
  onAddFood,
  service = nutritionCatalogService
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<Food | null>(null);
  const selectedFood = selectedRecord ? toLegacyFoodItem(selectedRecord) : null;
  const [portionInput, setPortionInput] = useState('100');
  const portionGrams = Number(portionInput);
  const [foods, setFoods] = useState<Food[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState('');
  const [searchAttempt, setSearchAttempt] = useState(0);
  const [addError, setAddError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const confirmRequest = useRef<AbortController | null>(null);
  const categories = useMemo(() => [{ id: '', label: 'Todos' }, ...service.getCategories()], [service]);
  const filteredFoods = foods.map(toLegacyFoodItem);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setSearchError('');
    service.search(searchQuery, { category: selectedCategory || undefined, page, limit: 30, signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted) return;
        setFoods(previous => page === 1 ? result.items : [...previous, ...result.items]);
        setHasNextPage(result.hasNextPage);
      })
      .catch(() => {
        if (!controller.signal.aborted) setSearchError('Não foi possível carregar os alimentos. Tente novamente.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [searchQuery, selectedCategory, page, service, searchAttempt]);

  useEffect(() => () => confirmRequest.current?.abort(), []);

  const resetSearch = () => { setPage(1); setFoods([]); setHasNextPage(false); setLoading(true); };
  const handleSelectFood = (food: CatalogFoodItem) => {
    setSelectedRecord(foods.find(record => record.id === food.id) ?? null);
    setPortionInput('100'); setAddError('');
  };

  // Calculate scaled macros based on chosen portion
  const calculatedMacros = useMemo(() => {
    if (!selectedRecord) return { values: {}, error: '' };
    try {
      return { values: toLegacyMacros(service.calculateForFood(selectedRecord, { amount: portionGrams, unit: 'g' }).nutrition), error: '' };
    } catch (error) {
      return { values: {}, error: error instanceof Error ? error.message : 'Quantidade inválida.' };
    }
  }, [selectedRecord, portionGrams, service]);

  const handleConfirmAdd = async () => {
    if (!selectedRecord || calculatedMacros.error || confirmRequest.current) return;
    const controller = new AbortController(); confirmRequest.current = controller;
    setIsSaving(true); setAddError('');
    try {
      const snapshot = await service.createSnapshot(selectedRecord.id, { amount: portionGrams, unit: 'g' }, controller.signal);
      if (controller.signal.aborted) return;
      onAddFood(toMealFoodEntry(snapshot)); onClose();
    } catch (error) {
      if (!controller.signal.aborted) setAddError(error instanceof Error ? error.message : 'Não foi possível adicionar o alimento.');
    } finally {
      if (!controller.signal.aborted) { confirmRequest.current = null; setIsSaving(false); }
    }
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
            onClick={() => { confirmRequest.current?.abort(); onClose(); }}
            aria-label="Fechar adicionar alimento"
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
                placeholder="Pesquisar alimento (ex: Frango, Arroz, Ovo, Feijão, Batata)..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); resetSearch(); }}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs sm:text-sm placeholder-[#8c90a1] focus:border-[#0066ff] outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { if (selectedCategory !== cat.id) { setSelectedCategory(cat.id); resetSearch(); } }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#0066ff] text-white'
                      : 'bg-[#181c21] text-[#8c90a1] hover:text-white'
                  }`}
                >
                  {cat.label}
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
                      Base: {food.servingSize}{food.servingUnit} • {displayNutrient(food.calories, 0)} kcal
                    </span>
                  </div>

                  {/* Quick Macro chips */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end text-[10px]">
                      <span className="font-bold text-[#b3c5ff]">P: {displayNutrient(food.protein)}g</span>
                      <span className="text-[#8c90a1]">C: {displayNutrient(food.carbs)}g • G: {displayNutrient(food.fats)}g</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-[#262a30] text-[#c2c6d8] group-hover:bg-[#0066ff] group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
              {loading && <p role="status" className="text-xs text-[#8c90a1]">Carregando alimentos…</p>}
              {searchError && <><p role="alert" className="text-xs text-[#ffb59d]">{searchError}</p><button type="button" onClick={() => setSearchAttempt(attempt => attempt + 1)} className="w-full h-10 rounded-xl bg-[#262a30] text-white text-xs font-bold">Tentar novamente</button></>}
              {!loading && !searchError && foods.length === 0 && <p role="status" className="text-xs text-[#8c90a1]">Nenhum alimento encontrado.</p>}
              {!loading && hasNextPage && !searchError && <button type="button" onClick={() => { setLoading(true); setPage(p => p + 1); }} className="w-full h-10 rounded-xl bg-[#262a30] text-white text-xs font-bold">Carregar mais</button>}
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
                {selectedRecord?.source === 'taco' ? 'TACO/NEPA–UNICAMP (2011)' : 'Tabela de referência'}: {selectedFood.servingSize}{selectedFood.servingUnit} ({displayNutrient(selectedFood.calories, 0)} kcal)
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
                  disabled={isSaving}
                  onClick={() => setPortionInput(String(Math.max(10, (Number.isFinite(portionGrams) ? portionGrams : 100) - 25)))}
                  className="w-11 h-11 rounded-xl bg-[#262a30] text-white font-bold text-lg hover:bg-[#31353b]"
                >
                  -
                </button>
                <input
                  type="number"
                  aria-label="Quantidade em gramas"
                  min="0"
                  step="any"
                  disabled={isSaving}
                  value={portionInput}
                  onChange={(e) => setPortionInput(e.target.value)}
                  className="flex-1 h-11 text-center bg-[#181c21] border border-[#262a30] rounded-xl text-white font-extrabold text-base focus:border-[#0066ff] outline-none"
                />
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setPortionInput(String((Number.isFinite(portionGrams) ? portionGrams : 100) + 25))}
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
                    disabled={isSaving}
                    onClick={() => setPortionInput(String(preset))}
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
            <div className="grid grid-cols-4 gap-2" title="— indica nutriente não informado na fonte; não significa zero.">
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#8c90a1] uppercase block">Calorias</span>
                <span className="text-base font-black text-white">{displayNutrient(calculatedMacros.values.calories, 0)}</span>
                <span className="text-[9px] text-[#8c90a1]">kcal</span>
              </div>
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#0066ff] uppercase block">Proteínas</span>
                <span className="text-base font-black text-[#b3c5ff]">{displayNutrient(calculatedMacros.values.protein)}</span>
                <span className="text-[9px] text-[#8c90a1]">g</span>
              </div>
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#4edea3] uppercase block">Carbos</span>
                <span className="text-base font-black text-[#4edea3]">{displayNutrient(calculatedMacros.values.carbs)}</span>
                <span className="text-[9px] text-[#8c90a1]">g</span>
              </div>
              <div className="bg-[#181c21] p-2.5 rounded-xl text-center border border-[#262a30]">
                <span className="text-[10px] font-bold text-[#ffb59d] uppercase block">Gorduras</span>
                <span className="text-base font-black text-[#ffb59d]">{displayNutrient(calculatedMacros.values.fats)}</span>
                <span className="text-[9px] text-[#8c90a1]">g</span>
              </div>
            </div>

            {/* Action buttons */}
            {(calculatedMacros.error || addError) && <p role="alert" className="text-xs text-[#ffb59d]">{calculatedMacros.error || addError}</p>}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setSelectedRecord(null)}
                className="flex-1 h-12 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Voltar à Lista
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={isSaving || Boolean(calculatedMacros.error)}
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
