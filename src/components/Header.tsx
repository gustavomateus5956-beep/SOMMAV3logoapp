import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { TabType } from '../types';
import { USER_PROFILE } from '../data/mockData';
import { SommaLogo } from './SommaLogo';
import { useUser } from '../context/UserContext';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenNotifications: () => void;
  onBack?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenNotifications,
  onBack,
  unreadCount = 2
}) => {
  const { user } = useUser();
  const avatarUrl = user?.avatar || USER_PROFILE.avatar;
  const userName = user?.name || USER_PROFILE.name;

  const isSecondaryView = currentTab === 'evolucao' || currentTab === 'comunidade' || currentTab === 'profissionais';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-40 pt-safe bg-[#101419]/90 backdrop-blur-xl border-b border-[#262a30]/40">
      <div className="h-14 px-4 max-w-[430px] md:max-w-none mx-auto flex items-center justify-between">
        {/* Brand logo (and optional contextual Back button for secondary views) */}
        <div className="flex items-center gap-2.5 min-w-0">
          {isSecondaryView && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1c2025] hover:bg-[#262a30] text-[#8c90a1] hover:text-white border border-[#262a30] text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Voltar para a tela anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : null}

          {/* Logo visual: Somma iconic dual blue spheres + lettering */}
          <button 
            onClick={() => onNavigate('inicio')}
            className="flex items-center focus:outline-none group text-left hover:opacity-85 transition-opacity cursor-pointer shrink-0"
            aria-label="SOMMA+"
          >
            <SommaLogo variant="full" className="h-8 sm:h-9 w-auto shrink-0 object-contain" />
          </button>
        </div>

        {/* Action icons: Notifications & User profile avatar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="Notificações"
            onClick={onOpenNotifications}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#c2c6d8] hover:text-white hover:bg-[#1c2025] transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0066ff] ring-2 ring-[#101419]"></span>
            )}
          </button>

          <button
            aria-label="Perfil do Atleta"
            onClick={() => onNavigate('perfil')}
            className="w-10 h-10 flex items-center justify-center rounded-full ring-1 ring-transparent hover:ring-[#0066ff] transition-all cursor-pointer overflow-hidden shrink-0"
          >
            <img
              src={avatarUrl}
              alt={`Foto de perfil de ${userName}`}
              className="w-8 h-8 rounded-full object-cover shrink-0 block bg-[#1c2025]"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
