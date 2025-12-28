import React, { useState, useRef } from 'react';

/**
 * SpotifyTrackCard Component
 * Displays a Spotify track with all details and 30-second preview
 * 
 * Props:
 *   - track: Spotify track object from API
 *   - showPreview: Show/hide audio preview (default: true)
 */
export default function SpotifyTrackCard({ track, showPreview = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (!track.preview_url) {
      setError('Preview not available for this track');
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio playback error:', err);
          setError('Failed to play preview');
        });
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const artistNames = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
  const albumName = track.album?.name || 'Unknown Album';
  const albumArt = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '';
  const duration = Math.floor((track.duration_ms || 0) / 1000);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Album Art */}
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
        {albumArt ? (
          <img
            src={albumArt}
            alt={`${track.name} album art`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
        )}

        {/* Play Button Overlay */}
        {showPreview && track.preview_url && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center group"
          >
            <div className="bg-green-500 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Track Details */}
      <div className="p-4">
        {/* Track Name */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate mb-1">
          {track.name}
        </h3>

        {/* Artist */}
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
          {artistNames}
        </p>

        {/* Album */}
        <p className="text-xs text-gray-500 dark:text-gray-500 truncate mb-3">
          {albumName}
        </p>

        {/* Duration and Preview Status */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>{formatDuration(duration)}</span>
          {showPreview && (
            <span className={track.preview_url ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
              {track.preview_url ? '🎵 Preview' : 'No preview'}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-500 mb-2">{error}</p>
        )}

        {/* Open in Spotify Button */}
        {track.external_urls?.spotify && (
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-lg font-medium transition-colors duration-300"
          >
            Open in Spotify
          </a>
        )}

        {/* Hidden Audio Element */}
        {showPreview && track.preview_url && (
          <audio
            ref={audioRef}
            src={track.preview_url}
            onEnded={handleAudioEnd}
            onError={() => setError('Failed to load preview')}
          />
        )}
      </div>
    </div>
  );
}
