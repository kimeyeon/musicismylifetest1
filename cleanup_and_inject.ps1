# PowerShell script to clean up tags in app.js and inject seasonal songs
$filePath = "app.js"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Split the file at '{ id:''m51''' (this is purely ASCII to avoid encoding issues)
$splitMarker = "{ id:'m51'"
$parts = $content.Split(@($splitMarker), [System.StringSplitOptions]::None)

if ($parts.Length -ne 2) {
    Write-Error "Failed to split app.js using marker: $splitMarker"
    exit 1
}

$part1 = $parts[0]
$part2 = $splitMarker + $parts[1]

# 2. Perform string replacements on Part 1 to remove old seasonal tags
$part1 = $part1.Replace("'season','season-fall','season-winter',", "")
$part1 = $part1.Replace("'season','season-winter','season-fall',", "")
$part1 = $part1.Replace("'season','season-summer',", "")
$part1 = $part1.Replace("'season','season-fall',", "")
$part1 = $part1.Replace("'season','season-winter',", "")

# 3. Format fetched songs as JavaScript object literals
$fetchedSongs = Get-Content -Raw -Path "scratch/fetched_seasons.json" -Encoding utf8 | ConvertFrom-Json
$jsSongsList = [System.Collections.Generic.List[string]]::new()

foreach ($song in $fetchedSongs) {
    $t = $song.title.Replace("'", "\'")
    $a = $song.artist.Replace("'", "\'")
    $img = $song.imgUrl.Replace("'", "\'")
    $prev = $song.previewUrl.Replace("'", "\'")
    $tagsStr = "['" + ($song.tags -join "','") + "']"

    $jsSong = "    { id:'$($song.id)', title:'$t', artist:'$a',`r`n" +
              "      tags:$tagsStr,`r`n" +
              "      imgUrl:'$img',`r`n" +
              "      previewUrl:'$prev',`r`n" +
              "      likes:$($song.likes) }"
    
    $jsSongsList.Add($jsSong)
}

$jsSongsBlock = $jsSongsList -join ",`r`n`r`n"

# 4. Inject the new songs block at the end of musicData in Part 2
# In Part 2, the end of the array is the first occurrence of "];"
$targetSearch = "      likes:6100 },`r`n];"
# Try LF line endings just in case
if (-not $part2.Contains($targetSearch)) {
    $targetSearch = "      likes:6100 },`n];"
}

if (-not $part2.Contains($targetSearch)) {
    # Fallback to search just "likes:6100 }," followed by "];"
    Write-Host "Target search string not found, attempting generic find..."
    $idx = $part2.IndexOf("];")
    if ($idx -lt 0) {
        Write-Error "Failed to find closing '];' of musicData in Part 2"
        exit 1
    }
    $part2Before = $part2.Substring(0, $idx)
    $part2After = $part2.Substring($idx)
    
    $part2 = $part2Before + ",`r`n`r`n" + $jsSongsBlock + "`r`n" + $part2After
} else {
    $targetReplace = "      likes:6100 },`r`n`r`n" + $jsSongsBlock + "`r`n];"
    $part2 = $part2.Replace($targetSearch, $targetReplace)
}

# 5. Reconstruct the file and save
$finalContent = $part1 + $part2
[System.IO.File]::WriteAllText($filePath, $finalContent, [System.Text.Encoding]::UTF8)

Write-Host "Successfully cleaned up old tags and injected 90 new seasonal songs!"
