'use client';

import { useCallback } from 'react';
import { cn } from '../lib/utils';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

interface AudioVisualizerProps {
  playlist: string[];
  className?: string;
  barCount?: number;
}

export default function AudioVisualizer({
  playlist,
  className,
  barCount = 4,
}: AudioVisualizerProps) {
  const {
    isPlaying,
    isLoading,
    error,
    frequencyData,
    currentTrack,
    totalTracks,
    toggle,
    next,
    prev,
  } = useAudioVisualizer(playlist, barCount);

  // Default bar heights when not playing
  const idleHeights = [0.4, 0.7, 0.5, 0.3];

  // Vibrant orange color
  const barColor = '#ff6b35';

  // Handle button click with proper event handling for iOS
  const handleToggle = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  }, [toggle]);

  const handlePrev = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    prev();
  }, [prev]);

  const handleNext = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    next();
  }, [next]);

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-1 py-1 rounded-md',
        'transition-all duration-200',
        className
      )}
    >
      {/* Previous Button (only show if multiple tracks) */}
      {totalTracks > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          onTouchEnd={handlePrev}
          disabled={isLoading}
          className="p-2 hover:bg-white/10 active:bg-white/20 rounded transition-colors cursor-pointer touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Previous track"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={barColor}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 20L9 12l10-8v16z" />
            <rect x="5" y="4" width="2" height="16" />
          </svg>
        </button>
      )}

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={handleToggle}
        onTouchEnd={handleToggle}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded cursor-pointer touch-manipulation',
          'hover:bg-white/10 active:bg-white/20',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35]',
          'transition-all duration-200',
          'min-h-[40px]',
          isLoading && 'cursor-wait opacity-70'
        )}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={isPlaying}
        title={error || (isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play')}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Play/Pause Icon */}
        <div className="w-5 h-5 flex items-center justify-center">
          {isLoading ? (
            // Loading spinner
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin"
            >
              <circle cx="12" cy="12" r="10" stroke={barColor} strokeWidth="3" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke={barColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : isPlaying ? (
            // Pause icon
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={barColor}
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            // Play icon
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={barColor}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
            </svg>
          )}
        </div>

        {/* Visualizer Bars */}
        <div className="flex items-end gap-[3px] h-5">
          {frequencyData.map((value, index) => {
            const height = isPlaying ? Math.max(0.2, value) : idleHeights[index] || 0.4;

            return (
              <div
                key={index}
                className={cn(
                  'w-[4px] rounded-full transition-all',
                  isPlaying ? 'duration-75' : 'duration-500'
                )}
                style={{
                  height: `${height * 20}px`,
                  backgroundColor: barColor,
                  opacity: isPlaying ? 1 : 0.6,
                }}
              />
            );
          })}
        </div>
      </button>

      {/* Next Button (only show if multiple tracks) */}
      {totalTracks > 1 && (
        <button
          type="button"
          onClick={handleNext}
          onTouchEnd={handleNext}
          disabled={isLoading}
          className="p-2 hover:bg-white/10 active:bg-white/20 rounded transition-colors cursor-pointer touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Next track"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={barColor}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 4l10 8-10 8V4z" />
            <rect x="17" y="4" width="2" height="16" />
          </svg>
        </button>
      )}

      {/* Track indicator (only show if multiple tracks) */}
      {totalTracks > 1 && (
        <span
          className="text-xs ml-1 opacity-50"
          style={{ color: barColor }}
        >
          {currentTrack + 1}/{totalTracks}
        </span>
      )}
    </div>
  );
}
