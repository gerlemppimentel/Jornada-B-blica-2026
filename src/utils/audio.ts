"use client";

/**
 * Gera um som curto programaticamente usando a Web Audio API
 */
const playTone = (frequency: number, type: OscillatorType, duration: number, volume: number) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
    
    // Fecha o contexto após o som terminar para economizar recursos
    setTimeout(() => audioCtx.close(), duration * 1000 + 100);
  } catch (e) {
    console.error("Erro ao reproduzir áudio:", e);
  }
};

export const playToc = () => {
  // Som agudo e curto para marcação
  playTone(800, "sine", 0.1, 0.1);
};

export const playPo = () => {
  // Som grave e curto para desmarcação
  playTone(150, "sine", 0.15, 0.15);
};