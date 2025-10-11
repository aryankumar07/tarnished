'use client';

import { useCallback, useEffect, useState } from 'react';

export function useNativeSoundEffect(soundPath: string) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!soundPath) {
      setError('No sound path provided');
      setIsLoading(false);
      return;
    }

    const audioInstance = new Audio(soundPath);
    audioInstance.preload = 'auto';
    audioInstance.volume = 0.1;

    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e: Event) => {
      const audioError = (e.target as HTMLAudioElement).error;
      setError(`Failed to load audio: ${audioError?.message || 'Unknown error'} (Code: ${audioError?.code || 'N/A'})`);
      setIsLoading(false);
    };

    audioInstance.addEventListener('canplaythrough', handleCanPlay);
    audioInstance.addEventListener('error', handleError);

    setAudio(audioInstance);

    return () => {
      audioInstance.removeEventListener('canplaythrough', handleCanPlay);
      audioInstance.removeEventListener('error', handleError);
      audioInstance.pause();
    };
  }, [soundPath]);

  const play = useCallback(() => {
    if (!audio || isLoading) {
      console.warn(isLoading ? 'Audio is still loading' : 'Audio not initialized');
      return;
    }
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.error('Audio playback failed:', err.message);
      setError('Playback failed: ' + err.message);
    });
  }, [audio, isLoading]);

  return { play, isLoading, error };
}
