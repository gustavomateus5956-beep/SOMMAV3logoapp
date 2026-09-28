import React, { useState, useEffect } from 'react';
import { Timer, Play, Check, Plus, Minus, Sliders } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export const MAX_REST_SECONDS = 900; // Limite máximo de 15 minutos

export const PRESET_REST_TIMES = [
  { label: '30s', seconds: 30 },
  { label: '45s', seconds: 45 },
  { label: '1 min', seconds: 60 },
  { label: '1 min 30s', seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '2 min 30s', seconds: 150 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 }
];

interface RestSettingsSheetProps {
  isOpen: boolean;
  currentRestSeconds: number;
  exerciseName?: string;
  onClose: () => void;
  onSetRest: (seconds: number, autoStart?: boolean) => void;
}

export const RestSettingsSheet: React.FC<RestSettingsSheetProps> = ({
  isOpen,
  currentRestSeconds,
  exerciseName,
  onClose,
  onSetRest
}) => {
  useScrollLock(isOpen);

  // Tab mode: 'presets' | 'custom'
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Selected preset or active seconds
  const [selectedSeconds, setSelectedSeconds] = useState<number>(currentRestSeconds || 120);

  // Custom stepper values (minutes and seconds)
  const [customMinutes, setCustomMinutes] = useState<number>(Math.floor((currentRestSeconds || 120) / 60));
  const [customSeconds, setCustomSeconds] = useState<number>((currentRestSeconds || 120) % 60);

  // Re-sync when opening or changing exercise
  useEffect(() => {
    if (isOpen) {
      const initial = currentRestSeconds > 0 ? currentRestSeconds : 120;
      setSelectedSeconds(initial);
      setCustomMinutes(Math.floor(initial / 60));
      setCustomSeconds(initial % 60);

      // Se o tempo não coincidir com nenhum preset, abrir direto na aba personalizado
      const isPreset = PRESET_REST_TIMES.some((p) => p.seconds === initial);
      setActiveTab(isPreset ? 'presets' : 'custom');
    }
  }, [isOpen, currentRestSeconds]);

  if (!isOpen) return null;

  // Cálculo e validação do personalizado
  const calculatedCustomTotal = customMinutes * 60 + customSeconds;
  const isCustomValid = calculatedCustomTotal > 0 && calculatedCustomTotal <= MAX_REST_SECONDS;

  const handleApply = (startNow = false) => {
    const finalSeconds = activeTab === 'presets' ? selectedSeconds : calculatedCustomTotal;
    if (finalSeconds > 0 && finalSeconds <= MAX_REST_SECONDS) {
      onSetRest(finalSeconds, startNow);
      onClose();
    }
  };

  const handleStepMinutes = (delta: number) => {
    setCustomMinutes((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next * 60 + customSeconds > MAX_REST_SECONDS) return Math.floor(MAX_REST_SECONDS / 60);
      return next;
    });
  };

  const handleStepSeconds = (delta: number) => {
    setCustomSeconds((prev) => {
      let next = prev + delta;
      if (next < 0) next = 55;
      if (next > 59) next = 0;
      if (customMinutes * 60 + next > MAX_REST_SECONDS) return prev;
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-2 shrink-0" />

        {/* Title & Context */}
        <div className="px-5 pt-1 pb-3 text-center border-b border-[#262a30]/50">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066ff] uppercase tracking-wider mb-1">
            <Timer className="w-3.5 h-3.5" />
            <span>Tempo de Descanso</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight truncate">
            {exerciseName || 'Descanso do Exercício'}
          </h3>
          <p className="text-xs text-[#8c90a1] mt-0.5">
            Configuração individual para este exercício
          </p>
        </div>

        {/* Tab Switcher: Opções Rápidas | Personalizado */}
        <div className="px-4 pt-3 pb-1">
          <div className="grid grid-cols-2 p-1 bg-[#101419] rounded-xl border border-[#262a30]">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-[#181c22] text-white shadow-xs'
                  : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              Opções Rápidas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-[#181c22] text-white shadow-xs'
                  : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalizado</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Grid de Opções Rápidas */}
        {activeTab === 'presets' && (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_REST_TIMES.map((item) => {
              const isSelected = selectedSeconds === item.seconds;
              return (
                <button
                  key={item.seconds}
                  type="button"
                  onClick={() => setSelectedSeconds(item.seconds)}
                  className={`h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0066ff] text-white shadow-md shadow-[#0066ff]/30 ring-2 ring-[#0066ff]/50'
                      : 'bg-[#181c22] hover:bg-[#20252c] text-[#c2c6d8] border border-[#262a30]'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Descanso Personalizado com Steppers Móveis */}
        {activeTab === 'custom' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Stepper Minutos */}
              <div className="p-3 rounded-2xl bg-[#101419] border border-[#262a30] flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c90a1] mb-2">
                  Minutos
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepMinutes(-1)}
                    disabled={customMinutes <= 0}
                    className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#20252c] disabled:opacity-30 disabled:cursor-not-allowed border border-[#262a30] flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-2xl font-extrabold text-white w-8 text-center">
                    {customMinutes}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepMinutes(1)}
                    disabled={customMinutes >= Math.floor(MAX_REST_SECONDS / 60)}
                    className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#20252c] disabled:opacity-30 disabled:cursor-not-allowed border border-[#262a30] flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stepper Segundos */}
              <div className="p-3 rounded-2xl bg-[#101419] border border-[#262a30] flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c90a1] mb-2">
                  Segundos
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepSeconds(-5)}
                    className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#20252c] border border-[#262a30] flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-2xl font-extrabold text-white w-10 text-center">
                    {customSeconds.toString().padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStepSeconds(5)}
                    className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#20252c] border border-[#262a30] flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Preview */}
            <div className="p-2.5 rounded-xl bg-[#181c22] border border-[#262a30] flex items-center justify-between text-xs">
              <span className="text-[#8c90a1]">Tempo total configurado:</span>
              <span className="font-bold font-mono text-white text-sm">
                {customMinutes > 0 ? `${customMinutes}min ` : ''}
                {customSeconds}s ({calculatedCustomTotal}s)
              </span>
            </div>

            {!isCustomValid && (
              <p className="text-[11px] text-[#ef4444] text-center font-medium">
                {calculatedCustomTotal <= 0
                  ? 'O tempo de descanso deve ser maior que zero.'
                  : `O tempo de descanso não pode exceder ${Math.floor(MAX_REST_SECONDS / 60)} minutos.`}
              </p>
            )}
          </div>
        )}

        {/* Footer Actions: Cancelar | Salvar Configuração | Iniciar Imediatamente */}
        <div className="p-4 pt-2 border-t border-[#262a30]/50 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#181c22] hover:bg-[#20252c] text-[#8c90a1] hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-[#262a30]"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={activeTab === 'custom' && !isCustomValid}
              onClick={() => handleApply(false)}
              className="flex-1 h-11 rounded-xl bg-[#1c222b] hover:bg-[#262d38] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold border border-[#262a30] transition-colors cursor-pointer"
            >
              Salvar Tempo
            </button>
          </div>

          <button
            type="button"
            disabled={activeTab === 'custom' && !isCustomValid}
            onClick={() => handleApply(true)}
            className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0066ff]/25"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Salvar e Iniciar Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
