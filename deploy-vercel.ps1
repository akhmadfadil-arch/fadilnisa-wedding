param(
  [string]$ProjectDir = "."
)

Write-Host "Deploying project from $ProjectDir to Vercel..."

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Write-Warning "`n'npx' not found. Please install Node.js (which includes npm/npx), or install the Vercel CLI globally with:`n  npm i -g vercel`n" -ForegroundColor Yellow
}

Push-Location $ProjectDir
try {
  & npx vercel --prod --confirm
} catch {
  Write-Error "Deployment failed. Ensure Node.js is installed and you are logged in to Vercel (run 'npx vercel login' first).`nError: $_"
  Pop-Location
  exit 1
}
Pop-Location

Write-Host "Deployment command finished. Check the output above for the deployment URL."
