const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const extractor = fs.readFileSync(path.join(root, 'tools', 'extract_universe_data.py'), 'utf8');

test('game entry exposes required surfaces', () => {
    for (const id of ['game-canvas', 'hud', 'start-screen', 'scanner-list', 'landing-overlay', 'map-overlay']) {
        assert.match(html, new RegExp(`id=["']${id}["']`));
    }
});

test('active shared game logic is loaded before the inline game', () => {
    const logicIndex = html.indexOf('js/active/game-logic.js');
    const inlineIndex = html.indexOf('<script>');
    assert.ok(logicIndex >= 0, 'active game logic script is missing');
    assert.ok(logicIndex < inlineIndex, 'active game logic must load before inline game code');
});

test('referenced local script files exist', () => {
    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(match => match[1].split('?')[0]);
    for (const script of scripts) assert.ok(fs.existsSync(path.join(root, script)), `missing ${script}`);
});

test('info panel visibility uses computed style instead of an empty inline style', () => {
    assert.match(html, /getComputedStyle\(panel\)\.display === 'none'/);
});

test('system map is decluttered and frame-rate limited', () => {
    assert.match(html, /function drawDeclutteredMapLabels/);
    assert.match(html, /game\.mapZoom >= 2\.4/);
    assert.match(html, /game\.mapRenderInterval \|\| 180/);
});

test('trade lane rings stay visible and mod archetypes are extracted', () => {
    assert.match(html, /function drawSystemMapTradeLanes/);
    assert.match(html, /drawSystemMapTradeLanes\(ctx, mapTransform\)/);
    assert.match(html, /if \(!\(entity instanceof TradeLaneRing\)\) entity\.render\(ctx\)/);
    assert.match(extractor, /def is_trade_lane_ring_archetype/);
    assert.match(extractor, /'trade_lane_ring' in normalized/);
});

test('active mission loop exposes combat, transport, patrol, and escort paths', () => {
    for (const type of ['transport', 'patrol', 'escort']) {
        assert.match(html, new RegExp(`type === ['"]${type}['"]`), `missing ${type} mission path`);
    }
    assert.match(html, /spawnMissionEnemies/);
    assert.match(html, /advancePatrolRoute/);
    assert.match(html, /handleMissionDock/);
    assert.match(html, /spawnEscortMission/);
});
