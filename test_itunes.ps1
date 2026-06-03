$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Accept" = "application/json, text/plain, */*"
    "Accept-Language" = "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
    "Origin" = "https://www.apple.com"
    "Referer" = "https://www.apple.com/"
}

try {
    $res = Invoke-RestMethod -Uri "https://itunes.apple.com/search?term=Jannabi&limit=1&country=KR" -Headers $headers -TimeoutSec 10
    Write-Host "SUCCESS!"
    $res | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host "FAILED: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Response Body: $body"
    }
}
