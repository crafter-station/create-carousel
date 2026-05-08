#!/usr/bin/env bash
set -euo pipefail

FONT_NAME="${1:-Satoshi}"

if command -v fc-match >/dev/null 2>&1; then
	match="$(fc-match "$FONT_NAME" || true)"
	if [[ "$match" == *"$FONT_NAME"* ]]; then
		printf '%s font resolved by fontconfig: %s\n' "$FONT_NAME" "$match"
		exit 0
	fi
fi

font_paths=()
for dir in "$HOME/Library/Fonts" "/Library/Fonts" "/System/Library/Fonts"; do
	if [[ -d "$dir" ]]; then
		while IFS= read -r -d '' file; do
			font_paths+=("$file")
		done < <(find "$dir" -maxdepth 1 -iname "*${FONT_NAME}*" -print0 2>/dev/null)
	fi
done

if (( ${#font_paths[@]} > 0 )); then
	printf '%s font files found:\n' "$FONT_NAME"
	printf '  %s\n' "${font_paths[@]}"
	printf 'Pencil can only render this font if the renderer has access to these installed fonts.\n'
	exit 0
fi

printf 'Missing %s font.\n' "$FONT_NAME" >&2
printf 'Pencil .pen files only store fontFamily strings; they do not embed or load font files.\n' >&2
printf 'Install %s where Pencil renders before final export, then rerun this script.\n' "$FONT_NAME" >&2
exit 1
