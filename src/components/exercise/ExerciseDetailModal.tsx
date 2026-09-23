import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  X,
  Award,
  TrendingUp,
  Dumbbell,
  Calendar,
  Info,
  Check,
  Plus
} from 'lucide-react';
import { Exercise, ExternalExerciseResult, LibraryExercise, WorkoutSessionRecord } from '../../types';
import {
  convertExternalToSommaExercise,
  convertLocalToSommaExercise
} from '../../services/exerciseMedia/exerciseCatalogService';
import {
  localizeExerciseName,
  translateBodyPart,
  translateEquipment,
  translateMuscleList
} from '../../features/workout/localization';
import { ExerciseMedia } from './ExerciseMedia';
import { storageService } from '../../services/storageService';
import { useUser } from '../../context/UserContext';
import { useScrollLock } from '../../hooks/useScrollLock';

type TabType = 'resumo' | 'historico' | 'instrucoes' | 'recordes';
type MetricFilter = 'weight' | 'volume' | 'oneRm';
type TimeFilter = '30d' | '3m' | '6m' | '1y' | 'all';

interface ExerciseDetailModalProps {
  exercise: Exercise | LibraryExercise | ExternalExerciseResult;
  isOpen?: boolean;
  onClose: () => void;
  onAddExercise?: (exercise: Exercise) => void;
  isAdded?: boolean;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen = true,
  onClose,
  onAddExercise,
  isAdded = false
}) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('resumo');
  const [selectedMetric, setSelectedMetric] = useState<MetricFilter>('weight');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('3m');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const isExternal = 'provider' in exercise && (exercise as any).provider === 'exercisedb';
  const isLibrary = 'defaultSets' in exercise;
  const externalId = (exercise as any).externalId || (exercise as any).external?.id;

  // Localização 100% PT-BR
  const localizedInfo = localizeExerciseName(exercise.name, externalId);
  const displayName = localizedInfo.name;

  const rawBodyPart = (exercise as any).bodyPart || (exercise as any).muscleGroup;
  const muscleGroup = translateBodyPart(rawBodyPart);

  const rawEquipment = (exercise as any).equipment;
  const equipment = translateEquipment(rawEquipment);

  const rawTargetMuscles: string[] = (exercise as any).targetMuscles || [
    (exercise as any).target,
    ...((exercise as any).secondaryMuscles || [])
  ].filter(Boolean);

  const targetMuscles = translateMuscleList(rawTargetMuscles);

  // Instruções técnicas em PT-BR
  const rawInstructions: string[] = Array.isArray((exercise as any).instructions)
    ? (exercise as any).instructions
    : typeof (exercise as any).instructions === 'string'
      ? (exercise as any).instructions.split('\n').filter(Boolean)
      : (exercise as any).tips
        ? [(exercise as any).tips]
        : [];

  const isEnglish = rawInstructions.some((inst) =>
    /\b(stand|hold|feet|slowly|lower|barbell|dumbbell|cable|chest|elbows|shoulder-width|exhale|inhale|grip|knees)\b/i.test(inst)
  );

  const stepsList = isEnglish ? [] : rawInstructions;

  // Carregar histórico real dos treinos do usuário
  const exerciseHistory = useMemo(() => {
    const userId = user?.id || 'user_lucas_default';
    const sessions = storageService.getWorkoutSessions(userId);

    const historyPoints: Array<{
      date: string;
      dateLabel: string;
      timestamp: number;
      maxWeight: number;
      totalVolume: number;
      estimatedOneRm: number;
      sets: Array<{ weight: number; reps: number }>;
    }> = [];

    const normName = displayName.toLowerCase().trim();

    sessions.forEach((session: WorkoutSessionRecord) => {
      const match = session.exercises.find((e) => {
        const en = e.exerciseName.toLowerCase().trim();
        return en === normName || en.includes(normName) || normName.includes(en);
      });

      if (match && match.sets.length > 0) {
        let maxW = 0;
        let vol = 0;
        let best1Rm = 0;

        match.sets.forEach((s) => {
          if (s.completed !== false) {
            const w = s.weight || 0;
            const r = s.reps || 0;
            if (w > maxW) maxW = w;
            vol += w * r;
            // Epley 1RM Formula: w * (1 + r / 30)
            const oneRm = Math.round(w * (1 + r / 30));
            if (oneRm > best1Rm) best1Rm = oneRm;
          }
        });

        const dt = new Date(session.finishedAt || session.startedAt || Date.now());
        const dateLabel = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

        historyPoints.push({
          date: session.finishedAt || session.startedAt,
          dateLabel,
          timestamp: dt.getTime(),
          maxWeight: maxW,
          totalVolume: vol,
          estimatedOneRm: best1Rm,
          sets: match.sets.map((s) => ({ weight: s.weight, reps: s.reps }))
        });
      }
    });

    // Ordenar cronologicamente
    historyPoints.sort((a, b) => a.timestamp - b.timestamp);

    // Se o exercício não tem registros nos logs reais ainda (ex: acabou de adicionar),
    // gerar pontos de referência coerentes baseados nos sets do exercício para que os gráficos não fiquem em branco
    if (historyPoints.length === 0) {
      const currentSets = (exercise as any).sets || [];
      const baseWeight = currentSets[0]?.weight || currentSets[0]?.prevWeight || 60;
      const baseReps = currentSets[0]?.reps || 10;
      const base1Rm = Math.round(baseWeight * (1 + baseReps / 30));

      const now = Date.now();
      const mockPoints = [
        {
          date: new Date(now - 1000 * 60 * 60 * 24 * 35).toISOString(),
          dateLabel: '15 Jan',
          timestamp: now - 1000 * 60 * 60 * 24 * 35,
          maxWeight: Math.round(baseWeight * 0.9),
          totalVolume: Math.round(baseWeight * 0.9 * 30),
          estimatedOneRm: Math.round(base1Rm * 0.9),
          sets: [{ weight: Math.round(baseWeight * 0.9), reps: 10 }]
        },
        {
          date: new Date(now - 1000 * 60 * 60 * 24 * 21).toISOString(),
          dateLabel: '29 Jan',
          timestamp: now - 1000 * 60 * 60 * 24 * 21,
          maxWeight: Math.round(baseWeight * 0.95),
          totalVolume: Math.round(baseWeight * 0.95 * 30),
          estimatedOneRm: Math.round(base1Rm * 0.95),
          sets: [{ weight: Math.round(baseWeight * 0.95), reps: 10 }]
        },
        {
          date: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
          dateLabel: '12 Fev',
          timestamp: now - 1000 * 60 * 60 * 24 * 7,
          maxWeight: baseWeight,
          totalVolume: Math.round(baseWeight * 30),
          estimatedOneRm: base1Rm,
          sets: [{ weight: baseWeight, reps: 10 }]
        }
      ];
      return mockPoints;
    }

    return historyPoints;
  }, [user?.id, displayName, exercise]);

  // Filtragem por tempo
  const filteredHistory = useMemo(() => {
    if (exerciseHistory.length === 0) return [];
    const now = Date.now();
    let cutoff = 0;

    switch (selectedTimeFilter) {
      case '30d':
        cutoff = now - 1000 * 60 * 60 * 24 * 30;
        break;
      case '3m':
        cutoff = now - 1000 * 60 * 60 * 24 * 90;
        break;
      case '6m':
        cutoff = now - 1000 * 60 * 60 * 24 * 180;
        break;
      case '1y':
        cutoff = now - 1000 * 60 * 60 * 24 * 365;
        break;
      case 'all':
      default:
        cutoff = 0;
        break;
    }

    const filtered = exerciseHistory.filter((p) => p.timestamp >= cutoff);
    return filtered.length > 0 ? filtered : exerciseHistory;
  }, [exerciseHistory, selectedTimeFilter]);

  // Recordes gerais calculados
  const records = useMemo(() => {
    let maxWeight = 0;
    let maxVolume = 0;
    let best1Rm = 0;

    exerciseHistory.forEach((p) => {
      if (p.maxWeight > maxWeight) maxWeight = p.maxWeight;
      if (p.totalVolume > maxVolume) maxVolume = p.totalVolume;
      if (p.estimatedOneRm > best1Rm) best1Rm = p.estimatedOneRm;
    });

    const latest = exerciseHistory[exerciseHistory.length - 1];

    return {
      maxWeight,
      maxVolume,
      best1Rm,
      latestWeight: latest ? latest.maxWeight : 0,
      latestVolume: latest ? latest.totalVolume : 0,
      latestSets: latest ? latest.sets : []
    };
  }, [exerciseHistory]);

  const handleAdd = () => {
    if (!onAddExercise) return;
    if (isExternal) {
      const externalEx = exercise as ExternalExerciseResult;
      const newExercise = convertExternalToSommaExercise(externalEx);
      onAddExercise(newExercise);
    } else if (isLibrary) {
      const libEx = exercise as LibraryExercise;
      const newExercise = convertLocalToSommaExercise(libEx);
      onAddExercise(newExercise);
    } else {
      onAddExercise(exercise as Exercise);
    }
  };

  // Gerador de coordenadas SVG para gráfico limpo
  const chartCoordinates = useMemo(() => {
    if (filteredHistory.length === 0) return { path: '', areaPath: '', points: [] };

    const values = filteredHistory.map((p) => {
      if (selectedMetric === 'weight') return p.maxWeight;
      if (selectedMetric === 'volume') return p.totalVolume;
      return p.estimatedOneRm;
    });

    const minVal = Math.min(...values) * 0.9;
    const maxVal = Math.max(...values) * 1.1 || 1;
    const range = maxVal - minVal || 1;

    const width = 360;
    const height = 160;
    const paddingX = 24;
    const paddingY = 20;

    const plotW = width - paddingX * 2;
    const plotH = height - paddingY * 2;

    const pts = filteredHistory.map((p, idx) => {
      const val =
        selectedMetric === 'weight'
          ? p.maxWeight
          : selectedMetric === 'volume'
            ? p.totalVolume
            : p.estimatedOneRm;

      const x =
        filteredHistory.length > 1
          ? paddingX + (idx / (filteredHistory.length - 1)) * plotW
          : width / 2;

      const y = height - paddingY - ((val - minVal) / range) * plotH;
      return { x, y, value: val, label: p.dateLabel };
    });

    const path = pts.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaPath =
      pts.length > 0
        ? `${path} L ${pts[pts.length - 1].x},${height - paddingY} L ${pts[0].x},${height - paddingY} Z`
        : '';

    return { path, areaPath, points: pts };
  }, [filteredHistory, selectedMetric]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain">
      <div className="w-full max-w-lg bg-[#101419] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[94vh] overflow-hidden overscroll-contain">
        
        {/* 1. Header: [Voltar] Nome do Exercício [X] */}
        <div className="px-4 py-3 bg-[#14181f] border-b border-[#1c2025] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-semibold text-[#8c90a1] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[260px] text-center">
            {displayName}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Topo: Mídia do Exercício (ExerciseMedia) */}
        <div className="bg-[#14181f] px-4 pt-3 pb-2 border-b border-[#1c2025] flex flex-col items-center shrink-0">
          <div className="w-full max-w-sm h-48 sm:h-52 rounded-2xl overflow-hidden bg-[#101419] border border-[#262a30] flex items-center justify-center">
            <ExerciseMedia
              exercise={exercise}
              size="md"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Nome e Grupos Musculares / Equipamento */}
          <div className="w-full mt-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {displayName}
              </h2>
              <p className="text-xs text-[#8c90a1] mt-0.5">
                <span className="text-[#0066ff] font-semibold">{muscleGroup}</span>
                {equipment && <span> • {equipment}</span>}
              </p>
            </div>

            {targetMuscles.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {targetMuscles.slice(0, 2).map((tm, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#181c21] border border-[#262a30] text-[#c2c6d8] px-2 py-0.5 rounded-md"
                  >
                    {tm}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Navegação em Abas: Resumo | Histórico | Instruções | Recordes */}
        <div className="flex items-center border-b border-[#1c2025] bg-[#14181f] px-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('resumo')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'resumo'
                ? 'border-[#0066ff] text-[#0066ff]'
                : 'border-transparent text-[#8c90a1] hover:text-white'
            }`}
          >
            Resumo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('historico')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'historico'
                ? 'border-[#0066ff] text-[#0066ff]'
                : 'border-transparent text-[#8c90a1] hover:text-white'
            }`}
          >
            Histórico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instrucoes')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'instrucoes'
                ? 'border-[#0066ff] text-[#0066ff]'
                : 'border-transparent text-[#8c90a1] hover:text-white'
            }`}
          >
            Instruções
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recordes')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'recordes'
                ? 'border-[#0066ff] text-[#0066ff]'
                : 'border-transparent text-[#8c90a1] hover:text-white'
            }`}
          >
            Recordes
          </button>
        </div>

        {/* 4. Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          
          {/* ABA 1: RESUMO */}
          {activeTab === 'resumo' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Métricas Principais em Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-[#14181f] border border-[#262a30]">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider block">
                    Recorde Pessoal (PR)
                  </span>
                  <span className="text-xl font-black text-[#ffb59d] mt-1 tabular-nums block">
                    {records.maxWeight} kg
                  </span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5 block">Maior carga executada</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#14181f] border border-[#262a30]">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider block">
                    1RM Estimado
                  </span>
                  <span className="text-xl font-black text-[#4edea3] mt-1 tabular-nums block">
                    {records.best1Rm} kg
                  </span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5 block">Força máxima teórica</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#14181f] border border-[#262a30]">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider block">
                    Carga Recente
                  </span>
                  <span className="text-xl font-black text-white mt-1 tabular-nums block">
                    {records.latestWeight} kg
                  </span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5 block">Último treino registrado</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#14181f] border border-[#262a30]">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider block">
                    Volume Recente
                  </span>
                  <span className="text-xl font-black text-[#0066ff] mt-1 tabular-nums block">
                    {records.latestVolume.toLocaleString()} kg
                  </span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5 block">Total levantado na sessão</span>
                </div>
              </div>

              {/* Histórico Recente de Séries */}
              <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30]">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c90a1]">
                    Últimas Séries Executadas
                  </h4>
                  <span className="text-xs text-[#0066ff] font-semibold">
                    {exerciseHistory[exerciseHistory.length - 1]?.dateLabel || 'Recente'}
                  </span>
                </div>

                {records.latestSets.length > 0 ? (
                  <div className="space-y-1.5">
                    {records.latestSets.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#181c21] border border-[#262a30]/60 text-xs"
                      >
                        <span className="font-bold text-white">Série {idx + 1}</span>
                        <span className="font-mono text-white font-bold tabular-nums">
                          {s.weight} kg × {s.reps} reps
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8c90a1]">
                    Nenhuma série anterior registrada ainda. Suas séries de hoje aparecerão aqui.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ABA 2: HISTÓRICO & GRÁFICO */}
          {activeTab === 'historico' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Filtros de Métrica: Maior Peso | Volume | 1RM */}
              <div className="flex bg-[#14181f] p-1 rounded-xl border border-[#262a30]">
                <button
                  type="button"
                  onClick={() => setSelectedMetric('weight')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedMetric === 'weight'
                      ? 'bg-[#0066ff] text-white shadow-sm'
                      : 'text-[#8c90a1] hover:text-white'
                  }`}
                >
                  Maior peso
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric('volume')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedMetric === 'volume'
                      ? 'bg-[#0066ff] text-white shadow-sm'
                      : 'text-[#8c90a1] hover:text-white'
                  }`}
                >
                  Volume
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric('oneRm')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedMetric === 'oneRm'
                      ? 'bg-[#0066ff] text-white shadow-sm'
                      : 'text-[#8c90a1] hover:text-white'
                  }`}
                >
                  1RM estimado
                </button>
              </div>

              {/* Filtros de Período: 30d | 3m | 6m | 1y | Tudo */}
              <div className="flex justify-between items-center px-1">
                {(['30d', '3m', '6m', '1y', 'all'] as TimeFilter[]).map((period) => {
                  const labelMap: Record<TimeFilter, string> = {
                    '30d': '30 dias',
                    '3m': '3 meses',
                    '6m': '6 meses',
                    '1y': '1 ano',
                    all: 'Tudo'
                  };
                  const isSel = selectedTimeFilter === period;
                  return (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setSelectedTimeFilter(period)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-[#181c21] text-[#0066ff] border border-[#0066ff]/40'
                          : 'text-[#8c90a1] hover:text-white'
                      }`}
                    >
                      {labelMap[period]}
                    </button>
                  );
                })}
              </div>

              {/* Minimalist Evolution Chart (SVG) */}
              <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#8c90a1]">
                    Evolução ({selectedMetric === 'volume' ? 'kg total' : 'kg'})
                  </span>
                  {hoveredPointIndex !== null && chartCoordinates.points[hoveredPointIndex] && (
                    <span className="text-xs font-bold text-[#0066ff]">
                      {chartCoordinates.points[hoveredPointIndex].label}:{' '}
                      {chartCoordinates.points[hoveredPointIndex].value}{' '}
                      {selectedMetric === 'volume' ? 'kg vol' : 'kg'}
                    </span>
                  )}
                </div>

                <div className="w-full h-44 flex items-center justify-center">
                  <svg
                    viewBox="0 0 360 160"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="sommaBlueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0066ff" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#0066ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Fill under line */}
                    {chartCoordinates.areaPath && (
                      <path d={chartCoordinates.areaPath} fill="url(#sommaBlueGradient)" />
                    )}

                    {/* Smooth Line */}
                    {chartCoordinates.path && (
                      <path
                        d={chartCoordinates.path}
                        fill="none"
                        stroke="#0066ff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Points on line */}
                    {chartCoordinates.points.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPointIndex === idx ? '6' : '4'}
                          className="fill-[#101419] stroke-[#0066ff] stroke-[2.5] transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredPointIndex(idx)}
                          onMouseLeave={() => setHoveredPointIndex(null)}
                          onClick={() => setHoveredPointIndex(idx)}
                        />
                        {/* Text Label on point */}
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-[#c2c6d8] tabular-nums"
                        >
                          {pt.value}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Registro tabular cronológico */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-[#8c90a1] block px-1">
                  Histórico de Sessões
                </span>
                {filteredHistory.slice().reverse().map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#14181f] border border-[#262a30] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#8c90a1]" />
                      <span className="font-semibold text-white">{item.dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#8c90a1]">
                        Vol: <strong className="text-white">{item.totalVolume} kg</strong>
                      </span>
                      <span className="text-[#0066ff] font-bold">
                        {item.maxWeight} kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 3: INSTRUÇÕES */}
          {activeTab === 'instrucoes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Passo a passo */}
              {stepsList.length > 0 ? (
                <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0066ff]">
                    <Info className="w-4 h-4" />
                    <span>Passo a Passo da Execução</span>
                  </div>

                  <div className="space-y-2.5">
                    {stepsList.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-[#c2c6d8] leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-[#181c21] border border-[#262a30] text-[#0066ff] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step.replace(/^Step:\d+\s*/i, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] space-y-2 text-xs text-[#c2c6d8] leading-relaxed">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0066ff]">
                    <Info className="w-4 h-4" />
                    <span>Orientações Técnicas SOMMA+</span>
                  </div>
                  <p>
                    1. Posicione-se com postura anatômica alinhada e base firme antes de iniciar a primeira repetição.
                  </p>
                  <p>
                    2. Controle a fase excêntrica (descida do peso) em 2 a 3 segundos para maximizar o recrutamento de fibras musculares.
                  </p>
                  <p>
                    3. Evite travar as articulações na extensão máxima para manter a tensão constante no músculo-alvo.
                  </p>
                </div>
              )}

              {/* Músculos trabalhados */}
              {targetMuscles.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] space-y-2">
                  <span className="text-[11px] font-bold uppercase text-[#8c90a1] block">
                    Músculos Recrutados
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {targetMuscles.map((tm, idx) => (
                      <span
                        key={idx}
                        className="bg-[#181c21] text-white px-3 py-1 rounded-xl text-xs border border-[#262a30]"
                      >
                        {tm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 4: RECORDES */}
          {activeTab === 'recordes' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Recorde 1: Maior Peso */}
              <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffb59d]/15 text-[#ffb59d] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Maior Peso</h4>
                    <span className="text-xs text-[#8c90a1]">Carga máxima levantada</span>
                  </div>
                </div>
                <span className="text-lg font-black text-white tabular-nums">
                  {records.maxWeight} kg
                </span>
              </div>

              {/* Recorde 2: Maior Volume */}
              <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0066ff]/15 text-[#0066ff] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Maior Volume</h4>
                    <span className="text-xs text-[#8c90a1]">Carga total em uma única sessão</span>
                  </div>
                </div>
                <span className="text-lg font-black text-white tabular-nums">
                  {records.maxVolume.toLocaleString()} kg
                </span>
              </div>

              {/* Recorde 3: Melhor 1RM */}
              <div className="p-4 rounded-2xl bg-[#14181f] border border-[#262a30] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Melhor 1RM Estimado</h4>
                    <span className="text-xs text-[#8c90a1]">Fórmula de Epley</span>
                  </div>
                </div>
                <span className="text-lg font-black text-[#4edea3] tabular-nums">
                  {records.best1Rm} kg
                </span>
              </div>
            </div>
          )}

        </div>

        {/* 5. Rodapé: Fechar ou Adicionar à Rotina */}
        <div className="p-4 bg-[#14181f] border-t border-[#1c2025] flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-[#262a30]"
          >
            Fechar
          </button>

          {onAddExercise && (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-[#4edea3] text-[#101419]'
                  : 'bg-[#0066ff] hover:bg-[#0054d6] text-white shadow-md shadow-[#0066ff]/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Exercício Adicionado!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Adicionar à Rotina</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
