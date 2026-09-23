import React from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Edit3, 
  Target, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';

interface ProfileIdentityCardProps {
  displayName: string;
  displayUsername: string;
  displayRole: string;
  displayEmail: string;
  displayAvatar: string;
  displayAge: number;
  displayWeight: number;
  displayHeight: number;
  displayWorkouts: number;
  displayGoal: string;
  onChangePhotoClick: () => void;
  onEditProfileClick: () => void;
  onNavigateToEvolution?: () => void;
}

export const ProfileIdentityCard: React.FC<ProfileIdentityCardProps> = ({
  displayName,
  displayUsername,
  displayRole,
  displayEmail,
  displayAvatar,
  displayAge,
  displayWeight,
  displayHeight,
  displayWorkouts,
  displayGoal,
  onChangePhotoClick,
  onEditProfileClick,
  onNavigateToEvolution
}) => {
  return (
    <section className="bg-[#1c2025] rounded-3xl p-5 md:p-6 border border-[#262a30] shadow-sm flex flex-col items-center text-center gap-4">
      
      {/* Avatar with Camera Overlay */}
      <div className="relative group">
        <img
          src={displayAvatar}
          alt={`Foto de perfil de ${displayName}`}
          className="w-24 h-24 rounded-full object-cover ring-2 ring-[#0066ff] bg-[#262a30] shadow-xl transition-all group-hover:opacity-90"
        />
        <button
          type="button"
          onClick={onChangePhotoClick}
          title="Alterar foto de perfil"
          aria-label="Alterar foto de perfil"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0066ff] hover:bg-[#0052cc] text-white flex items-center justify-center ring-3 ring-[#101419] shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Change Photo Button */}
      <button
        type="button"
        onClick={onChangePhotoClick}
        className="text-xs text-[#0066ff] hover:text-[#b3c5ff] font-bold flex items-center gap-1.5 transition-colors cursor-pointer -mt-1 px-3 py-1 rounded-full hover:bg-[#0066ff]/10"
      >
        <Camera className="w-3.5 h-3.5" />
        <span>Alterar foto</span>
      </button>

      {/* User Titles & Handle */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <h1 className="text-xl font-extrabold text-white tracking-tight">{displayName}</h1>
          <ShieldCheck className="w-4 h-4 text-[#0066ff]" />
        </div>
        <span className="text-xs font-semibold text-[#0066ff] tracking-wide mt-0.5">
          @{displayUsername}
        </span>
        <span className="text-xs text-[#8c90a1] mt-1">{displayRole}</span>
        <span className="text-[11px] text-[#424656]">{displayEmail}</span>
      </div>

      {/* Action Button: Edit Personal Data */}
      <button
        type="button"
        onClick={onEditProfileClick}
        className="w-full max-w-xs h-10 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold border border-[#31353b] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm"
      >
        <Edit3 className="w-3.5 h-3.5 text-[#0066ff]" />
        <span>Editar dados pessoais</span>
      </button>

      {/* Biometrics & Goal Matrix */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#262a30]/70">
        <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30]/60 flex flex-col items-center">
          <span className="text-[10px] text-[#8c90a1] uppercase font-bold tracking-wider">Idade</span>
          <span className="text-sm font-extrabold text-white mt-0.5">{displayAge} anos</span>
        </div>

        <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30]/60 flex flex-col items-center">
          <span className="text-[10px] text-[#8c90a1] uppercase font-bold tracking-wider">Peso</span>
          <span className="text-sm font-extrabold text-white mt-0.5">{displayWeight} kg</span>
        </div>

        <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30]/60 flex flex-col items-center">
          <span className="text-[10px] text-[#8c90a1] uppercase font-bold tracking-wider">Altura</span>
          <span className="text-sm font-extrabold text-white mt-0.5">{displayHeight} m</span>
        </div>

        <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30]/60 flex flex-col items-center">
          <span className="text-[10px] text-[#8c90a1] uppercase font-bold tracking-wider">Treinos</span>
          <span className="text-sm font-extrabold text-[#4edea3] mt-0.5">{displayWorkouts}</span>
        </div>
      </div>

      {/* Goal highlight */}
      <div className="w-full p-3 rounded-2xl bg-[#181c21]/80 border border-[#262a30]/70 flex items-center justify-between text-left">
        <div className="flex items-center gap-2.5">
          <Target className="w-4 h-4 text-[#0066ff] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8c90a1] uppercase font-bold">Foco Atual</span>
            <span className="text-xs font-bold text-white">{displayGoal}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onEditProfileClick}
          className="text-[11px] text-[#0066ff] hover:text-[#b3c5ff] font-semibold cursor-pointer"
        >
          Ajustar
        </button>
      </div>

      {/* Link to Evolução & Medidas */}
      {onNavigateToEvolution && (
        <button
          type="button"
          onClick={onNavigateToEvolution}
          className="w-full p-3.5 rounded-2xl bg-[#181c21]/90 hover:bg-[#20252c] border border-[#262a30]/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ffb59d]/15 text-[#ffb59d] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white group-hover:text-[#ffb59d] transition-colors">
                Histórico de Evolução & Medidas
              </span>
              <span className="text-[11px] text-[#8c90a1]">
                Gráficos de peso, percentual de gordura e cargas máximas
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8c90a1] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>
      )}
    </section>
  );
};
