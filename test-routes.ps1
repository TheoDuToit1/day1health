# Test Directory Routing Implementation
# Run this script to verify all routes are working correctly

Write-Host "🧪 Testing Directory Routing Implementation" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if dev server is running
$devServerRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
    $devServerRunning = $true
} catch {
    $devServerRunning = $false
}

if (-not $devServerRunning) {
    Write-Host "❌ Dev server not running!" -ForegroundColor Red
    Write-Host "Please start the dev server first:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✅ Dev server is running" -ForegroundColor Green
Write-Host ""

# Test routes
$routes = @(
    @{
        Name = "Directory Landing"
        Url = "http://localhost:3000/directory"
        Expected = 200
    },
    @{
        Name = "Directory with Slug"
        Url = "http://localhost:3000/directory/dr-test-provider"
        Expected = 200
    },
    @{
        Name = "Invalid Slug (404)"
        Url = "http://localhost:3000/directory/nonexistent-provider-xyz"
        Expected = 200  # SPA returns 200, shows 404 UI
    },
    @{
        Name = "Sitemap Index"
        Url = "http://localhost:3000/api/sitemap-index"
        Expected = 200
    },
    @{
        Name = "Main Sitemap"
        Url = "http://localhost:3000/api/generate-sitemap"
        Expected = 200
    },
    @{
        Name = "Directory Sitemap"
        Url = "http://localhost:3000/api/sitemap-directory"
        Expected = 200
    }
)

Write-Host "Testing Routes:" -ForegroundColor Cyan
Write-Host "---------------" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

foreach ($route in $routes) {
    Write-Host "Testing: $($route.Name)" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $route.Url -Method Get -TimeoutSec 5 -ErrorAction Stop
        
        if ($response.StatusCode -eq $route.Expected) {
            Write-Host " ✅" -ForegroundColor Green
            $passed++
        } else {
            Write-Host " ❌ (Expected $($route.Expected), got $($response.StatusCode))" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host " ❌ (Error: $($_.Exception.Message))" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:3000/directory in your browser" -ForegroundColor White
    Write-Host "2. Click on a provider card" -ForegroundColor White
    Write-Host "3. Verify the URL changes to /directory/{slug}" -ForegroundColor White
    Write-Host "4. Refresh the page - profile should stay open" -ForegroundColor White
    Write-Host "5. Click back button - should return to /directory" -ForegroundColor White
    Write-Host "6. Check sitemap: http://localhost:3000/api/sitemap-directory" -ForegroundColor White
} else {
    Write-Host "⚠️  Some tests failed. Please check the errors above." -ForegroundColor Yellow
}

Write-Host ""
