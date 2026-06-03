# Fetch missing songs using Deezer API with strict URI formatting
$missingSongs = New-Object System.Collections.ArrayList

[void]$missingSongs.Add(@{ id = "m94"; artist = "LE SSERAFIM"; track = "1-800-hot-n-fun" })
[void]$missingSongs.Add(@{ id = "m97"; artist = "fromis_9"; track = "Stay This Way" })
[void]$missingSongs.Add(@{ id = "m102"; artist = "aespa"; track = "BAHAMA" })
[void]$missingSongs.Add(@{ id = "m103"; artist = "Jannabi"; track = "Blue spring" })
[void]$missingSongs.Add(@{ id = "m112"; artist = "Jannabi"; track = "A thought on an autumn night" })
[void]$missingSongs.Add(@{ id = "m118"; artist = "Jannabi"; track = "November Rain" })
[void]$missingSongs.Add(@{ id = "m126"; artist = "Saint Motel"; track = "My Type" })
[void]$missingSongs.Add(@{ id = "m140"; artist = "Mahalia"; track = "Plastic Plants" })
[void]$missingSongs.Add(@{ id = "m141"; artist = "HONNE"; track = "Warm On A Cold Night" })
[void]$missingSongs.Add(@{ id = "m144"; artist = "HONNE"; track = "It Ain't Wrong Loving You" })
[void]$missingSongs.Add(@{ id = "m145"; artist = "Dynamic Duo"; track = "SsSs" })
[void]$missingSongs.Add(@{ id = "m146"; artist = "Lee Mujin"; track = "When it snows" })
[void]$missingSongs.Add(@{ id = "m150"; artist = "Josef Lee"; track = "Mulholland Drive" })
[void]$missingSongs.Add(@{ id = "m152"; artist = "Cosmic Boy"; track = "Can I Love" })
[void]$missingSongs.Add(@{ id = "m162"; artist = "Jeremih"; track = "Don't Get Much Better" })

Write-Host "Total missing songs: $($missingSongs.Count)"

$results = New-Object System.Collections.ArrayList

foreach ($song in $missingSongs) {
    $artist = $song.artist
    $trackName = $song.track
    
    # Manual query construction to match working Deezer API advanced search exactly:
    # q=artist:%22[artist]%22%20track:%22[track]%22
    $artistEscaped = $artist -replace " ", "%20"
    $trackEscaped = $trackName -replace " ", "%20" -replace "'", "%27"
    
    $q = "artist:%22$artistEscaped%22%20track:%22$trackEscaped%22"
    $url = "https://api.deezer.com/search?q=$q"
    
    Write-Host "Searching: $artist - $trackName -> $url"
    try {
        $uri = New-Object System.Uri($url)
        $res = Invoke-RestMethod -Uri $uri -TimeoutSec 10
        if ($res.data -and $res.data.Count -gt 0) {
            $track = $res.data[0]
            $img = $track.album.cover_xl
            if (-not $img) { $img = $track.album.cover_big }
            if (-not $img) { $img = $track.album.cover_medium }
            
            $item = [PSCustomObject]@{
                id = $song.id
                target_title = $trackName
                found_title = $track.title
                found_artist = $track.artist.name
                imgUrl = $img
                previewUrl = $track.preview
            }
            [void]$results.Add($item)
            Write-Host "FOUND: $($track.artist.name) - $($track.title)"
        } else {
            # Try fallback search (without quotes/fields, just space separated)
            $fallbackQuery = "$artist $trackName" -replace " ", "%20"
            $url2 = "https://api.deezer.com/search?q=$fallbackQuery"
            Write-Host "FALLBACK: $fallbackQuery -> $url2"
            $uri2 = New-Object System.Uri($url2)
            $res2 = Invoke-RestMethod -Uri $uri2 -TimeoutSec 10
            if ($res2.data -and $res2.data.Count -gt 0) {
                $track = $res2.data[0]
                $img = $track.album.cover_xl
                if (-not $img) { $img = $track.album.cover_big }
                if (-not $img) { $img = $track.album.cover_medium }
                
                $item = [PSCustomObject]@{
                    id = $song.id
                    target_title = $trackName
                    found_title = $track.title
                    found_artist = $track.artist.name
                    imgUrl = $img
                    previewUrl = $track.preview
                }
                [void]$results.Add($item)
                Write-Host "FOUND FALLBACK: $($track.artist.name) - $($track.title)"
            } else {
                # Super fallback: search just the track name
                $superQuery = $trackName -replace " ", "%20"
                $url3 = "https://api.deezer.com/search?q=$superQuery"
                Write-Host "SUPER FALLBACK: $superQuery -> $url3"
                $uri3 = New-Object System.Uri($url3)
                $res3 = Invoke-RestMethod -Uri $uri3 -TimeoutSec 10
                if ($res3.data -and $res3.data.Count -gt 0) {
                    $track = $res3.data[0]
                    $img = $track.album.cover_xl
                    if (-not $img) { $img = $track.album.cover_big }
                    
                    $item = [PSCustomObject]@{
                        id = $song.id
                        target_title = $trackName
                        found_title = $track.title
                        found_artist = $track.artist.name
                        imgUrl = $img
                        previewUrl = $track.preview
                    }
                    [void]$results.Add($item)
                    Write-Host "FOUND SUPER FALLBACK: $($track.artist.name) - $($track.title)"
                } else {
                    Write-Host "NOT FOUND AT ALL: $artist - $trackName"
                    $item = [PSCustomObject]@{
                        id = $song.id
                        target_title = $trackName
                        found_title = $null
                        found_artist = $null
                        imgUrl = $null
                        previewUrl = $null
                    }
                    [void]$results.Add($item)
                }
            }
        }
    } catch {
        Write-Host "ERROR searching $artist - $trackName : $_"
        $item = [PSCustomObject]@{
            id = $song.id
            target_title = $trackName
            found_title = $null
            found_artist = $null
            imgUrl = $null
            previewUrl = $null
        }
        [void]$results.Add($item)
    }
    Start-Sleep -Milliseconds 200
}

# Save results to JSON
$results | ConvertTo-Json -Depth 5 | Out-File -FilePath "c:\Users\kyh08\Desktop\musicismylife\scratch\deezer_results.json" -Encoding utf8
Write-Host "Done! Saved to scratch\deezer_results.json"
