import React from 'react';
import { 
  Users, 
  Compass, 
  Search, 
  ArrowRight, 
  Camera, 
  Plus 
} from 'lucide-react';

interface CommunityFeedControlsProps {
  activeTab: 'seguindo' | 'explorar';
  onTabChange: (tab: 'seguindo' | 'explorar') => void;
  onOpenCreatePhoto: () => void;
  activePartnerAvatars: string[];
}

export const CommunityFeedControls: React.FC<CommunityFeedControlsProps> = ({
  activeTab,
  onTabChange,
  onOpenCreatePhoto,
  activePartnerAvatars
}) => {
  return (
    <>
      {/* Sub-tabs: Seguindo vs Explorar */}
      <div className="w-full bg-[#181c21] p-1 rounded-2xl flex items-center border border-[#262a30] shadow-sm">
        <button
          type="button"
          onClick={() => onTabChange('seguindo')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'seguindo'
              ? 'bg-[#0066ff] text-white shadow-md'
              : 'text-[#8c90a1] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Feed Seguindo</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange('explorar')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'explorar'
              ? 'bg-[#0066ff] text-white shadow-md'
              : 'text-[#8c90a1] hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Barra Explorar & Novos Atletas</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-black">
            NOVO
          </span>
        </button>
      </div>

      {/* Seguindo Quick Shortcuts (When Seguindo Tab is selected) */}
      {activeTab === 'seguindo' && (
        <>
          {/* Invite / Discover teaser banner */}
          <div
            onClick={() => onTabChange('explorar')}
            className="bg-gradient-to-r from-[#1c2025] via-[#20252d] to-[#14181f] p-4 rounded-2xl border border-[#262a30] hover:border-[#0066ff]/50 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Descobrir Novos Atletas</span>
                  <span className="text-[9px] font-extrabold bg-[#0066ff]/20 text-[#b3c5ff] px-1.5 py-0.5 rounded">
                    Explorar
                  </span>
                </div>
                <span className="text-[11px] text-[#8c90a1] truncate">
                  Use a barra explorar para buscar atletas por modalidade, academia e recordes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b3c5ff] group-hover:text-white shrink-0">
              <span className="hidden sm:inline">Explorar Atletas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quick Actions Bar: Postar Foto / Postar Rotina 24h */}
          <div className="bg-gradient-to-r from-[#1c2025] to-[#181c21] rounded-2xl p-3.5 border border-[#262a30] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Compartilhe sua evolução</span>
                <span className="text-[11px] text-[#8c90a1]">Fotos de treino, rotinas de 24h e colagens para o Instagram</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCreatePhoto}
                className="flex-1 sm:flex-initial h-9 px-3.5 bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Foto</span>
              </button>
            </div>
          </div>

          {/* Active buddies strip */}
          <div className="bg-[#1c2025] rounded-2xl p-3.5 border border-[#262a30] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2 overflow-hidden">
                {activePartnerAvatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Foto de atleta ativo parceiro"
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-[#1c2025] object-cover bg-[#262a30]"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-white">14 parceiros ativos hoje</span>
            </div>

            <button
              type="button"
              onClick={() => alert('Link de convite da SOMMA+ copiado!')}
              className="text-xs font-bold text-[#b3c5ff] hover:text-white px-3 py-1.5 rounded-lg bg-[#262a30] border border-[#31353b] transition-colors cursor-pointer"
            >
              Convidar
            </button>
          </div>
        </>
      )}
    </>
  );
};
