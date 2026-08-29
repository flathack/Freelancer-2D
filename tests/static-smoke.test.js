const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const extractor = fs.readFileSync(path.join(root, 'tools', 'extract_universe_data.py'), 'utf8');
const scriptPaths = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(match => match[1].split('?')[0]);
const activeSource = scriptPaths
    .filter(script => script.startsWith('js/active/'))
    .map(script => fs.readFileSync(path.join(root, script), 'utf8'))
    .join('\n');

test('game entry exposes required surfaces', () => {
    for (const id of ['game-canvas', 'hud', 'start-screen', 'scanner-list', 'landing-overlay', 'map-overlay']) {
        assert.match(html, new RegExp(`id=["']${id}["']`));
    }
});

test('active runtime is modular and loaded in dependency order', () => {
    const expected = [
        'js/active/game-logic.js', 'js/active/core.js', 'js/active/world.js',
        'js/active/npc.js', 'js/active/runtime-ui.js', 'js/active/universe-map.js',
        'js/active/base-ui.js', 'js/active/bootstrap.js'
    ];
    assert.deepEqual(scriptPaths, expected);
    assert.doesNotMatch(html, /<script>\s*\/\/ Freelancer ID Lookup Table/);
    assert.match(html, /css\/active-game\.css/);
});

test('referenced local script files exist', () => {
    for (const script of scriptPaths) assert.ok(fs.existsSync(path.join(root, script)), `missing ${script}`);
});

test('active runtime files parse independently as classic scripts', () => {
    for (const script of scriptPaths) {
        const source = fs.readFileSync(path.join(root, script), 'utf8');
        assert.doesNotThrow(() => new Function(source), `${script} contains invalid JavaScript`);
    }
});

test('HTML ids are unique and inline handlers resolve to active functions', () => {
    const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'duplicate DOM ids found');
    const handlers = [...html.matchAll(/\sonclick=["']([A-Za-z_$][\w$]*)\s*\(/g)].map(match => match[1]);
    for (const handler of new Set(handlers)) {
        assert.match(activeSource, new RegExp(`(?:function\\s+${handler}\\s*\\(|window\\.${handler}\\s*=)`), `missing click handler ${handler}`);
    }
});

test('entry document stays a shell instead of regaining the monolith', () => {
    assert.ok(html.split('\n').length < 500, 'index.html has grown beyond the shell boundary');
    assert.doesNotMatch(html, /<style>/);
    assert.doesNotMatch(html, /<script>(?!\s*<\/script>)/);
});

test('info panel visibility uses computed style instead of an empty inline style', () => {
    assert.match(activeSource, /getComputedStyle\(panel\)\.display === 'none'/);
});

test('system map is decluttered and frame-rate limited', () => {
    assert.match(activeSource, /function drawDeclutteredMapLabels/);
    assert.match(activeSource, /game\.mapZoom >= 2\.4/);
    assert.match(activeSource, /game\.mapRenderInterval \|\| 180/);
});

test('trade lane rings stay visible and mod archetypes are extracted', () => {
    assert.match(activeSource, /function drawSystemMapTradeLanes/);
    assert.match(activeSource, /drawSystemMapTradeLanes\(ctx, mapTransform\)/);
    assert.match(activeSource, /if \(!\(entity instanceof TradeLaneRing\)\) entity\.render\(ctx\)/);
    assert.match(extractor, /def is_trade_lane_ring_archetype/);
    assert.match(extractor, /'trade_lane_ring' in normalized/);
});

test('active mission loop exposes combat, transport, patrol, and escort paths', () => {
    for (const type of ['transport', 'patrol', 'escort']) {
        assert.match(activeSource, new RegExp(`type === ['"]${type}['"]`), `missing ${type} mission path`);
    }
    assert.match(activeSource, /spawnMissionEnemies/);
    assert.match(activeSource, /advancePatrolRoute/);
    assert.match(activeSource, /handleMissionDock/);
    assert.match(activeSource, /spawnEscortMission/);
});

test('runtime system objects receive collision-safe ids', () => {
    assert.match(activeSource, /Freelancer2DLogic\.uniqueObjectIds/);
    assert.match(activeSource, /runtimeIdByObject/);
});

test('ambient NPC traffic is seeded once during initialization', () => {
    const bootstrap = fs.readFileSync(path.join(root, 'js/active/bootstrap.js'), 'utf8');
    assert.equal((bootstrap.match(/seedAmbientTradeTrafficForSystem\(\)/g) || []).length, 1);
});
