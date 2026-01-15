'use client';

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

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-md',
        'transition-all duration-200',
        isLoading && 'opacity-50',
        className
      )}
    >
      {/* Previous Button (only show if multiple tracks) */}
      {totalTracks > 1 && (
        <button
          onClick={prev}
          disabled={isLoading}
          className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          aria-label="Previous track"
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
        onClick={toggle}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded cursor-pointer',
          'hover:bg-white/10 active:bg-white/20',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35]',
          'transition-all duration-200',
          isLoading && 'cursor-wait'
        )}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={isPlaying}
        title={error || (isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play')}
      >
        {/* Play/Pause Icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          {isPlaying ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={barColor}
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
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
          onClick={next}
          disabled={isLoading}
          className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          aria-label="Next track"
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
