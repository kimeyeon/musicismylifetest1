const https = require('https');
const fs = require('fs');

const songs = [
    { title: "벚꽃엔딩", query: "벚꽃엔딩 버스커 버스커" },
    { title: "Electric Love", query: "Electric Love BORNS" },
    { title: "즐거운 인생", query: "즐거운 인생 디핵" },
    { title: "work shit sleep", query: "work shit sleep jisokuryClub" },
    { title: "민들레", query: "민들레 한요한" },
    { title: "난춘", query: "난춘 새소년" },
    { title: "love affair", query: "love affair UMI" },
    { title: "cant take my eyes off you", query: "can't take my eyes off you Frankie Valli" },
    { title: "flower", query: "flower 지수 JISOO" },
    { title: "why you look sad?", query: "왜 슬퍼 보여 연규성" },
    { title: "아무리 애를 쓰고 막아 보려 해도 너의 목소리가 들려", query: "너의 목소리가 들려 델리스파이스" },
    { title: "i love you so", query: "i love you so The Walters" },
    { title: "봄바람", query: "봄바람 이문세" },
    { title: "뜨거운 여름밤은 가고 남은건 볼품 없지만", query: "뜨거운 여름밤은 가고 남은건 볼품 없지만 잔나비" },
    { title: "do your thing", query: "do your thing guesthouse" },
    { title: "babe!", query: "babe 현아" },
    { title: "가죽자켓", query: "가죽자켓 혁오" }
];

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    const results = [];
    for (const song of songs) {
        console.log(`Searching: ${song.query}`);
        const encoded = encodeURIComponent(song.query);
        const url = `https://itunes.apple.com/search?term=${encoded}&media=music&limit=1&country=KR`;
        try {
            let data = await fetchJson(url);
            if (data.resultCount > 0) {
                const track = data.results[0];
                results.push({
                    searchTitle: song.title,
                    title: track.trackName,
                    artist: track.artistName,
                    imgUrl: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg').replace('100x100bb.png', '600x600bb.png') : '',
                    previewUrl: track.previewUrl
                });
            } else {
                console.log(`  Retry with title only: ${song.title}`);
                const encodedTitle = encodeURIComponent(song.title);
                const url2 = `https://itunes.apple.com/search?term=${encodedTitle}&media=music&limit=1&country=KR`;
                data = await fetchJson(url2);
                if (data.resultCount > 0) {
                    const track = data.results[0];
                    results.push({
                        searchTitle: song.title,
                        title: track.trackName,
                        artist: track.artistName,
                        imgUrl: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg').replace('100x100bb.png', '600x600bb.png') : '',
                        previewUrl: track.previewUrl
                    });
                } else {
                    results.push({
                        searchTitle: song.title,
                        title: "NOT_FOUND",
                        artist: "",
                        imgUrl: "",
                        previewUrl: ""
                    });
                }
            }
        } catch (e) {
            console.error(`  Error searching ${song.query}:`, e.message);
            results.push({
                searchTitle: song.title,
                title: "ERROR",
                artist: "",
                imgUrl: "",
                previewUrl: ""
            });
        }
        // Throttling
        await new Promise(r => setTimeout(r, 200));
    }
    fs.writeFileSync('c:\\Users\\kyh08\\Desktop\\musicismylife\\scratch\\search_results.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('Done!');
}

run();
