/**
 * workoutSound.ts
 * 
 * Abstração de áudio para alertas do treino (SOMMA+).
 * Toca um alerta curto, limpo e discreto ("plin") ao término natural do descanso.
 */

// Preferência de áudio do usuário (preparada para futuro toggle nas configurações)
let soundEnabled = true;

export function isWorkoutSoundEnabled(): boolean {
  return soundEnabled;
}

export function setWorkoutSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Toca o som discreto de finalização do descanso ("plin").
 * Tenta síntese cristalina via Web Audio API; se indisponível, faz fallback para o arquivo local.
 * Falhas são capturadas silenciosamente para nunca interromper o fluxo do treino.
 */
export function playRestFinishedSound(): void {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx) {
      const now = ctx.currentTime;

      // Tom fundamental (C6 - 1046.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(0.24, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.65);

      // Harmônico brilhante suave (C7 - 2093 Hz) para o efeito "plin" cristalino
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2093, now);
      gain2.gain.setValueAtTime(0.10, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.4);
      return;
    }
  } catch {
    // Fallback silencioso
  }

  // Fallback via elemento Audio local
  try {
    const audio = new Audio('/sounds/rest-complete.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignorar bloqueio de autoplay se ainda não houve interação
    });
  } catch {
    // Ignorar silenciosamente
  }
}
