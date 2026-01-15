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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>(() => Array(barCount).fill(0));
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
    { start: 2, end: 4 },    // Bass
    { start: 5, end: 8 },    // Low-mid
    { start: 9, end: 16 },   // Mid
    { start: 17, end: 32 },  // High/Treble
  ];

  // Initialize audio element once
  useEffect(() => {
    if (!playlist.length) {
      setError('No tracks in playlist');
      setIsLoading(false);
      return;
    }

    const audio = new Audio(playlist[0]);
    audio.preload = 'auto';
    audio.volume = 0.3;
    audio.crossOrigin = 'anonymous';

    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e: Event) => {
      const audioError = (e.target as HTMLAudioElement).error;
      setError(`Failed to load audio: ${audioError?.message || 'Unknown error'}`);
      setIsLoading(false);
    };

    // Auto-play next track when current ends
    const handleEnded = () => {
      const nextIndex = (currentTrackRef.current + 1) % playlist.length;
      setCurrentTrack(nextIndex);

      // Load and play next track
      audio.src = playlist[nextIndex];
      audio.load();

      // Wait for the new track to be ready, then play
      const playNextWhenReady = () => {
        if (isPlayingRef.current) {
          audio.play().catch(console.error);
        }
        audio.removeEventListener('canplaythrough', playNextWhenReady);
      };
      audio.addEventListener('canplaythrough', playNextWhenReady);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [playlist]);

  // Initialize Web Audio API (must be called after user interaction)
  const initializeAudioContext = useCallback(() => {
    if (isInitializedRef.current || !audioRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      isInitializedRef.current = true;
    } catch (err) {
      setError(`Failed to initialize audio context: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Animation loop for frequency data
  const updateFrequencyData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) {
      animationRef.current = requestAnimationFrame(updateFrequencyData);
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Calculate average for each frequency band
    const newData = frequencyBands.slice(0, barCount).map(band => {
      let sum = 0;
      let count = 0;
      for (let i = band.start; i <= band.end && i < dataArrayRef.current!.length; i++) {
        sum += dataArrayRef.current![i];
        count++;
      }
      // Normalize to 0-1 range
      return count > 0 ? sum / count / 255 : 0;
    });

    setFrequencyData(newData);
    animationRef.current = requestAnimationFrame(updateFrequencyData);
  }, [barCount]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    // Check for reduced motion preference
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize audio context on first interaction
    if (!isInitializedRef.current) {
      initializeAudioContext();
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Reset bars when paused
      setFrequencyData(Array(barCount).fill(0.15));
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        // Only animate if not reduced motion
        if (!isReducedMotion) {
          animationRef.current = requestAnimationFrame(updateFrequencyData);
        }
      }).catch(err => {
        setError(`Playback failed: ${err.message}`);
      });
    }
  }, [isPlaying, isLoading, barCount, initializeAudioContext, updateFrequencyData]);

  // Skip to next track
  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextIndex = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextIndex);

    audio.src = playlist[nextIndex];
    audio.load();

    const playWhenReady = () => {
      if (isPlayingRef.current) {
        audio.play().catch(console.error);
      }
      audio.removeEventListener('canplaythrough', playWhenReady);
    };
    audio.addEventListener('canplaythrough', playWhenReady);
  }, [currentTrack, playlist]);

  // Skip to previous track
  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
    setCurrentTrack(prevIndex);

    audio.src = playlist[prevIndex];
    audio.load();

    const playWhenReady = () => {
      if (isPlayingRef.current) {
        audio.play().catch(console.error);
      }
      audio.removeEventListener('canplaythrough', playWhenReady);
    };
    audio.addEventListener('canplaythrough', playWhenReady);
  }, [currentTrack, playlist]);

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
