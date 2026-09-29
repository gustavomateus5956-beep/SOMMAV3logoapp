import React, { useState } from 'react';
import {
  Timer,
  MoreVertical,
  Check,
  Plus
} from 'lucide-react';
import { Exercise, SetRole, SetMethod } from '../../types';
import { ExerciseMedia } from '../exercise/ExerciseMedia';
import { ExerciseOptionsSheet } from './ExerciseOptionsSheet';
import { ProfessionalInstructionsSheet } from './ProfessionalInstructionsSheet';

interface ActiveWorkoutExerciseCardProps {
  exercise: Exercise;
  exIndex: number;
  totalExercises: number;
  blockTag?: string; // e.g. "A1", "A2"
  blockName?: string;
  onOpenFeedback: (exercise: Exercise) => void;
  onStartRest: (seconds?: number) => void;
  onRemoveExercise: (exIndex: number) => void;
  onEditSetType: (exIndex: number, setIndex: number) => void;
  onUpdateSetField: (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => void;
  onToggleSetComplete: (exIndex: number, setIndex: number) => void;
  onAddSet: (exIndex: number) => void;
  onOpenDetail?: (exercise: Exercise) => void;
  onUpdateNotes?: (exIndex: number, notes: string) => void;
  onConfigureRest?: (exercise: Exercise) => void;
  onAddToBlock?: () => void;
  onRemoveFromBlock?: () => void;
}

export const ActiveWorkoutExerciseCard: React.FC<ActiveWorkoutExerciseCardProps> = ({
  exercise,
  exIndex,
  totalExercises,
  blockTag,
  blockName,
  onOpenFeedback,
  onStartRest,
  onRemoveExercise,
  onEditSetType,
  onUpdateSetField,
  onToggleSetComplete,
  onAddSet,
  onOpenDetail,
  onUpdateNotes,
  onConfigureRest,
  onAddToBlock,
  onRemoveFromBlock
}) => {
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showInstructionsSheet, setShowInstructionsSheet] = useState(false);

