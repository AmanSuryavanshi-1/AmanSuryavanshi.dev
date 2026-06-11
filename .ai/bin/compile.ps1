# .ai/bin/compile.ps1
# Master UAPM Compiler Script for Aman Suryavanshi's S-Tier Architecture
# Usage: powershell -File .ai/bin/compile.ps1 [-Force]
#   -Force : overwrite human-authored pointer files (default refuses + backs them up to .ai/_migrated/)
#
# Design: Follows Addy Osmani's research — compiled pointers contain ONLY non-discoverable
# information (gotchas, landmines, skill routing). Directory structure, tech stack, and generic
# coding conventions are omitted because agents discover them on their own.
# AGENTS.md is the primary file; CLAUDE.md and GEMINI.md are symlinks to it.

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# UAPM marker — present in every COMPILED pointer. Its ABSENCE means a file is human-authored.
$uapmMarker = "Agent Directives - UAPM Standard"

# 1. Path Definitions
$aiDir = Join-Path $PSScriptRoot ".."
$projectRoot = Resolve-Path (Join-Path $aiDir "..")

$projectRulesFile = Join-Path $aiDir "PROJECT-RULES.md"
$architectureFile = Join-Path $aiDir "ARCHITECTURE.md"
$gotchasFile = Join-Path $aiDir "GOTCHAS.md"
$decisionsFile = Join-Path $aiDir "DECISIONS.md"
$mcpConfigFile = Join-Path $aiDir "mcp.json"
$skillsDir = Join-Path $aiDir "skills"
$rulesDir = Join-Path $aiDir "rules"

# 2. Get Project Name
$projectName = (Split-Path $projectRoot -Leaf)

Write-Host " Compiling UAPM S-Tier Architecture for project: $projectName..." -ForegroundColor Green

# 3. Compile Rules & Pointer Files
Write-Host "  - Compiling rule and pointer files..." -ForegroundColor Cyan

# Read core UAPM components (only non-discoverable info per Osmani's research)
$projectRules = if (Test-Path $projectRulesFile) { Get-Content $projectRulesFile -Raw } else { "" }
$architecture = if (Test-Path $architectureFile) { Get-Content $architectureFile -Raw } else { "" }
$gotchas = if (Test-Path $gotchasFile) { Get-Content $gotchasFile -Raw } else { "" }
$decisions = if (Test-Path $decisionsFile) { Get-Content $decisionsFile -Raw } else { "" }

# Gather modular rules
$modularRules = ""
if (Test-Path $rulesDir) {
    $ruleFiles = Get-ChildItem $rulesDir -Filter *.md
    foreach ($file in $ruleFiles) {
        $modularRules += "`n### From $($file.BaseName)`n" + (Get-Content $file.FullName -Raw) + "`n"
    }
}

# Construct ultra-thin compiled content (non-discoverable info only)
$compiledContent = @"
#  Agent Directives - UAPM Standard (COMPILED  DO NOT EDIT BY HAND)
# PROJECT: $projectName
# Edit .ai/ files, then re-run: powershell -File .ai/bin/compile.ps1

Before writing any code, read these .ai/ files:
1. .ai/MEMORY.md (active goals)
2. .ai/ARCHITECTURE.md (non-obvious gotchas)
3. .ai/DECISIONS.md (committed architectural decisions)
4. .ai/GOTCHAS.md (known pitfalls)
5. .ai/skills/ (task-specific workflows — load before executing)

---

$projectRules

$architecture

$decisions

$gotchas

$modularRules
"@

# 3a. Write AGENTS.md (PRIMARY — the only real file)
$agentsFile = Join-Path $projectRoot "AGENTS.md"
if ((Test-Path $agentsFile) -and -not $Force) {
    $existing = Get-Content $agentsFile -Raw -ErrorAction SilentlyContinue
    if ($existing -and ($existing -notmatch [regex]::Escape($uapmMarker))) {
        $migratedDir = Join-Path $aiDir "_migrated"
        if (!(Test-Path $migratedDir)) { New-Item -ItemType Directory -Path $migratedDir -Force | Out-Null }
        $backupName = "AGENTS.md." + (Get-Date -Format "yyyyMMdd-HHmmss") + ".bak"
        Copy-Item $agentsFile (Join-Path $migratedDir $backupName) -Force
        Write-Host "    [!] SKIPPED (human-authored): $agentsFile" -ForegroundColor Yellow
    }
} else {
    [System.IO.File]::WriteAllText($agentsFile, $compiledContent, [System.Text.Encoding]::UTF8)
    Write-Host "     Generated: $agentsFile (PRIMARY)" -ForegroundColor Gray
}

# 3b. Create symlinks for CLAUDE.md and GEMINI.md → AGENTS.md
$symlinks = @(
    @{ Link = (Join-Path $projectRoot "CLAUDE.md"); Target = "AGENTS.md" },
    @{ Link = (Join-Path $projectRoot "GEMINI.md"); Target = "AGENTS.md" }
)

foreach ($sl in $symlinks) {
    # Remove existing file/symlink first
    if (Test-Path $sl.Link) { Remove-Item $sl.Link -Force }
    # Create symlink (requires dev mode or admin on Windows)
    try {
        cmd /c mklink $sl.Link $sl.Target 2>$null | Out-Null
        Write-Host "     Symlinked: $($sl.Link) -> $($sl.Target)" -ForegroundColor Gray
    } catch {
        # Fallback: copy the file if symlinks aren't available (non-dev-mode Windows)
        Copy-Item $agentsFile $sl.Link -Force
        Write-Host "     Copied (symlink fallback): $($sl.Link)" -ForegroundColor Yellow
    }
}

