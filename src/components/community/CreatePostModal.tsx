import React, { useState } from 'react';
import { 
  X, 
  Dumbbell, 
  TrendingUp, 
  Camera, 
  FileText, 
  Sparkles, 
  Check, 
  Clock, 
  Layers, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { CommunityPost, PostType, UserProfile, WorkoutSessionRecord } from '../../types';
import { storageService } from '../../services/storageService';

interface CreatePostModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onPostCreated: (post: CommunityPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  user,
  onClose,
  onPostCreated
}) => {
  const [activeTab, setActiveTab] = useState<PostType>('workout');
  const [caption, setCaption] = useState('');

  // Workout form states
  const [routineName, setRoutineName] = useState('Treino A • Peito e Tríceps');
  const [durationMinutes, setDurationMinutes] = useState(55);
  const [totalExercises, setTotalExercises] = useState(8);
  const [totalVolume, setTotalVolume] = useState(7600);
  const [prsCount, setPrsCount] = useState(1);
  const [muscleGroups, setMuscleGroups] = useState('Peitoral & Tríceps');

  // Photo form states
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop');

  // Evolution form states
  const [metricName, setMetricName] = useState('Peso Corporal');
  const [beforeValue, setBeforeValue] = useState('76,0 kg');
  const [currentValue, setCurrentValue] = useState('74,2 kg');
  const [changeText, setChangeText] = useState('-1,8 kg');
  const [period, setPeriod] = useState('4 semanas');
  const [secondaryMetric, setSecondaryMetric] = useState('Percentual de Gordura: 16% → 14%');

  // Load user's recent workouts from storage to easily pick one
  const userWorkouts = user?.id ? storageService.getWorkoutSessions(user.id) : [];

  const handleSelectRecentWorkout = (session: WorkoutSessionRecord) => {
    setRoutineName(session.routineName);
    setDurationMinutes(session.durationMinutes);
    setTotalExercises(session.totalExercises);
    setTotalVolume(session.totalVolume);
    setPrsCount(session.prsCount || 0);
    if (session.muscleGroups) setMuscleGroups(session.muscleGroups);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && activeTab === 'text') return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userId: user?.id || 'user_lucas_default',
      type: activeTab,
      authorName: user?.name || 'Lucas Andrade',
      authorHandle: `@${(user?.username || 'lucas').toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: user?.avatar || 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
      authorVerified: true,
      authorBadge: 'Atleta',
      createdAt: new Date().toISOString(),
      timeAgo: 'agora',
      caption: caption.trim(),
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      workoutData: activeTab === 'workout' ? {
        routineName,
        muscleGroups,
        durationMinutes,
        durationFormatted: `${durationMinutes} min`,
        totalVolume,
        totalCompletedSets: totalExercises * 3,
        totalExercises,
        prsCount: prsCount > 0 ? prsCount : undefined,
        exercisesPreview: [
          { name: 'Supino Reto com Barra', detail: '4 séries pesadas', isPr: prsCount > 0 },
          { name: 'Supino Inclinado Halteres', detail: '3 séries de 8-10 reps' },
          { name: 'Desenvolvimento c/ Halteres', detail: '3 séries moderadas' }
        ]
      } : undefined,
      evolutionData: activeTab === 'evolution' ? {
        metricName,
        beforeValue,
        currentValue,
        changeText,
        period,
        secondaryMetric
      } : undefined,
      imageUrl: (activeTab === 'photo' || (activeTab === 'workout' && imageUrl)) ? imageUrl : undefined
    };

    storageService.saveCommunityPost(newPost);
    onPostCreated(newPost);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#101419] border border-[#262a30] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#262a30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Criar Publicação</h3>
              <p className="text-[11px] text-[#8c90a1]">Compartilhe com a comunidade SOMMA</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal de criação"
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 p-2 bg-[#181c21] border-b border-[#262a30] gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'workout'
                ? 'bg-[#0066ff] text-white shadow-sm'
                : 'text-[#8c90a1] hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Treino</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evolution')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'evolution'
                ? 'bg-[#4edea3] text-black shadow-sm font-extrabold'
                : 'text-[#8c90a1] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Evolução</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-[#b3c5ff] text-[#001b3d] shadow-sm font-extrabold'
                : 'text-[#8c90a1] hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#262a30] text-white shadow-sm'
                : 'text-[#8c90a1] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Texto</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Legenda principal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#c2c6d8] uppercase tracking-wider block">
              Legenda
            </label>
            <textarea
              rows={3}
              placeholder={
                activeTab === 'workout' 
                  ? 'Como foi a intensidade do treino de hoje? Bateu meta de carga?' 
                  : activeTab === 'evolution'
                  ? 'Compartilhe os resultados da sua dedicação com a dieta e treino...'
                  : activeTab === 'photo'
                  ? 'Descreva a foto ou sua evolução...'
                  : 'Escreva uma mensagem, dica ou pergunta para a comunidade...'
              }
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#181c21] border border-[#262a30] text-xs text-white placeholder:text-[#8c90a1] outline-none focus:border-[#0066ff] transition-colors resize-none"
            />
          </div>

          {/* 1. SELEÇÃO / CONFIGURAÇÃO DE TREINO */}
          {activeTab === 'workout' && (
            <div className="space-y-3 bg-[#181c21] p-3.5 rounded-xl border border-[#262a30]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-[#0066ff]" /> Dados do Treino
                </span>
                {userWorkouts.length > 0 && (
                  <span className="text-[10px] text-[#8c90a1]">
                    {userWorkouts.length} treino(s) salvo(s)
                  </span>
                )}
              </div>

              {/* Se houver treinos finalizados do usuário, mostrar atalho para selecionar */}
              {userWorkouts.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8c90a1]">Selecionar de treinos finalizados:</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {userWorkouts.slice(0, 3).map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => handleSelectRecentWorkout(w)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#101419] hover:bg-[#262a30] border border-[#262a30] text-[11px] text-white shrink-0 text-left cursor-pointer transition-colors"
                      >
                        <div className="font-bold truncate max-w-[130px]">{w.routineName}</div>
                        <div className="text-[10px] text-[#4edea3]">{w.durationFormatted} • {w.totalExercises} ex</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Nome do Treino</label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Grupamentos</label>
                  <input
                    type="text"
                    value={muscleGroups}
                    onChange={(e) => setMuscleGroups(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Total de Exercícios</label>
                  <input
                    type="number"
                    value={totalExercises}
                    onChange={(e) => setTotalExercises(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Volume Total (kg)</label>
                  <input
                    type="number"
                    value={totalVolume}
                    onChange={(e) => setTotalVolume(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Recordes Pessoais (PRs)</label>
                  <input
                    type="number"
                    value={prsCount}
                    onChange={(e) => setPrsCount(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. CONFIGURAÇÃO DE EVOLUÇÃO */}
          {activeTab === 'evolution' && (
            <div className="space-y-3 bg-[#181c21] p-3.5 rounded-xl border border-[#262a30]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#4edea3]" /> Métricas de Progresso
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Métrica Principal</label>
                  <input
                    type="text"
                    value={metricName}
                    onChange={(e) => setMetricName(e.target.value)}
                    placeholder="Ex: Peso Corporal"
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Período / Tempo</label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Ex: 4 semanas"
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Valor Anterior</label>
                  <input
                    type="text"
                    value={beforeValue}
                    onChange={(e) => setBeforeValue(e.target.value)}
                    placeholder="Ex: 75,2 kg"
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Valor Atual</label>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="Ex: 73,8 kg"
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Variação Total</label>
                  <input
                    type="text"
                    value={changeText}
                    onChange={(e) => setChangeText(e.target.value)}
                    placeholder="Ex: -1,4 kg"
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8c90a1] block mb-1">Métrica Secundária</label>
                  <input
                    type="text"
                    value={secondaryMetric}
                    onChange={(e) => setSecondaryMetric(e.target.value)}
                    placeholder="Ex: Gordura 16% → 14%"
                    className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. CONFIGURAÇÃO DE FOTO */}
          {activeTab === 'photo' && (
            <div className="space-y-3 bg-[#181c21] p-3.5 rounded-xl border border-[#262a30]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#b3c5ff]" /> Foto da Publicação
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL da Imagem..."
                  className="w-full h-9 px-3 rounded-lg bg-[#101419] border border-[#262a30] text-xs text-white outline-none focus:border-[#0066ff]"
                />

                {imageUrl && (
                  <div className="w-full h-44 rounded-lg overflow-hidden border border-[#262a30] bg-black">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

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
              className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-xs font-bold text-white shadow-md shadow-[#0066ff]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publicar no Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
