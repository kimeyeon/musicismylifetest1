# UTF-8 인코딩 설정
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 파일 경로
$seasonsPath = "scratch/seasons_list.json"
$songsPath = "scratch/songs_list.json"
$outputPath = "scratch/all_seasons_fixed.json"
$logPath = "scratch/fetch_log.txt"
$tempFile = "scratch/temp_res_safe.json"

# 로그 함수
function Write-Log($msg) {
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $formattedMsg = "[$time] $msg"
    Write-Host $formattedMsg
    Add-Content -Path $logPath -Value $formattedMsg -Encoding UTF8
}

# 헬퍼 함수: 곡 메타데이터 검색 및 파싱
function Get-MusicMetadata($queryText, $isDeezer) {
    $result = @{
        success = $false
        title = ""
        artist = ""
        imgUrl = ""
        previewUrl = ""
        source = ""
    }
    
    if (Test-Path $tempFile) { Remove-Item $tempFile }
    
    $escaped = [System.Net.WebUtility]::UrlEncode($queryText)
    
    if ($isDeezer) {
        $url = "https://api.deezer.com/search?q=$escaped&limit=1"
        Write-Log "Deezer Request: $queryText"
        & curl.exe -s -m 10 -o $tempFile $url
    } else {
        $url = "https://itunes.apple.com/search?term=$escaped&media=music&limit=1&country=KR"
        Write-Log "iTunes Request: $queryText"
        & curl.exe -s -m 10 -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -o $tempFile $url
    }
    
    if (-not (Test-Path $tempFile)) {
        return $result
    }
    
    $raw = Get-Content -Raw -Encoding UTF8 $tempFile
    if (-not $raw) {
        return $result
    }
    if ($raw -like "*403 Forbidden*" -or $raw -like "*Access Denied*" -or $raw.Trim().Length -eq 0) {
        return $result
    }
    
    $json = $raw | ConvertFrom-Json -ErrorAction SilentlyContinue
    if (-not $json) {
        return $result
    }
    
    if ($isDeezer) {
        if ($json.data -and $json.data.Count -gt 0) {
            $track = $json.data[0]
            $result.success = $true
            $result.title = $track.title
            $result.artist = $track.artist.name
            $md5 = $track.md5_image
            $result.imgUrl = "https://e-cdns-images.dzcdn.net/images/cover/$md5/500x500-000000-80-0-0.jpg"
            $result.previewUrl = $track.preview
            $result.source = "Deezer"
        }
    } else {
        if ($json.resultCount -gt 0) {
            $track = $json.results[0]
            $result.success = $true
            $result.title = $track.trackName
            $result.artist = $track.artistName
            $result.imgUrl = $track.artworkUrl100 -replace "100x100bb.jpg", "600x600bb.jpg"
            $result.previewUrl = $track.previewUrl
            $result.source = "iTunes"
        }
    }
    
    return $result
}

# 기존 로그 초기화
if (Test-Path $logPath) { Remove-Item $logPath }
Write-Log "Starting flat-structured music metadata fetch (v6)..."

# JSON 로드
$seasons = Get-Content -Raw -Encoding UTF8 $seasonsPath | ConvertFrom-Json
$songs = Get-Content -Raw -Encoding UTF8 $songsPath | ConvertFrom-Json

# 여름, 가을, 겨울 순차적 병합 리스트 생성
$allSeasonsList = @()
foreach ($track in $seasons.summer) {
    $track | Add-Member -NotePropertyName "season" -NotePropertyValue "summer"
    $allSeasonsList += $track
}
foreach ($track in $seasons.fall) {
    $track | Add-Member -NotePropertyName "season" -NotePropertyValue "fall"
    $allSeasonsList += $track
}
foreach ($track in $seasons.winter) {
    $track | Add-Member -NotePropertyName "season" -NotePropertyValue "winter"
    $allSeasonsList += $track
}

$results = @()

# 메인 루프
for ($i = 0; $i -lt $songs.Count; $i++) {
    $songInfo = $songs[$i]
    $origInfo = $allSeasonsList[$i]
    
    $id = $songInfo.id
    $season = $songInfo.season
    $targetArtist = $origInfo.artist
    $targetTitle = $origInfo.title
    $fallbackQueryText = $songInfo.query -replace "\+", " "
    
    Write-Log "--------------------------------------------"
    Write-Log "[$($i+1)/90] Fetching ID: $id ($season) - $targetArtist - $targetTitle"
    
    $imgUrl = ""
    $previewUrl = ""
    $source = ""
    $title = $targetTitle
    $artist = $targetArtist
    
    # 1차 시도: iTunes API (원본 이름)
    $res = Get-MusicMetadata -queryText "$targetArtist $targetTitle" -isDeezer $false
    
    # 2차 시도: iTunes Fallback (영어 query)
    if (-not $res.success) {
        $res = Get-MusicMetadata -queryText $fallbackQueryText -isDeezer $false
    }
    
    # 3차 시도: Deezer API (원본 이름)
    if (-not $res.success) {
        $res = Get-MusicMetadata -queryText "$targetArtist $targetTitle" -isDeezer $true
    }
    
    # 4차 시도: Deezer Fallback (영어 query)
    if (-not $res.success) {
        $res = Get-MusicMetadata -queryText $fallbackQueryText -isDeezer $true
    }
    
    # 최종 결과 적용
    if ($res.success) {
        $imgUrl = $res.imgUrl
        $previewUrl = $res.previewUrl
        $source = $res.source
        $title = $res.title
        $artist = $res.artist
    } else {
        Write-Log "Warning: Fetch failed. Using fallback placeholders."
        $imgUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500"
        $previewUrl = ""
        $source = "None (Placeholder)"
    }
    
    # 객체 속성 지정
    $seasonTag = "season-$season"
    $songTags = "season", $seasonTag
    
    $obj = [PSCustomObject]@{
        id = $id
        title = $targetTitle
        artist = $targetArtist
        tags = $songTags
        imgUrl = $imgUrl
        previewUrl = $previewUrl
        likes = (Get-Random -Minimum 1000 -Maximum 9999)
        matchedTitle = $title
        matchedArtist = $artist
        source = $source
    }
    
    $results += $obj
    
    # 대기 시간 설정 (iTunes 차단 우회를 위해 기본 4초, Deezer 시 2초)
    if ($source -like "*Deezer*") {
        Start-Sleep -Seconds 2
    } else {
        Start-Sleep -Seconds 4
    }
}

# 임시 파일 정리
if (Test-Path $tempFile) { Remove-Item $tempFile }

Write-Log "Starting JSON Serialization..."

# JSON 저장 (안정적인 -InputObject 사용)
$jsonOutput = ConvertTo-Json -InputObject $results -Depth 5

# 방어 로직: 직렬화 실패 시 개별 직렬화 후 결합
if (-not $jsonOutput -or $jsonOutput.Trim().Length -le 3) {
    Write-Log "Global ConvertTo-Json failed or returned empty. Using fallback element-by-element serialization..."
    $jsonParts = @()
    foreach ($r in $results) {
        $part = ConvertTo-Json -InputObject $r -Depth 5
        $jsonParts += $part
    }
    $jsonOutput = "[" + ($jsonParts -join ",") + "]"
}

# 최종 쓰기
[System.IO.File]::WriteAllText($outputPath, $jsonOutput, [System.Text.Encoding]::UTF8)

Write-Log "Metadata fetch process completed! Total $($results.Count) songs saved to $outputPath"
