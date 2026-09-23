import React from 'react';
import { Users } from 'lucide-react';

interface SuggestedAthlete {
  name: string;
  avatar: string;
  specialty: string;
  following: boolean;
}

interface CommunitySuggestedAthletesProps {
  athletes: SuggestedAthlete[];
  onToggleFollow: (index: number) => void;
}

export const CommunitySuggestedAthletes: React.FC<CommunitySuggestedAthletesProps> = ({
  athletes,
  onToggleFollow
}) => {
  return (
    <section className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3 shadow-sm mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0066ff]" />
          <span className="text-xs font-bold text-white">Atletas em Destaque na Sua Região</span>
        </div>
        <span className="text-[11px] text-[#8c90a1]">Mesmas metas que você</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {athletes.map((athlete, idx) => (
          <div
            key={athlete.name}
            className="flex items-center justify-between p-3 rounded-xl bg-[#181c21] border border-[#262a30]/60"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={athlete.avatar}
                alt={`Foto de ${athlete.name}`}
                className="w-9 h-9 rounded-full object-cover bg-[#262a30] shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{athlete.name}</span>
                <span className="text-[11px] text-[#8c90a1] truncate">{athlete.specialty}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFollow(idx)}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                athlete.following
                  ? 'bg-[#262a30] text-[#c2c6d8] hover:text-white'
                  : 'bg-[#0066ff] hover:bg-[#0054d6] text-white'
              }`}
            >
              {athlete.following ? 'Seguindo' : 'Seguir'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
