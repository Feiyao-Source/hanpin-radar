Set-Location -LiteralPath $PSScriptRoot
Write-Host "招聘雷达已启动：http://localhost:8080" -ForegroundColor Green
node server.js
