param(
    [string]$RepoName = "",
    [switch]$Private
)

# Usage examples:
# .\create_github_repo.ps1 -RepoName "my-wedding-repo"
# .\create_github_repo.ps1 -RepoName "my-wedding-repo" -Private

function Assert-Command($cmd) {
    $p = Get-Command $cmd -ErrorAction SilentlyContinue
    if (-not $p) { throw "$cmd is not installed or not in PATH. Please install it first." }
}

# Ensure required tools
Assert-Command git
Assert-Command gh

if (-not $RepoName -or $RepoName -eq "") {
    $cwd = Split-Path -Leaf (Get-Location)
    $RepoName = Read-Host "Repo name (press Enter to use folder name '$cwd')"
    if (-not $RepoName) { $RepoName = $cwd }
}

$visibility = if ($Private) { 'private' } else { 'public' }
Write-Host "Creating GitHub repo: $RepoName ($visibility)"

# Create repository using gh CLI (interactive if necessary)
if ($Private) {
    gh repo create $RepoName --private --source . --remote origin --push
} else {
    gh repo create $RepoName --public --source . --remote origin --push
}

Write-Host "Repository created (if auth prompted, complete login), remote set to 'origin'."
