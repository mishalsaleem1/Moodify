/**
 * Example: Integrating Spotify Search into Dashboard
 * 
 * This shows how to add a quick music search widget to any page
 */

import React, { useState } from 'react';
import { searchSpotifyTracks } from '../services/spotify';

export default function MusicSearchWidget() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = React.useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchSpotifyTracks(query, 5);
      setResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreview = (track) => {
    if (!track.preview_url) {
      alert('Preview not available for this track');
      return;
    }

    if (currentlyPlaying === track.id && audioRef.current && !audioRef.current.paused) {
      // Pause if already playing
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        audioRef.current.play();
        setCurrentlyPlaying(track.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        🎵 Quick Music Search
      </h3>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 text-sm"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {results.map(track => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {/* Album Art */}
              <img
                src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                alt={track.name}
                className="w-12 h-12 rounded object-cover"
              />

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {track.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {track.artists?.map(a => a.name).join(', ')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                {/* Play Preview Button */}
                {track.preview_url && (
                  <button
                    onClick={() => handlePlayPreview(track)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    title="Play 30s preview"
                  >
                    {currentlyPlaying === track.id ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}

                {/* Open in Spotify Button */}
                <a
                  href={track.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Open in Spotify"
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setCurrentlyPlaying(null)}
      />
    </div>
  );
}

/**
 * Usage in Dashboard or any page:
 * 
 * import MusicSearchWidget from '../components/MusicSearchWidget';
 * 
 * function Dashboard() {
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       <div className="col-span-2">
 *         // Main content
 *       </div>
 *       <div>
 *         <MusicSearchWidget />
 *       </div>
 *     </div>
 *   );
 * }
 */
