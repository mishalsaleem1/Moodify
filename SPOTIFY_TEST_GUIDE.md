# 🧪 Quick Test Guide - Spotify Integration

## 🚀 How to Test the Complete Flow

### Prerequisites:
- ✅ Backend running on `http://localhost:3001`
- ✅ Frontend running on `http://localhost:5173`
- ✅ Spotify credentials configured in Backend `.env`

---

## 📋 Test Scenario 1: Without Spotify Connected

### Steps:
1. Open browser and go to `http://localhost:5173`
2. Login or signup
3. Go to **Emotion Detection** page
4. **Open Browser Console** (F12)
5. Select any mood (e.g., "Happy")
6. Watch console logs for:
   ```
   🎭 ========== MOOD DETECTED ==========
   💾 Saving emotion to database...
   ✅ Emotion saved to database
   ```
7. Automatically redirected to Recommendations page
8. Watch console logs for:
   ```
   🎵 ========== FETCHING SPOTIFY RECOMMENDATIONS ==========
   ⚠️ No Spotify token found - using fallback recommendations
   ```
9. **Expected Result:** Shows 4 fallback songs with toast message "Connect Spotify for personalized recommendations!"

---

## 📋 Test Scenario 2: Connect Spotify

### Steps:
1. Go to **Profile** page
2. Look for "Connect Spotify" button
3. Click it
4. **Watch console logs:**
   ```
   📡 Redirecting to Spotify authorization...
   ```
5. Authorize on Spotify (login if needed)
6. You'll be redirected back to your app at `/spotify-callback`
7. **Watch console logs:**
   ```
   🎵 ========== SPOTIFY CALLBACK ==========
   🔑 Access Token received: true
   ✅ Spotify token saved successfully
   🔄 Starting auto-sync of top tracks...
   ✅ Sync successful
   ```
8. **Expected Result:** Toast "Connected to Spotify!" and "Synced X songs to library"

---

## 📋 Test Scenario 3: With Spotify Connected

### Steps:
1. After connecting Spotify (Scenario 2)
2. Go to **Emotion Detection** page
3. **Open Browser Console** (F12)
4. Select mood: "Happy" 😊
5. **Watch console logs:**
   ```
   🎭 ========== MOOD DETECTED ==========
   📊 Mood ID: happy
   💾 Saving emotion to database...
   ✅ Emotion saved to database: {id: 'xxx', emotion: 'happy'}
   🎵 Redirecting to recommendations page with mood: happy
   ```
6. On Recommendations page, **watch console logs:**
   ```
   🎵 ========== FETCHING SPOTIFY RECOMMENDATIONS ==========
   📊 Current mood from store: happy
   🎭 Using mood: happy
   🔑 Spotify token exists: true
   📡 Calling Spotify API for mood-based recommendations...
   🎵 getMoodBasedRecommendations - mood: happy, token: true
   📤 API Request: GET /api/spotify/recommendations
   ✅ Spotify API response: {tracks: [...20 tracks...]}
   🎵 Number of tracks received: 20
   ✅ Formatted recommendations: [...20 formatted songs...]
   ```
7. **Expected Result:**
   - Loading spinner appears briefly
   - 20 real Spotify songs displayed
   - Album art from Spotify
   - Toast: "Found 20 happy songs from Spotify!"
   - Real song titles like "Blinding Lights", "Levitating", etc.

---

## 📋 Test Scenario 4: Different Moods

Test each mood to verify Spotify returns appropriate songs:

### Happy 😊
- Expected: Upbeat, energetic, positive songs
- Console: `🎭 Using mood: happy`
- Spotify: High valence (0.8), high energy (0.7)

### Sad 😢  
- Expected: Melancholic, slower, emotional songs
- Console: `🎭 Using mood: sad`
- Spotify: Low valence (0.2), low energy (0.3), acoustic

### Calm 😌
- Expected: Relaxing, peaceful, soothing songs
- Console: `🎭 Using mood: calm`
- Spotify: Medium valence (0.5), low energy (0.2), acoustic

### Energetic ⚡
- Expected: High-energy, fast-paced songs
- Console: `🎭 Using mood: energetic`
- Spotify: High valence (0.7), very high energy (0.9)

---

## 🔍 What to Look For in Console

