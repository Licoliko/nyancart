param(
    [string]$PackageName = "NYAN_CART"
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$outputRoot = Join-Path $root "output"
$packageRoot = Join-Path $outputRoot $PackageName
$zipPath = Join-Path $outputRoot "$PackageName.zip"

if (-not (Test-Path $outputRoot)) {
    New-Item -ItemType Directory -Path $outputRoot | Out-Null
}

$resolvedOutput = (Resolve-Path $outputRoot).Path.TrimEnd('\') + '\'
$candidate = [IO.Path]::GetFullPath($packageRoot)
if (-not ($candidate + '\').StartsWith($resolvedOutput, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Package path escaped the output directory."
}

if (Test-Path $packageRoot) {
    Remove-Item -LiteralPath $packageRoot -Recurse -Force
}
if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
New-Item -ItemType Directory -Path $packageRoot | Out-Null

$catSlugs = @(
    "aruka-sham", "kurone-night", "kohaku-taiga", "ghost-rex",
    "nerine-korat", "fumika-scotty", "bell-savanna", "popo-munch",
    "marron-maine", "milfi-ragdoll", "yukine-silky", "rhythm-sphynx"
)
$spectators = @("pink-human", "blond-cookie", "cyan-cat", "purple-witch", "teal-glasses")

$files = [Collections.Generic.List[string]]::new()
$files.AddRange([string[]]@("index.html", "style.css", "game.js", "README.md"))
$files.Add("assets/sprite-bounds.js")
$files.AddRange([string[]]@(
    "assets/audio/n(ya)itro_cat_grand_prix.mp3",
    "assets/audio/drigt_swing_nya.mp3",
    "assets/environment/sweets-circuit-v1.png",
    "assets/environment/course-sweets.png",
    "assets/environment/course-steam.png",
    "assets/environment/course-neon.png",
    "assets/environment/course-rain.png",
    "assets/environment/course-royal.png",
    "assets/ui/course-map-v2.png",
    "assets/ui/items.png",
    "assets/ui/vfx.png",
    "assets/trackside/candy-sign.png",
    "assets/trackside/cupcake-tower.png"
))
foreach ($slug in $catSlugs) {
    $files.Add("assets/sprites/$slug.png")
    $files.Add("assets/portraits/$slug.webp")
}
foreach ($slug in $spectators) {
    $files.Add("assets/trackside/spectator-$slug.png")
}
foreach ($theme in @("steam", "neon", "rain", "royal")) {
    foreach ($index in 0..5) {
        $files.Add("assets/trackside/$theme-prop-$index.png")
    }
}

foreach ($relative in $files) {
    $source = Join-Path $root $relative
    if (-not (Test-Path -LiteralPath $source)) {
        throw "Missing required runtime file: $relative"
    }
    $destination = Join-Path $packageRoot $relative
    $destinationDirectory = Split-Path -Parent $destination
    if (-not (Test-Path $destinationDirectory)) {
        New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
    }
    Copy-Item -LiteralPath $source -Destination $destination
}

$manifest = Get-ChildItem -LiteralPath $packageRoot -Recurse -File |
    Sort-Object FullName |
    ForEach-Object {
        $relative = $_.FullName.Substring($packageRoot.Length + 1).Replace('\', '/')
        "$relative`t$($_.Length) bytes"
    }
$manifestPath = Join-Path $packageRoot "DISTRIBUTION_MANIFEST.txt"
[IO.File]::WriteAllLines($manifestPath, $manifest, [Text.UTF8Encoding]::new($false))

Compress-Archive -LiteralPath $packageRoot -DestinationPath $zipPath -CompressionLevel Optimal

$packageFiles = Get-ChildItem -LiteralPath $packageRoot -Recurse -File
$packageBytes = ($packageFiles | Measure-Object Length -Sum).Sum
Write-Output "Package: $packageRoot"
Write-Output "ZIP: $zipPath"
Write-Output "Files: $($packageFiles.Count)"
Write-Output "Uncompressed bytes: $packageBytes"
Write-Output "ZIP bytes: $((Get-Item $zipPath).Length)"
