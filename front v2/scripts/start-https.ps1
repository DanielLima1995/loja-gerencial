param(
  [int]$Port = 4200
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$certificateDirectory = Join-Path $projectRoot '.certs'
$certificatePath = Join-Path $certificateDirectory 'localhost.pem'

New-Item -ItemType Directory -Path $certificateDirectory -Force | Out-Null

dotnet dev-certs https --trust
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

dotnet dev-certs https --export-path $certificatePath --format Pem --no-password
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Push-Location $projectRoot
try {
  npx ng serve --port $Port
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
