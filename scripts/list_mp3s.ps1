[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$html = (Invoke-WebRequest -Uri "https://archive.org/download/BCWSE/" -UseBasicParsing).Content
$pattern = 'href="([^"]+\.mp3)"'
$matches = [regex]::Matches($html, $pattern)
foreach ($m in $matches | Select-Object -First 30) {
    Write-Host $m.Groups[1].Value
}
