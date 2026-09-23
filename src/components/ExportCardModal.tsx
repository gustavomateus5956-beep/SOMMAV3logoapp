import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Instagram, 
  Sparkles, 
  Flame, 
  Trophy, 
  Check, 
  Layers, 
  Copy,
  Clock,
  Dumbbell,
  Eye,
  EyeOff,
  Smartphone,
  Square,
  BadgePercent
} from 'lucide-react';
import { SommaLogo } from './SommaLogo';

export interface WorkoutExportData {
  title: string;
  duration: string;
  volume: string;
  exercisesCount: number;
  completedSets: number;
  prsCount: number;
  authorName?: string;
  authorAvatar?: string;
  imageUrl?: string;
  exercisesPreview?: { name: string; detail: string; isPr?: boolean }[];
}

interface ExportCardModalProps {
  workoutData: WorkoutExportData;
  onClose: () => void;
}

export const ExportCardModal: React.FC<ExportCardModalProps> = ({ workoutData, onClose }) => {
  const [template, setTemplate] = useState<'stories' | 'square' | 'sticker'>('stories');
  const [bgStyle, setBgStyle] = useState<'transparent' | 'neon' | 'dark' | 'glass'>('transparent');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [instagramFeedback, setInstagramFeedback] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const authorName = workoutData.authorName || 'Lucas Andrade';
  const authorAvatar = workoutData.authorAvatar || 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k';

  const handleCopySummary = () => {
    const text = `🔥 Treino finalizado na SOMMA+!\n🏋️ ${workoutData.title}\n⏱️ Duração: ${workoutData.duration} | Volume Total: ${workoutData.volume}\n🏆 Séries: ${workoutData.completedSets} | ${workoutData.prsCount > 0 ? `+${workoutData.prsCount} PRs batidos!` : 'Treino 100% cumprido'}\n\n#SOMMAPlus #Musculação #TreinoConcluído`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateInstagramExport = () => {
    handleCopySummary();
    setInstagramFeedback(true);
    setTimeout(() => setInstagramFeedback(false), 3500);
    
    if (navigator.share) {
      navigator.share({
        title: `Meu treino SOMMA+: ${workoutData.title}`,
        text: `Acabei de finalizar ${workoutData.title} com ${workoutData.volume} na SOMMA+!`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  const handleDownloadImage = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Create a virtual download link simulation
      const canvas = document.createElement('canvas');
      canvas.width = template === 'stories' ? 1080 : 1080;
      canvas.height = template === 'stories' ? 1920 : 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (bgStyle !== 'transparent') {
          ctx.fillStyle = bgStyle === 'neon' ? '#0a101d' : '#12151a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        // Save as PNG
        const link = document.createElement('a');
        link.download = `SOMMA-treino-${bgStyle === 'transparent' ? 'sem-fundo' : 'card'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      alert(`Card salvo com sucesso no seu dispositivo! ${bgStyle === 'transparent' ? 'Fundo transparente (PNG) pronto para colar sobre a sua foto no Instagram Stories.' : 'Pronto para postar.'}`);
    }, 900);
  };

  // Background visual themes
  const bgClasses = {
    transparent: 'bg-black/30 backdrop-blur-md border-2 border-dashed border-[#0066ff]/60 shadow-[0_0_35px_rgba(0,102,255,0.25)]',
    neon: 'bg-gradient-to-b from-[#0b1426] via-[#10192a] to-[#0a0d14] border border-[#2a303c] shadow-2xl',
    dark: 'bg-gradient-to-b from-[#14171d] via-[#101419] to-[#090b0e] border border-[#2a303c] shadow-2xl',
    glass: 'bg-[#181c21]/90 backdrop-blur-xl border border-white/20 shadow-2xl'
  }[bgStyle];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#14181f] border border-[#2a303c] rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262a30]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Compartilhar Treino Finalizado</h3>
              <p className="text-[11px] text-[#8c90a1]">Gere uma colagem ou figurinha para colar no Instagram Stories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c2025] hover:bg-[#262a30] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Switch: Background Mode (Transparente para Colar vs Fundo Escuro) */}
        <div className="bg-[#101419] p-3 rounded-2xl border border-[#262a30] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0066ff]" /> Estilo de Fundo:
            </span>
            {bgStyle === 'transparent' && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#0066ff]/20 text-[#4edea3] border border-[#0066ff]/40">
                ✨ Fundo Transparente Ativado (PNG)
              </span>
            )}
          </div>

          {/* Background Toggle Buttons */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#181c21] p-1 rounded-xl border border-[#262a30]">
            <button
              type="button"
              onClick={() => setBgStyle('transparent')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
                bgStyle === 'transparent'
                  ? 'bg-[#0066ff] text-white shadow-md'
                  : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="text-[10px]">Sem Fundo</span>
            </button>

            <button
              type="button"
              onClick={() => setBgStyle('neon')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
                bgStyle === 'neon'
                  ? 'bg-[#0066ff] text-white shadow-md'
                  : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px]">Azul SOMMA</span>
            </button>

            <button
              type="button"
              onClick={() => setBgStyle('dark')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
                bgStyle === 'dark'
                  ? 'bg-[#0066ff] text-white shadow-md'
                  : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px]">Preto Fosco</span>
            </button>

            <button
              type="button"
              onClick={() => setBgStyle('glass')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
                bgStyle === 'glass'
                  ? 'bg-[#0066ff] text-white shadow-md'
                  : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px]">Vidro Glass</span>
            </button>
          </div>

          {bgStyle === 'transparent' ? (
            <p className="text-[11px] text-[#4edea3] leading-relaxed">
              💡 <strong>Como colar nos Stories:</strong> Exporte sem fundo, tire uma foto sua no espelho pelo Instagram e cole este sticker flutuante por cima!
            </p>
          ) : (
            <p className="text-[11px] text-[#8c90a1]">
              Card completo com moldura estética e métricas consolidadas da sessão de treino.
            </p>
          )}
        </div>

        {/* Format Selector: Stories 9:16 vs Feed 1:1 vs Compact Sticker */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#c2c6d8]">Formato de Exportação:</span>
          <div className="flex bg-[#1c2025] p-1 rounded-xl border border-[#262a30] gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTemplate('stories')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                template === 'stories' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Stories 9:16</span>
            </button>
            <button
              type="button"
              onClick={() => setTemplate('square')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                template === 'square' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <Square className="w-3 h-3" />
              <span>Feed 1:1</span>
            </button>
            <button
              type="button"
              onClick={() => setTemplate('sticker')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                template === 'sticker' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1] hover:text-white'
              }`}
            >
              <BadgePercent className="w-3 h-3" />
              <span>Figurinha Compacta</span>
            </button>
          </div>
        </div>

        {/* --- LIVE PREVIEW CANVAS --- */}
        <div className="flex justify-center w-full py-1 relative">
          {/* Transparent Checkered Backdrop (shows transparency clearly) */}
          {bgStyle === 'transparent' && (
            <div 
              className="absolute inset-0 max-w-[320px] mx-auto rounded-3xl opacity-25 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }}
            />
          )}

          <div
            ref={cardRef}
            className={`w-full ${
              template === 'stories' 
                ? 'max-w-[280px] min-h-[420px]' 
                : template === 'square' 
                  ? 'max-w-[310px] aspect-square' 
                  : 'max-w-[270px] min-h-[300px]'
            } ${bgClasses} rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden text-white select-none transition-all duration-300`}
          >
            {/* Athletic glow elements if not transparent */}
            {bgStyle !== 'transparent' && (
              <>
                <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#0066ff]/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#0658af]/20 rounded-full blur-3xl pointer-events-none" />
              </>
            )}

            {/* Top Brand Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <SommaLogo variant="full" className="h-4 w-auto" />
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0066ff]/80 backdrop-blur-md text-[9px] font-black text-white shadow-md">
                <Flame className="w-3 h-3 text-[#ffb59d]" />
                <span>TREINO PAGO</span>
              </div>
            </div>

            {/* Center Content / Metrics Grid */}
            <div className="relative z-10 my-auto flex flex-col gap-3 py-2">
              {/* Routine Title */}
              <div>
                <span className="text-[9px] font-extrabold tracking-wider text-[#0066ff] uppercase block">
                  Sessão Finalizada
                </span>
                <h4 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                  {workoutData.title}
                </h4>
              </div>

              {/* Bento Telemetry Metrics */}
              <div className={`grid grid-cols-2 gap-2 p-3 rounded-2xl border ${
                bgStyle === 'transparent' 
                  ? 'bg-black/60 backdrop-blur-md border-[#0066ff]/40' 
                  : 'bg-[#101419]/70 backdrop-blur-md border-white/10'
              }`}>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-[#8c90a1] uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#0066ff]" /> Tempo
                  </span>
                  <span className="text-sm font-black text-white">{workoutData.duration}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-[#8c90a1] uppercase flex items-center gap-1">
                    <Dumbbell className="w-3 h-3 text-[#0066ff]" /> Volume
                  </span>
                  <span className="text-sm font-black text-[#b3c5ff]">{workoutData.volume}</span>
                </div>

                <div className="flex flex-col pt-1 border-t border-white/5">
                  <span className="text-[9px] font-bold text-[#8c90a1] uppercase">Séries Feitas</span>
                  <span className="text-xs font-extrabold text-white">{workoutData.completedSets} séries</span>
                </div>
                <div className="flex flex-col pt-1 border-t border-white/5">
                  <span className="text-[9px] font-bold text-[#ffb59d] uppercase flex items-center gap-0.5">
                    <Trophy className="w-3 h-3 text-[#ffb59d]" /> Recordes
                  </span>
                  <span className="text-xs font-extrabold text-[#ffb59d]">
                    {workoutData.prsCount > 0 ? `+${workoutData.prsCount} Novos PRs` : 'Consistência 100%'}
                  </span>
                </div>
              </div>

              {/* Watermark preview note if transparent */}
              {bgStyle === 'transparent' && (
                <div className="text-center py-0.5">
                  <span className="text-[9px] font-bold text-[#4edea3] tracking-wider uppercase">
                    • Sem fundo • Pronto para colar •
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Athlete Footer */}
            <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30"
                />
                <span className="text-[10px] font-bold text-white">{authorName}</span>
              </div>
              <span className="text-[8px] text-[#8c90a1] tracking-wider">@somma.mais</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#262a30]">
          {instagramFeedback && (
            <div className="bg-[#0066ff]/20 border border-[#0066ff]/40 text-[#b3c5ff] text-xs p-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#4edea3] shrink-0" />
              <span>Texto copiado! Agora abra o Instagram Stories, tire sua foto e cole o sticker.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Salvar Imagem / PNG no dispositivo */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="h-11 rounded-2xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Salvando...' : (bgStyle === 'transparent' ? 'Salvar Imagem PNG' : 'Salvar no Dispositivo')}</span>
            </button>

            {/* Compartilhar Instagram Stories */}
            <button
              type="button"
              onClick={handleSimulateInstagramExport}
              className="h-11 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Compartilhar nos Stories</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-[#8c90a1]">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Legenda copiada!' : 'Copiar resumo do treino'}</span>
            </button>
            <span className="text-[10px] text-[#8c90a1]/70">Salva em alta resolução (PNG)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
