# SONORA AI - Zero-Dependency Local Web Server
$port = 3000
$url = "http://localhost:$port/"
$folder = $PSScriptRoot

Write-Host "=========================================" -ForegroundColor Magenta
Write-Host "       SONORA AI - MUSIC STUDIO          " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host "Iniciando servidor local en: $url" -ForegroundColor Green
Write-Host "Directorio: $folder" -ForegroundColor Yellow
Write-Host "Presione Ctrl+C para detener el servidor" -ForegroundColor DarkGray
Write-Host "=========================================" -ForegroundColor Magenta

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Start-Process $url

try {
    while ($listener.IsListening) {
        $response = $null
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "*")
            $response.Headers.Add("Accept-Ranges", "bytes")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 204
                $response.Close()
                continue
            }

            $path = $request.Url.LocalPath
            if ($path -eq "/" -or [string]::IsNullOrEmpty($path)) {
                $path = "/index.html"
            }

            $cleanRelPath = $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $localPath = [System.IO.Path]::Combine($folder, $cleanRelPath)

            if ([System.IO.File]::Exists($localPath)) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".wav"  { "audio/wav" }
                    ".mp3"  { "audio/mpeg" }
                    ".ogg"  { "audio/ogg" }
                    ".m4a"  { "audio/mp4" }
                    Default { "application/octet-stream" }
                }

                $fileInfo = New-Object System.IO.FileInfo($localPath)
                $totalLength = $fileInfo.Length
                $response.ContentType = $mime

                $range = $request.Headers["Range"]
                if ($range -and ($range -match "bytes=(\d+)-(\d*)")) {
                    $start = [int64]$matches[1]
                    $end = if ($matches[2]) { [int64]$matches[2] } else { $totalLength - 1 }
                    if ($end -ge $totalLength) { $end = $totalLength - 1 }
                    $len = $end - $start + 1

                    $response.StatusCode = 206
                    $response.Headers.Add("Content-Range", "bytes $start-$end/$totalLength")
                    $response.ContentLength64 = $len

                    if ($request.HttpMethod -ne "HEAD") {
                        $fs = [System.IO.File]::OpenRead($localPath)
                        try {
                            $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                            $buf = New-Object byte[] 65536
                            $rem = $len
                            while ($rem -gt 0) {
                                $toRead = [Math]::Min($buf.Length, [int]$rem)
                                $read = $fs.Read($buf, 0, $toRead)
                                if ($read -le 0) { break }
                                $response.OutputStream.Write($buf, 0, $read)
                                $rem -= $read
                            }
                        } finally {
                            $fs.Dispose()
                        }
                    }
                } else {
                    $response.StatusCode = 200
                    $response.ContentLength64 = $totalLength

                    if ($request.HttpMethod -ne "HEAD") {
                        $bytes = [System.IO.File]::ReadAllBytes($localPath)
                        $response.OutputStream.Write($bytes, 0, $bytes.Length)
                    }
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $response.Close()
        } catch {
            try { if ($response) { $response.Close() } } catch {}
        }
    }
} finally {
    $listener.Stop()
}
