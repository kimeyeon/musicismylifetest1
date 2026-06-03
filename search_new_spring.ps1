$songs = @(
    @{ title = "Joyful_Life_LeeKwangCho"; encodedQuery = "%EC%A6%90%EA%B1%B0%EC%9A%B4%20%EC%9D%B8%EC%83%9D%20%EC%9D%B4%EA%B4%91%EC%A1%B0" },
    @{ title = "Flower_JohnnyStimson"; encodedQuery = "Johnny%20Stimson%20Flower" },
    @{ title = "ChauChau_Jannabi"; encodedQuery = "%EC%B1%A4%EC%9A%B0%EC%B1%A4%EC%9A%B0%20%EC%9E%94%EB%82%98%EB%B9%84" },
    @{ title = "ILoveYouSo_Delorians"; encodedQuery = "Delorians%20I%20Love%20You%20So" },
    @{ title = "DoYourThingBabe_MichaelFranks"; encodedQuery = "Michael%20Franks%20Do%20Your%20Thing%20Babe" },
    @{ title = "Tomboy_Hyukoh"; encodedQuery = "HYUKOH%20Tomboy" },
    @{ title = "WiIngWiIng_Hyukoh"; encodedQuery = "%EC%9C%84%EC%9E%89%EC%9C%84%EC%9E%89%20%ED%98%81%EC%98%A4" },
    @{ title = "ParisInTheRain_Lauv"; encodedQuery = "Lauv%20Paris%20in%20the%20Rain" },
    @{ title = "EverySummertime_Niki"; encodedQuery = "NIKI%20Every%20Summertime" },
    @{ title = "FallingForU_Peachy"; encodedQuery = "Peachy%20Falling%20for%20U" },
    @{ title = "Sunflower_RexOrangeCounty"; encodedQuery = "Rex%20Orange%20County%20Sunflower" },
    @{ title = "Beautiful_Crush"; encodedQuery = "%ED%81%AC%EB%9F%AC%EC%89%AC%20Beautiful" },
    @{ title = "Lavender_Dept"; encodedQuery = "Dept%20Lavender" },
    @{ title = "GiveYouTheUniverse_Bolbbalgan4"; encodedQuery = "%EC%9A%B0%EC%A3%BC%EB%A5%BC%20%EC%A5%B4%EA%B2%8C%20%EB%B3%BC%EB%B9%A8%EA%B0%84%EC%82%AC%EC%B6%98%EA%B8%B0" },
    @{ title = "Yacht_JayPark"; encodedQuery = "Jay%20Park%20Yacht" },
    @{ title = "PeachEyes_WaveToEarth"; encodedQuery = "Wave%20to%20Earth%20Peach%20Eyes" },
    @{ title = "Seasons_WaveToEarth"; encodedQuery = "Wave%20to%20Earth%20Seasons" },
    @{ title = "LoverBoy_PhumViphurit"; encodedQuery = "Phum%20Viphurit%20Lover%20Boy" },
    @{ title = "Daisy_WaveToEarth"; encodedQuery = "Wave%20to%20Earth%20Daisy" }
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
            # Try US store search as fallback
            $urlUS = "https://itunes.apple.com/search?term=$encoded&media=music&limit=1&country=US"
            $resUS = Invoke-RestMethod -Uri $urlUS -Method Get
            if ($resUS.resultCount -gt 0) {
                $track = $resUS.results[0]
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
[System.IO.File]::WriteAllText("c:\Users\kyh08\Desktop\musicismylife\scratch\new_spring_results.json", $json, [System.Text.Encoding]::UTF8)
