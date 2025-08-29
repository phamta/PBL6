# PowerShell script to perform MOU migration
$apiUrl = "http://localhost:3001/api/v1"

try {
    # Login and get token
    Write-Host "Logging in..."
    $loginBody = @{
        email = "@university.edu.vn"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "Login successful! Token: $($token.Substring(0,20))..."

    # Prepare headers with token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    # Perform migration
    Write-Host "Performing enum migration..."
    $migrationResponse = Invoke-RestMethod -Uri "$apiUrl/mou-migration/fix-enum" -Method POST -Headers $headers
    Write-Host "Migration completed!"
    Write-Host "Migration result:"
    $migrationResponse | ConvertTo-Json -Depth 3 | Write-Host

} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error details: $responseBody"
    }
}
