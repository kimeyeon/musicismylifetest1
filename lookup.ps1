[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
foreach ($c in @('US', 'TW', 'CN', 'HK', 'SG', 'KR')) {
    $url = "https://itunes.apple.com/lookup?id=1501170701&entity=song&country=$c"
    try {
        $res = Invoke-RestMethod -Uri $url -Method Get
        if ($res.resultCount -gt 0) {
            Write-Output "Found in country: $c"
            $res.results | ConvertTo-Json -Depth 5
            break
        }
    } catch {
        # Ignore error
    }
}
