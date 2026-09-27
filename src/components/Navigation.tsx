import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { MAIN_NAV_ITEMS } from '../config/navigation';
import { SommaLogo } from './SommaLogo';
import { useUser } from '../context/UserContext';
import { USER_PROFILE } from '../data/mockData';

interface NavigationProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onNavigate }) => {
  const { user } = useUser();
  const [avatarImgError, setAvatarImgError] = useState(false);

  const avatarUrl = user?.avatar || USER_PROFILE.avatar;
  const userName = user?.name || USER_PROFILE.name;

  // Sincroniza e reseta erro caso a foto do usuário seja alterada
  useEffect(() => {
    setAvatarImgError(false);
  }, [avatarUrl]);

  // Helper to determine active state including contextual secondary views
  const isItemActive = (itemId: string) => {
    if (currentTab === itemId) return true;
    if (itemId === 'inicio' && currentTab === 'comunidade') return true;
    if (itemId === 'treino' && currentTab === 'evolucao') return true;
    if (itemId === 'perfil' && currentTab === 'profissionais') return true;
    return false;
  };

  const isProfileActive = isItemActive('perfil');

  const getInitials = (name?: string) => {
    if (!name) return 'S';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Os 4 primeiros itens principais (Início, Treino, Dieta, Pass)
  const mainTabs = MAIN_NAV_ITEMS.filter((item) => item.id !== 'perfil');

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#101419]/95 backdrop-blur-xl border-r border-[#262a30]/40 z-50 fixed top-0 bottom-0 left-0">
        <div className="h-16 px-5 flex items-center border-b border-[#262a30]/40">
          <button
            onClick={() => onNavigate('inicio')}
            className="flex items-center focus:outline-none hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Ir para a tela inicial da SOMMA+"
          >
            <SommaLogo variant="full" className="h-8 w-auto" />
          </button>
        </div>

        {/* 5 Primary Navigation Items on Desktop */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1.5" aria-label="Navegação principal">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={item.ariaLabel}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#0066ff] text-white font-bold shadow-lg shadow-[#0066ff]/25 scale-[1.02]'
                    : 'text-[#c2c6d8] hover:text-white hover:bg-[#1c2025]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8c90a1]'}`} />
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Athlete Profile & Status Footer on Desktop */}
        <div className="p-4 border-t border-[#262a30]/40 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onNavigate('perfil')}
            className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
              isProfileActive
                ? 'bg-white/10 border-[#0066ff] shadow-md shadow-[#0066ff]/20'
                : 'bg-[#181c21] hover:bg-[#1f242b] border-[#262a30]'
            }`}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#1c2025]">
              {avatarUrl && !avatarImgError ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  onError={() => setAvatarImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                  {getInitials(userName)}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate">{userName}</span>
              <span className="text-[11px] text-[#8c90a1] truncate">Ver Perfil</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar: Floating Dark Glass Capsule */}
      <nav 
        className="md:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-3.5 right-3.5 max-w-[430px] mx-auto z-40 pointer-events-auto"
        aria-label="Navegação mobile inferior"
      >
        <div
          className="h-16 px-1.5 rounded-2xl sm:rounded-3xl flex items-center justify-between transition-all"
          style={{
            background: 'linear-gradient(180deg, rgba(38, 42, 50, 0.55), rgba(12, 14, 18, 0.42))',
            backdropFilter: 'blur(26px) saturate(145%)',
            WebkitBackdropFilter: 'blur(26px) saturate(145%)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* 1. Início | 2. Treino | 3. Dieta | 4. Pass */}
          {mainTabs.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={item.ariaLabel}
                className="flex-1 flex flex-col items-center justify-center h-full relative focus:outline-none cursor-pointer transition-all active:scale-95"
              >
                {isActive ? (
                  /* Item Ativo: Pill glass discreta com ícone azul SOMMA+ */
                  <div
                    className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl border border-white/10 shadow-[0_0_12px_rgba(0,102,255,0.2)] transition-all duration-200"
                    style={{ background: 'rgba(80, 95, 120, 0.28)' }}
                  >
                    <Icon className="w-4 h-4 stroke-[2.4] text-[#0066ff]" />
                    <span className="text-[10px] tracking-tight font-bold text-white leading-none mt-1 truncate max-w-[56px] text-center">
                      {item.shortLabel}
                    </span>
                  </div>
                ) : (
                  /* Demais Itens: Cinza/branco suave */
                  <div className="flex flex-col items-center justify-center py-1.5 px-2 text-[#8c90a1] hover:text-white transition-colors">
                    <Icon className="w-4 h-4 transition-colors text-[#8c90a1] hover:text-white" />
                    <span className="text-[10px] tracking-tight font-medium leading-none mt-1 text-[#8c90a1] hover:text-[#c2c6d8] transition-colors truncate max-w-[56px] text-center">
                      {item.shortLabel}
                    </span>
                  </div>
                )}
              </button>
            );
          })}

          {/* 5. Avatar do Usuário (acesso ao Perfil) */}
          <button
            type="button"
            onClick={() => onNavigate('perfil')}
            aria-label="Perfil do Atleta"
            title="Perfil"
            className="flex-1 flex flex-col items-center justify-center h-full relative focus:outline-none cursor-pointer transition-all active:scale-95 group"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                isProfileActive
                  ? 'ring-2 ring-[#0066ff] shadow-[0_0_14px_rgba(0,102,255,0.45)] scale-105'
                  : 'ring-1 ring-white/15 hover:ring-white/30'
              }`}
            >
              {avatarUrl && !avatarImgError ? (
                <img
                  src={avatarUrl}
                  alt={`Foto de perfil de ${userName}`}
                  onError={() => setAvatarImgError(true)}
                  className="w-full h-full rounded-full object-cover shrink-0 block bg-[#1c2025]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#1c2025] flex items-center justify-center text-[11px] font-bold text-[#c2c6d8]">
                  {getInitials(userName)}
                </div>
              )}
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};
