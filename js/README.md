# JavaScript paths

`active/` is the only JavaScript runtime loaded by `index.html`:

1. `game-logic.js` — pure, Node-testable rules
2. `core.js` — state, data, saves, equipment, missions, and navigation
3. `world.js` — systems, hazards, entities, and player flight
4. `npc.js` — NPC spawning, AI, combat, and mission actors
5. `runtime-ui.js` — render/update loop, HUD, audio, input, scanner, and system map
6. `universe-map.js` — universe map and its input handling
7. `base-ui.js` — base interiors, docking UI, trade, equipment, and ships
8. `bootstrap.js` — initialization and game start

The sibling directories `core/`, `entities/`, `simulation/`, `ai/`, and `ui/`, plus `main.js`, are older prototype/ES-module implementations. They are not part of the browser entry point and must not be treated as production code without an explicit migration.
