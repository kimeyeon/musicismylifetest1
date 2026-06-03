$wc = New-Object System.Net.WebClient
$wc.Encoding = [System.Text.Encoding]::UTF8
try {
    $res = $wc.DownloadString('https://api.deezer.com/search?q=artist:%22fromis_9%22%20track:%22Stay%20This%20Way%22')
    Write-Host "SUCCESS!"
    $res | Write-Host
} catch {
    Write-Host "FAILED: $_"
}
