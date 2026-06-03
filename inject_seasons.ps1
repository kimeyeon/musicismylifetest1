# UTF-8 인코딩 설정
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$appJsPath = "app.js"
$fixedJsonPath = "scratch/all_seasons_fixed.json"

Write-Host "Loading data..."
$appJsContent = Get-Content -Raw -Encoding UTF8 $appJsPath
$songs = Get-Content -Raw -Encoding UTF8 $fixedJsonPath | ConvertFrom-Json

# 자바스크립트 포맷으로 90곡 직렬화
Write-Host "Formatting JavaScript objects..."
$formattedJsList = @()
foreach ($song in $songs) {
    # 싱글 쿼테이션(') 에스케이프 처리
    $escapedTitle = $song.title -replace "'", "\'"
    $escapedArtist = $song.artist -replace "'", "\'"
    $escapedImgUrl = $song.imgUrl -replace "'", "\'"
    $escapedPreviewUrl = $song.previewUrl -replace "'", "\'"
    
    $tagStr = "['season','season-$($song.tags[1] -replace 'season-', '')']"
    
    $jsObj = "    { id:'$($song.id)', title:'$escapedTitle', artist:'$escapedArtist',`n" +
             "      tags:$tagStr,`n" +
             "      imgUrl:'$escapedImgUrl',`n" +
             "      previewUrl:'$escapedPreviewUrl',`n" +
             "      likes:$($song.likes) }"
             
    $formattedJsList += $jsObj
}

$newJsContent = $formattedJsList -join ",`n`n"

# app.js에서 m81의 시작 부분과 m170의 끝 부분을 찾아서 치환
# regex를 써서 안전하게 치환합니다.
# m81 시작 패턴: \{ id:'m81', title: ...
# m170 끝 패턴: likes:\d+ \}\r?\n?\];
Write-Host "Injecting into app.js..."

$pattern = "(?s)    \{ id:'m81',.*?likes:\d+ \}\r?\n?\];"
$replacement = "$newJsContent`n];"

if ($appJsContent -match $pattern) {
    $updatedAppJs = $appJsContent -replace $pattern, $replacement
    [System.IO.File]::WriteAllText($appJsPath, $updatedAppJs, [System.Text.Encoding]::UTF8)
    Write-Host "Injection successful! app.js updated."
} else {
    Write-Host "Error: Pattern for m81-m170 injection not found in app.js!"
}
