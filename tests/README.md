# Tests

Run everything without a package installation or build step:

```bash
node --test tests/*.test.js
```

Coverage layers:

- `game-logic.test.js`: deterministic combat and NPC maneuver decisions, cruise hysteresis, navigation, geometry, reputation, missions, trade, and ID normalization.
- `data-integrity.test.js`: Vanilla DE, Vanilla EN, and Crossfire object coordinates plus ordered trade-lane chains.
- `static-smoke.test.js`: DOM contract, active module order, syntax, handlers, architecture boundaries, and regression guards.
- `browser-smoke.test.js`: headless Chromium flow covering initialization, game start, free flight, keyboard input, HUD, system/universe maps, overlays, language switching, save/restore, ambient and hostile NPC simulation, trade lanes, docking, commodity trading, and launch.

The browser smoke test discovers Chromium automatically. Set `CHROME_BIN` to a compatible Chrome/Chromium executable when needed.

GitHub Actions runs the complete suite on every push and pull request. It also enforces minimum coverage for the extracted pure gameplay core: 99% lines, 75% branches, and 95% functions. Browser-driven classic scripts are validated through observable gameplay contracts instead of misleading line-count coverage.
