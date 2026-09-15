#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash).
# Forces a confirmation prompt (permissionDecision "ask") whenever the
# command looks like a "download and pipe straight to a shell/interpreter"
# pattern (curl|wget|iwr ... | bash|sh|iex ..., or bash <(curl ...)).
# This is a hard, non-bypassable check: it runs regardless of what the
# model decides, and regardless of any Bash(...) allow rule already in
# effect, because a hook permissionDecision of "ask" overrides auto-allow.
set -euo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

if [ -z "$cmd" ]; then
  exit 0
fi

pattern1='(curl|wget|iwr|invoke-webrequest|invoke-restmethod)[^|]*\|[[:space:]]*(sudo[[:space:]]+)?(bash|sh|zsh|dash|python[0-9.]*|iex|invoke-expression|powershell|pwsh)\b'
pattern2='\b(bash|sh|zsh|source|\.)[[:space:]]+<\([[:space:]]*(curl|wget)\b'
pattern3='iex[[:space:]]*\([[:space:]]*(iwr|invoke-webrequest|new-object[[:space:]]+net\.webclient)'

if printf '%s' "$cmd" | grep -Eiq "$pattern1" \
  || printf '%s' "$cmd" | grep -Eiq "$pattern2" \
  || printf '%s' "$cmd" | grep -Eiq "$pattern3"; then
  printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"Detected a download-and-execute pattern (curl/wget/iwr piped straight to a shell or interpreter). Confirm this exact command is safe before running it."}}'
fi

exit 0
