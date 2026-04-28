#!/usr/bin/env python3
"""Extract equipment definitions and base markets from Freelancer HD market_misc.ini."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FL_ROOT = Path("C:/Users/steve/Github/FL-Installationen/Freelancer-HD")
FL_DATA = FL_ROOT / "DATA"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_ship_market_data import all_values, first, fl_text, parse_ini_sections, to_int  # noqa: E402
import extract_universe_data as universe  # noqa: E402


def title_from_nickname(nickname: str) -> str:
    text = re.sub(r"_(mark|mk)(\d+)", r" Mark \2", nickname, flags=re.IGNORECASE)
    text = text.replace("ge_s_", "").replace("ge_", "")
    return " ".join(part.capitalize() for part in re.split(r"[_\s]+", text) if part)


def classify_equipment(nickname: str, category: str, equipment_id: str) -> str:
    value = f"{nickname} {category} {equipment_id}".lower()
    if "battery" in value:
        return "shield_battery"
    if "repair" in value or "nanobot" in value:
        return "nanobot"
    if "shield" in value:
        return "shield"
    if "thruster" in value:
        return "thruster"
    if "mine" in value:
        return "mine"
    if "cm_" in value or "counter" in value:
        return "countermeasure"
    if "missile" in value or "rocket" in value or "torpedo" in value or "disruptor" in value:
        return "missile"
    if "turret" in value:
        return "turret"
    if "gun" in value:
        return "weapon"
    if "ammo" in value:
        return "ammo"
    return category or "equipment"


def extract_goods() -> dict[str, dict]:
    equipment: dict[str, dict] = {}
    for section, props in parse_ini_sections(FL_DATA / "EQUIPMENT" / "goods.ini"):
        if section.lower() != "good":
            continue
        category = first(props, "category").lower()
        if category in {"commodity", "shiphull"}:
            continue
        nickname = first(props, "nickname").lower()
        if not nickname:
            continue
        equipment_id = first(props, "equipment", nickname).lower()
        price = to_int(first(props, "price"), 1)
        equipment[nickname] = {
            "id": nickname,
            "equipmentId": equipment_id,
            "name": fl_text(title_from_nickname(nickname)),
            "category": classify_equipment(nickname, category, equipment_id),
            "rawCategory": category,
            "price": max(1, price),
            "itemIcon": first(props, "item_icon"),
            "combinable": first(props, "combinable", "false").lower() == "true",
        }
    return equipment


def enrich_from_equipment_files(equipment: dict[str, dict]) -> dict[str, dict]:
    for ini_path in sorted((FL_DATA / "EQUIPMENT").glob("*.ini")):
        if ini_path.name.lower() in {"goods.ini", "market_misc.ini", "market_commodities.ini", "market_ships.ini"}:
            continue
        for section, props in parse_ini_sections(ini_path):
            nickname = first(props, "nickname").lower()
            if not nickname:
                continue
            ids_name = first(props, "ids_name")
            ids_info = first(props, "ids_info")
            category = classify_equipment(nickname, section.lower(), nickname)
            item = equipment.get(nickname, {
                "id": nickname,
                "equipmentId": nickname,
                "name": fl_text(universe.resolve_id(ids_name, title_from_nickname(nickname))),
                "category": category,
                "rawCategory": section.lower(),
                "price": 500,
                "itemIcon": "",
                "combinable": category in {"ammo", "nanobot", "shield_battery"},
            })
            if ids_name:
                item["name"] = fl_text(universe.resolve_id(ids_name, item["name"]))
            item["idsName"] = ids_name
            item["idsInfo"] = ids_info
            item["info"] = universe.resolve_info(ids_info)
            item["category"] = category
            item["hitPts"] = to_int(first(props, "hit_pts"), item.get("hitPts", 0))
            item["powerUsage"] = to_int(first(props, "power_usage"), item.get("powerUsage", 0))
            item["refireDelay"] = first(props, "refire_delay", item.get("refireDelay", ""))
            item["sourceFile"] = ini_path.name
            equipment[nickname] = item
    return equipment


def to_float(value: str, default: float = 1.0) -> float:
    try:
        return float(value.strip())
    except Exception:
        return default


def extract_markets(equipment: dict[str, dict]) -> dict[str, list[dict]]:
    markets: dict[str, list[dict]] = {}
    for section, props in parse_ini_sections(FL_DATA / "EQUIPMENT" / "market_misc.ini"):
        if section.lower() != "basegood":
            continue
        base = first(props, "base").lower()
        if not base:
            continue
        entries = []
        for value in all_values(props, "marketgood"):
            parts = [part.strip() for part in value.split(",")]
            if len(parts) < 7:
                continue
            item_id = parts[0].lower()
            item = equipment.get(item_id)
            if not item:
                item = {
                    "id": item_id,
                    "equipmentId": item_id,
                    "name": title_from_nickname(item_id),
                    "category": classify_equipment(item_id, "equipment", item_id),
                    "rawCategory": "market_misc",
                    "price": 500 + to_int(parts[1]) * 250,
                    "itemIcon": "",
                    "combinable": item_id.endswith("_ammo") or "battery" in item_id or "repair" in item_id,
                }
                equipment[item_id] = item
            min_stock = to_int(parts[3])
            max_stock = to_int(parts[4])
            multiplier = to_float(parts[6], 1.0)
            entries.append({
                "id": item_id,
                "price": max(1, round(item["price"] * multiplier)),
                "rank": to_int(parts[1]),
                "reputation": to_float(parts[2], -1),
                "stockMin": min_stock,
                "stockMax": max_stock,
                "forSale": max_stock > 0,
            })
        if entries:
            markets[base] = entries
    return markets


def write_js(equipment: dict[str, dict], markets: dict[str, list[dict]]) -> Path:
    output = ROOT / "data" / "equipment.js"
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        handle.write("// Auto-generated equipment market data\n")
        handle.write("// Generated from Freelancer HD goods.ini and market_misc.ini\n\n")
        handle.write("const FL_EQUIPMENT = ")
        json.dump(dict(sorted(equipment.items())), handle, indent=2, ensure_ascii=False)
        handle.write(";\n\nconst FL_BASE_EQUIPMENT_MARKETS = ")
        json.dump(dict(sorted(markets.items())), handle, indent=2, ensure_ascii=False)
        handle.write(";\n")
    return output


def main() -> None:
    universe.RESOURCE_STRINGS = universe.load_resource_strings()
    universe.RESOURCE_INFOCARDS = universe.load_resource_infocards()
    equipment = extract_goods()
    equipment = enrich_from_equipment_files(equipment)
    markets = extract_markets(equipment)
    output = write_js(equipment, markets)
    print(f"Saved {len(equipment)} equipment goods for {len(markets)} bases to {output}")


if __name__ == "__main__":
    main()
