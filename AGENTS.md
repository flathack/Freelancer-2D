# AGENTS.md

## Repo-Ablage

- Private Arbeitskopie: `C:\Users\steve\PROJECTS\PRIVATE\Freelancer2D`.
- Private Source of Truth: `origin` auf NAS/Gitea.
- Oeffentliche GitHub-Arbeitskopien/Fassaden liegen lokal unter `C:\Users\steve\PROJECTS\PUBLIC`.
- Fuer dieses Repo ist aktuell kein Public-GitHub-Remote konfiguriert.

## Project
Freelancer2D is a static HTML5 Canvas space sandbox inspired by Freelancer-style trading, docking, jump gates, trade lanes, factions, and ship progression.
The playable browser entry point is `index.html`. It is a thin HTML shell that loads the active stylesheet and ordered classic-script runtime modules from `css/active-game.css` and `js/active/`.

## Tech Stack
- Static HTML/CSS/JavaScript, no npm package manifest.
- Canvas 2D rendering and DOM overlays for HUD, map, universe view, inventory, and ship shop.
- Vanilla JavaScript globals are shared by the ordered classic scripts under `js/active/`.
- ES module files under `js/core`, `js/entities`, `js/simulation`, `js/ai`, and `js/ui` are legacy/prototype paths and are not loaded by `index.html`.
- Python tools under `tools/` extract and generate game data from the local Freelancer HD installation and FLAtlas renderer.

## Main Entry Points
- Game entry: `index.html`
- Active generated data loaded by the game:
  - `data/game_systems.js`
  - `data/ships.js`
  - `data/object_icons.js`
- Parallel/static source data:
  - `data/systems.json`
  - `data/universe_map.json`
  - `js/data/*.json`
- Older standalone ship data also exists in `ships.js`; check call sites before changing it.

## Run
Open the game directly:

```powershell
start index.html
```

If browser module loading, fetches, or path behavior becomes relevant, run a local static server from this directory:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Data Generation
The current local source paths used by tools are:

- Freelancer HD data: `C:/Users/steve/Github/FL-Installationen/Freelancer-HD/DATA`
- Freelancer HD root: `C:/Users/steve/Github/FL-Installationen/Freelancer-HD`
- FLAtlas renderer project: `C:/Users/steve/PROJECTS/PRIVATE/FLAtlas`

Important tools:

```powershell
python tools/extract_universe_data.py
python tools/extract_ship_market_data.py
python tools/generate_object_icons.py
python tools/ini_parser.py "C:/Users/steve/Github/FL-Installationen/Freelancer-HD/DATA"
```

`extract_universe_data.py` writes `data/game_systems.js` and extracts systems, jump gates, jump holes, stations, planets, asteroid fields, nebulae, and trade lanes. Trade lane routes are built from `Trade_Lane_Ring` objects connected by `next_ring` and `prev_ring`.

`extract_ship_market_data.py` writes `data/ships.js`, resolves `ids_name` and `ids_info` through Freelancer resource DLLs, and renders top-view ship icons through FLAtlas when available.

`generate_object_icons.py` writes `data/object_icons.js` and `data/object_icons/*.png` for used solar archetypes.

The FLAtlas renderer path requires PySide6 and FLAtlas importability. The scripts set `QT_QPA_PLATFORM=offscreen` where needed.

## Important Paths
- `index.html`: active DOM shell and ordered stylesheet/script loading only.
- `css/active-game.css`: active game, HUD, map, landing, and start-screen styling.
- `js/active/game-logic.js`: pure shared logic with CommonJS export for Node tests and a browser global for the runtime.
- `js/active/core.js`: configuration, data access, saves, equipment, missions, navigation, and shared state.
- `js/active/world.js`: system construction, hazards, entities, and player ship.
- `js/active/npc.js`: NPC creation, missions, combat, AI, and NPC rendering.
- `js/active/runtime-ui.js`: audio, main rendering/update loop, HUD, input, scanner, and system map.
- `js/active/universe-map.js`: universe/sector map and map input.
- `js/active/base-ui.js`: command UI, inventory, bases, interiors, markets, and landing decks.
- `js/active/bootstrap.js`: initialization and game start.
- `css/style.css`: legacy stylesheet; it is not loaded by the active entry point.
- `js/core/`: GameLoop, Renderer, Input modules.
- `js/entities/`: Entity, Ship, PlayerShip, Station, Gate, Planet modules.
- `js/simulation/`: Universe, Economy, Factions, Scheduler, Spawner modules.
- `js/ai/`: NPC behavior modules.
- `js/ui/HUD.js`: HUD module.
- `data/`: generated gameplay data and generated PNG icons.
- `tools/`: Python content pipeline.
- `todo.md`: current German design notes and feature priorities from the project owner.

