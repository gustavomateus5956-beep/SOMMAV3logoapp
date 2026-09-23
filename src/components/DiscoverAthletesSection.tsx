import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  UserPlus, 
  UserCheck, 
  Flame, 
  Trophy, 
  MapPin, 
  Sparkles, 
  X, 
  Dumbbell, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { DiscoverAthlete } from '../types';

interface DiscoverAthletesSectionProps {
  athletes: DiscoverAthlete[];
  onToggleFollow: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const CATEGORIES = [
  'Todos',
  'Hipertrofia',
  'Powerlifting',
  'Cross Training',
  'Calistenia',
  'Endurance',
  'Treinador'
] as const;

export const DiscoverAthletesSection: React.FC<DiscoverAthletesSectionProps> = ({
  athletes,
  onToggleFollow,
  searchQuery: externalSearch,
  onSearchChange: externalOnSearch
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [onlyActiveToday, setOnlyActiveToday] = useState(false);
  const [selectedAthleteForProfile, setSelectedAthleteForProfile] = useState<DiscoverAthlete | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const search = externalSearch !== undefined ? externalSearch : internalSearch;
  const setSearch = (val: string) => {
    if (externalOnSearch) externalOnSearch(val);
    setInternalSearch(val);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      // Category match
      if (selectedCategory !== 'Todos' && athlete.category !== selectedCategory) {
        return false;
      }
      // Active today filter
      if (onlyActiveToday && !athlete.isActiveToday) {
        return false;
      }
      // Search query filter (name, handle, gymLocation, specialty, topPR)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = athlete.name.toLowerCase().includes(q);
        const matchHandle = athlete.handle.toLowerCase().includes(q);
        const matchSpecialty = athlete.specialty.toLowerCase().includes(q);
        const matchGym = athlete.gymLocation.toLowerCase().includes(q);
        const matchCity = athlete.city.toLowerCase().includes(q);
        const matchPR = athlete.topPR.toLowerCase().includes(q);
        return matchName || matchHandle || matchSpecialty || matchGym || matchCity || matchPR;
      }
      return true;
    });
  }, [athletes, selectedCategory, onlyActiveToday, search]);

  const handleFollowClick = (athlete: DiscoverAthlete, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onToggleFollow(athlete.id);
    if (!athlete.following) {
      showToast(`Você agora está seguindo ${athlete.name.split(' ')[0]}!`);
    } else {
      showToast(`Você deixou de seguir ${athlete.name.split(' ')[0]}.`);
    }
  };

  return (
    <section aria-label="Explorar e Descobrir Novos Usuários" className="flex flex-col gap-4">
      
      {/* 1. BARRA EXPLORAR (Search Input & Header) */}
      <div className="bg-[#1c2025] rounded-2xl p-4 md:p-5 border border-[#262a30] shadow-sm flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Descobrir Novos Atletas
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff]">
                  {filteredAthletes.length} encontrados
                </span>
              </h3>
              <p className="text-xs text-[#8c90a1]">
                Encontre atletas com objetivos parecidos, troque rotinas e compare cargas.
              </p>
            </div>
          </div>

          {/* Quick toggle for Active Today */}
          <button
            type="button"
            onClick={() => setOnlyActiveToday(!onlyActiveToday)}
            className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyActiveToday
                ? 'bg-[#00a572]/20 border border-[#00a572]/40 text-[#4edea3]'
                : 'bg-[#181c21] border border-[#262a30] text-[#8c90a1] hover:text-white'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyActiveToday ? 'text-[#4edea3]' : 'text-[#8c90a1]'}`} />
            <span>Treinaram Hoje</span>
          </button>
        </div>

        {/* The Search Bar Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8c90a1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, modalidade (@handle), academia, cidade ou PR..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#14181f] border border-[#262a30] focus:border-[#0066ff] text-xs sm:text-sm text-white placeholder:text-[#8c90a1] transition-all outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c90a1] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modality / Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0066ff] text-white shadow-sm'
                    : 'bg-[#14181f] hover:bg-[#20252c] text-[#8c90a1] hover:text-[#c2c6d8] border border-[#262a30]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ATHLETES DISCOVERY GRID */}
      {filteredAthletes.length === 0 ? (
        <div className="p-8 text-center bg-[#1c2025] rounded-2xl border border-[#262a30] flex flex-col items-center justify-center gap-2">
          <Users className="w-8 h-8 text-[#8c90a1]" />
          <span className="text-sm font-bold text-white">Nenhum atleta encontrado</span>
          <p className="text-xs text-[#8c90a1] max-w-sm">
            Tente pesquisar com outros termos ou alterne as categorias na barra de filtros acima.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('Todos');
              setOnlyActiveToday(false);
            }}
            className="mt-2 px-4 py-2 bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              onClick={() => setSelectedAthleteForProfile(athlete)}
              className="bg-[#1c2025] hover:bg-[#20252c] p-4 rounded-2xl border border-[#262a30] hover:border-[#0066ff]/40 transition-all flex flex-col justify-between gap-3 shadow-sm group cursor-pointer"
            >
              {/* Top: Avatar, Name, Handle, Badges & Follow Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={athlete.avatar}
                      alt={`Foto de ${athlete.name}`}
                      className="w-12 h-12 rounded-2xl object-cover bg-[#262a30] ring-1 ring-[#262a30] group-hover:ring-[#0066ff]/50 transition-all"
                    />
                    {athlete.isActiveToday && (
                      <span
                        title="Treinou hoje"
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00a572] border-2 border-[#1c2025] flex items-center justify-center text-white"
                      >
                        <Zap className="w-2.5 h-2.5 fill-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-white truncate group-hover:text-[#b3c5ff] transition-colors">
                        {athlete.name}
                      </span>
                      {athlete.verifiedBadge && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#0066ff]/20 text-[#b3c5ff] border border-[#0066ff]/40">
                          {athlete.verifiedBadge}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs text-[#8c90a1]">{athlete.handle}</span>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#c2c6d8]">
                      <span className="font-semibold text-[#0066ff]">{athlete.category}</span>
                      <span>•</span>
                      <span className="truncate">{athlete.specialty}</span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  type="button"
                  onClick={(e) => handleFollowClick(athlete, e)}
                  className={`h-8 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm ${
                    athlete.following
                      ? 'bg-[#262a30] hover:bg-[#31353b] text-[#c2c6d8] hover:text-white border border-[#3a404d]'
                      : 'bg-[#0066ff] hover:bg-[#0054d6] text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {athlete.following ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-[#4edea3]" />
                      <span>Seguindo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>
              </div>

              {/* Middle: Bio & Location */}
              <p className="text-xs text-[#c2c6d8] line-clamp-2 leading-relaxed">
                {athlete.bio}
              </p>

              {/* Bottom Info Chips: Location, PR and Streak */}
              <div className="pt-2 border-t border-[#262a30]/60 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-[#8c90a1] flex-wrap gap-1">
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-[#8c90a1] shrink-0" />
                    <span className="truncate">{athlete.gymLocation}</span>
                  </span>

                  <span className="flex items-center gap-1 font-bold text-[#ffb59d]">
                    <Flame className="w-3 h-3 text-[#cc4204] fill-[#cc4204]" />
                    {athlete.streakDays} dias de ofensiva
                  </span>
                </div>

                {/* Top PR highlight box */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#14181f] border border-[#262a30]/50 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Trophy className="w-3.5 h-3.5 text-[#eab308] shrink-0" />
                    <span className="text-[11px] font-bold text-white truncate">
                      {athlete.topPR}
                    </span>
                  </div>
                  {athlete.matchPercentage && (
                    <span className="text-[10px] font-black text-[#4edea3] bg-[#00a572]/15 px-1.5 py-0.5 rounded shrink-0">
                      {athlete.matchPercentage}% afinidade
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. QUICK PROFILE PREVIEW MODAL */}
      {selectedAthleteForProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c2025] w-full max-w-md rounded-2xl border border-[#262a30] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header / Cover */}
            <div className="relative h-24 bg-gradient-to-r from-[#0066ff]/30 via-[#181c21] to-[#00a572]/20 p-4 flex items-start justify-between">
              <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                Perfil de Atleta SOMMA
              </span>
              <button
                type="button"
                onClick={() => setSelectedAthleteForProfile(null)}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 -mt-10 flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div className="relative">
                  <img
                    src={selectedAthleteForProfile.avatar}
                    alt={selectedAthleteForProfile.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#1c2025] bg-[#262a30]"
                  />
                  {selectedAthleteForProfile.isActiveToday && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#00a572] border-2 border-[#1c2025] flex items-center justify-center text-white">
                      <Zap className="w-3 h-3 fill-white" />
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleFollowClick(selectedAthleteForProfile)}
                  className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    selectedAthleteForProfile.following
                      ? 'bg-[#262a30] hover:bg-[#31353b] text-[#c2c6d8] border border-[#3a404d]'
                      : 'bg-[#0066ff] hover:bg-[#0054d6] text-white'
                  }`}
                >
                  {selectedAthleteForProfile.following ? (
                    <>
                      <UserCheck className="w-4 h-4 text-[#4edea3]" />
                      <span>Seguindo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Seguir Atleta</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">
                    {selectedAthleteForProfile.name}
                  </h3>
                  {selectedAthleteForProfile.verifiedBadge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#0066ff]/20 text-[#b3c5ff] border border-[#0066ff]/40">
                      {selectedAthleteForProfile.verifiedBadge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#8c90a1]">{selectedAthleteForProfile.handle}</span>
                <p className="text-xs text-[#c2c6d8] mt-2 leading-relaxed">
                  {selectedAthleteForProfile.bio}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#14181f] border border-[#262a30]">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Ofensiva</span>
                  <span className="text-sm font-extrabold text-[#ffb59d] flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-[#cc4204] fill-[#cc4204]" />
                    {selectedAthleteForProfile.streakDays}d
                  </span>
                </div>
                <div className="flex flex-col items-center border-x border-[#262a30]">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Seguidores</span>
                  <span className="text-sm font-extrabold text-white mt-0.5">
                    {selectedAthleteForProfile.followersCount + (selectedAthleteForProfile.following ? 1 : 0)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Modalidade</span>
                  <span className="text-xs font-bold text-[#b3c5ff] mt-1 text-center truncate max-w-[90px]">
                    {selectedAthleteForProfile.category}
                  </span>
                </div>
              </div>

              {/* PR & Recent Workout Highlight */}
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-xl bg-[#181c21] border border-[#262a30] flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#eab308] uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Recordes Pessoais Principais
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedAthleteForProfile.topPR}
                  </span>
                </div>

                {selectedAthleteForProfile.recentWorkout && (
                  <div className="p-3 rounded-xl bg-[#181c21] border border-[#262a30] flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Último Treino Registrado
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {selectedAthleteForProfile.recentWorkout}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#8c90a1]">
                <MapPin className="w-3.5 h-3.5 text-[#8c90a1] shrink-0" />
                <span>{selectedAthleteForProfile.gymLocation} • {selectedAthleteForProfile.city}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedAthleteForProfile(null);
                  showToast(`Convite de treino compartilhado enviado para ${selectedAthleteForProfile.name.split(' ')[0]}!`);
                }}
                className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                <span>Convidar para Treinar Juntos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1c2025] text-white px-4 py-2.5 rounded-xl border border-[#0066ff]/40 shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <Check className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
};
