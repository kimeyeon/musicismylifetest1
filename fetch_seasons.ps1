# Pure ASCII script to query Deezer Search API for seasons playlists to avoid Apple rate limiting
$jsonPath = "scratch/seasons_list.json"
$jsonData = Get-Content -Raw -Path $jsonPath -Encoding utf8 | ConvertFrom-Json

function Get-DeezerMetadata($artist, $title) {
    # Helper to execute request
    function Execute-Request($query) {
        $escaped = [URI]::EscapeDataString($query)
        $url = "https://api.deezer.com/search?q=$escaped&limit=1"
        try {
            $response = Invoke-RestMethod -Uri $url -TimeoutSec 10
            return $response
        } catch {
            Write-Host "  Deezer query failed for $query : $_" -ForegroundColor Yellow
            return $null
        }
    }

    # Try searching "$artist $title"
    $query1 = "$artist $title"
    $response = Execute-Request $query1
    if ($response -and $response.data -and $response.data.Count -gt 0) {
        $track = $response.data[0]
        return @{
            title = $track.title
            artist = $track.artist.name
            imgUrl = $track.album.cover_big
            previewUrl = $track.preview
        }
    }

    # Fallback: Search with just "$title"
    Write-Host "  Trying fallback query with title only: $title" -ForegroundColor Gray
    $response = Execute-Request $title
    if ($response -and $response.data -and $response.data.Count -gt 0) {
        $track = $response.data[0]
        return @{
            title = $track.title
            artist = $track.artist.name
            imgUrl = $track.album.cover_big
            previewUrl = $track.preview
        }
    }
    
    # Return placeholder
    return @{
        title = $title
        artist = $artist
        imgUrl = ""
        previewUrl = ""
    }
}

$global:allFetchedSongs = [System.Collections.Generic.List[PSObject]]::new()
$global:idCounter = 81

# Helper function to process a season list
function Process-Season($songsList, $seasonTag) {
    foreach ($item in $songsList) {
        $artist = $item.artist
        $title = $item.title
        
        Write-Host "Fetching [$seasonTag]: $artist - $title ..."
        $meta = Get-DeezerMetadata $artist $title
        
        $likes = (Get-Random -Minimum 1000 -Maximum 9900)
        
        $song = [PSCustomObject]@{
            id = "m$($global:idCounter)"
            title = $meta.title
            artist = $meta.artist
            tags = [string[]]@("season", $seasonTag)
            imgUrl = $meta.imgUrl
            previewUrl = $meta.previewUrl
            likes = $likes
        }
        
        $global:allFetchedSongs.Add($song)
        $global:idCounter++
        
        # Short polite delay (Deezer is very generous, but 100ms is good)
        Start-Sleep -Milliseconds 100
    }
}

Write-Host "Starting Summer..."
Process-Season $jsonData.summer "season-summer"

Write-Host "Starting Fall..."
Process-Season $jsonData.fall "season-fall"

Write-Host "Starting Winter..."
Process-Season $jsonData.winter "season-winter"

$global:allFetchedSongs | ConvertTo-Json -Depth 5 | Out-File -FilePath "scratch/fetched_seasons.json" -Encoding utf8
Write-Host "All fetched songs saved to scratch/fetched_seasons.json"
