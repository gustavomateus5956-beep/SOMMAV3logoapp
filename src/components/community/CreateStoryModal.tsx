import React, { useState } from 'react';
import { 
  X, 
  Dumbbell, 
  TrendingUp, 
  Camera, 
  Utensils, 
  Sparkles, 
  Clock, 
  Plus, 
  Flame 
} from 'lucide-react';
import { RoutineStory, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface CreateStoryModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onStoryCreated: (story: RoutineStory) => void;
}

const PRESET_STORY_BACKGROUNDS = [
  {
    name: 'Treino de Força',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Supino & Peitoral',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Inferiores & Agachamento',
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Físico & Espelho',
    url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Refeição & Dieta',
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop'
  }
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  user,
  onClose,
  onStoryCreated
}) => {
  const [type, setType] = useState<'workout' | 'evolution' | 'photo' | 'diet'>('workout');
  const [caption, setCaption] = useState('');
  const [workoutHighlight, setWorkoutHighlight] = useState('Treino de Hoje Concluído');
  const [statBadge, setStatBadge] = useState('+1 PR Batido');
  const [selectedImage, setSelectedImage] = useState(PRESET_STORY_BACKGROUNDS[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newStory: RoutineStory = {
      id: `story-user-${Date.now()}`,
      userId: user?.id || 'user_lucas_default',
      authorName: user?.name || 'Você',
      authorHandle: `@${(user?.username || 'você').toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: user?.avatar || 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
      authorVerified: true,
      isUser: true,
      viewed: false,
      hasUnseen: true,
      type,
      imageUrl: selectedImage,
      caption: caption.trim(),
      createdAt: new Date().toISOString(),
      timeAgo: 'agora',
      expiresInHours: 24,
      workoutHighlight: type === 'workout' ? workoutHighlight : undefined,
      statBadge: statBadge ? statBadge : undefined,
      todayVolume: type === 'workout' ? '8.400 kg' : undefined
    };

    storageService.saveRoutineStory(newStory);
    onStoryCreated(newStory);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#101419] border border-[#262a30] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#262a30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Publicar Rotina Diária</h3>
              <p className="text-[11px] text-[#8c90a1] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#4edea3]" /> Visível por 24 horas para a comunidade
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Routine Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#c2c6d8] uppercase tracking-wider block">
              Tipo de Rotina
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { setType('workout'); setWorkoutHighlight('Treino do Dia'); }}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  type === 'workout'
                    ? 'bg-[#0066ff]/20 border-[#0066ff] text-white font-bold'
                    : 'bg-[#181c21] border-[#262a30] text-[#8c90a1] hover:text-white'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-[#79a9ff]" />
                <span className="text-[10px]">Treino</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('evolution'); setWorkoutHighlight('Check-in Físico'); }}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  type === 'evolution'
                    ? 'bg-[#4edea3]/20 border-[#4edea3] text-white font-bold'
                    : 'bg-[#181c21] border-[#262a30] text-[#8c90a1] hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-[#4edea3]" />
                <span className="text-[10px]">Evolução</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('photo'); setWorkoutHighlight('Momento Fitness'); }}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  type === 'photo'
                    ? 'bg-[#b3c5ff]/20 border-[#b3c5ff] text-white font-bold'
                    : 'bg-[#181c21] border-[#262a30] text-[#8c90a1] hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 text-[#dae1ff]" />
                <span className="text-[10px]">Foto</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('diet'); setWorkoutHighlight('Alimentação Limpa'); }}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  type === 'diet'
                    ? 'bg-[#ffb59d]/20 border-[#ffb59d] text-white font-bold'
                    : 'bg-[#181c21] border-[#262a30] text-[#8c90a1] hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4 text-[#ffb59d]" />
                <span className="text-[10px]">Dieta</span>
              </button>
            </div>
          </div>

          {/* Background Image Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#c2c6d8] uppercase tracking-wider block">
              Imagem de Fundo
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_STORY_BACKGROUNDS.map((bg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(bg.url)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === bg.url
                      ? 'border-[#0066ff] ring-2 ring-[#0066ff]/40 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#c2c6d8] uppercase tracking-wider block">
              Legenda da Rotina
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Treino de peito pago às 06h! Bati meta de carga no supino reto 🔥"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#181c21] border border-[#262a30] text-xs text-white placeholder:text-[#8c90a1] outline-none focus:border-[#0066ff] transition-colors resize-none"
            />
          </div>

          {/* Quick Highlight Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[#8c90a1]">Destaque Principal</label>
              <input
                type="text"
                value={workoutHighlight}
                onChange={(e) => setWorkoutHighlight(e.target.value)}
                placeholder="Ex: Treino A • Peito"
                className="w-full h-9 px-3 rounded-lg bg-[#181c21] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#8c90a1]">Selo de Conquista</label>
              <input
                type="text"
                value={statBadge}
                onChange={(e) => setStatBadge(e.target.value)}
                placeholder="Ex: +1 Novo PR"
                className="w-full h-9 px-3 rounded-lg bg-[#181c21] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-xs font-bold text-[#c2c6d8] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!caption.trim()}
              className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-40 text-xs font-bold text-white shadow-md shadow-[#0066ff]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publicar Rotina</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
