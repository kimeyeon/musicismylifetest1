$filePath = "app.js"
$content = [System.IO.File]::ReadAllText($filePath)

# Literal string replacements
$content = $content.Replace("tags:['season','season-spring-old','season-summer',", "tags:['season','season-summer',")
$content = $content.Replace("tags:['season','season-spring-old','time',", "tags:['time',")

[System.IO.File]::WriteAllText($filePath, $content)
Write-Output "Cleanup completed successfully!"
