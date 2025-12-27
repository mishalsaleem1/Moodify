const moods = {
  'happy': 'happy upbeat dance pop',
  'sad': 'sad emotional acoustic',
  'energetic': 'energetic workout electronic dance',
  'calm': 'calm relaxing ambient chill'
};

async function testMood(mood, searchTerm) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=5&media=music`;
  const response = await fetch(url);
  const data = await response.json();
  
  console.log('\n' + '='.repeat(60));
  console.log(`MOOD: ${mood.toUpperCase()} (search: '${searchTerm}')`);
  console.log('='.repeat(60));
  console.log(`Total songs: ${data.results.length}\n`);
  
  data.results.slice(0, 5).forEach((song, i) => {
    console.log(`${i+1}. ${song.trackName}`);
    console.log(`   Artist: ${song.artistName}`);
    console.log(`   Album: ${song.collectionName}`);
    console.log('');
  });
}

(async () => {
  console.log('🎵 Testing iTunes API with different moods...');
  for (const [mood, term] of Object.entries(moods)) {
    await testMood(mood, term);
  }
})();
