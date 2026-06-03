# Enable TLS 1.2 explicitly for PowerShell 5.1
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

try {
    $res = Invoke-RestMethod -Uri "https://itunes.apple.com/search?term=Jannabi&limit=1&country=KR" -Headers $headers -TimeoutSec 10
    Write-Host "SUCCESS!"
    $res.results[0] | ConvertTo-Json | Write-Host
} catch {
    Write-Host "FAILED: $_"
}
