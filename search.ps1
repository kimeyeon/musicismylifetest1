$songs = @(
    @{ title = "Spring_Flower_Ending"; encodedQuery = "%EB%B2%9A%EA%BD%83%EC%97%94%EB%94%A9%20%EB%B2%84%EC%8A%A4%EC%BB%A4%20%EB%B2%84%EC%8A%A4%EC%BB%A4" },
    @{ title = "Electric_Love"; encodedQuery = "Electric%20Love%20BORNS" },
    @{ title = "Joyful_Life"; encodedQuery = "%EC%A6%90%EA%B1%B0%EC%9A%B4%20%EC%9D%B8%EC%83%9D%20%EB%94%94%ED%95%B5" },
    @{ title = "work_shit_sleep"; encodedQuery = "work%20shit%20sleep%20jisokuryClub" },
    @{ title = "Dandelion"; encodedQuery = "%EB%AF%BC%EB%93%A4%EB%A0%88%20%ED%95%9C%EC%9A%94%ED%95%9C" },
    @{ title = "Late_Spring"; encodedQuery = "%EB%82%9C%EC%B5%98%20%EC%83%88%EC%86%8C%EB%85%84" },
    @{ title = "love_affair"; encodedQuery = "love%20affair%20UMI" },
    @{ title = "cant_take_my_eyes_off_you"; encodedQuery = "can't%20take%20my%20eyes%20off%20you%20Frankie%20Valli" },
    @{ title = "flower"; encodedQuery = "flower%20%EC%A7%80%EC%88%98%20JISOO" },
    @{ title = "why_you_look_sad"; encodedQuery = "%EC%99%9C%20%EC%8A%AC%ED%8D%BC%20%EB%B3%B4%EC%97%AC%20%EC%97%B0%EA%B7%9C%EC%84%B1" },
    @{ title = "Hear_Your_Voice"; encodedQuery = "%EB%84%88%EC%9D%9D%20%EB%AA%A9%EC%86%8C%EB%A6%AC%EA%B0%80%20%EB%93%A4%EB%A0%A4%20%EB%8D%B8%EB%A6%AC%EC%8A%A4%ED%8C%8C%EC%9D%B4%EC%8A%A4" },
    @{ title = "i_love_you_so"; encodedQuery = "i%20love%20you%20so%20The%20Walters" },
    @{ title = "Spring_Breeze"; encodedQuery = "%EB%B4%84%EB%B0%94%EB%9E%8C%20%EC%9D%B4%EB%AC%B8%EC%84%B8" },
    @{ title = "Jannabi_Hot_Summer_Night"; encodedQuery = "%EB%9C%A8%EA%B1%B0%EC%9A%B4%20%EC%97%AC%EB%A6%84%EB%B0%A4%EC%9D%80%20%EA%B0%80%EA%B3%A0%20%EB%82%A8%EC%9D%80%EA%B1%B4%20%EB%B3%BC%ED%92%88%20%EC%97%86%EC%A7%80%EB%A7%8C%20%EC%9E%94%EB%82%98%EB%B9%84" },
    @{ title = "do_your_thing"; encodedQuery = "do%20your%20thing%20guesthouse" },
    @{ title = "babe"; encodedQuery = "babe%20%ED%98%84%EC%95%84" },
    @{ title = "Leather_Jacket"; encodedQuery = "%EA%B0%80%EC%A3%BD%EC%9E%90%EC%BC%93%20%ED%98%81%EC%98%A4" }
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
[System.IO.File]::WriteAllText("c:\Users\kyh08\Desktop\musicismylife\scratch\search_results.json", $json, [System.Text.Encoding]::UTF8)
