[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
function Get-ArchiveFiles($id) {
    try {
        $url = "https://archive.org/metadata/$id"
        $json = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content | ConvertFrom-Json
        $mp3s = $json.files | Where-Object { $_.name -like "*.mp3" }
        Write-Host "Item: $id -> $($mp3s.Count) MP3s"
        foreach ($f in $mp3s | Select-Object -First 5) {
            Write-Host "   https://archive.org/download/$id/$($f.name)"
        }
    } catch {
        Write-Host "Error for ${id}: $($_.Exception.Message)"
    }
}

Get-ArchiveFiles "jamendo-632009"
Get-ArchiveFiles "jamendo-251002"
Get-ArchiveFiles "reggaetontxl4-djgrimey"
