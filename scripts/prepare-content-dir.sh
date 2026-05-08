#!/usr/bin/env bash
set -euo pipefail

CONTENT_ROOT="${CONTENT_ROOT:-/Users/cuevaio/projects/content}"
PROFILE_TARGET="${PROFILE_TARGET:-$CONTENT_ROOT/assets/profile/anthony-profile.jpg}"

mkdir -p "$CONTENT_ROOT/assets/profile"
mkdir -p "$CONTENT_ROOT/assets/logos"
mkdir -p "$CONTENT_ROOT/assets/images"
mkdir -p "$CONTENT_ROOT/assets/illustrations"
mkdir -p "$CONTENT_ROOT/assets/memes"
mkdir -p "$CONTENT_ROOT/assets/screenshots"
mkdir -p "$CONTENT_ROOT/assets/icons"
mkdir -p "$CONTENT_ROOT/assets/references"
mkdir -p "$CONTENT_ROOT/carousels"
mkdir -p "$CONTENT_ROOT/logs"

if [[ -f "$PROFILE_TARGET" ]]; then
	printf 'Profile image ready at %s\n' "$PROFILE_TARGET"
else
	printf 'Missing profile image: %s\n' "$PROFILE_TARGET" >&2
	printf 'Place Anthony profile image at the canonical content asset path before building follow slides.\n' >&2
	exit 1
fi

printf 'Content root ready at %s\n' "$CONTENT_ROOT"
