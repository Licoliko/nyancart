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

$separator = [IO.Path]::DirectorySeparatorChar
$resolvedOutput = (Resolve-Path $outputRoot).Path.TrimEnd([char[]]"\/") + $separator
$candidate = [IO.Path]::GetFullPath($packageRoot)
if (-not ($candidate.TrimEnd([char[]]"\/") + $separator).StartsWith($resolvedOutput, [StringComparison]::OrdinalIgnoreCase)) {
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
    "marron-maine", "milfi-ragdoll", "yukine-silky", "rhythm-sphynx",
    "tick-abyssinian", "flora-turkishvan", "reska-americancurl",
    "cleo-mau", "ciel-norwegian", "sucre-persian",
    "moka-oriental", "garnet-bengal", "rinka-somali",
    "stella-russianblue", "honey-british", "liber-birman"
)
$portraitSlugs = $catSlugs[0..11]
$spectators = @("pink-human", "blond-cookie", "cyan-cat", "purple-witch", "teal-glasses")

$files = [Collections.Generic.List[string]]::new()
$files.AddRange([string[]]@("index.html", "style.css", "audio.js", "game.js", "quality.js", "README.md"))
$files.Add("assets/sprite-bounds.js")
$files.Add("assets/runtime-image-manifest.json")
$files.AddRange([string[]]@(
    "assets/audio/n(ya)itro_cat_grand_prix.mp3",
    "assets/audio/drigt_swing_nya.mp3",
    "assets/environment/sweets-circuit-v1.webp",
    "assets/environment/course-sweets.webp",
    "assets/environment/course-steam.webp",
    "assets/environment/course-neon.webp",
    "assets/environment/course-rain.webp",
    "assets/environment/course-royal.webp",
    "assets/environment/course-aurora.webp",
    "assets/environment/course-jungle.webp",
    "assets/environment/course-sakura.webp",
    "assets/environment/course-coral.webp",
    "assets/environment/course-phantom.webp",
    "assets/environment/course-lunatic.webp",
    "assets/environment/racer-set-garage.webp",
    "assets/ui/course-map-v2.webp",
    "assets/ui/items.webp",
    "assets/ui/mobile-controls-gpt2.webp",
    "assets/ui/driving-vfx-animated-gpt2-v1.webp",
    "assets/ui/item-vfx-animated-gpt2-v1.webp",
    "assets/ui/mia-charme-intrusion-gpt2.webp",
    "assets/ui/mia-charme-boss-portrait-gpt2.webp",
    "assets/ui/result-ceremony-gpt2.webp",
    "assets/sprites/mia-charme.webp",
    "assets/trackside/candy-sign.webp",
    "assets/trackside/cupcake-tower.webp",
    "assets/trackside/jump-ramps-angled-gpt2-v2.webp",
    "assets/trackside/course-scenery-sweets-gpt2.webp",
    "assets/trackside/course-scenery-steam-gpt2.webp",
    "assets/trackside/course-scenery-neon-gpt2.webp",
    "assets/trackside/course-scenery-rain-gpt2.webp",
    "assets/trackside/course-scenery-royal-gpt2.webp",
    "assets/trackside/course-scenery-aurora-gpt2.webp",
    "assets/trackside/course-scenery-jungle-gpt2.webp",
    "assets/trackside/course-scenery-sakura-gpt2.webp",
    "assets/trackside/course-scenery-coral-gpt2.webp",
    "assets/trackside/course-scenery-phantom-gpt2.webp",
    "assets/trackside/course-scenery-lunatic-gpt2.webp",
    "assets/trackside/scenery-candy-houses.webp",
    "assets/trackside/scenery-forest.webp"
))
foreach ($slug in $catSlugs) {
    $files.Add("assets/sprites/$slug.webp")
    $files.Add("assets/select-heroes/$slug.webp")
}
foreach ($slug in $portraitSlugs) {
    $files.Add("assets/portraits/$slug.webp")
}
foreach ($slug in $spectators) {
    $files.Add("assets/trackside/spectator-$slug.webp")
}
foreach ($theme in @("steam", "neon", "rain", "royal")) {
    foreach ($index in 0..5) {
        $files.Add("assets/trackside/$theme-prop-$index.webp")
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
