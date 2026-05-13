# Freelancer 2D Browser Game

Freelancer 2D is a browser-based space sandbox inspired by the structure and systemic feel of **Freelancer**.
It runs with HTML, Canvas, vanilla JavaScript, local data files, and local browser storage.

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
| Mouse | Aim ship |
| Left click | Primary weapon |
| Right click | Secondary weapon / missiles |
| W / mouse wheel up | Increase throttle |
| S / mouse wheel down | Decrease throttle |
| Shift | Cruise mode |
| Space | Brake |
| D | Dock at station |
| G | Enter gate |
| M | Toggle map |
| Tab | Next target |

## Project Structure

```text
index.html      Main game entry point and current bundled game UI
css/            Shared styling
js/             Modular game engine, entities, simulation, AI, and UI code
data/           Game data, systems, equipment, ships, factions, and icons
assets/         Audio, music, textures, menu art, and UI assets
tools/          Helper scripts for generated assets and data work
ships.js        Ship data used by the browser game
```

## Status

This is an active hobby/game prototype. Expect frequent changes to data formats, balancing, UI, and save behavior while the game evolves.

## Notes

Freelancer is used as a design reference and compatibility inspiration. This repository is not affiliated with Microsoft, Digital Anvil, or the original Freelancer rights holders.

## License

MIT License. See [LICENSE](LICENSE).
