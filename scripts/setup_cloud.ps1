# ==============================================================================
# SONORA AI - Cloud Automation Script (GitHub, Vercel & Supabase)
# ==============================================================================
param(
    [string]$GitHubToken = "",
    [string]$VercelToken = "",
    [string]$SupabaseToken = "",
    [string]$SupabaseUrl = "",
    [string]$SupabaseAnonKey = "",
    [string]$SupabaseServiceKey = "",
    [string]$RepoName = "sonora-ai-studio"
)

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "   SONORA AI - CLOUD AUTOMATION MANAGER   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Magenta

# 1. GITHUB INTEGRATION
if ($GitHubToken) {
    Write-Host "`n[1/3] Conectando GitHub con Token..." -ForegroundColor Yellow
    $GitHubToken | gh auth login --with-token
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Autenticacion en GitHub exitosa." -ForegroundColor Green
        gh auth status
        
        # Check if remote already exists
        $hasRemote = git remote get-url origin 2>$null
        if (-not $hasRemote) {
            Write-Host "Creando repositorio remoto en GitHub: $RepoName..." -ForegroundColor Cyan
            gh repo create $RepoName --public --source=. --remote=origin --push
        } else {
            Write-Host "Remoto origin ya configurado. Empujando cambios..." -ForegroundColor Cyan
            git push -u origin main
        }
    } else {
        Write-Host "Error al autenticar en GitHub." -ForegroundColor Red
    }
} else {
    Write-Host "`n[1/3] GitHub Token no proporcionado. Verificando estado actual..." -ForegroundColor DarkYellow
    gh auth status
}

# 2. VERCEL INTEGRATION
if ($VercelToken) {
    Write-Host "`n[2/3] Conectando Vercel con Token..." -ForegroundColor Yellow
    vercel.cmd whoami --token $VercelToken
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Desplegando en Vercel Produccion..." -ForegroundColor Green
        vercel.cmd --prod --yes --token $VercelToken
    } else {
        Write-Host "Error con el token de Vercel." -ForegroundColor Red
    }
} else {
    Write-Host "`n[2/3] Vercel Token no proporcionado. Verificando estado actual..." -ForegroundColor DarkYellow
    vercel.cmd whoami
}

# 3. SUPABASE INTEGRATION
if ($SupabaseUrl -and $SupabaseAnonKey) {
    Write-Host "`n[3/3] Guardando credenciales de Supabase en .env..." -ForegroundColor Yellow
    $envContent = @"
SUPABASE_URL=$SupabaseUrl
SUPABASE_ANON_KEY=$SupabaseAnonKey
SUPABASE_SERVICE_ROLE_KEY=$SupabaseServiceKey
"@
    Set-Content -Path .env -Value $envContent -Encoding UTF8
    Write-Host ".env configurado correctamente con Supabase." -ForegroundColor Green
}

if ($SupabaseToken) {
    Write-Host "Autenticando Supabase CLI..." -ForegroundColor Yellow
    supabase.cmd login --token $SupabaseToken
}

Write-Host "`n==========================================" -ForegroundColor Magenta
Write-Host "Proceso completado." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Magenta
