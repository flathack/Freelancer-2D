#!/usr/bin/env python3
from __future__ import annotations

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
MOD_IDS = ("vanilla-de", "vanilla-en", "crossfire")
ASSET_DIRS = ("ship_icons", "object_icons")
JS_FILES = ("ships.js", "object_icons.js", "mod_data.js")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repo_path(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def dedupe_asset_dir(mod_id: str, mod_dir: Path, asset_dir_name: str) -> dict[str, str]:
    mod_asset_dir = mod_dir / asset_dir_name
    shared_asset_dir = DATA_DIR / asset_dir_name
    replacements: dict[str, str] = {}
    if not mod_asset_dir.exists() or not shared_asset_dir.exists():
        return replacements

    shared_hashes: dict[Path, str] = {}
    for source in sorted(mod_asset_dir.glob("*.png")):
        shared = shared_asset_dir / source.name
        if not shared.exists() or not shared.is_file():
            continue
        same_asset_by_contract = mod_id in {"vanilla-de", "vanilla-en"}
        if not same_asset_by_contract:
            shared_hashes.setdefault(shared, sha256(shared))
        if not same_asset_by_contract and sha256(source) != shared_hashes[shared]:
            continue
        replacements[repo_path(source)] = repo_path(shared)
        source.unlink()
    if mod_asset_dir.exists() and not any(mod_asset_dir.iterdir()):
        mod_asset_dir.rmdir()
    return replacements


def rewrite_references(mod_dir: Path, replacements: dict[str, str]) -> int:
    if not replacements:
        return 0
    changed = 0
    for filename in JS_FILES:
        path = mod_dir / filename
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        new_text = text
        for old, new in replacements.items():
            new_text = new_text.replace(old, new)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            changed += 1
    return changed


def main() -> None:
    total_removed = 0
    total_rewritten = 0
    for mod_id in MOD_IDS:
        mod_dir = DATA_DIR / mod_id
        if not mod_dir.exists():
            continue
        replacements: dict[str, str] = {}
        for asset_dir_name in ASSET_DIRS:
            replacements.update(dedupe_asset_dir(mod_id, mod_dir, asset_dir_name))
        rewritten = rewrite_references(mod_dir, replacements)
        total_removed += len(replacements)
        total_rewritten += rewritten
        print(f"{mod_id}: removed {len(replacements)} duplicate PNGs, rewrote {rewritten} JS files")
    print(f"Done: removed {total_removed} duplicate PNGs, rewrote {total_rewritten} JS files")


if __name__ == "__main__":
    main()
