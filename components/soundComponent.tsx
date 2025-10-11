'use client';
import { useNativeSoundEffect } from '../hooks/useNativeSoundEffect';
import { useEffect } from 'react';
interface SoundComponentProps {
  href: string;
  render: (handlePlay: () => void, isLoading: boolean, error: string | null) => React.ReactNode;
}
const SoundComponent = ({ href, render }: SoundComponentProps) => {
  const { play, isLoading, error } = useNativeSoundEffect(href);
  useEffect(() => {
    if (error) {
      console.error('Sound error:', error);
    }
  }, [error]);
  const handlePlay = () => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || isLoading || error) {
      console.warn(
        'Sound playback skipped:',
        isReducedMotion ? 'Reduced motion enabled' : isLoading ? 'Sound is loading' : 'Sound error'
      );
      return;
    }
    play();
  };
  if (typeof render !== 'function') {
    console.error('SoundComponent: render prop must be a function, received:', render);
    return <div>Error: Invalid render prop</div>;
  }
  return <>{render(handlePlay, isLoading, error)}</>;
};

export default SoundComponent;
