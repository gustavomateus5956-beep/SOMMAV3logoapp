import React from 'react';
import { Dumbbell, User, Search, ChevronRight } from 'lucide-react';
import { Professional } from '../../types';

interface ProfileTeamSectionProps {
  linkedProfessionals: Professional[];
  onSelectProfessional?: (professional: Professional) => void;
  onNavigateToProfessionals: () => void;
}

export const ProfileTeamSection: React.FC<ProfileTeamSectionProps> = ({
  linkedProfessionals,
  onSelectProfessional,
  onNavigateToProfessionals
}) => {
  return (
    <section className="bg-[#1c2025] rounded-3xl p-5 border border-[#262a30] flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-[#0066ff]" />
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Minha equipe
          </h2>
        </div>
        {linkedProfessionals.length > 0 && (
          <span className="text-[10px] text-[#8c90a1] font-semibold bg-[#262a30] px-2 py-0.5 rounded-full">
            {linkedProfessionals.length} ativo(s)
          </span>
        )}
      </div>

      {linkedProfessionals.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {linkedProfessionals.map((prof) => (
            <div
              key={prof.id}
              className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30]/80 flex items-center justify-between gap-3 hover:border-[#0066ff]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={prof.avatar}
                  alt={`Foto de ${prof.name}`}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-[#0066ff] bg-[#262a30] shrink-0"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{prof.name}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#0066ff]/20 text-[#b3c5ff]">
                      {prof.categoryLabel || prof.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8c90a1] line-clamp-1">{prof.title}</span>
                  {prof.nextCheckInDate && (
                    <span className="text-[10px] text-[#4edea3] mt-0.5">
                      Próximo alinhamento: {prof.nextCheckInDate}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectProfessional) {
                    onSelectProfessional(prof);
                  } else {
                    onNavigateToProfessionals();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Ver perfil
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onNavigateToProfessionals}
            className="text-xs text-[#0066ff] hover:text-[#b3c5ff] font-bold flex items-center justify-center gap-1.5 py-2 transition-colors cursor-pointer"
          >
            <span>Gerenciar especialistas & ver diretório</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Empty state when user has no linked professional */
        <div className="p-5 rounded-2xl bg-[#181c21] border border-[#262a30]/80 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#262a30] flex items-center justify-center text-[#8c90a1]">
            <User className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">
              Você ainda não possui um profissional vinculado.
            </span>
            <span className="text-xs text-[#8c90a1] mt-1 max-w-xs">
              Contrate um treinador ou nutricionista para prescrever seus treinos, ajustar calorias e acompanhar sua evolução.
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateToProfessionals}
            className="h-10 px-5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#0066ff]/20 active:scale-98 mt-1"
          >
            <Search className="w-4 h-4" />
            <span>Encontrar profissionais</span>
          </button>
        </div>
      )}
    </section>
  );
};
