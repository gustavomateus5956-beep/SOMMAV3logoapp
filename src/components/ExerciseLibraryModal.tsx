import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  Dumbbell, 
  ChevronRight, 
  Eye, 
  Loader2, 
  Layers
} from 'lucide-react';
import { Exercise, ExternalExerciseResult, LibraryExercise } from '../types';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { ExerciseMedia } from './exercise/ExerciseMedia';
import { ExerciseDetailModal } from './exercise/ExerciseDetailModal';
import { 
  convertExternalToSommaExercise, 
  convertLocalToSommaExercise, 
  deduplicateExternalResults, 
  searchExternalExercises, 
  searchLocalExercises 
} from '../services/exerciseMedia/exerciseCatalogService';
import { useScrollLock } from '../hooks/useScrollLock';

interface ExerciseLibraryModalProps {
  onClose: () => void;
  onAddExercise: (exercise: Exercise) => void;
  title?: string;
}

const MUSCLE_GROUPS = [
  'Todos',
  'Peitoral',
  'Costas',
  'Ombros',
  'Pernas',
  'Braços',
  'Core'
];

const EQUIPMENTS = ['Todos', 'Barra', 'Halteres', 'Máquina', 'Polia', 'Peso Corporal'];

const MUSCLE_TO_BODYPART_MAP: Record<string, string> = {
  Peitoral: 'chest',
  Costas: 'back',
  Ombros: 'shoulders',
  Pernas: 'upper legs',
  Braços: 'upper arms',
  Core: 'waist'
};

const EQUIPMENT_TO_EXDB_MAP: Record<string, string> = {
  Barra: 'barbell',
  Halteres: 'dumbbell',
  Máquina: 'leverage machine',
  Polia: 'cable',
  'Peso Corporal': 'body weight'
};

type UnifiedExerciseItem = 
  | { kind: 'local'; id: string; data: LibraryExercise; name: string; muscleGroup: string; equipment: string }
  | { kind: 'external'; id: string; data: ExternalExerciseResult; name: string; muscleGroup: string; equipment: string };

