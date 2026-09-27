import React from 'react';
import { Bell, ArrowLeft, MessageCircle } from 'lucide-react';
import { TabType } from '../types';
import { SommaLogo } from './SommaLogo';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenNotifications: () => void;
  onOpenMessages?: () => void;
  onBack?: () => void;
  unreadCount?: number;
  unreadMessagesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenNotifications,
  onOpenMessages,
  onBack,
  unreadCount = 2,
  unreadMessagesCount = 1
}) => {
  const isSecondaryView = currentTab === 'evolucao' || currentTab === 'profissionais';

  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-64 z-40 pt-safe pointer-events-none transition-all duration-300 select-none pb-6"
      style={{
        background: 'linear-gradient(to bottom, #06080c 0%, rgba(6, 8, 14, 0.92) 28%, rgba(6, 8, 14, 0.55) 60%, rgba(6, 8, 14, 0.18) 82%, rgba(6, 8, 14, 0) 100%)'
      }}
    >
      <div className="h-14 sm:h-16 px-4 max-w-[440px] md:max-w-none mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand logo (and optional contextual Back button for secondary sub-views) */}
        <div className="flex items-center gap-2.5 min-w-0">
          {isSecondaryView && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8c90a1] hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95"
              title="Voltar para a tela anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : null}

          {/* Logo visual oficial SOMMA+ preservada integralmente */}
          <button 
            type="button"
            onClick={() => onNavigate('inicio')}
            className="flex items-center focus:outline-none group text-left hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shrink-0"
            aria-label="SOMMA+"
          >
            <SommaLogo variant="full" className="h-8 sm:h-9 w-auto shrink-0 object-contain drop-shadow-[0_2px_12px_rgba(0,102,255,0.18)]" />
          </button>
        </div>

        {/* Action icons: Única cápsula glass para os botões da direita [Notificações 🔔] e [Mensagens 💬] */}
        <div
          className="flex items-center rounded-full p-1 px-1.5 transition-all"
          style={{
            background: 'linear-gradient(180deg, rgba(38, 42, 50, 0.55), rgba(12, 14, 18, 0.42))',
            backdropFilter: 'blur(26px) saturate(145%)',
            WebkitBackdropFilter: 'blur(26px) saturate(145%)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* 1. Botão de Notificações (à esquerda) */}
          <button
            type="button"
            aria-label="Notificações"
            onClick={onOpenNotifications}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all relative cursor-pointer group"
            title="Notificações"
          >
            <Bell className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[2.2] text-white/90 group-hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0066ff] ring-2 ring-[#0c0e12] shadow-sm shadow-[#0066ff]/60"></span>
            )}
          </button>

          {/* Micro divisor sutil entre os dois botões da cápsula */}
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

          {/* 2. Botão de Mensagens (à direita) */}
          <button
            type="button"
            aria-label="Mensagens"
            onClick={onOpenMessages}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all relative cursor-pointer group"
            title="Mensagens"
          >
            <MessageCircle className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[2.2] text-white/90 group-hover:text-white transition-colors" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0066ff] ring-2 ring-[#0c0e12] shadow-sm shadow-[#0066ff]/60"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
