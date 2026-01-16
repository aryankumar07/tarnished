'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAudioVisualizerReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  frequencyData: number[];
  currentTrack: number;
  totalTracks: number;
  toggle: () => void;
  next: () => void;
  prev: () => void;
}

export function useAudioVisualizer(
  playlist: string[],
  barCount: number = 4
): UseAudioVisualizerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>(() => Array(barCount).fill(0.3));
  const [currentTrack, setCurrentTrack] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const isInitializedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const currentTrackRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // Frequency bin ranges for each bar (bass to treble)
  const frequencyBands = [
    { start: 2, end: 4 },
    { start: 5, end: 8 },
    { start: 9, end: 16 },
    { start: 17, end: 32 },
  ];

  // Animation loop for frequency data
  const updateFrequencyData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || !isPlayingRef.current) {
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const newData = frequencyBands.slice(0, barCount).map(band => {
      let sum = 0;
      let count = 0;
      for (let i = band.start; i <= band.end && i < dataArrayRef.current!.length; i++) {
        sum += dataArrayRef.current![i];
        count++;
      }
      return count > 0 ? sum / count / 255 : 0;
    });

    setFrequencyData(newData);
    animationRef.current = requestAnimationFrame(updateFrequencyData);
  }, [barCount]);

  // Initialize or get audio element
  const getOrCreateAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.3;
    // Don't set crossOrigin for same-origin requests - iOS Safari can be picky
    audio.src = playlist[currentTrackRef.current];

    // Auto-play next track when current ends
    audio.addEventListener('ended', () => {
      const nextIndex = (currentTrackRef.current + 1) % playlist.length;
      setCurrentTrack(nextIndex);
      currentTrackRef.current = nextIndex;

      audio.src = playlist[nextIndex];
      if (isPlayingRef.current) {
        audio.play().catch(console.error);
      }
    });

    audio.addEventListener('error', (e) => {
      const audioError = (e.target as HTMLAudioElement).error;
      console.error('Audio error:', audioError);
      setError(`Audio error: ${audioError?.message || 'Unknown'}`);
      setIsLoading(false);
    });

    audioRef.current = audio;
    return audio;
  }, [playlist]);

  // Initialize Web Audio API for visualization
  const initializeAudioContext = useCallback((audio: HTMLAudioElement) => {
    if (isInitializedRef.current) return true;

    try {
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      isInitializedRef.current = true;
      return true;
    } catch (err) {
      console.error('AudioContext error:', err);
      // Continue without visualization - audio will still play
      return false;
    }
  }, []);

  // Toggle play/pause - this is the main user interaction handler
  const toggle = useCallback(async () => {
    setError(null);

    if (!playlist.length) {
      setError('No tracks available');
      return;
    }

    const audio = getOrCreateAudio();

    // If currently playing, pause
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setFrequencyData(Array(barCount).fill(0.3));
      return;
    }

    // Starting playback
    setIsLoading(true);

    try {
      // Initialize AudioContext on user gesture (required for iOS)
      if (!isInitializedRef.current) {
        initializeAudioContext(audio);
      }

      // Resume AudioContext if suspended (iOS requirement)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Play the audio
      await audio.play();

      setIsPlaying(true);
      setIsLoading(false);

      // Start visualization if available
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion && analyserRef.current) {
        animationRef.current = requestAnimationFrame(updateFrequencyData);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Playback failed');
    }
  }, [playlist, isPlaying, barCount, getOrCreateAudio, initializeAudioContext, updateFrequencyData]);

  // Skip to next track
  const next = useCallback(async () => {
    const audio = getOrCreateAudio();
    const nextIndex = (currentTrack + 1) % playlist.length;

    setCurrentTrack(nextIndex);
    currentTrackRef.current = nextIndex;
    audio.src = playlist[nextIndex];

    if (isPlayingRef.current) {
      try {
        await audio.play();
      } catch (err) {
        console.error('Next track error:', err);
      }
    }
  }, [currentTrack, playlist, getOrCreateAudio]);

  // Skip to previous track
  const prev = useCallback(async () => {
    const audio = getOrCreateAudio();
    const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;

    setCurrentTrack(prevIndex);
    currentTrackRef.current = prevIndex;
    audio.src = playlist[prevIndex];

    if (isPlayingRef.current) {
      try {
        await audio.play();
      } catch (err) {
        console.error('Previous track error:', err);
      }
    }
  }, [currentTrack, playlist, getOrCreateAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    error,
    frequencyData,
    currentTrack,
    totalTracks: playlist.length,
    toggle,
    next,
    prev,
  };
}
