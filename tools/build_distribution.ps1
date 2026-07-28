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
    "stella-russianblue", "honey-british", "liber-birman",
    "masuka-chartreux", "soyi-tonkinese", "shino-cornish",
    "aroma-balinese", "matsuri-japanese-bobtail"
)
$portraitSlugs = $catSlugs[0..11]

$files = [Collections.Generic.List[string]]::new()
$files.AddRange([string[]]@("index.html", "style.css", "audio.js", "game.js", "quality.js", "README.md"))
$files.Add("assets/sprite-bounds.js")
$files.Add("assets/runtime-image-manifest.json")
$files.AddRange([string[]]@(
    "assets/audio/n(ya)itro_cat_grand_prix.mp3",
    "assets/audio/drigt_swing_nya.mp3",
    "assets/audio/CARAMEL_OVERDRIVE.mp3",
    "assets/audio/clockwork_claw.mp3",
    "assets/audio/aurora_prism_break.mp3",
    "assets/audio/EMERALD_CLAW.mp3",
    "assets/audio/phantom_gear_parade.mp3"
))
foreach ($slug in $portraitSlugs) {
    $files.Add("assets/portraits/$slug.webp")
}

$runtimeImageManifestPath = Join-Path $root "assets/runtime-image-manifest.json"
$runtimeImageManifest = Get-Content -LiteralPath $runtimeImageManifestPath -Raw | ConvertFrom-Json
if (-not $runtimeImageManifest.assets -or $runtimeImageManifest.assets.Count -ne $runtimeImageManifest.files) {
    throw "Runtime image manifest is missing or inconsistent. Run tools/optimize_runtime_images.py first."
}
$manifestOutputs = @($runtimeImageManifest.assets | ForEach-Object { [string]$_.output })
if (($manifestOutputs | Sort-Object -Unique).Count -ne $manifestOutputs.Count) {
    throw "Runtime image manifest contains duplicate output paths."
}
$ignoredRuntimeImages = @("assets/ui/mia-charme-intrusion-gpt2.webp")
$unlistedRuntimeImages = @(
    Get-ChildItem -LiteralPath @(
        (Join-Path $root "assets/environment"),
        (Join-Path $root "assets/sprites"),
        (Join-Path $root "assets/select-chibis"),
        (Join-Path $root "assets/select-heroes"),
        (Join-Path $root "assets/skill-cutins"),
        (Join-Path $root "assets/ui"),
        (Join-Path $root "assets/trackside")
    ) -Filter "*.webp" -File |
        ForEach-Object { $_.FullName.Substring($root.Length + 1).Replace('\', '/') } |
        Where-Object { $manifestOutputs -notcontains $_ -and $ignoredRuntimeImages -notcontains $_ }
)
if ($unlistedRuntimeImages.Count) {
    throw "Optimized runtime images are missing from the manifest:`n$($unlistedRuntimeImages -join "`n")"
}
foreach ($asset in $runtimeImageManifest.assets) {
    if (-not $asset.output -or -not $asset.output.EndsWith(".webp", [StringComparison]::OrdinalIgnoreCase)) {
        throw "Invalid runtime image manifest entry."
    }
    $files.Add([string]$asset.output)
}

$uniqueFiles = $files | Sort-Object -Unique
foreach ($relative in $uniqueFiles) {
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

foreach ($asset in $runtimeImageManifest.assets) {
    $publishedImage = Join-Path $packageRoot ([string]$asset.output)
    if (-not (Test-Path -LiteralPath $publishedImage)) {
        throw "Runtime image was not published: $($asset.output)"
    }
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
