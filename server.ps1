# WEDDING PLANNER PRO - LOCAL SERVER (POWERSHELL)
$port = 5500
$url = "http://localhost:$port"

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host " 💍 WEDDING PLANNER PRO - WEB SERVER LOKAL" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "  👉 Portal Customer : $url" -ForegroundColor Green
Write-Host "  👉 Portal Admin    : $url/admin.html" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "Tekan CTRL + C di terminal ini untuk menghentikan server.`n" -ForegroundColor Gray

# Open default browser
Start-Process $url

# Simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath) -or $localPath -eq '/') {
            $localPath = "index.html"
        }

        $filePath = Join-Path $PSScriptRoot $localPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
