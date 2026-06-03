$res = Invoke-RestMethod -Uri 'https://api.deezer.com/search?q=bts'
$res.data[0] | ConvertTo-Json -Depth 5