export const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({
  onClose,
  onAddExercise,
  title = 'Biblioteca de Exercícios'
}) => {
  useScrollLock(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState('Todos');
  
  // Estado para visualização de detalhes no modal
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<
    LibraryExercise | ExternalExerciseResult | null
  >(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Estados de catálogo paginado
  const [externalExercises, setExternalExercises] = useState<ExternalExerciseResult[]>([]);
  const [isExternalLoading, setIsExternalLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Abort controller para requisições obsoletas
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Busca Local Síncrona e Imediata (~29 movimentos padrão)
  const localExercises = useMemo(() => {
    return searchLocalExercises(searchQuery, selectedMuscle, selectedEquipment);
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  // 2. Busca e paginação unificada com Debounce (350ms)
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsExternalLoading(true);

      try {
        const bodyPartParam = selectedMuscle !== 'Todos' ? MUSCLE_TO_BODYPART_MAP[selectedMuscle] : undefined;
        const equipmentParam = selectedEquipment !== 'Todos' ? EQUIPMENT_TO_EXDB_MAP[selectedEquipment] : undefined;

        const res = await searchExternalExercises(
          {
            query: searchQuery.trim() || undefined,
            bodyPart: bodyPartParam,
            equipment: equipmentParam,
            limit: 20
          },
          controller.signal
        );

        // Deduplica com base nos exercícios locais para evitar repetições redundantes
        const deduplicated = deduplicateExternalResults(EXERCISE_LIBRARY, res.exercises);

        setExternalExercises(deduplicated);
        setHasNextPage(res.hasNextPage);
        setNextCursor(res.nextCursor);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setExternalExercises([]);
        }
      } finally {
        setIsExternalLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  // Carregamento da próxima página
  const handleLoadMore = async () => {
    if (!hasNextPage || !nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const bodyPartParam = selectedMuscle !== 'Todos' ? MUSCLE_TO_BODYPART_MAP[selectedMuscle] : undefined;
      const equipmentParam = selectedEquipment !== 'Todos' ? EQUIPMENT_TO_EXDB_MAP[selectedEquipment] : undefined;

      const res = await searchExternalExercises({
        query: searchQuery.trim() || undefined,
        bodyPart: bodyPartParam,
        equipment: equipmentParam,
        after: nextCursor,
        limit: 20
      });

      const deduplicated = deduplicateExternalResults(EXERCISE_LIBRARY, res.exercises);

      setExternalExercises((prev) => [...prev, ...deduplicated]);
      setHasNextPage(res.hasNextPage);
      setNextCursor(res.nextCursor);
    } catch {
      // Ignora erro de rede suavemente
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Lista unificada final
  const unifiedList = useMemo<UnifiedExerciseItem[]>(() => {
    const localItems: UnifiedExerciseItem[] = localExercises.map((ex) => ({
      kind: 'local',
      id: ex.id,
      data: ex,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      equipment: ex.equipment
    }));

    const externalItems: UnifiedExerciseItem[] = externalExercises.map((ext) => ({
      kind: 'external',
      id: ext.externalId,
      data: ext,
      name: ext.name,
      muscleGroup: ext.bodyPart || 'Geral',
      equipment: ext.equipment || 'Livre'
    }));

    return [...localItems, ...externalItems];
  }, [localExercises, externalExercises]);

  // Adiciona exercício à rotina
  const handleAddExercise = (item: UnifiedExerciseItem) => {
    const itemId = item.id;

    if (item.kind === 'external') {
      const newEx = convertExternalToSommaExercise(item.data);
      onAddExercise(newEx);
    } else {
      const newEx = convertLocalToSommaExercise(item.data);
      onAddExercise(newEx);
    }

    setAddedIds((prev) => [...prev, itemId]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== itemId));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
      <div className="w-full max-w-xl bg-[#14181f] border border-[#2a303c] rounded-3xl p-4 sm:p-6 flex flex-col gap-3.5 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] overflow-hidden overscroll-contain">
        
        {/* Header Unificado */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262a30]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">{title}</h3>
              <p className="text-xs text-[#8c90a1]">
                Selecione ou pesquise exercícios para estruturar seu treino
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Campo de Busca Unificada */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8c90a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar exercício (ex: Supino, Agachamento, Remada, Rosca)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs sm:text-sm placeholder-[#8c90a1] focus:border-[#0066ff] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c90a1] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros Simplificados */}
        <div className="flex flex-col gap-2">
          {/* Grupo Muscular */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                type="button"
                onClick={() => setSelectedMuscle(mg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMuscle === mg
                    ? 'bg-[#0066ff] text-white shadow-md'
                    : 'bg-[#181c21] text-[#8c90a1] hover:text-white hover:bg-[#20252c]'
                }`}
              >
                {mg}
              </button>
            ))}
          </div>

          {/* Equipamento */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <span className="text-[#8c90a1] font-semibold text-[10px] uppercase px-1">Equipamento:</span>
            {EQUIPMENTS.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => setSelectedEquipment(eq)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedEquipment === eq
                    ? 'bg-[#262a30] text-[#b3c5ff] border border-[#0066ff]/40 font-bold'
                    : 'text-[#8c90a1] hover:text-white'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Lista Única e Unificada de Resultados */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar min-h-[260px] max-h-[440px]">
          {unifiedList.map((item) => {
            const isAdded = addedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-[#181c21] hover:bg-[#1d2229] border border-[#262a30] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all shadow-sm group"
              >
                {/* Thumbnail do Exercício */}
                <button
                  type="button"
                  onClick={() => setSelectedExerciseDetail(item.data)}
                  className="cursor-pointer transition-transform active:scale-95 group/thumb relative shrink-0"
                  title="Toque para ver execução biomecânica"
                >
                  <ExerciseMedia
                    exercise={item.data}
                    size="sm"
                    className="hover:border-[#0066ff]/50 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>

                {/* Dados Principais do Exercício */}
                <div className="flex flex-col flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelectedExerciseDetail(item.data)}
                    className="text-left font-black text-white text-sm sm:text-base hover:text-[#0066ff] transition-colors cursor-pointer truncate"
                  >
                    {item.name}
                  </button>

                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#8c90a1]">
                    <span className="font-semibold text-[#b3c5ff]">{item.muscleGroup}</span>
                    <span>•</span>
                    <span>{item.equipment}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedExerciseDetail(item.data)}
                    className="text-[11px] font-semibold text-[#0066ff] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer w-fit"
                  >
                    <span>Ver execução</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Botão de Adicionar à Rotina */}
                <button
                  type="button"
                  onClick={() => handleAddExercise(item)}
                  className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isAdded
                      ? 'bg-[#00a572] text-white shadow-md'
                      : 'bg-[#0066ff] hover:bg-[#0054d6] text-white shadow-md'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}

          {/* Indicador de busca assíncrona */}
          {isExternalLoading && (
            <div className="py-4 flex items-center justify-center gap-2 text-xs text-[#0066ff]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Buscando exercícios...</span>
            </div>
          )}

          {/* Paginação Incremental */}
          {hasNextPage && !isExternalLoading && (
            <div className="pt-2 pb-1 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-5 py-2.5 rounded-xl bg-[#1c2025] hover:bg-[#262a30] text-[#b3c5ff] hover:text-white text-xs font-bold transition-all border border-[#262a30] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066ff]" />
                    <span>Carregando mais exercícios...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[#0066ff]" />
                    <span>Carregar mais exercícios</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {unifiedList.length === 0 && !isExternalLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Dumbbell className="w-10 h-10 text-[#424656] mb-2" />
              <p className="text-sm font-bold text-white">Nenhum exercício encontrado</p>
              <p className="text-xs text-[#8c90a1] mt-1 max-w-sm">
                Não encontramos resultados para os filtros ou termos pesquisados.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMuscle('Todos');
                  setSelectedEquipment('Todos');
                }}
                className="mt-3 text-xs font-bold text-[#0066ff] hover:underline cursor-pointer"
              >
                Limpar filtros de busca
              </button>
            </div>
          )}
        </div>

        {/* Modal de Detalhes com Animação Biomecânica */}
        {selectedExerciseDetail && (
          <ExerciseDetailModal
            exercise={selectedExerciseDetail}
            isOpen={Boolean(selectedExerciseDetail)}
            onClose={() => setSelectedExerciseDetail(null)}
            onAddExercise={() => {
              const isExt = 'provider' in selectedExerciseDetail && selectedExerciseDetail.provider === 'exercisedb';
              if (isExt) {
                const newEx = convertExternalToSommaExercise(selectedExerciseDetail as ExternalExerciseResult);
                onAddExercise(newEx);
              } else {
                const newEx = convertLocalToSommaExercise(selectedExerciseDetail as LibraryExercise);
                onAddExercise(newEx);
              }
              const itemId = isExt ? (selectedExerciseDetail as ExternalExerciseResult).externalId : (selectedExerciseDetail as LibraryExercise).id;
              setAddedIds((prev) => [...prev, itemId]);
              setTimeout(() => {
                setAddedIds((prev) => prev.filter((id) => id !== itemId));
              }, 2000);
            }}
            isAdded={
              'provider' in selectedExerciseDetail
                ? addedIds.includes((selectedExerciseDetail as ExternalExerciseResult).externalId)
                : addedIds.includes((selectedExerciseDetail as LibraryExercise).id)
            }
          />
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-[#262a30] flex items-center justify-between text-xs text-[#8c90a1]">
          <span className="text-[11px] truncate">
            {unifiedList.length} exercícios disponíveis
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-white font-bold hover:underline cursor-pointer ml-2 shrink-0"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
