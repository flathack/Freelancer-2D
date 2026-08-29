# Tests

Run everything without a package installation or build step:

```bash
node --test tests/*.test.js
```

Coverage layers:

- `game-logic.test.js`: deterministic combat, navigation, geometry, reputation, missions, trade, and ID normalization.
- `data-integrity.test.js`: Vanilla DE, Vanilla EN, and Crossfire object coordinates plus ordered trade-lane chains.
- `static-smoke.test.js`: DOM contract, active module order, syntax, handlers, architecture boundaries, and regression guards.
- `browser-smoke.test.js`: headless Chromium flow covering initialization, game start, free flight, HUD, system map, ambient NPCs, docking, and launch.

The browser smoke test discovers Chromium automatically. Set `CHROME_BIN` to a compatible Chrome/Chromium executable when needed.
