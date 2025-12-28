import React, { useState } from 'react';
import { searchSpotifyTracks, getSpotifyMoodRecommendations } from '../services/spotify';
import SpotifyTrackCard from '../components/common/SpotifyTrackCard';

/**
 * SpotifySearch Page
 * Demonstrates Spotify Web API integration with Client Credentials Flow
 * Features:
 *  - Search tracks by song name/artist
 *  - Get mood-based recommendations
 *  - Display track details with 30-second previews
 *  - NO user login required
 */
export default function SpotifySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('search'); // 'search' or 'mood'

  const moods = [
    { value: 'happy', label: '😊 Happy', color: 'bg-yellow-100' },
    { value: 'sad', label: '😢 Sad', color: 'bg-blue-100' },
    { value: 'energetic', label: '⚡ Energetic', color: 'bg-red-100' },
    { value: 'calm', label: '😌 Calm', color: 'bg-green-100' },
    { value: 'romantic', label: '❤️ Romantic', color: 'bg-pink-100' },
    { value: 'party', label: '🎉 Party', color: 'bg-purple-100' },
    { value: 'focus', label: '🧘 Focus', color: 'bg-indigo-100' },
    { value: 'angry', label: '😠 Angry', color: 'bg-orange-100' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchType('search');

    try {
      const results = await searchSpotifyTracks(searchQuery, 20);
      setTracks(results.tracks?.items || []);
      
      if (results.tracks?.items?.length === 0) {
        setError('No tracks found. Try a different search query.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search tracks');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodRecommendations = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    setSearchType('mood');

    try {
      const results = await getSpotifyMoodRecommendations(mood, 20);
      setTracks(results.tracks || []);
      
      if (!results.tracks || results.tracks.length === 0) {
        setError('No recommendations found for this mood.');
      }
    } catch (err) {
      console.error('Mood recommendations error:', err);
      setError(err.message || 'Failed to get mood recommendations');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎵 Spotify Music Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for songs or get mood-based recommendations (No login required!)
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search for a song or artist
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., 'happy songs', 'Ed Sheeran', 'Bohemian Rhapsody'"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading && searchType === 'search' ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Mood Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Or get recommendations by mood
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodRecommendations(mood.value)}
                disabled={loading}
                className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedMood === mood.value && searchType === 'mood'
                    ? 'ring-2 ring-green-500 scale-105'
                    : ''
                } ${mood.color} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tracks...</p>
          </div>
        )}

        {/* Results */}
        {!loading && tracks.length > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchType === 'search' ? 'Search Results' : `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Recommendations`}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Found {tracks.length} track{tracks.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <SpotifyTrackCard key={track.id} track={track} showPreview={true} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && tracks.length === 0 && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tracks yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Search for songs or select a mood to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
