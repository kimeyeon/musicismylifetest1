$songs = @(
    @{ title = "Joyful_Life_D-Hack"; encodedQuery = "%EB%94%94%ED%95%B5%20%EC%A6%90%EA%B1%B0%EC%9A%B4%20%EC%9D%B8%EC%83%9D" },
    @{ title = "Dandelion_HanYoHan"; encodedQuery = "%ED%95%9C%EC%9A%94%ED%95%9C%20%EB%AF%BC%EB%93%A4%EB%A0%88" },
    @{ title = "Why_You_Look_Sad_Search"; encodedQuery = "%EC%99%9C%20%EC%8A%AC%ED%8D%BC%20%EB%B3%B4%EC%97%AC" },
    @{ title = "Babe_Hyuna"; encodedQuery = "%ED%98%84%EC%95%84%20BABE" },
    @{ title = "ChauChau_DeliSpice"; encodedQuery = "%EB%8D%B8%EB%A6%AC%EC%8A%A4%ED%8C%8C%EC%9D%B4%EC%8A%A4%20%EC%B1%A4%EC%9A%B0%EC%B1%A4%EC%9A%B0" }
)

$results = @()
foreach ($song in $songs) {
    $encoded = $song.encodedQuery
    # Limit 5 to see multiple options for Why You Look Sad
    $limit = if ($song.title -eq "Why_You_Look_Sad_Search") { 5 } else { 1 }
    $url = "https://itunes.apple.com/search?term=$encoded&media=music&limit=$limit&country=KR"
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $res = Invoke-RestMethod -Uri $url -Method Get
        if ($res.resultCount -gt 0) {
            foreach ($track in $res.results) {
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
[System.IO.File]::WriteAllText("c:\Users\kyh08\Desktop\musicismylife\scratch\retry_results.json", $json, [System.Text.Encoding]::UTF8)
