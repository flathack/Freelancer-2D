const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const chromeCandidates = [
    process.env.CHROME_BIN,
    'chromium',
    'chromium-browser',
    'google-chrome',
    'chrome',
    process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env['PROGRAMFILES(X86)'] && `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
].filter(Boolean);

const chrome = chromeCandidates.find(command => {
    const result = spawnSync(command, ['--version'], { stdio: 'ignore' });
    return !result.error && result.status === 0;
});

function contentType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    return ({
        '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
        '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav'
    })[extension] || 'application/octet-stream';
}

function createStaticServer() {
    return http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
        const filePath = path.resolve(root, relative);
        if (!filePath.startsWith(root + path.sep)) {
            response.writeHead(403).end();
            return;
        }
        fs.readFile(filePath, (error, data) => {
            if (error) {
                response.writeHead(404).end();
                return;
            }
            response.writeHead(200, { 'content-type': contentType(filePath), 'cache-control': 'no-store' });
            response.end(data);
        });
    });
}

function waitForDevtools(process, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
        let stderr = '';
        const timeout = setTimeout(() => reject(new Error(`Chromium did not expose DevTools: ${stderr.slice(-1000)}`)), timeoutMs);
        process.stderr.on('data', chunk => {
            stderr += chunk.toString();
            const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
            if (match) {
                clearTimeout(timeout);
                resolve(match[1]);
            }
        });
        process.once('exit', code => {
            clearTimeout(timeout);
            reject(new Error(`Chromium exited before startup (${code}): ${stderr.slice(-1000)}`));
        });
    });
}

function createCdpClient(webSocketUrl) {
    const socket = new WebSocket(webSocketUrl);
    const pending = new Map();
    const listeners = new Map();
    let nextId = 1;
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const { resolve, reject, timeout } = pending.get(message.id);
            clearTimeout(timeout);
            pending.delete(message.id);
            if (message.error) reject(new Error(message.error.message));
            else resolve(message.result);
            return;
        }
        for (const listener of listeners.get(message.method) || []) listener(message.params || {});
    });
    const ready = new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', () => reject(new Error('Could not connect to Chromium DevTools')), { once: true });
    });
    return {
        ready,
        on(method, listener) {
            const entries = listeners.get(method) || [];
            entries.push(listener);
            listeners.set(method, entries);
        },
        send(method, params = {}, timeoutMs = 30000) {
            const id = nextId++;
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    pending.delete(id);
                    reject(new Error(`CDP command timed out: ${method}`));
                }, timeoutMs);
                pending.set(id, { resolve, reject, timeout });
                socket.send(JSON.stringify({ id, method, params }));
            });
        },
        close() { socket.close(); }
    };
}

async function poll(evaluate, expression, timeoutMs = 30000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const value = await evaluate(expression);
        if (value) return value;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Browser condition timed out: ${expression}`);
}

