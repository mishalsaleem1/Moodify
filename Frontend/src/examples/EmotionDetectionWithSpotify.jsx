/**
 * Example: Integrating Spotify into Emotion Detection Page
 * 
 * This shows how to use Spotify recommendations based on detected emotion
 */

import React, { useState, useEffect } from 'react';
import { getSpotifyMoodRecommendations } from '../services/spotify';
import SpotifyTrackCard from '../components/common/SpotifyTrackCard';

// Map emotions to Spotify moods
const EMOTION_TO_MOOD_MAP = {
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
  neutral: 'calm',
  surprised: 'energetic',
  fear: 'calm',
  disgust: 'angry',
};

export default function EmotionDetectionWithSpotify() {
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When emotion is detected, fetch Spotify recommendations
  useEffect(() => {
    if (detectedEmotion) {
      fetchRecommendations(detectedEmotion);
    }
  }, [detectedEmotion]);

  const fetchRecommendations = async (emotion) => {
    setLoading(true);
    setError(null);

    try {
      // Map emotion to Spotify mood
      const mood = EMOTION_TO_MOOD_MAP[emotion.toLowerCase()] || 'calm';
      
      console.log(`🎵 Fetching ${mood} songs for ${emotion} emotion`);
      
      // Get recommendations from Spotify
      const results = await getSpotifyMoodRecommendations(mood, 12);
      setRecommendations(results.tracks || []);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load song recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Simulate emotion detection (replace with your actual detection logic)
  const simulateEmotionDetection = (emotion) => {
    setDetectedEmotion(emotion);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Emotion Detection Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            😊 Emotion Detection
          </h2>
          
          {/* Your existing emotion detection UI */}
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Detect your emotion and get matching music recommendations
            </p>

            {/* Simulate emotion buttons (replace with your camera/detection logic) */}
            <div className="flex gap-2 flex-wrap">
              {Object.keys(EMOTION_TO_MOOD_MAP).map(emotion => (
                <button
                  key={emotion}
                  onClick={() => simulateEmotionDetection(emotion)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </button>
              ))}
            </div>

            {/* Detected Emotion Display */}
            {detectedEmotion && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  ✅ Detected emotion: <strong>{detectedEmotion}</strong>
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Finding matching songs for you...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Spotify Recommendations */}
        {detectedEmotion && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🎵 Recommended Songs for "{detectedEmotion}" mood
            </h3>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading recommendations...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Recommendations Grid */}
            {!loading && recommendations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map(track => (
                  <SpotifyTrackCard 
                    key={track.id} 
                    track={track} 
                    showPreview={true}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && recommendations.length === 0 && !error && (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No recommendations yet. Detect an emotion to get started!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
