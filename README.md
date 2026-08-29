# Freelancer 2D Browser Game

Freelancer 2D is a browser-based space sandbox inspired by the structure and systemic feel of **Freelancer**.
It runs with HTML, Canvas, vanilla JavaScript, local data files, and local browser storage.

Play the game directly here!
https://flathack.github.io/Freelancer-2D/

## Features

- 2D ship flight with mouse aiming and throttle controls
- trade lanes, docking, gates, jump-style system travel, and local save slots
- faction, reputation, economy, commodity, ship, and station data
- NPC simulation for traders, miners, police, and pirates
- combat with weapons, shields, missiles, countermeasures, and cruise disruption
- multiple data sets, including vanilla-style and mod-oriented data folders
- audio, ship icons, object icons, planet textures, and menu assets

## Run

The project is static. For the most reliable local preview, serve the repository root:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Opening `index.html` directly can work for simple checks, but a local server is better for loading data, scripts, audio, and images consistently.

## Controls

| Input | Action |
| --- | --- |
| Left mouse, held | Rotate and steer ship |
| Left mouse, released | Cursor and HUD interaction mode |
| Right mouse | Fire primary weapons |
| Q | Fire missiles |
| W | Increase throttle |
| S | Reduce throttle / cancel cruise |
| X | Reverse thrust |
| Tab | Hold afterburner |
| A / D | Drift left / right |
| M | Toggle map |
| G / N | Use nanobot |
| F / B | Use shield battery |
| E | Drop mine |
| C | Drop countermeasure |
| Mouse wheel | Zoom |

## Project Structure

```text
index.html      Main game entry point and current bundled game UI
css/            Shared styling
js/active/      Shared logic used by the active browser game and tests
js/             Active code plus an older, currently unwired module prototype
data/           Game data, systems, equipment, ships, factions, and icons
assets/         Audio, music, textures, menu art, and UI assets
tools/          Helper scripts for generated assets and data work
ships.js        Ship data used by the browser game
```

## Status

This is an active hobby/game prototype. Expect frequent changes to data formats, balancing, UI, and save behavior while the game evolves.

## Tests

Run the dependency-free logic and static smoke tests with:

```text
node --test tests/*.test.js
```

The browser loads only the selected mod bundle. Generated standalone data files remain available to the extraction pipeline but are not loaded in parallel with the active bundle.

## Notes

Freelancer is used as a design reference and compatibility inspiration. This repository is not affiliated with Microsoft, Digital Anvil, or the original Freelancer rights holders.

## License

MIT License. See [LICENSE](LICENSE).