test('browser smoke: flight, input, maps, saves, NPC AI, trade lanes, trading, and docking', { skip: !chrome, timeout: 60000 }, async () => {
    const server = createStaticServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'freelancer2d-browser-'));
    const browser = spawn(chrome, [
        '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
        '--autoplay-policy=no-user-gesture-required', '--remote-debugging-port=0',
        '--window-size=1280,720', `--user-data-dir=${profile}`, 'about:blank'
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    let client;
    try {
        const browserWebSocket = await waitForDevtools(browser);
        const debuggerPort = new URL(browserWebSocket).port;
        const targetUrl = `http://127.0.0.1:${port}/`;
        const target = await fetch(`http://127.0.0.1:${debuggerPort}/json/new?${encodeURIComponent(targetUrl)}`, { method: 'PUT' }).then(response => response.json());
        client = createCdpClient(target.webSocketDebuggerUrl);
        await client.ready;
        const exceptions = [];
        client.on('Runtime.exceptionThrown', event => exceptions.push(event.exceptionDetails?.text || 'Runtime exception'));
        await client.send('Runtime.enable');
        await client.send('Page.enable');
        const evaluate = async expression => {
            const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
            if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
            return result.result?.value;
        };

        await poll(evaluate, `document.readyState === 'complete' && typeof game === 'object' && !!game.player && game.entities.length > 0`);
        const initial = await evaluate(`({ player: !!game.player, entities: game.entities.length, npcs: game.npcs.length, hud: !!document.getElementById('hud') })`);
        assert.equal(initial.player, true);
        assert.equal(initial.hud, true);
        assert.ok(initial.entities > 0);
        assert.ok(initial.npcs > 0, 'ambient NPC traffic should be seeded');

        await evaluate(`startGame(); true`);
        await poll(evaluate, `game.running && document.getElementById('start-screen').classList.contains('hidden')`);
        const hud = await evaluate(`({ system: document.getElementById('system-name').textContent, mode: document.getElementById('mode-indicator').textContent, hull: document.getElementById('hull-value').textContent })`);
        assert.ok(hud.system.trim().length > 0);
        assert.ok(hud.mode.length > 0);
        assert.match(hud.hull, /%/);

        const before = await evaluate(`({ x: game.player.x, z: game.player.z })`);
        await evaluate(`game.player.rotation = 0; game.player.speed = 50; game.player.throttle = 1; true`);
        await new Promise(resolve => setTimeout(resolve, 350));
        const after = await evaluate(`({ x: game.player.x, z: game.player.z })`);
        assert.ok(Math.hypot(after.x - before.x, after.z - before.z) > 0.1, 'player should move during free flight');

        await evaluate(`toggleMap(); true`);
        const map = await poll(evaluate, `game.showMap && !document.getElementById('map-overlay').classList.contains('hidden') && document.getElementById('map-canvas').width > 0`);
        assert.equal(map, true);
        await evaluate(`toggleMap(); true`);

        const universeView = await evaluate(`(() => { toggleUniverseView(); return game.showMap && document.getElementById('map-universe-canvas').style.display === 'block' && !document.getElementById('map-overlay').classList.contains('hidden'); })()`);
        assert.equal(universeView, true);
        await evaluate(`toggleMap(); true`);

        const controls = await evaluate(`(() => {
            game.player.throttle = 0.4;
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
            const throttleRaised = game.player.throttle > 0.4;
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
            const strafing = game.player.strafeLeftActive;
            window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }));
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab', cancelable: true }));
            const afterburner = game.player.afterburnerActive;
            window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Tab', cancelable: true }));
            window.dispatchEvent(new Event('blur'));
            return { throttleRaised, strafing, released: !game.player.strafeLeftActive, afterburner, afterburnerReleased: !game.player.afterburnerActive };
        })()`);
        assert.deepEqual(controls, { throttleRaised: true, strafing: true, released: true, afterburner: true, afterburnerReleased: true });

        const overlays = await evaluate(`(() => {
            toggleInventoryPanel(true);
            const inventory = !document.getElementById('inventory-overlay').classList.contains('hidden');
            toggleInventoryPanel(false);
            toggleReputationPanel(true);
            const reputation = !document.getElementById('reputation-overlay').classList.contains('hidden');
            toggleReputationPanel(false);
            const beforeLanguage = game.language;
            toggleLanguage();
            const languageChanged = game.language !== beforeLanguage;
            toggleLanguage();
            return { inventory, reputation, languageChanged, languageRestored: game.language === beforeLanguage };
        })()`);
        assert.deepEqual(overlays, { inventory: true, reputation: true, languageChanged: true, languageRestored: true });

        const logContract = await evaluate(`(() => {
            for (let index = 0; index < 65; index++) addLog('HUD log test ' + index, index === 64 ? 'alert' : 'system');
            const entries = [...document.querySelectorAll('#log-area .log-entry')];
            return { count: entries.length, newestAlert: entries.at(-1)?.classList.contains('log-entry-alert'), inlineColor: entries.at(-1)?.style.color || '' };
        })()`);
        assert.deepEqual(logContract, { count: 60, newestAlert: true, inlineColor: '' });

        const inspectHudLayout = () => evaluate(`(() => {
            const ids = ['music-player', 'command-bar', 'utility-bar', 'hud-context', 'hud-left', 'hud-bottom', 'hud-right', 'zoom-control', 'speed-control'];
            const visible = id => {
                const element = document.getElementById(id);
                const rect = element.getBoundingClientRect();
                return getComputedStyle(element).display !== 'none' && rect.width > 0 && rect.height > 0
                    ? { id, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
                    : null;
            };
            const boxes = ids.map(visible).filter(Boolean);
            const overlaps = (a, b) => a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
            const byId = Object.fromEntries(boxes.map(box => [box.id, box]));
            return {
                width: innerWidth,
                withinViewport: boxes.every(box => box.left >= -1 && box.top >= -1 && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1),
                sidePanelsClearFlightCore: !overlaps(byId['hud-bottom'], byId['hud-left']) && !overlaps(byId['hud-right'], byId['hud-left']),
                panelsDoNotOverflow: ['scanner-panel', 'loadout-panel'].every(id => { const element = document.getElementById(id); return element.scrollWidth <= element.clientWidth + 1; })
            };
        })()`);
        for (const viewport of [{ width: 1280, height: 720 }, { width: 820, height: 720 }, { width: 600, height: 800 }]) {
            await client.send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });
            await new Promise(resolve => setTimeout(resolve, 80));
            const layout = await inspectHudLayout();
            assert.equal(layout.width, viewport.width);
            assert.equal(layout.withinViewport, true, `HUD must stay inside ${viewport.width}px viewport`);
            assert.equal(layout.sidePanelsClearFlightCore, true, `HUD panels must not overlap at ${viewport.width}px`);
            assert.equal(layout.panelsDoNotOverflow, true, `HUD content must not overflow at ${viewport.width}px`);
        }
        await client.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });

        const saveRoundTrip = await evaluate(`(() => {
            const expected = { x: 1234, z: -5678, credits: 424242, cargo: [{ id: 'commodity_food', name: 'Food', quantity: 2, avgPrice: 50 }] };
            Object.assign(game.player, expected);
            game.waypoint = { name: 'Saved target', x: 900, z: 800, systemId: currentSystemId, type: 'Waypoint' };
            saveGame();
            const saved = readSavedGame();
            game.player.x = 0; game.player.z = 0; game.player.credits = 0; game.player.cargo = []; game.waypoint = null;
            restorePlayerFromSave(saved);
            return {
                saved: !!saved,
                position: game.player.x === expected.x && game.player.z === expected.z,
                credits: game.player.credits === expected.credits,
                cargo: game.player.cargo[0]?.id === expected.cargo[0].id && game.player.cargo[0]?.quantity === 2,
                waypoint: game.waypoint?.name === 'Saved target'
            };
        })()`);
        assert.deepEqual(saveRoundTrip, { saved: true, position: true, credits: true, cargo: true, waypoint: true });

        const npcSimulation = await evaluate(`(() => {
            const npc = createNPC('pirate', { x: game.player.x + 1100, z: game.player.z, difficulty: 3 });
            npc.hostileToPlayer = true;
            npc.aiDecisionTimer = 0;
            game.npcs.push(npc);
            for (let step = 0; step < 240; step++) updateNPC(npc, 1 / 60);
            return { finite: Number.isFinite(npc.x) && Number.isFinite(npc.z) && Number.isFinite(npc.rotation), state: npc.aiState, moved: Math.hypot(npc.x - (game.player.x + 1100), npc.z - game.player.z) > 1 };
        })()`);
        assert.equal(npcSimulation.finite, true);
        assert.ok(['flee', 'intercept', 'break', 'engage'].includes(npcSimulation.state));
        assert.equal(npcSimulation.moved, true);

        const tradeLane = await evaluate(`(() => {
            const ring = game.entities.find(entity => entity instanceof TradeLaneRing && entity.laneRings?.length > 1);
            if (!ring) return { available: false };
            const entered = startTradeLaneFromRing(ring);
            const targetIsNeighbor = Math.abs(game.player.laneIndex - ring.index) === 1;
            game.player.exitTradeLane();
            return { available: true, entered, targetIsNeighbor, exited: !game.player.inTradeLane };
        })()`);
        assert.deepEqual(tradeLane, { available: true, entered: true, targetIsNeighbor: true, exited: true });

        const docked = await evaluate(`(() => { const target = game.entities.find(entity => entity instanceof Station && (entity.base || entity.dockWith)); if (!target) return false; openLandingWindow(target); return game.isDocked && !!game.interior?.active && document.getElementById('hud').classList.contains('interior-mode'); })()`);
        assert.equal(docked, true);

        const trading = await evaluate(`(() => {
            const entry = getCommodityMarket().find(item => item.forSale && getCommodity(item.id));
            if (!entry) return { available: false };
            game.player.credits = Math.max(game.player.credits, entry.price * 10);
            const beforeCredits = game.player.credits;
            const beforeQuantity = findCargoItem(entry.id)?.quantity || 0;
            buyCommodity(entry.id, 1);
            const afterBuyQuantity = findCargoItem(entry.id)?.quantity || 0;
            const afterBuyCredits = game.player.credits;
            sellCommodity(entry.id, 1);
            return {
                available: true,
                bought: afterBuyQuantity === beforeQuantity + 1 && afterBuyCredits === beforeCredits - entry.price,
                sold: (findCargoItem(entry.id)?.quantity || 0) === beforeQuantity && game.player.credits > afterBuyCredits
            };
        })()`);
        assert.deepEqual(trading, { available: true, bought: true, sold: true });
        await evaluate(`launchFromBase(); true`);
        assert.equal(await evaluate(`!game.isDocked && !game.interior`), true);
        assert.deepEqual(exceptions, []);
    } finally {
        client?.close();
        browser.kill('SIGTERM');
        await new Promise(resolve => server.close(resolve));
        fs.rmSync(profile, { recursive: true, force: true });
    }
});
