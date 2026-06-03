$songs = @(
    @{ title = "Lavender_dep_art"; encodedQuery = "dep.art%20Lavender" },
    @{ title = "DoYourThingBabe_MichaelMedrano"; encodedQuery = "Michael%20Medrano%20Do%20Your%20Thing%20Babe" },
    @{ title = "Delorians_Deezer_Search"; url = "https://api.deezer.com/search?q=Delorians%20I%20Love%20You%20So" }
)

$results = @()
# 1. dep.art Lavender search
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $url = "https://itunes.apple.com/search?term=" + $songs[0].encodedQuery + "&media=music&limit=1&country=KR"
    $res = Invoke-RestMethod -Uri $url -Method Get
    if ($res.resultCount -gt 0) {
        $track = $res.results[0]
        $img = $track.artworkUrl100.Replace("100x100bb.jpg", "600x600bb.jpg").Replace("100x100bb.png", "600x600bb.png")
        $results += [PSCustomObject]@{
            searchTitle = $songs[0].title
            title = $track.trackName
            artist = $track.artistName
            imgUrl = $img
            previewUrl = $track.previewUrl
        }
    } else {
        $results += [PSCustomObject]@{ searchTitle = $songs[0].title; title = "NOT_FOUND"; artist = ""; imgUrl = ""; previewUrl = "" }
    }
} catch {
    $results += [PSCustomObject]@{ searchTitle = $songs[0].title; title = "ERROR"; artist = $_.Exception.Message; imgUrl = ""; previewUrl = "" }
}

# 2. Michael Medrano search
try {
    $url = "https://itunes.apple.com/search?term=" + $songs[1].encodedQuery + "&media=music&limit=1&country=US"
    $res = Invoke-RestMethod -Uri $url -Method Get
    if ($res.resultCount -gt 0) {
        $track = $res.results[0]
        $img = $track.artworkUrl100.Replace("100x100bb.jpg", "600x600bb.jpg").Replace("100x100bb.png", "600x600bb.png")
        $results += [PSCustomObject]@{
            searchTitle = $songs[1].title
            title = $track.trackName
            artist = $track.artistName
            imgUrl = $img
            previewUrl = $track.previewUrl
        }
    } else {
        $results += [PSCustomObject]@{ searchTitle = $songs[1].title; title = "NOT_FOUND"; artist = ""; imgUrl = ""; previewUrl = "" }
    }
} catch {
    $results += [PSCustomObject]@{ searchTitle = $songs[1].title; title = "ERROR"; artist = $_.Exception.Message; imgUrl = ""; previewUrl = "" }
}

# 3. Delorians Deezer search
try {
    $res = Invoke-RestMethod -Uri $songs[2].url -Method Get
    if ($res.data.Count -gt 0) {
        $track = $res.data[0]
        $results += [PSCustomObject]@{
            searchTitle = $songs[2].title
            title = $track.title
            artist = $track.artist.name
            imgUrl = $track.album.cover_big
            previewUrl = $track.preview
        }
    } else {
        $results += [PSCustomObject]@{ searchTitle = $songs[2].title; title = "NOT_FOUND"; artist = ""; imgUrl = ""; previewUrl = "" }
    }
} catch {
    $results += [PSCustomObject]@{ searchTitle = $songs[2].title; title = "ERROR"; artist = $_.Exception.Message; imgUrl = ""; previewUrl = "" }
}

$json = $results | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("c:\Users\kyh08\Desktop\musicismylife\scratch\new_spring_results2.json", $json, [System.Text.Encoding]::UTF8)