### ✅ Success Flow:
```
1. Emotion Detection:
   🎭 MOOD DETECTED
   💾 Saving to database
   ✅ Emotion saved
   🎵 Redirecting

2. Spotify Fetch:
   🎵 FETCHING SPOTIFY RECOMMENDATIONS
   🔑 Token exists: true
   📡 Calling Spotify API
   📤 API Request: GET /api/spotify/recommendations
   ✅ API Response: 200 OK
   🎵 Number of tracks: 20
   ✅ Formatted recommendations

3. Display:
   Loading → Real Spotify songs displayed
   Toast: "Found 20 {mood} songs from Spotify!"
```

### ❌ Error Flow (without Spotify):
```
1. Emotion Detection:
   🎭 MOOD DETECTED
   💾 Saving to database
   ✅ Emotion saved

2. Spotify Fetch:
   🎵 FETCHING SPOTIFY RECOMMENDATIONS
   🔑 Token exists: false
   ⚠️ No Spotify token found
   Using fallback recommendations

3. Display:
   Mock songs displayed
   Toast: "Connect Spotify for personalized recommendations!"
```

---

## 🎯 Verification Checklist

- [ ] Emotion saves to database (check backend logs/Prisma Studio)
- [ ] Mood stored in global state (Zustand)
- [ ] Spotify token saved to localStorage
- [ ] API call to `/api/spotify/recommendations` succeeds
- [ ] Real song titles appear (not mock data)
- [ ] Album art loads from Spotify CDN
- [ ] Match scores calculated (95%, 93%, 91%, etc.)
- [ ] Different moods return different songs
- [ ] Loading state shows during fetch
- [ ] Error handling works (try disconnecting Spotify)

---

## 🛠️ Debugging Commands

### Check Spotify Token:
```javascript
// In browser console:
localStorage.getItem('spotify_access_token')
// Should return: "BQC7x..." (long token string)
```

### Check Current Mood:
```javascript
// In browser console:
useMoodStore.getState()
// Should return: {mood: "happy", confidence: 0.95}
```

### Check if Backend is Running:
```bash
curl http://localhost:3001/api/spotify/connect
# Should return: {"url":"https://accounts.spotify.com/authorize?..."}
```

### Check Emotion History in Database:
```bash
# Open Prisma Studio:
cd Backend
npx prisma studio
# Navigate to EmotionHistory table
# Should see your detected emotions
```

---

## 🎊 Expected User Experience

### Perfect Flow:
1. User opens app → "Detect Your Mood" 🎭
2. Selects "Happy" mood → Confetti 🎉
3. "Mood detected: Happy!" toast
4. Auto-redirect to Recommendations
5. Loading spinner → "Loading your personalized recommendations..."
6. Real Spotify songs appear with album art
7. Toast: "Found 20 happy songs from Spotify!" 🎵
8. User can play, like, add to playlist

### Fallback Flow (No Spotify):
1. User detects mood
2. Redirected to Recommendations
3. Shows 4 fallback songs
4. Toast: "Connect Spotify for personalized recommendations!"
5. User clicks "Connect Spotify" button
6. Authorizes → Syncs songs
7. Goes back to Emotion Detection
8. Detects mood again
9. Now gets REAL Spotify songs! ✨

---

## 🚨 Common Issues & Solutions

### Issue: "No Spotify token found"
**Solution:** Connect Spotify via Profile page first

### Issue: API returns 401 Unauthorized
**Solution:** Spotify token expired. Reconnect to Spotify

### Issue: No songs displayed
**Solution:** Check console for errors. Verify backend is running

### Issue: Mock songs instead of real songs  
**Solution:** Verify `spotify_access_token` exists in localStorage

### Issue: Backend error on /spotify/recommendations
**Solution:** Check Backend .env has valid SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET

---

## ✅ Integration Is Working When:

- ✅ Console shows complete flow from emotion → Spotify → display
- ✅ Real song titles appear (verified on Spotify)
- ✅ Album art loads (URLs contain `i.scdn.co`)
- ✅ Different moods return different songs
- ✅ Toast shows song count: "Found 20 songs"
- ✅ No 401 errors in console
- ✅ Backend logs show successful API calls

---

## 🎉 Success!

If you see all the console logs and real Spotify songs, **congratulations!** Your emotion-based Spotify integration is working perfectly! 🎊🎵✨
