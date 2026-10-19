[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$audioDir = Join-Path $PSScriptRoot "audio"
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

$more = @(
    @{
        url = "https://archive.org/download/BCWSE/Awesome%20God.mp3"
        dest = Join-Path $audioDir "cristiana-4.mp3"
    },
    @{
        url = "https://archive.org/download/jamendo-632009/01-2315638-nikproteus-vida%20reggaeton.mp3"
        dest = Join-Path $audioDir "reggaeton-3.mp3"
    }
)

foreach ($item in $more) {
    if (-not (Test-Path $item.dest)) {
        try {
            $wc.DownloadFile($item.url, $item.dest)
            Write-Host "Downloaded $($item.dest)"
        } catch {
            Write-Host "Failed: $($_.Exception.Message)"
        }
    }
}
