import json
import urllib.request
import urllib.parse
import time
import ssl

# Disable SSL verification to avoid certificate issues
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('scratch/songs_list.json', 'r', encoding='utf-8') as f:
    songs = json.load(f)

results = []
total = len(songs)

for i, song in enumerate(songs):
    search_term = song['query'].replace('+', ' ')
    print(f"[{i+1}/{total}] {song['ea']} - {song['et']}", flush=True)
    
    try:
        url = f"https://itunes.apple.com/search?term={urllib.parse.quote(search_term)}&media=music&limit=3&country=KR"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        
        if data['resultCount'] > 0:
            # Find best artist match
            best = None
            ea = song['ea'].lower()
            
            for r in data['results']:
                ra = r['artistName'].lower()
                ea_words = [w for w in ea.replace(',', ' ').replace('&', ' ').split() if len(w) > 1]
                if any(w in ra for w in ea_words) or ea in ra or ra in ea:
                    best = r
                    break
            
            if not best:
                best = data['results'][0]
                status = 'WARN'
            else:
                status = 'OK'
            
            img = best.get('artworkUrl100', '').replace('100x100bb', '600x600bb')
            preview = best.get('previewUrl', '')
            
            results.append({
                'id': song['id'],
                'title': best['trackName'],
                'artist': best['artistName'],
                'season': song['season'],
                'imgUrl': img,
                'previewUrl': preview,
                'match': status
            })
            print(f"  -> {best['artistName']} - {best['trackName']} [{status}]", flush=True)
        else:
            print(f"  -> NO RESULTS", flush=True)
            results.append({
                'id': song['id'],
                'title': song['et'],
                'artist': song['ea'],
                'season': song['season'],
                'imgUrl': '',
                'previewUrl': '',
                'match': 'FAIL'
            })
    except Exception as e:
        err_str = str(e)
        print(f"  -> ERROR: {err_str}", flush=True)
        
        # If rate limited, wait longer and retry once
        if '403' in err_str or '429' in err_str:
            print(f"  -> Retrying after 5s...", flush=True)
            time.sleep(5)
            try:
                with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                if data['resultCount'] > 0:
                    best = data['results'][0]
                    img = best.get('artworkUrl100', '').replace('100x100bb', '600x600bb')
                    preview = best.get('previewUrl', '')
                    results.append({
                        'id': song['id'],
                        'title': best['trackName'],
                        'artist': best['artistName'],
                        'season': song['season'],
                        'imgUrl': img,
                        'previewUrl': preview,
                        'match': 'RETRY'
                    })
                    print(f"  -> RETRY OK: {best['artistName']} - {best['trackName']}", flush=True)
                    time.sleep(2)
                    continue
                else:
                    results.append({
                        'id': song['id'],
                        'title': song['et'],
                        'artist': song['ea'],
                        'season': song['season'],
                        'imgUrl': '',
                        'previewUrl': '',
                        'match': 'FAIL'
                    })
            except:
                results.append({
                    'id': song['id'],
                    'title': song['et'],
                    'artist': song['ea'],
                    'season': song['season'],
                    'imgUrl': '',
                    'previewUrl': '',
                    'match': 'ERROR'
                })
        else:
            results.append({
                'id': song['id'],
                'title': song['et'],
                'artist': song['ea'],
                'season': song['season'],
                'imgUrl': '',
                'previewUrl': '',
                'match': 'ERROR'
            })
    
    time.sleep(2)  # 2 second delay between requests

# Save results
with open('scratch/itunes_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

# Summary
ok = sum(1 for r in results if r['match'] == 'OK')
warn = sum(1 for r in results if r['match'] == 'WARN')
fail = sum(1 for r in results if r['match'] in ('FAIL', 'ERROR'))
retry = sum(1 for r in results if r['match'] == 'RETRY')
has_img = sum(1 for r in results if r['imgUrl'])
has_preview = sum(1 for r in results if r['previewUrl'])

print(f"\nDone! Total: {len(results)}")
print(f"OK: {ok}, WARN: {warn}, RETRY: {retry}, FAIL: {fail}")
print(f"Has image: {has_img}, Has preview: {has_preview}")
