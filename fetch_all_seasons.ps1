$songsList = Get-Content -Path "scratch/songs_list.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$results = @()
$total = $songsList.Count
$i = 0

foreach ($song in $songsList) {
    $i++
    Write-Host "[$i/$total] Fetching: $($song.ea) - $($song.et)..."
    
    $url = "https://itunes.apple.com/search?term=$($song.query)&media=music&limit=5&country=KR"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
        
        if ($response.resultCount -gt 0) {
            $bestMatch = $response.results[0]
            
            $imgUrl = ""
            if ($bestMatch.artworkUrl100) {
                $imgUrl = $bestMatch.artworkUrl100 -replace "100x100bb", "600x600bb"
            }
            $previewUrl = ""
            if ($bestMatch.previewUrl) {
                $previewUrl = $bestMatch.previewUrl
            }
            
            $obj = [PSCustomObject]@{
                id = $song.id
                title = $bestMatch.trackName
                artist = $bestMatch.artistName
                season = $song.season
                imgUrl = $imgUrl
                previewUrl = $previewUrl
                expectedArtist = $song.ea
                expectedTitle = $song.et
            }
            $results += $obj
            Write-Host "  OK: $($bestMatch.artistName) - $($bestMatch.trackName)"
        }
        else {
            Write-Host "  FAILED: No results"
            $obj = [PSCustomObject]@{
                id = $song.id
                title = $song.et
                artist = $song.ea
                season = $song.season
                imgUrl = ""
                previewUrl = ""
                expectedArtist = $song.ea
                expectedTitle = $song.et
            }
            $results += $obj
        }
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
        $obj = [PSCustomObject]@{
            id = $song.id
            title = $song.et
            artist = $song.ea
            season = $song.season
            imgUrl = ""
            previewUrl = ""
            expectedArtist = $song.ea
            expectedTitle = $song.et
        }
        $results += $obj
    }
    
    Start-Sleep -Milliseconds 400
}

$json = $results | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("$PWD/scratch/all_seasons_fixed.json", $json, [System.Text.Encoding]::UTF8)

Write-Host ""
Write-Host "Done! Fetched $($results.Count) songs."
Write-Host "Results saved to scratch/all_seasons_fixed.json"
