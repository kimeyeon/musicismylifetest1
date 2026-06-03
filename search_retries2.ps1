$songs = @(
    @{ title = "Dandelion_Oohyo"; encodedQuery = "Oohyo%20Dandelion" },
    @{ title = "Why_You_Look_Sad_Diverseddie"; encodedQuery = "Diverseddie%20Why%20you%20look%20sad" }
)

$results = @()
foreach ($song in $songs) {
    $encoded = $song.encodedQuery
    $url = "https://itunes.apple.com/search?term=$encoded&media=music&limit=1&country=KR"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $res = Invoke-RestMethod -Uri $url -Method Get
        if ($res.resultCount -gt 0) {
            $track = $res.results[0]
            $img = $track.artworkUrl100
            if ($img) {
                $img = $img.Replace("100x100bb.jpg", "600x600bb.jpg").Replace("100x100bb.png", "600x600bb.png")
            }
            $results += [PSCustomObject]@{
                searchTitle = $song.title
                title = $track.trackName
                artist = $track.artistName
                imgUrl = $img
                previewUrl = $track.previewUrl
            }
        } else {
            $results += [PSCustomObject]@{
                searchTitle = $song.title
                title = "NOT_FOUND"
                artist = ""
                imgUrl = ""
                previewUrl = ""
            }
        }
    } catch {
        $results += [PSCustomObject]@{
            searchTitle = $song.title
            title = "ERROR"
            artist = $_.Exception.Message
            imgUrl = ""
            previewUrl = ""
        }
    }
}

$json = $results | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("c:\Users\kyh08\Desktop\musicismylife\scratch\retry_results2.json", $json, [System.Text.Encoding]::UTF8)