  // Rest duration format (e.g. 120s -> "2min", 90s -> "1min 30s", 45s -> "45s")
  const exerciseRest = exercise.restSeconds ?? (exercise as any).restTimeSeconds ?? 120;
  const formatRestDisplay = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    if (mins > 0 && remainderSecs > 0) {
      return `${mins}min ${remainderSecs}s`;
    }
    if (mins > 0) {
      return `${mins}min`;
    }
    return `${remainderSecs}s`;
  };

  return (
    <div className="pb-7 mb-7 border-b border-[#1c2025] last:border-b-0 last:mb-2 last:pb-2">
      {/* 1. Exercise Top Row: [Circular Thumbnail] [Name + Subtitle] [•••] */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Circular Thumbnail (48–56px) */}
          <button
            type="button"
            onClick={() => onOpenDetail && onOpenDetail(exercise)}
            title="Ver execução biomecânica e histórico"
            aria-label={`Ver execução de ${exercise.name}`}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#262a30] bg-[#181c21] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform group shadow-sm p-0.5"
          >
            <ExerciseMedia
              exercise={exercise}
              size="sm"
              forceStaticThumbnail={true}
              className="w-full h-full object-cover rounded-full"
            />
          </button>

          {/* Exercise Title & Subtitle */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {blockTag && (
                <span className="px-2 py-0.5 rounded-lg bg-[#0066ff]/20 text-[#38bdf8] border border-[#0066ff]/40 text-xs font-mono font-black tracking-wider shrink-0">
                  {blockTag}
                </span>
              )}
              <h3
                onClick={() => onOpenDetail && onOpenDetail(exercise)}
                className="text-base sm:text-lg font-bold text-[#0066ff] hover:text-[#38bdf8] transition-colors cursor-pointer truncate leading-tight"
                title={exercise.name}
              >
                {exercise.name}
              </h3>
            </div>

            <span className="text-xs text-[#8c90a1] truncate mt-0.5">
              {exercise.muscleGroup}
              {exercise.equipment && (
                <>
                  {' • '}
                  <span className="text-[#a5b4fc]">{exercise.equipment}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Options Button [•••] */}
        <button
          type="button"
          onClick={() => setShowOptionsSheet(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#8c90a1] hover:text-white hover:bg-[#181c21] transition-colors cursor-pointer shrink-0"
          title="Opções do exercício"
          aria-label="Opções"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Rest line: [Clock icon] Descanso: 2min */}
      <div className="mt-2.5 pl-0.5 flex items-center">
        <button
          type="button"
          onClick={() => {
            if (onConfigureRest) {
              onConfigureRest(exercise);
            } else {
              onStartRest(exerciseRest);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066ff] hover:text-[#38bdf8] transition-colors cursor-pointer"
          title="Toque para configurar ou iniciar descanso"
        >
          <Timer className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Descanso: {formatRestDisplay(exerciseRest)}</span>
        </button>
      </div>

      {/* 4. Sets Table */}
      <div className="mt-3.5 space-y-1.5">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] sm:text-[11px] font-bold text-[#8c90a1] uppercase px-1 pb-1">
          <span className="col-span-2 text-center">SÉRIE</span>
          <span className="col-span-3 text-center truncate">ANTERIOR</span>
          <span className="col-span-3 text-center">KG</span>
          <span className="col-span-2 text-center">REPS</span>
          <span className="col-span-2 text-center">CHECK</span>
        </div>

        {/* Set Rows */}
        {exercise.sets.map((set, setIndex) => {
          // 1. Resolve role and method with backwards compatibility
          const effectiveRole: SetRole = set.role || (set.type === 'warmup' ? 'warmup' : 'working');
          const effectiveMethod: SetMethod =
            set.method ||
            (set.type === 'dropset'
              ? 'dropset'
              : set.type === 'rest_pause'
              ? 'rest_pause'
              : set.type === 'amrap'
              ? 'amrap'
              : 'normal');

          // 2. Count ordinals per role up to this set
          let countForRole = 0;
          for (let i = 0; i <= setIndex; i++) {
            const s = exercise.sets[i];
            const r: SetRole = s.role || (s.type === 'warmup' ? 'warmup' : 'working');
            if (r === effectiveRole) {
              countForRole++;
            }
          }

          let setSymbol = `${countForRole}`;
          let symbolStyle = 'text-white bg-[#181c21] border-[#262a30] hover:border-[#0066ff]';

          if (effectiveRole === 'warmup') {
            setSymbol = `A${countForRole}`;
            symbolStyle = 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/40 hover:border-[#fbbf24]';
          } else if (effectiveRole === 'top_set') {
            setSymbol = `T${countForRole}`;
            symbolStyle = 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/40 hover:border-[#38bdf8]';
          } else if (effectiveRole === 'backoff') {
            setSymbol = `B${countForRole}`;
            symbolStyle = 'text-[#c084fc] bg-[#c084fc]/10 border-[#c084fc]/40 hover:border-[#c084fc]';
          } else {
            // effectiveRole === 'working'
            setSymbol = `${countForRole}`;
            if (effectiveMethod === 'dropset') {
              symbolStyle = 'text-[#0066ff] bg-[#0066ff]/10 border-[#0066ff]/40 hover:border-[#0066ff]';
            } else if (effectiveMethod === 'rest_pause') {
              symbolStyle = 'text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/40 hover:border-[#4edea3]';
            } else if (effectiveMethod === 'amrap') {
              symbolStyle = 'text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/40 hover:border-[#f43f5e]';
            }
          }

          // 3. Discreet summary tokens (only rendered if there is relevant config)
          const summaryTokens: string[] = [];
          if (effectiveMethod === 'dropset') summaryTokens.push('DROP SET');
          else if (effectiveMethod === 'rest_pause') summaryTokens.push('REST-PAUSE');
          else if (effectiveMethod === 'amrap') summaryTokens.push('AMRAP');

          if (effectiveRole === 'top_set') summaryTokens.push('TOP SET');
          else if (effectiveRole === 'backoff') summaryTokens.push('BACK-OFF');

          if (set.targetRepsRange && set.targetRepsRange.trim()) {
            summaryTokens.push(set.targetRepsRange);
          }

          if (set.rir !== undefined && set.rir !== null) {
            summaryTokens.push(`RIR ${set.rir}`);
          } else if (set.rpe !== undefined && set.rpe !== null) {
            summaryTokens.push(`RPE ${set.rpe}`);
          }

          if (set.restTimeSeconds && set.restTimeSeconds > 0 && set.restTimeSeconds !== exerciseRest) {
            summaryTokens.push(`${set.restTimeSeconds}s`);
          }

          return (
            <div
              key={set.id || `set-${setIndex}`}
              className={`rounded-xl p-1 transition-colors ${
                set.completed ? 'bg-[#4edea3]/5' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* SÉRIE: Clickable set badge */}
                <div className="col-span-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onEditSetType(exIndex, setIndex)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all cursor-pointer active:scale-95 ${symbolStyle}`}
                    title="Configurar série (Função, Método, Meta)"
                    aria-label={`Série ${setSymbol}`}
                  >
                    <span className="tabular-nums font-mono">{setSymbol}</span>
                  </button>
                </div>

                {/* ANTERIOR: Previous performance */}
                <div className="col-span-3 flex flex-col items-center justify-center text-center">
                  {set.prevWeight || set.targetWeight ? (
                    <span className="text-xs sm:text-sm text-[#8c90a1] tabular-nums font-medium truncate">
                      {set.prevWeight || set.targetWeight}kg × {set.prevReps || set.targetReps}
                    </span>
                  ) : (
                    <span className="text-xs text-[#4b5563]">-</span>
                  )}
                </div>

                {/* KG: Weight Input */}
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight === 0 ? '' : set.weight}
                    placeholder="0"
                    onChange={(e) =>
                      onUpdateSetField(
                        exIndex,
                        setIndex,
                        'weight',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full h-10 sm:h-11 bg-[#181c21] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-center text-sm sm:text-base font-bold text-white tabular-nums outline-none transition-colors"
                  />
                </div>

                {/* REPS: Reps Input */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    value={set.reps === 0 ? '' : set.reps}
                    placeholder="0"
                    onChange={(e) =>
                      onUpdateSetField(
                        exIndex,
                        setIndex,
                        'reps',
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-full h-10 sm:h-11 bg-[#181c21] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-center text-sm sm:text-base font-bold text-white tabular-nums outline-none transition-colors"
                  />
                </div>

                {/* CHECK: Complete Set Button */}
                <div className="col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => onToggleSetComplete(exIndex, setIndex)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      set.completed
                        ? 'bg-[#4edea3] text-[#101419] shadow-sm shadow-[#4edea3]/30'
                        : 'bg-[#181c21] border border-[#262a30] text-[#64748b] hover:border-[#4edea3]/50 hover:text-white'
                    }`}
                    title={set.completed ? 'Desmarcar série' : 'Concluir série'}
                    aria-label={set.completed ? 'Série concluída' : 'Concluir série'}
                  >
                    <Check
                      className={`w-5 h-5 ${set.completed ? 'stroke-[3]' : 'stroke-[2]'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Discreet Configuration Summary below row */}
              {summaryTokens.length > 0 && (
                <div className="pt-1 pb-0.5 px-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#8c90a1] truncate">
                  <span className="text-[#38bdf8] font-mono tracking-tight font-medium">
                    {summaryTokens.join(' • ')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Wide Button: + Adicionar série */}
      <button
        type="button"
        onClick={() => onAddSet(exIndex)}
        className="w-full h-11 rounded-xl bg-[#181c21] hover:bg-[#20252c] border border-[#262a30] text-[#c2c6d8] hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3 shadow-xs active:scale-[0.99]"
      >
        <Plus className="w-4 h-4 text-[#8c90a1]" />
        <span>Adicionar série</span>
      </button>

      {/* Options Bottom Sheet */}
      <ExerciseOptionsSheet
        isOpen={showOptionsSheet}
        exercise={exercise}
        totalExercises={totalExercises}
        isInBlock={Boolean(blockTag)}
        blockName={blockName}
        onClose={() => setShowOptionsSheet(false)}
        onOpenDetail={() => onOpenDetail && onOpenDetail(exercise)}
        onOpenFeedback={() => onOpenFeedback(exercise)}
        onOpenInstructions={() => setShowInstructionsSheet(true)}
        onConfigureRest={() => {
          if (onConfigureRest) {
            onConfigureRest(exercise);
          } else {
            onStartRest(exerciseRest);
          }
        }}
        onRemoveExercise={() => onRemoveExercise(exIndex)}
        onAddToBlock={onAddToBlock}
        onRemoveFromBlock={onRemoveFromBlock}
      />

      {/* Professional Instructions Bottom Sheet */}
      <ProfessionalInstructionsSheet
        isOpen={showInstructionsSheet}
        exercise={exercise}
        coachName={(exercise as any).coachName || (exercise as any).certifiedBy?.professionalName}
        onClose={() => setShowInstructionsSheet(false)}
        onOpenFeedback={() => {
          setShowInstructionsSheet(false);
          onOpenFeedback(exercise);
        }}
      />
    </div>
  );
};