# 3c. Write .codex/AGENTS.md (Codex reads from its own directory)
$codexAgents = Join-Path $projectRoot ".codex\AGENTS.md"
$codexDir = Split-Path $codexAgents
if (!(Test-Path $codexDir)) { New-Item -ItemType Directory -Path $codexDir -Force | Out-Null }
[System.IO.File]::WriteAllText($codexAgents, $compiledContent, [System.Text.Encoding]::UTF8)
Write-Host "     Generated: $codexAgents" -ForegroundColor Gray

# 4. Sync Workspace Model Context Protocol (MCP) Configuration
if (Test-Path $mcpConfigFile) {
    Write-Host "  - Syncing Model Context Protocol (MCP) configurations..." -ForegroundColor Cyan
    $mcpRaw = Get-Content $mcpConfigFile -Raw

    # 4a. SECRET-STRIP GATE (ZERO EXPOSURE POLICY)
    $secretPatterns = @('sk-ant-', 'tvly-', 'ctx7sk-', 'ntn_', 'xox[bpoa]-', 'gh[pousr]_', 'AIza[0-9A-Za-z_\-]{35}', 'eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.')
    $leak = $false
    foreach ($pat in $secretPatterns) {
        if ($mcpRaw -match $pat) { $leak = $true; break }
    }
    if ($leak) {
        Write-Host "      SECRET DETECTED in .ai/mcp.json  MCP sync ABORTED." -ForegroundColor Red
        Write-Host "        Replace inline keys with {env:VAR_NAME} references, then re-run." -ForegroundColor Yellow
    } else {
        # Claude Code (.mcp.json)
        $claudeMcp = Join-Path $projectRoot ".mcp.json"
        [System.IO.File]::WriteAllText($claudeMcp, $mcpRaw, [System.Text.Encoding]::UTF8)
        Write-Host "     Synced: $claudeMcp" -ForegroundColor Gray

        # OpenCode (opencode.json)
        $mcpObjOC = ConvertFrom-Json $mcpRaw
        $openCodeCfg = [ordered]@{ '$schema' = 'https://opencode.ai/config.json'; mcp = $mcpObjOC.mcpServers }
        $openCodeJson = $openCodeCfg | ConvertTo-Json -Depth 10
        $openCodeFile = Join-Path $projectRoot "opencode.json"
        [System.IO.File]::WriteAllText($openCodeFile, $openCodeJson, [System.Text.Encoding]::UTF8)
        Write-Host "     Synced: $openCodeFile" -ForegroundColor Gray

        # Codex (.codex/config.toml)
        $codexConfig = Join-Path $projectRoot ".codex\config.toml"
        $mcpObj = ConvertFrom-Json $mcpRaw
        $tomlContent = "[mcp_servers]`n"
        if ($mcpObj.mcpServers) {
            foreach ($serverName in $mcpObj.mcpServers.psobject.properties.name) {
                $server = $mcpObj.mcpServers.$serverName
                $tomlContent += "[mcp_servers.$serverName]`n"
                $tomlContent += "command = `"$($server.command.Replace('\', '\\'))`"`n"
                $argsStr = ""
                if ($server.args) {
                    $argsList = foreach ($arg in $server.args) { "`"$($arg.Replace('\', '\\'))`"" }
                    $argsStr = "[" + ($argsList -join ", ") + "]"
                }
                $tomlContent += "args = $argsStr`n"
                if ($server.env) {
                    $tomlContent += "[mcp_servers.$serverName.env]`n"
                    foreach ($envName in $server.env.psobject.properties.name) {
                        $tomlContent += "$envName = `"$($server.env.$envName.Replace('\', '\\'))`"`n"
                    }
                }
                $tomlContent += "`n"
            }
        }
        [System.IO.File]::WriteAllText($codexConfig, $tomlContent, [System.Text.Encoding]::UTF8)
        Write-Host "     Synced: $codexConfig" -ForegroundColor Gray
    }
}

# 5. Compile Workspace Skills → Claude Code slash commands & OpenCode Custom Modes
if (Test-Path $skillsDir) {
    Write-Host "  - Compiling workspace-specific skills..." -ForegroundColor Cyan

    $skills = Get-ChildItem $skillsDir -Filter *.md

    # Claude Code slash commands
    $claudeCmdsDir = Join-Path $projectRoot ".claude\commands"
    if (!(Test-Path $claudeCmdsDir)) { New-Item -ItemType Directory -Path $claudeCmdsDir -Force | Out-Null }

    foreach ($skill in $skills) {
        $skillName = $skill.BaseName
        $skillContent = Get-Content $skill.FullName -Raw

        # 5a. Claude Code Command
        $claudeCmdFile = Join-Path $claudeCmdsDir "$skillName.md"
        [System.IO.File]::WriteAllText($claudeCmdFile, $skillContent, [System.Text.Encoding]::UTF8)
        Write-Host "     Claude slash command: /$skillName" -ForegroundColor Gray
    }
}

Write-Host " S-Tier UAPM Sync Completed Successfully!" -ForegroundColor Green
