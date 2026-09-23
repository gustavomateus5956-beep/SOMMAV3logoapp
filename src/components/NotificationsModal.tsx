import React from 'react';
import { X, Flame, Dumbbell, Calendar, Check, Award, Bell } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  useScrollLock(true);
  const notifications = [
    {
      id: '1',
      icon: Flame,
      color: 'text-[#ffb59d] bg-[#ffb59d]/15',
      title: 'Matheus Silva deu força no seu treino!',
      detail: 'Treino A • Foco Peito e Tríceps',
      time: 'há 15 minutos',
      unread: true
    },
    {
      id: '2',
      icon: Dumbbell,
      color: 'text-[#0066ff] bg-[#0066ff]/15',
      title: 'Coach Rodrigo atualizou sua periodização',
      detail: 'Série de trabalho do Supino Inclinado calibrada para 34kg',
      time: 'há 2 horas',
      unread: true
    },
    {
      id: '3',
      icon: Award,
      color: 'text-[#4edea3] bg-[#4edea3]/15',
      title: 'Novo Recorde Registrado!',
      detail: 'Você atingiu 100 kg no Supino Reto com Barra (1RM)',
      time: 'Ontem',
      unread: false
    },
    {
      id: '4',
      icon: Calendar,
      color: 'text-[#b3c5ff] bg-[#b3c5ff]/15',
      title: 'Lembrete de Treino Agendado',
      detail: 'Treino B (Costas & Bíceps) programado para hoje às 18:30',
      time: 'Ontem',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 overscroll-contain">
      <div className="w-full max-w-sm bg-[#1c2025] border border-[#262a30] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 overscroll-contain">
        <div className="px-4 py-3 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0066ff]" />
            <h3 className="text-sm font-bold text-white">Notificações</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-7 h-7 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-2 max-h-80 overflow-y-auto no-scrollbar">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-colors flex items-start gap-3 ${
                  n.unread
                    ? 'bg-[#181c21] border-[#0066ff]/40'
                    : 'bg-[#181c21]/60 border-[#262a30]/60 opacity-80'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-bold text-white leading-snug">{n.title}</span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5 truncate">{n.detail}</span>
                  <span className="text-[10px] text-[#424656] mt-1">{n.time}</span>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0 mt-1"></span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
