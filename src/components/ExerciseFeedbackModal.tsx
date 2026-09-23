import React, { useState } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  Share2,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Dumbbell,
  Sparkles,
  Flame
} from 'lucide-react';
import { Exercise } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';

interface ExerciseFeedbackModalProps {
  exercise: Exercise;
  routineName?: string;
  currentWeight?: number;
  currentReps?: number;
  onClose: () => void;
  onPostToFeed?: (post: {
    author: string;
    caption: string;
    exerciseName: string;
    weight?: number;
    reps?: number;
    muscleGroup: string;
  }) => void;
  onSendMessageToCoach?: (message: {
    coachName: string;
    exerciseName: string;
    category: string;
    content: string;
    currentLoad?: string;
  }) => void;
}

export const ExerciseFeedbackModal: React.FC<ExerciseFeedbackModalProps> = ({
  exercise,
  routineName = 'Treino Ativo',
  currentWeight,
  currentReps,
  onClose,
  onPostToFeed,
  onSendMessageToCoach
}) => {
  useScrollLock(true);
  const [activeTab, setActiveTab] = useState<'professor' | 'feed'>('professor');

  // Teacher feedback state
  const [category, setCategory] = useState<string>('Dúvida de Execução');
  const [coachNote, setCoachNote] = useState('');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [coachSuccess, setCoachSuccess] = useState(false);

  // Feed post state
  const [feedCaption, setFeedCaption] = useState(
    currentWeight && currentReps
      ? `Fechei ${exercise.name} hoje com ${currentWeight}kg para ${currentReps} reps! Execução alinhada com o professor.`
      : `Treinando firme ${exercise.name}! Foco total na técnica e postura.`
  );
  const [feedSuccess, setFeedSuccess] = useState(false);

  const categories = [
    { id: 'Dúvida de Execução', label: 'Dúvida de Execução', icon: HelpCircle },
    { id: 'Dor ou Desconforto', label: 'Dor / Desconforto', icon: AlertCircle },
    { id: 'Ajuste de Carga', label: 'Ajuste de Carga', icon: TrendingUp },
    { id: 'Substituição', label: 'Substituição', icon: Dumbbell }
  ];

  const handleSendToCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachNote.trim()) return;

    const loadString = includeMetrics && currentWeight
      ? `${currentWeight}kg ${currentReps ? `× ${currentReps} reps` : ''}`
      : undefined;

    if (onSendMessageToCoach) {
      onSendMessageToCoach({
        coachName: 'Dr. Rodrigo (Treinador SOMMA)',
        exerciseName: exercise.name,
        category,
        content: coachNote,
        currentLoad: loadString
      });
    }

    setCoachSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handlePostFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedCaption.trim()) return;

    if (onPostToFeed) {
      onPostToFeed({
        author: 'Lucas Silva',
        caption: feedCaption,
        exerciseName: exercise.name,
        weight: currentWeight,
        reps: currentReps,
        muscleGroup: exercise.muscleGroup
      });
    }

    setFeedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain">
      <div className="w-full max-w-lg bg-[#181c21] border border-[#262a30] rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl overscroll-contain">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#12161b] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c90a1] truncate">
              {routineName} • {exercise.muscleGroup}
            </span>
            <h3 className="text-sm font-bold text-white truncate">{exercise.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Direto pro Professor vs. Postar no Feed */}
        <div className="p-2.5 bg-[#12161b]/80 border-b border-[#262a30] flex gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('professor')}
            className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'professor'
                ? 'bg-[#0066ff] text-white shadow-md shadow-[#0066ff]/20'
                : 'bg-[#1c2025] hover:bg-[#22272e] text-[#8c90a1]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Direto ao Professor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-[#00a572] text-white shadow-md shadow-[#00a572]/20'
                : 'bg-[#1c2025] hover:bg-[#22272e] text-[#8c90a1]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Postar no Feed</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          {activeTab === 'professor' ? (
            coachSuccess ? (
              <div className="py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-[#00a572]/15 border border-[#00a572]/40 flex items-center justify-center text-[#4edea3] mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Mensagem Enviada!</h4>
                <p className="text-xs text-[#8c90a1] mt-1 max-w-xs">
                  Sua dúvida sobre <strong className="text-white">{exercise.name}</strong> foi encaminhada diretamente ao Dr. Rodrigo. Você receberá uma notificação quando ele responder.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendToCoach} className="space-y-3.5">
                {/* Professor Info card */}
                <div className="p-3 rounded-xl bg-[#12161c] border border-[#0066ff]/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0066ff]/15 border border-[#0066ff]/40 flex items-center justify-center text-[#0066ff] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Dr. Rodrigo Martins</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#0066ff]/15 text-[#b3c5ff] border border-[#0066ff]/30">
                        TREINADOR
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8c90a1] truncate">
                      CREF 089412-G/SP • Prescritor do seu plano
                    </p>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] uppercase block mb-1.5">
                    Motivo do Feedback / Dúvida
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSel = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#0066ff]/15 border-[#0066ff] text-white'
                              : 'bg-[#1c2025] border-[#262a30] text-[#8c90a1] hover:text-white'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-[#0066ff]' : 'text-[#8c90a1]'}`} />
                          <span className="truncate">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Context badge toggle */}
                {currentWeight ? (
                  <div
                    onClick={() => setIncludeMetrics(!includeMetrics)}
                    className="p-2.5 rounded-xl bg-[#12161c] border border-[#262a30] flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-[#0066ff]" />
                      <span className="text-xs text-[#c2c6d8]">
                        Anexar carga atual do treino ({currentWeight}kg{currentReps ? ` × ${currentReps}` : ''})
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeMetrics}
                      onChange={() => {}}
                      className="accent-[#0066ff] w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                ) : null}

                {/* Message input */}
                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] uppercase block mb-1.5">
                    Sua Mensagem ou Pergunta
                  </label>
                  <textarea
                    rows={3}
                    value={coachNote}
                    onChange={(e) => setCoachNote(e.target.value)}
                    placeholder="Ex: Senti um pequeno desconforto no ombro na descida. Devo diminuir a carga ou ajustar o banco?"
                    className="w-full p-3 rounded-xl bg-[#12161b] border border-[#262a30] text-xs text-white placeholder:text-[#64748b] focus:border-[#0066ff] outline-none resize-none"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!coachNote.trim()}
                  className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#0066ff]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Dúvida ao Professor</span>
                </button>
              </form>
            )
          ) : (
            feedSuccess ? (
              <div className="py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-[#00a572]/15 border border-[#00a572]/40 flex items-center justify-center text-[#4edea3] mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Publicado no Feed!</h4>
                <p className="text-xs text-[#8c90a1] mt-1 max-w-xs">
                  Sua atualização sobre <strong className="text-white">{exercise.name}</strong> já está visível para a comunidade SOMMA.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostFeed} className="space-y-3.5">
                {/* Exercise Preview Card */}
                <div className="p-3 rounded-xl bg-[#12161c] border border-[#262a30] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#00a572]/15 border border-[#00a572]/30 flex items-center justify-center text-[#4edea3]">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{exercise.name}</h4>
                      <span className="text-[10px] text-[#8c90a1]">{exercise.muscleGroup}</span>
                    </div>
                  </div>
                  {currentWeight ? (
                    <span className="px-2 py-1 rounded bg-[#1c2025] text-[#4edea3] text-xs font-bold border border-[#262a30]">
                      {currentWeight}kg {currentReps ? `× ${currentReps}` : ''}
                    </span>
                  ) : null}
                </div>

                {/* Caption input */}
                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] uppercase block mb-1.5">
                    Legenda da Publicação
                  </label>
                  <textarea
                    rows={4}
                    value={feedCaption}
                    onChange={(e) => setFeedCaption(e.target.value)}
                    placeholder="Compartilhe como foi a execução, sua sensação ou marque seu recorde pessoal..."
                    className="w-full p-3 rounded-xl bg-[#12161b] border border-[#262a30] text-xs text-white placeholder:text-[#64748b] focus:border-[#00a572] outline-none resize-none"
                    required
                  />
                </div>

                {/* Hashtag quick inserts */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['#Progresso', '#PR', '#SOMMATrain', '#FocoNaTécnica'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFeedCaption((prev) => `${prev} ${tag}`)}
                      className="px-2.5 py-1 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#8c90a1] hover:text-white text-[10px] font-semibold transition-colors cursor-pointer border border-[#262a30]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!feedCaption.trim()}
                  className="w-full h-11 rounded-xl bg-[#00a572] hover:bg-[#008f62] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#00a572]/20"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Publicar no Feed do SOMMA</span>
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};
