const https = require('https');
const fs = require('fs');

const songs = JSON.parse(fs.readFileSync('scratch/songs_list.json', 'utf8'));

function fetchSong(query) {
  return new Promise((resolve, reject) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=3&country=KR`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve({ resultCount: 0, results: [], error: data.substring(0, 200) });
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const results = [];
  
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const searchTerm = song.query.replace(/\+/g, ' ');
    console.log(`[${i+1}/${songs.length}] ${song.ea} - ${song.et}`);
    
    try {
      const data = await fetchSong(searchTerm);
      
      if (data.resultCount > 0) {
        // Try to find best match by artist
        let best = null;
        const expectedArtist = song.ea.toLowerCase();
        
        for (const r of data.results) {
          const rArtist = r.artistName.toLowerCase();
          if (rArtist.includes(expectedArtist) || expectedArtist.includes(rArtist) ||
              expectedArtist.split(/[\s,&]+/).some(w => w.length > 1 && rArtist.includes(w))) {
            best = r;
            break;
          }
        }
        
        if (!best) best = data.results[0];
        
        const imgUrl = best.artworkUrl100 ? best.artworkUrl100.replace('100x100bb', '600x600bb') : '';
        const previewUrl = best.previewUrl || '';
        
        results.push({
          id: song.id,
          title: best.trackName,
          artist: best.artistName,
          season: song.season,
          imgUrl: imgUrl,
          previewUrl: previewUrl,
          match: best.artistName.toLowerCase().includes(expectedArtist.split(/[\s,&]+/)[0].toLowerCase()) ? 'OK' : 'WARN'
        });
        
        console.log(`  -> ${best.artistName} - ${best.trackName} [${results[results.length-1].match}]`);
      } else {
        console.log(`  -> NO RESULTS${data.error ? ': ' + data.error : ''}`);
        results.push({
          id: song.id,
          title: song.et,
          artist: song.ea,
          season: song.season,
          imgUrl: '',
          previewUrl: '',
          match: 'FAIL'
        });
      }
    } catch(e) {
      console.log(`  -> ERROR: ${e.message}`);
      results.push({
        id: song.id,
        title: song.et,
        artist: song.ea,
        season: song.season,
        imgUrl: '',
        previewUrl: '',
        match: 'ERROR'
      });
    }
    
    // Delay to avoid rate limiting - 1.5 seconds between requests
    await sleep(1500);
  }
  
  // Write JSON results
  fs.writeFileSync('scratch/itunes_results.json', JSON.stringify(results, null, 2), 'utf8');
  
  // Generate JS code for app.js
  const jsLines = results.map(r => {
    const title = r.title.replace(/'/g, "\\'");
    const artist = r.artist.replace(/'/g, "\\'");
    const likes = Math.floor(Math.random() * 7500) + 2000;
    return `    { id:'${r.id}', title:'${title}', artist:'${artist}', tags:['season','season-${r.season}'], imgUrl:'${r.imgUrl}', previewUrl:'${r.previewUrl}', likes:${likes} },`;
  });
  
  fs.writeFileSync('scratch/seasons_js_code.txt', jsLines.join('\n'), 'utf8');
  
  // Summary
  const ok = results.filter(r => r.match === 'OK').length;
  const warn = results.filter(r => r.match === 'WARN').length;
  const fail = results.filter(r => r.match === 'FAIL' || r.match === 'ERROR').length;
  console.log(`\nDone! OK: ${ok}, WARN: ${warn}, FAIL: ${fail}`);
  console.log('Results: scratch/itunes_results.json');
  console.log('JS Code: scratch/seasons_js_code.txt');
}

main().catch(console.error);
