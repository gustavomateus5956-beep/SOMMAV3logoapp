import React from 'react';

export const EvolutionHistoryTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Treino B • Costas & Bíceps</span>
          <span className="text-[10px] text-[#4edea3] font-bold bg-[#00a572]/20 px-2 py-0.5 rounded">1 PR Batido</span>
        </div>
        <span className="text-xs text-[#8c90a1]">Ontem • 18:42 • 54 min</span>
        <div className="grid grid-cols-3 gap-2 bg-[#181c21] p-2.5 rounded-xl text-center text-xs mt-1">
          <div>
            <span className="text-[10px] text-[#8c90a1] block">TEMPO</span>
            <span className="font-bold text-white">54 min</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8c90a1] block">VOLUME</span>
            <span className="font-bold text-[#b3c5ff]">7.850 kg</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8c90a1] block">ITENS</span>
            <span className="font-bold text-white">6 exercícios</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Treino A • Empurrar & Peito</span>
          <span className="text-[10px] text-[#8c90a1]">Concluído</span>
        </div>
        <span className="text-xs text-[#8c90a1]">22 Outubro • 07:15 • 58 min</span>
        <div className="grid grid-cols-3 gap-2 bg-[#181c21] p-2.5 rounded-xl text-center text-xs mt-1">
          <div>
            <span className="text-[10px] text-[#8c90a1] block">TEMPO</span>
            <span className="font-bold text-white">58 min</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8c90a1] block">VOLUME</span>
            <span className="font-bold text-[#b3c5ff]">8.200 kg</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8c90a1] block">ITENS</span>
            <span className="font-bold text-white">6 exercícios</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Treino C • Pernas Completo</span>
          <span className="text-[10px] text-[#4edea3] font-bold bg-[#00a572]/20 px-2 py-0.5 rounded">PR no Agachamento</span>
        </div>
        <span className="text-xs text-[#8c90a1]">19 Outubro • 19:10 • 65 min</span>
        <div className="grid grid-cols-3 gap-2 bg-[#181c21] p-2.5 rounded-xl text-center text-xs mt-1">
          <div>
            <span className="text-[10px] text-[#8c90a1] block">TEMPO</span>
            <span className="font-bold text-white">65 min</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8c90a1] block">VOLUME</span>
            <span className="font-bold text-[#b3c5ff]">11.450 kg</span>
          </div>
          <div>
            <span className="text-[10px] text-[#8c90a1] block">ITENS</span>
            <span className="font-bold text-white">7 exercícios</span>
          </div>
        </div>
      </div>
    </div>
  );
};
