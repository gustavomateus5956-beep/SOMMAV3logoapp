import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Clock, 
  Trophy, 
  Dumbbell, 
  Layers, 
  Send,
  Zap
} from 'lucide-react';
import { RoutineFlash } from '../types';
import { SommaLogo } from './SommaLogo';
import { storageService } from '../services/storageService';

interface RoutineViewerModalProps {
  routines: RoutineFlash[];
  initialIndex?: number;
  onClose: () => void;
}

export const RoutineViewerModal: React.FC<RoutineViewerModalProps> = ({
  routines,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [cheered, setCheered] = useState(false);
  const [comment, setComment] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [sentFeedback, setSentFeedback] = useState(false);

  const currentRoutine = routines[currentIndex] || routines[0];

  useEffect(() => {
    setProgress(0);
    setCheered(false);
    if (currentRoutine?.id) {
      storageService.markStoryViewed(currentRoutine.id);
    }
  }, [currentIndex, currentRoutine]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, routines.length]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < routines.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            clearInterval(interval);
            onClose();
            return 100;
          }
        }
        return prev + 1.8; // ~5.5s per routine
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, routines.length, onClose]);

  const handleNext = () => {
    if (currentIndex < routines.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSendFeedback = () => {
    if (!comment.trim()) return;
    setSentFeedback(true);
    setComment('');
    setTimeout(() => setSentFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
      {/* Container with mobile phone ratio */}
      <div className="relative w-full max-w-[430px] h-full sm:h-[88vh] max-h-[820px] bg-[#0c1015] rounded-none sm:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10">
        
        {/* Background Workout Media */}
        <div 
          className="absolute inset-0 z-0 bg-black"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={currentRoutine.imageUrl}
            alt={currentRoutine.caption}
            className="w-full h-full object-cover select-none"
          />
          {/* Vignette / darkening gradients for clear telemetry readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />
        </div>

        {/* Top Progress Segmented Bars */}
        <div className="relative z-20 pt-3 px-3.5 flex items-center gap-1.5">
          {routines.map((r, idx) => (
            <div key={r.id} className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0066ff] to-[#4edea3] transition-all duration-100 ease-linear rounded-full"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Author Header & 24h Expiration Timer Badge */}
        <div className="relative z-20 px-4 pt-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={currentRoutine.authorAvatar}
                alt={currentRoutine.authorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0066ff]"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0066ff] flex items-center justify-center text-[9px] font-bold text-white border border-[#101419]">
                ⚡
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{currentRoutine.authorName}</span>
                <span className="text-[10px] font-bold text-[#8c90a1]">• {currentRoutine.timeAgo}</span>
              </div>
              
              {/* 24h Expiration countdown badge */}
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#4edea3]">
                <Clock className="w-3 h-3" />
                <span>Expira em {currentRoutine.expiresInHours}h (Ciclo 24h)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#b3c5ff]">
              <SommaLogo variant="icon" className="h-3.5 w-auto" />
              <span>ROTINA</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tap areas for prev / next */}
        <div className="absolute inset-y-16 inset-x-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Desktop Side Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center disabled:opacity-20 transition-all z-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center transition-all z-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Routine Telemetry & Athletic HUD */}
        <div className="relative z-20 p-4 flex flex-col gap-3">
          
          {/* Athlete Routine HUD Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentRoutine.workoutHighlight && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0066ff]/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{currentRoutine.workoutHighlight}</span>
              </div>
            )}

            {currentRoutine.statBadge && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[#ffb59d] text-xs font-bold border border-[#ffb59d]/30">
                <Trophy className="w-3 h-3 text-[#ffb59d]" />
                <span>{currentRoutine.statBadge}</span>
              </div>
            )}

            {currentRoutine.todayVolume && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[#dae1ff] text-[11px] font-medium border border-white/10">
                <Layers className="w-3 h-3 text-[#0066ff]" />
                <span>{currentRoutine.todayVolume}</span>
              </div>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs sm:text-sm text-white font-medium drop-shadow-md leading-relaxed">
            {currentRoutine.caption}
          </p>

          {/* Toast feedback when message is sent */}
          {sentFeedback && (
            <div className="text-[11px] font-bold text-[#4edea3] bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md self-start border border-[#4edea3]/40">
              ✓ Mensagem enviada para o atleta!
            </div>
          )}

          {/* Interactive Bar: Mensagem de incentivo & Dar Força */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enviar incentivo sobre a rotina..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendFeedback()}
                className="w-full h-10 pl-4 pr-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs text-white placeholder:text-white/60 outline-none focus:border-[#0066ff]"
              />
              <button
                onClick={handleSendFeedback}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCheered(!cheered)}
              className={`h-10 px-3.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border transition-all cursor-pointer ${
                cheered
                  ? 'bg-[#ffb59d] text-black border-[#ffb59d] font-bold scale-105 shadow-lg shadow-[#ffb59d]/30'
                  : 'bg-white/15 text-white border-white/25 hover:bg-white/25 text-xs font-semibold'
              }`}
            >
              <Flame className={`w-4 h-4 ${cheered ? 'fill-black' : ''}`} />
              <span className="text-xs">{cheered ? 'Força enviada!' : 'Dar Força'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