## Working Rules
- Treat `todo.md` as the product direction. It specifically calls out trade lane rings, zoomable 2D maps, freeflight/approach/dock modes, ship shields/armor/energy, universe view, Freelancer INI extraction, IDS name/info parsing, and visible player ship/flight regressions.
- Before changing behavior, identify the owning file under `js/active/`; do not edit the legacy ES-module path unless explicitly modernizing it.
- Keep the game static and dependency-light unless the task clearly requires a build system.
- Prefer small, focused fixes. This project has overlapping old and new paths, so broad rewrites can easily leave dead or duplicate behavior behind.
- Preserve the Freelancer-inspired UI feel: dark space background, neon HUD colors, compact command buttons, map overlays, and cockpit-like instrumentation.
- Keep player controls aligned with the German todo: hold left mouse to rotate/fly, released left mouse as cursor mode, right mouse to fire, selected-object approach, selected-object docking/autopilot, map/universe navigation.
- Use world coordinates consistently. Freelancer 3D positions are usually `x, y, z`; the 2D game generally maps `x` and `z` into the playfield.
- When adding system data, include resolved display names and infocard text where available from `ids_name`, `strid_name`, and `ids_info`.
- When touching trade lanes, preserve ring order and route grouping from `next_ring`/`prev_ring`; do not treat each ring as an unrelated object.

## Generated Files And Assets
- Files under `data/ship_icons/` and `data/object_icons/` are generated PNG assets.
- `data/ships.js`, `data/object_icons.js`, and `data/game_systems.js` are generated outputs. Prefer updating their generator scripts when changing extraction structure.
- Avoid committing temporary caches such as `tools/__pycache__/`.
- Be cautious with large generated asset churn. Regenerate only what the task needs and mention it in the response.

## Validation
Run the complete dependency-free test suite with:

```bash
node --test tests/*.test.js
```

The suite covers pure gameplay rules, generated-data integrity, active script wiring, and a Chromium browser smoke flow. Set `CHROME_BIN` when Chromium is not discoverable under a common executable name.

For JavaScript/gameplay changes:
- Run `node --test tests/*.test.js` first.
- Open `index.html` or serve the directory with `python -m http.server 8000` for additional manual checks.
- Verify the browser console has no startup errors.
- Verify the start screen opens, the player ship is visible, movement works, map/universe overlays open, and any touched UI flow behaves correctly.

For Python tool changes:
- Run the specific script touched by the task.
- Confirm regenerated files are valid JavaScript or JSON and still load in `index.html`.
- If the script uses FLAtlas rendering, confirm PySide6/FLAtlas imports work in the selected Python environment.

## Known Caution Areas
- The active classic scripts intentionally share a browser global scope and must remain in the order declared by `index.html`; the static tests enforce that order.
- Some older module code references DOM IDs such as `loading-screen`, `galaxy-map`, and `minimap`; confirm the current DOM has those elements before relying on that path.
- The game currently uses global constants from generated scripts, not ES module imports, for the main generated universe and ship data.
- Local paths in generator scripts are Windows-specific and user-machine-specific.
- Resource DLL parsing depends on `pefile`; icon rendering depends on PySide6 and FLAtlas internals.

## Response Expectations
- Answer in German when the user writes in German, unless code or project documents are more natural in English.
- Mention whether a change touched hand-written code, generated data, or generator scripts.
- Call out manual browser checks when no automated validation exists.
- If a task involves local Freelancer or FLAtlas data, state any local-path assumptions clearly.
