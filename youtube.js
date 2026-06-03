export default async function handler(req, res) {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required' });
    }

    try {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
        
        // Vercel Serverless Function에서 직접 유튜브 검색 결과 HTML을 가져옵니다.
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        
        const html = await response.text();
        
        // 정규식을 사용해 HTML 내에서 첫 번째 비디오 ID를 추출합니다.
        const match = html.match(/"videoId":"(.*?)"/);
        
        if (match && match[1]) {
            res.status(200).json({ videoId: match[1] });
        } else {
            res.status(404).json({ error: 'No video found' });
        }
    } catch (error) {
        console.error('YouTube Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch from YouTube' });
    }
}
