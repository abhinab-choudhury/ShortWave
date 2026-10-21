#!/usr/bin/env bash
# Benchmarks the redirect route: N requests without -L, so we measure the time to
# the redirect response itself and not the round trip to the target.
#
#   BASE_URL=https://short-wave-api.vercel.app CODE=65bcd8 ./scripts/bench-redirect.sh
#   ./scripts/bench-redirect.sh 50
set -euo pipefail

BASE_URL="${BASE_URL:-https://short-wave-api.vercel.app}"
CODE="${CODE:-65bcd8}"
COUNT="${1:-30}"
URL="${BASE_URL%/}/${CODE}"

echo "GET ${URL}  x${COUNT} (no -L)"
echo

results=$(mktemp)
trap 'rm -f "$results"' EXIT

for i in $(seq 1 "$COUNT"); do
  line=$(curl -sS -o /dev/null \
    -w '%{http_code}|%{redirect_url}|%{time_starttransfer}' "$URL")
  code="${line%%|*}"
  rest="${line#*|}"
  redirect="${rest%%|*}"
  ttfb="${rest##*|}"

  printf '%2d  status=%s  ttfb=%ss  redirect_url=%s\n' \
    "$i" "$code" "$ttfb" "$redirect"
  echo "$ttfb" >> "$results"
done

echo
sort -g "$results" | awk -v n="$COUNT" '
  { values[NR] = $1 }
  END {
    mid = (n % 2) ? (n + 1) / 2 : n / 2
    median = (n % 2) ? values[mid] : (values[mid] + values[mid + 1]) / 2
    printf "min=%.3fs  median=%.3fs  max=%.3fs  (n=%d)\n", values[1], median, values[n], n
  }'
