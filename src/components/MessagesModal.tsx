import React from 'react';
import { X, MessageCircle, UserCheck, ShieldCheck, Users, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { Professional } from '../types';

interface MessagesModalProps {
  onClose: () => void;
  onOpenChatWithCoach?: (coach: Professional) => void;
  assignedCoach?: Professional | null;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  onClose,
  onOpenChatWithCoach,
  assignedCoach
}) => {
  useScrollLock(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 overscroll-contain animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#14181f]/95 border border-[#262a30] rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 bg-[#101419] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#0066ff]" />
            <h3 className="text-sm font-bold text-white">Mensagens</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar mensagens"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-3 space-y-2.5">
          {/* 1. Aluno ↔ Treinador / Profissional */}
          <div
            onClick={() => {
              if (assignedCoach && onOpenChatWithCoach) {
                onClose();
                onOpenChatWithCoach(assignedCoach);
              }
            }}
            className="p-3 rounded-xl bg-[#181c21] hover:bg-[#1f242b] border border-[#262a30] hover:border-[#0066ff]/40 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#0066ff]/15 border border-[#0066ff]/30 flex items-center justify-center text-[#0066ff] shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {assignedCoach ? assignedCoach.name : 'Treinador SOMMA+'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                </div>
                <span className="text-[11px] text-[#8c90a1] truncate">
                  {assignedCoach ? 'Ajustes de carga e prescrição de treino' : 'Chat direto com treinador'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8c90a1] group-hover:text-white transition-colors shrink-0" />
          </div>

          {/* 2. Usuário ↔ Usuário / Comunidade */}
          <div className="p-3 rounded-xl bg-[#181c21] border border-[#262a30] flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#b3c5ff]/10 border border-[#b3c5ff]/20 flex items-center justify-center text-[#b3c5ff] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white">Comunidade & Atletas</span>
                <span className="text-[11px] text-[#8c90a1] truncate">
                  Mensagens diretas entre parceiros de treino
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#0066ff] bg-[#0066ff]/15 px-2 py-0.5 rounded-full border border-[#0066ff]/30">
              Em breve
            </span>
          </div>

          {/* 3. Suporte SOMMA */}
          <div className="p-3 rounded-xl bg-[#181c21] border border-[#262a30] flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 flex items-center justify-center text-[#4edea3] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white">Suporte Oficial SOMMA</span>
                <span className="text-[11px] text-[#8c90a1] truncate">
                  Dúvidas sobre assinaturas, treinos e aplicativo
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#4edea3] bg-[#4edea3]/15 px-2 py-0.5 rounded-full border border-[#4edea3]/30">
              Online
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#101419]/70 border-t border-[#262a30] text-center">
          <p className="text-[10px] text-[#8c90a1]">
            Central de mensagens criptografada da plataforma SOMMA+.
          </p>
        </div>
      </div>
    </div>
  );
};
