# Script PowerShell to create PostgreSQL database for PBL6
# Requirement: PostgreSQL must be installed and running

param(
    [string]$PostgreSQLPath = "C:\Program Files\PostgreSQL\15\bin",
    [string]$DBHost = "localhost",
    [string]$DBPort = "5432",
    [string]$DBUsername = "postgres",
    [string]$DBPassword = "123456"
)

Write-Host "[INFO] Looking for PostgreSQL..." -ForegroundColor Yellow

# List of possible PostgreSQL paths
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin",
    "C:\Program Files\PostgreSQL\13\bin",
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files (x86)\PostgreSQL\15\bin",
    "C:\Program Files (x86)\PostgreSQL\14\bin"
)

$psqlPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path "$path\psql.exe") {
        $psqlPath = "$path\psql.exe"
        Write-Host "[SUCCESS] Found PostgreSQL at: $path" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "[ERROR] PostgreSQL not found. Please:" -ForegroundColor Red
    Write-Host "   1. Install PostgreSQL from https://www.postgresql.org/download/" -ForegroundColor Red
    Write-Host "   2. Or specify correct path using -PostgreSQLPath parameter" -ForegroundColor Red
    exit 1
}

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $DBPassword

try {
    Write-Host "[INFO] Creating database ql_htqt..." -ForegroundColor Yellow
    
    # Test PostgreSQL connection
    $testConnection = & $psqlPath -h $DBHost -p $DBPort -U $DBUsername -d postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Cannot connect to PostgreSQL:" -ForegroundColor Red
        Write-Host $testConnection -ForegroundColor Red
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "   - PostgreSQL service is running" -ForegroundColor Yellow
        Write-Host "   - Connection info (host: $DBHost, port: $DBPort, user: $DBUsername)" -ForegroundColor Yellow
        Write-Host "   - PostgreSQL password" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "[SUCCESS] PostgreSQL connection successful" -ForegroundColor Green
    
    # Check if database already exists
    $checkDb = & $psqlPath -h $DBHost -p $DBPort -U $DBUsername -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname='ql_htqt';" 2>&1
    
    if ($checkDb -match "1") {
        Write-Host "[WARNING] Database ql_htqt already exists" -ForegroundColor Yellow
        $confirm = Read-Host "Do you want to drop and recreate the database? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host "[INFO] Dropping existing database..." -ForegroundColor Yellow
            & $psqlPath -h $DBHost -p $DBPort -U $DBUsername -d postgres -c "DROP DATABASE IF EXISTS ql_htqt;" 2>&1
        } else {
            Write-Host "[SUCCESS] Using existing database" -ForegroundColor Green
            exit 0
        }
    }
    
    # Create new database
    Write-Host "[INFO] Creating new database..." -ForegroundColor Yellow
    $createResult = & $psqlPath -h $DBHost -p $DBPort -U $DBUsername -d postgres -f "scripts\create-database.sql" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Database ql_htqt created successfully!" -ForegroundColor Green
        Write-Host "Connection info:" -ForegroundColor Cyan
        Write-Host "   Host: $DBHost" -ForegroundColor White
        Write-Host "   Port: $DBPort" -ForegroundColor White
        Write-Host "   Database: ql_htqt" -ForegroundColor White
        Write-Host "   Username: $DBUsername" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now run: npm run start:dev" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to create database:" -ForegroundColor Red
        Write-Host $createResult -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "[ERROR] Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Note: If you encounter connection errors, check:" -ForegroundColor Yellow
Write-Host "   - PostgreSQL service is running" -ForegroundColor White
Write-Host "   - pg_hba.conf allows local connections" -ForegroundColor White
Write-Host "   - Firewall is not blocking port 5432" -ForegroundColor White