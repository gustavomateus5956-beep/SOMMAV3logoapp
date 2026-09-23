import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Droplet,
  Pill,
  Check
} from 'lucide-react';
import { INITIAL_NUTRITION_PLAN } from '../data/dietData';
import { NutritionPlan, DailyMeal, MealFoodEntry } from '../types';
import { AddFoodModal } from './AddFoodModal';
import { PageHeader } from './PageHeader';
import { useUser } from '../context/UserContext';

// Helper to simplify meal names if desired
const formatMealDisplayName = (name: string): string => {
  if (name.toLowerCase().includes('café')) return 'Café da manhã';
  if (name.toLowerCase().includes('lanche da manhã')) return 'Lanche da manhã';
  if (name.toLowerCase().includes('almoço')) return 'Almoço';
  if (name.toLowerCase().includes('pré-treino') || name.toLowerCase().includes('pre-treino')) return 'Pré-treino';
  if (name.toLowerCase().includes('pós-treino') || name.toLowerCase().includes('jantar')) return 'Pós-treino / Jantar';
  if (name.toLowerCase().includes('ceia')) return 'Ceia';
  return name;
};

export const DietView: React.FC = () => {
  const { user } = useUser();
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>(INITIAL_NUTRITION_PLAN);
  const [waterConsumedMl, setWaterConsumedMl] = useState<number>(2450);
  const [activeMealForAdd, setActiveMealForAdd] = useState<DailyMeal | null>(null);
  const [expandedMealIds, setExpandedMealIds] = useState<string[]>(['meal-3']); // Expand Almoço by default
  const [supplementStack, setSupplementStack] = useState(INITIAL_NUTRITION_PLAN.supplementStack);

  // Toggle meal completion
  const handleToggleMealCompleted = (mealId: string) => {
    setNutritionPlan((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) =>
        meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
      )
    }));
  };

  // Toggle meal accordion expansion
  const toggleMealExpanded = (mealId: string) => {
    setExpandedMealIds((prev) =>
      prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  // Add food to meal
  const handleAddFoodToMeal = (entry: MealFoodEntry) => {
    if (!activeMealForAdd) return;
    setNutritionPlan((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) => {
        if (meal.id === activeMealForAdd.id) {
          return {
            ...meal,
            foods: [...meal.foods, entry]
          };
        }
        return meal;
      })
    }));
    setActiveMealForAdd(null);
  };

  // Remove food from meal
  const handleRemoveFood = (mealId: string, entryId: string) => {
    setNutritionPlan((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            foods: meal.foods.filter((f) => f.id !== entryId)
          };
        }
        return meal;
      })
    }));
  };

  // Toggle supplement taken
  const handleToggleSupplement = (supId: string) => {
    setSupplementStack((prev) =>
      prev.map((sup) => (sup.id === supId ? { ...sup, taken: !sup.taken } : sup))
    );
  };

  // Water increment
  const handleAddWater = (ml: number) => {
    setWaterConsumedMl((prev) => Math.min(6000, Math.max(0, prev + ml)));
  };

  // Calculate total consumed macros across completed meals
  const consumedTotals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    nutritionPlan.meals.forEach((meal) => {
      if (meal.completed) {
        meal.foods.forEach((food) => {
          calories += food.calories;
          protein += food.protein;
          carbs += food.carbs;
          fats += food.fats;
        });
      }
    });

    return {
      calories: Math.round(calories),
      protein: parseFloat(protein.toFixed(1)),
      carbs: parseFloat(carbs.toFixed(1)),
      fats: parseFloat(fats.toFixed(1))
    };
  }, [nutritionPlan]);

  const caloriesPercent = Math.min(100, Math.round((consumedTotals.calories / nutritionPlan.targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((consumedTotals.protein / nutritionPlan.targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedTotals.carbs / nutritionPlan.targetCarbs) * 100));
  const fatsPercent = Math.min(100, Math.round((consumedTotals.fats / nutritionPlan.targetFats) * 100));
  const waterPercent = Math.min(100, Math.round((waterConsumedMl / nutritionPlan.targetWaterMl) * 100));

  const remainingCalories = Math.max(0, nutritionPlan.targetCalories - consumedTotals.calories);

  // Completed meals count
  const completedMealsCount = useMemo(() => {
    return nutritionPlan.meals.filter((m) => m.completed).length;
  }, [nutritionPlan.meals]);

  const totalMealsCount = nutritionPlan.meals.length;

  // Day of week consistency data (Seg - Dom)
  const weekDays = useMemo(() => {
    const today = new Date();
    // In JS: 0 = Sun, 1 = Mon, ..., 6 = Sat
    const jsDay = today.getDay();
    // Map to Monday-first: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    const currentMondayIndex = jsDay === 0 ? 6 : jsDay - 1;

    const days = [
      { key: 'seg', label: 'Seg', pastCompleted: 6, pastTotal: 6 },
      { key: 'ter', label: 'Ter', pastCompleted: 5, pastTotal: 6 },
      { key: 'qua', label: 'Qua', pastCompleted: 4, pastTotal: 6 },
      { key: 'qui', label: 'Qui', pastCompleted: 0, pastTotal: 6 },
      { key: 'sex', label: 'Sex', pastCompleted: 0, pastTotal: 6 },
      { key: 'sab', label: 'Sáb', pastCompleted: 0, pastTotal: 6 },
      { key: 'dom', label: 'Dom', pastCompleted: 0, pastTotal: 6 }
    ];

    return days.map((d, index) => {
      const isToday = index === currentMondayIndex;
      const isPast = index < currentMondayIndex;
      const isFuture = index > currentMondayIndex;

      let completed = 0;
      let total = totalMealsCount;
      let displayFraction = '—';
      let circleValue: string | number = '—';

      if (isToday) {
        completed = completedMealsCount;
        displayFraction = `${completed}/${total}`;
        circleValue = completed;
      } else if (isPast) {
        completed = d.pastCompleted;
        displayFraction = `${completed}/${total}`;
        circleValue = completed;
      } else {
        displayFraction = '—';
        circleValue = '—';
      }

      return {
        ...d,
        isToday,
        isPast,
        isFuture,
        circleValue,
        displayFraction
      };
    });
  }, [completedMealsCount, totalMealsCount]);

  return (
    <div className="flex flex-col w-full pb-24 md:pb-12 gap-5">
      {/* 1. Header: Mesma hierarquia e padrão de Início e Treino */}
      <PageHeader
        category="NUTRIÇÃO"
        title="Dieta"
        subtitle="Seu plano alimentar, metas nutricionais e refeições do dia."
        badge={
          <div className="flex items-center gap-1.5 bg-[#181c21] px-3.5 py-1.5 rounded-full border border-[#262a30] shadow-sm shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#0066ff]" />
            <span className="text-xs font-bold text-white tracking-wide">
              {user?.goal || 'Hipertrofia e Força'}
            </span>
          </div>
        }
      />

      {/* 2. Resumo Nutricional Principal (Balanço Calórico e Macros) */}
      <section className="bg-[#181c21] rounded-3xl p-5 border border-[#262a30] flex flex-col gap-5 shadow-sm">
        {/* Topo do Resumo: Calorias Consumidas vs Meta e Restante */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
              Calorias
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                {consumedTotals.calories.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-[#8c90a1]">
                / {nutritionPlan.targetCalories.toLocaleString()} kcal
              </span>
            </div>
            <span className="text-[11px] text-[#8c90a1] mt-0.5">
              {completedMealsCount} de {totalMealsCount} refeições concluídas
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider block">
              Restante
            </span>
            <span className="text-base font-bold text-white tabular-nums mt-1 block">
              {remainingCalories.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* Barra de Progresso Calórico Geral */}
        <div className="w-full bg-[#101419] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#262a30]/80">
          <div
            className="h-full rounded-full bg-[#0066ff] transition-all duration-500"
            style={{ width: `${caloriesPercent}%` }}
          />
        </div>

        {/* Divisor Sutil */}
        <div className="h-px bg-[#262a30]/60 w-full" />

        {/* Macros: Composição Fluida sem Caixas Aninhadas */}
        <div className="space-y-3.5">
          {/* Proteína */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0066ff]" />
                <span className="font-bold text-white">Proteína</span>
              </div>
              <span className="font-semibold text-white tabular-nums">
                {consumedTotals.protein}g{' '}
                <span className="text-[#8c90a1]">/ {nutritionPlan.targetProtein}g</span>
              </span>
            </div>
            <div className="w-full bg-[#101419] h-2 rounded-full overflow-hidden border border-[#262a30]/60">
              <div
                className="h-full bg-[#0066ff] rounded-full transition-all duration-300"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carboidratos */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                <span className="font-bold text-white">Carboidratos</span>
              </div>
              <span className="font-semibold text-white tabular-nums">
                {consumedTotals.carbs}g{' '}
                <span className="text-[#8c90a1]">/ {nutritionPlan.targetCarbs}g</span>
              </span>
            </div>
            <div className="w-full bg-[#101419] h-2 rounded-full overflow-hidden border border-[#262a30]/60">
              <div
                className="h-full bg-[#4edea3] rounded-full transition-all duration-300"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Gorduras */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb59d]" />
                <span className="font-bold text-white">Gorduras</span>
              </div>
              <span className="font-semibold text-white tabular-nums">
                {consumedTotals.fats}g{' '}
                <span className="text-[#8c90a1]">/ {nutritionPlan.targetFats}g</span>
              </span>
            </div>
            <div className="w-full bg-[#101419] h-2 rounded-full overflow-hidden border border-[#262a30]/60">
              <div
                className="h-full bg-[#ffb59d] rounded-full transition-all duration-300"
                style={{ width: `${fatsPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Progresso de Refeições na Semana (Consistência Alimentar Compacta) */}
      <section className="bg-[#181c21] rounded-2xl p-3.5 border border-[#262a30] shadow-sm">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {weekDays.map((day) => (
            <div
              key={day.key}
              className={`flex flex-col items-center gap-1.5 py-1 px-0.5 rounded-xl transition-colors ${
                day.isToday ? 'bg-[#0066ff]/10 border border-[#0066ff]/30' : ''
              }`}
            >
              <span
                className={`text-[10px] sm:text-[11px] font-bold ${
                  day.isToday ? 'text-[#0066ff]' : 'text-[#8c90a1]'
                }`}
              >
                {day.label}
              </span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  day.isToday
                    ? 'bg-[#0066ff] text-white shadow-sm shadow-[#0066ff]/30'
                    : day.isPast
                      ? 'bg-[#14181f] border border-[#262a30] text-white'
                      : 'bg-[#14181f]/40 border border-[#262a30]/30 text-[#64748b]'
                }`}
              >
                {day.circleValue}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] tabular-nums font-semibold ${
                  day.isToday ? 'text-white' : 'text-[#8c90a1]'
                }`}
              >
                {day.displayFraction}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Seção Principal: REFEIÇÕES */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
              Refeições
            </span>
            <span className="bg-[#1c2025] text-[#8c90a1] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#262a30]">
              {totalMealsCount}
            </span>
          </div>
          <span className="text-[11px] text-[#8c90a1]">
            {completedMealsCount} concluída{completedMealsCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Lista de Refeições Expansíveis */}
        <div className="flex flex-col gap-2.5">
          {nutritionPlan.meals.map((meal) => {
            const isExpanded = expandedMealIds.includes(meal.id);
            const mealCals = meal.foods.reduce((acc, f) => acc + f.calories, 0);
            const mealProt = meal.foods.reduce((acc, f) => acc + f.protein, 0);
            const mealCarbs = meal.foods.reduce((acc, f) => acc + f.carbs, 0);
            const mealFats = meal.foods.reduce((acc, f) => acc + f.fats, 0);
            const friendlyName = formatMealDisplayName(meal.name);

            return (
              <div
                key={meal.id}
                className={`rounded-2xl border transition-all ${
                  meal.completed
                    ? 'bg-[#181c21] border-[#4edea3]/30 shadow-xs'
                    : 'bg-[#181c21] border-[#262a30]'
                }`}
              >
                {/* Linha da Refeição (Estado Fechado / Cabeçalho) */}
                <div
                  onClick={() => toggleMealExpanded(meal.id)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Botão de Check / Conclusão */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMealCompleted(meal.id);
                      }}
                      className="cursor-pointer transition-transform active:scale-90 shrink-0"
                      aria-label={`Marcar ${friendlyName} como ${meal.completed ? 'não realizada' : 'realizada'}`}
                    >
                      {meal.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#4edea3] fill-[#4edea3]/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#424656] hover:text-[#0066ff]" />
                      )}
                    </button>

                    {/* Nome da Refeição e Horário */}
                    <div className="flex flex-col min-w-0">
                      <h3
                        className={`text-sm sm:text-base font-bold truncate leading-tight ${
                          meal.completed ? 'text-white' : 'text-white'
                        }`}
                      >
                        {friendlyName}
                      </h3>
                      <span className="text-[11px] text-[#8c90a1] mt-0.5">
                        {meal.time}
                        {meal.badge && ` • ${meal.badge}`}
                      </span>
                    </div>
                  </div>

                  {/* Calorias da Refeição e Chevron */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-white tabular-nums">
                      {mealCals} kcal
                    </span>
                    <div className="text-[#8c90a1]">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Conteúdo Expandido: Alimentos com divisores simples */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-[#262a30]/60">
                    {/* Resumo de Macros da Refeição */}
                    <div className="flex items-center justify-between text-[11px] text-[#8c90a1] pt-1">
                      <span>Total da refeição</span>
                      <span className="font-semibold text-[#c2c6d8] tabular-nums">
                        P: {mealProt.toFixed(0)}g • C: {mealCarbs.toFixed(0)}g • G: {mealFats.toFixed(0)}g
                      </span>
                    </div>

                    {/* Lista Limpa de Alimentos */}
                    <div className="divide-y divide-[#262a30]/50">
                      {meal.foods.map((food) => (
                        <div
                          key={food.id}
                          className="py-2.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white truncate">
                              {food.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#8c90a1] flex-wrap">
                              <span>{food.portionDisplay}</span>
                              <span>•</span>
                              <span className="text-[#c2c6d8] font-medium">{food.calories} kcal</span>
                              <span>•</span>
                              <span className="text-[#0066ff]">P {food.protein}g</span>
                              <span className="text-[#4edea3]">C {food.carbs}g</span>
                              <span className="text-[#ffb59d]">G {food.fats}g</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFood(meal.id, food.id)}
                            className="w-7 h-7 rounded-lg text-[#8c90a1] hover:text-[#ffb59d] hover:bg-[#262a30] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            aria-label="Remover alimento"
                            title="Remover alimento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Botão de Adicionar Alimento */}
                    <button
                      type="button"
                      onClick={() => setActiveMealForAdd(meal)}
                      className="w-full h-10 rounded-xl bg-[#14181f] hover:bg-[#1c2025] text-[#0066ff] hover:text-[#38bdf8] border border-dashed border-[#262a30] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Alimento</span>
                    </button>

                    {/* Botão de Conclusão da Refeição */}
                    <button
                      type="button"
                      onClick={() => handleToggleMealCompleted(meal.id)}
                      className={`w-full h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        meal.completed
                          ? 'bg-[#14181f] border border-[#4edea3]/40 text-[#4edea3] hover:bg-[#1c2025]'
                          : 'bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white shadow-md shadow-[#0066ff]/20'
                      }`}
                    >
                      {meal.completed ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Refeição concluída</span>
                        </>
                      ) : (
                        <span>Marcar como feita</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Hidratação (Secundária e Compacta) */}
      <section className="bg-[#181c21] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0066ff]/15 text-[#0066ff] flex items-center justify-center shrink-0">
              <Droplet className="w-4 h-4 fill-[#0066ff]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Hidratação</h3>
              <span className="text-[11px] text-[#8c90a1]">Meta diária do plano</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 text-right">
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              {(waterConsumedMl / 1000).toFixed(1).replace('.', ',')}
            </span>
            <span className="text-xs text-[#8c90a1]">
              / {(nutritionPlan.targetWaterMl / 1000).toFixed(1).replace('.', ',')} L
            </span>
          </div>
        </div>

        {/* Barra de Progresso de Água */}
        <div className="w-full bg-[#101419] h-2 rounded-full overflow-hidden border border-[#262a30]/80">
          <div
            className="h-full bg-[#0066ff] rounded-full transition-all duration-300"
            style={{ width: `${waterPercent}%` }}
          />
        </div>

        {/* Botões Rápidos de Hidratação */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleAddWater(250)}
            className="flex-1 h-9 rounded-xl bg-[#14181f] hover:bg-[#1c2025] text-[#b3c5ff] border border-[#262a30] text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250 ml (Copo)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddWater(500)}
            className="flex-1 h-9 rounded-xl bg-[#0066ff]/15 hover:bg-[#0066ff]/25 text-white border border-[#0066ff]/30 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml (Garrafa)</span>
          </button>
          <button
            type="button"
            onClick={() => setWaterConsumedMl(0)}
            className="px-3 h-9 rounded-xl bg-[#14181f] text-[#8c90a1] hover:text-white border border-[#262a30] text-xs font-semibold"
          >
            Reset
          </button>
        </div>
      </section>

      {/* 6. Suplementação Prescrita (Discreta e Compacta) */}
      <section className="bg-[#181c21] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0066ff]/15 text-[#0066ff] flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Stack de Suplementação</h3>
              <span className="text-[11px] text-[#8c90a1]">Prescrito para recuperação e performance</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#4edea3]">
            {supplementStack.filter((s) => s.taken).length} de {supplementStack.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          {supplementStack.map((sup) => (
            <div
              key={sup.id}
              onClick={() => handleToggleSupplement(sup.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                sup.taken
                  ? 'bg-[#14181f] border-[#4edea3]/30'
                  : 'bg-[#14181f] border-[#262a30] hover:border-[#31353b]'
              }`}
            >
              <div className="flex flex-col pr-2 min-w-0">
                <span className="text-xs font-bold text-white truncate">{sup.name}</span>
                <span className="text-[10px] text-[#8c90a1] mt-0.5 truncate">
                  {sup.dosage} • {sup.timing}
                </span>
              </div>

              {sup.taken ? (
                <CheckCircle2 className="w-5 h-5 text-[#4edea3] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-[#424656] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Adição de Alimento */}
      {activeMealForAdd && (
        <AddFoodModal
          mealName={formatMealDisplayName(activeMealForAdd.name)}
          onClose={() => setActiveMealForAdd(null)}
          onAddFood={handleAddFoodToMeal}
        />
      )}
    </div>
  );
};
