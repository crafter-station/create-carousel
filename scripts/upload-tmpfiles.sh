#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE' >&2
Usage:
  upload-tmpfiles.sh /path/to/tmpfiles.json /path/to/slide-1.png [/path/to/slide-2.png ...] /path/to/carousel.pdf

Uploads local media assets to tmpfiles.org and writes a JSON manifest with direct /dl/ URLs.

Examples:
  Instagram images: upload-tmpfiles.sh uploads/tmpfiles.json exports/x3/*.png
  LinkedIn PDF:      upload-tmpfiles.sh uploads/tmpfiles.json exports/carousel.pdf
  Both platforms:    upload-tmpfiles.sh uploads/tmpfiles.json exports/x3/*.png exports/carousel.pdf
USAGE
}

if [[ $# -lt 2 ]]; then
	usage
	exit 1
fi

manifest_path="$1"
shift

mkdir -p "$(dirname "$manifest_path")"
tmp_manifest="$(mktemp)"
trap 'rm -f "$tmp_manifest"' EXIT

printf '[\n' > "$tmp_manifest"
first=true

mime_for_file() {
	case "${1##*.}" in
		png|PNG) printf 'image/png' ;;
		jpg|JPG|jpeg|JPEG) printf 'image/jpeg' ;;
		webp|WEBP) printf 'image/webp' ;;
		gif|GIF) printf 'image/gif' ;;
		pdf|PDF) printf 'application/pdf' ;;
		*) printf 'application/octet-stream' ;;
	esac
}

for file_path in "$@"; do
	if [[ ! -f "$file_path" ]]; then
		printf 'Missing upload file: %s\n' "$file_path" >&2
		exit 1
	fi

	mime_type="$(mime_for_file "$file_path")"
	response="$(curl -sS -F "file=@${file_path};type=${mime_type}" https://tmpfiles.org/api/v1/upload)"

	url="$(printf '%s' "$response" | node -e '
let input = "";
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  try {
    const parsed = JSON.parse(input);
    const url = parsed?.data?.url || parsed?.url;
    if (!url) throw new Error("tmpfiles response did not include a URL");
    process.stdout.write(url);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});
')"

	direct_url="$(node - "$url" <<'NODE'
const raw = process.argv[2];
const url = new URL(raw);
if (url.hostname === "tmpfiles.org" && !url.pathname.startsWith("/dl/")) {
  url.pathname = `/dl${url.pathname}`;
}
process.stdout.write(url.toString());
NODE
)"

	item="$(node - "$file_path" "$url" "$direct_url" "$mime_type" <<'NODE'
const path = require("path");
const [file, url, directUrl, mimeType] = process.argv.slice(2);
process.stdout.write(JSON.stringify({
  file,
  filename: path.basename(file),
  url,
  directUrl,
  mimeType,
}));
NODE
)"

	if [[ "$first" == true ]]; then
		first=false
	else
		printf ',\n' >> "$tmp_manifest"
	fi

	printf '  %s' "$item" >> "$tmp_manifest"
	printf 'Uploaded %s\n' "$file_path"
done

printf '\n]\n' >> "$tmp_manifest"
mv "$tmp_manifest" "$manifest_path"
trap - EXIT

printf 'Wrote tmpfiles manifest to %s\n' "$manifest_path"
