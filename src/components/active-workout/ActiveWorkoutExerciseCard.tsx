import React, { useState } from 'react';
import {
  Timer,
  MoreVertical,
  Check,
  Plus
} from 'lucide-react';
import { Exercise } from '../../types';
import { ExerciseMedia } from '../exercise/ExerciseMedia';
import { ExerciseOptionsSheet } from './ExerciseOptionsSheet';

interface ActiveWorkoutExerciseCardProps {
  exercise: Exercise;
  exIndex: number;
  totalExercises: number;
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
}

export const ActiveWorkoutExerciseCard: React.FC<ActiveWorkoutExerciseCardProps> = ({
  exercise,
  exIndex,
  totalExercises,
  onOpenFeedback,
  onStartRest,
  onRemoveExercise,
  onEditSetType,
  onUpdateSetField,
  onToggleSetComplete,
  onAddSet,
  onOpenDetail,
  onUpdateNotes,
  onConfigureRest
}) => {
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(exercise.professionalNote || (exercise as any).notes || '');

  // Rest duration format (e.g. 120s -> "2min 0s", 60s -> "1min 0s", 90s -> "1min 30s")
  const defaultRest = (exercise as any).restTimeSeconds || 120;
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

  const handleNotesBlur = () => {
    setIsEditingNotes(false);
    if (onUpdateNotes) {
      onUpdateNotes(exIndex, notesValue);
    }
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
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#262a30] bg-[#181c21] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform group shadow-sm"
          >
            <div className="w-full h-full flex items-center justify-center pointer-events-none p-1">
              <ExerciseMedia
                exercise={exercise}
                size="sm"
                forceStaticThumbnail={true}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </button>

          {/* Exercise Title & Subtitle */}
          <div className="flex flex-col min-w-0">
            <h3
              onClick={() => onOpenDetail && onOpenDetail(exercise)}
              className="text-base sm:text-lg font-bold text-[#0066ff] hover:text-[#38bdf8] transition-colors cursor-pointer truncate leading-tight"
              title={exercise.name}
            >
              {exercise.name}
            </h3>

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

      {/* 2. Notes / Observações (Discreet inline line, no card) */}
      <div className="mt-2.5 pl-0.5">
        {isEditingNotes ? (
          <input
            type="text"
            autoFocus
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            onBlur={handleNotesBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNotesBlur();
            }}
            placeholder="Adicione notas aqui..."
            className="w-full text-xs text-white bg-[#181c21] border border-[#262a30] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#0066ff] placeholder-[#64748b]"
          />
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="text-xs text-[#64748b] hover:text-[#8c90a1] transition-colors cursor-pointer truncate py-0.5"
            title="Clique para editar a nota do exercício"
          >
            {notesValue.trim() ? (
              <span className="text-[#c2c6d8]">{notesValue}</span>
            ) : (
              <span>Adicione notas aqui...</span>
            )}
          </div>
        )}
      </div>

      {/* 3. Rest line: [Clock icon] Descanso: 2min */}
      <div className="mt-2 pl-0.5 flex items-center">
        <button
          type="button"
          onClick={() => {
            if (onConfigureRest) {
              onConfigureRest(exercise);
            } else {
              onStartRest(defaultRest);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066ff] hover:text-[#38bdf8] transition-colors cursor-pointer"
          title="Toque para configurar ou iniciar descanso"
        >
          <Timer className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Descanso: {formatRestDisplay(defaultRest)}</span>
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
          // Determine badge text and color based on set type
          let setSymbol = `${setIndex + 1}`;
          let symbolStyle = 'text-white bg-[#181c21] border-[#262a30] hover:border-[#0066ff]';

          if (set.type === 'warmup') {
            setSymbol = 'W';
            symbolStyle = 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/40';
          } else if (set.type === 'failure') {
            setSymbol = 'F';
            symbolStyle = 'text-[#ff5c5c] bg-[#ff5c5c]/10 border-[#ff5c5c]/40';
          } else if (set.type === 'dropset') {
            setSymbol = 'D';
            symbolStyle = 'text-[#0066ff] bg-[#0066ff]/10 border-[#0066ff]/40';
          }

          return (
            <div
              key={set.id || `set-${setIndex}`}
              className={`grid grid-cols-12 gap-2 items-center rounded-xl p-1 transition-colors ${
                set.completed ? 'bg-[#4edea3]/5' : ''
              }`}
            >
              {/* SÉRIE: Clickable set badge */}
              <div className="col-span-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onEditSetType(exIndex, setIndex)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all cursor-pointer active:scale-95 ${symbolStyle}`}
                  title="Alterar tipo de série"
                  aria-label={`Série ${setSymbol}`}
                >
                  <span className="tabular-nums">{setSymbol}</span>
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
        onClose={() => setShowOptionsSheet(false)}
        onOpenDetail={() => onOpenDetail && onOpenDetail(exercise)}
        onOpenFeedback={() => onOpenFeedback(exercise)}
        onConfigureRest={() => {
          if (onConfigureRest) {
            onConfigureRest(exercise);
          } else {
            onStartRest(defaultRest);
          }
        }}
        onRemoveExercise={() => onRemoveExercise(exIndex)}
      />
    </div>
  );
};
