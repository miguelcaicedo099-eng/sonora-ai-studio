[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$audioDir = Join-Path $PSScriptRoot "audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir | Out-Null
}

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

# Move test.mp3 to audio/cristiana-1.mp3 if it exists
$testFile = Join-Path $PSScriptRoot "test.mp3"
$targetC1 = Join-Path $audioDir "cristiana-1.mp3"
if ((Test-Path $testFile) -and (-not (Test-Path $targetC1))) {
    Move-Item $testFile $targetC1 -Force
    Write-Host "Moved test.mp3 -> audio/cristiana-1.mp3"
}

$downloads = @(
    @{
        url = "https://archive.org/download/BCWSE/Amazing%20Love.mp3"
        dest = Join-Path $audioDir "cristiana-2.mp3"
        name = "Cristiana 2 (Amazing Love)"
    },
    @{
        url = "https://archive.org/download/BCWSE/Break%20Every%20Chain.mp3"
        dest = Join-Path $audioDir "cristiana-3.mp3"
        name = "Cristiana 3 (Break Every Chain)"
    },
    @{
        url = "https://archive.org/download/reggaetontxl4-djgrimey/01.%20Menor%20Menor%20Feat.%20Farruko%20-%20Muevete.mp3"
        dest = Join-Path $audioDir "reggaeton-1.mp3"
        name = "Reggaeton 1 (Farruko - Muevete)"
    },
    @{
        url = "https://archive.org/download/reggaetontxl4-djgrimey/04.%20Tropkillaz%20Feat.%20J%20Balvin%2C%20Anitta%20%26%20MC%20Zaac%20-%20Bola%20Rebola.mp3"
        dest = Join-Path $audioDir "reggaeton-2.mp3"
        name = "Reggaeton 2 (J Balvin - Bola Rebola)"
    }
)

foreach ($item in $downloads) {
    if (-not (Test-Path $item.dest)) {
        Write-Host "Downloading $($item.name)..."
        try {
            $wc.DownloadFile($item.url, $item.dest)
            $size = (Get-Item $item.dest).Length
            Write-Host "   Done: $size bytes"
        } catch {
            Write-Host "   Failed: $($_.Exception.Message)"
        }
    } else {
        Write-Host "Already exists: $($item.name)"
    }
}
