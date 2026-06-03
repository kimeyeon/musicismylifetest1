$path = "c:\Users\kyh08\Desktop\musicismylife\app.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$newContent = $content.Replace("'season-spring'", "'season-spring-old'")
[System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully replaced season-spring tags"
