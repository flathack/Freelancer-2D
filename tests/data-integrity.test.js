const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const datasets = [
    ['vanilla-de', 'data/vanilla-de/systems.json'],
    ['vanilla-en', 'data/vanilla-en/systems.json'],
    ['crossfire', 'data/crossfire/systems.json']
];

for (const [name, relativePath] of datasets) {
    const systems = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

    test(`${name} systems expose valid object ids and coordinates`, () => {
        assert.ok(Object.keys(systems).length > 0);
        for (const [systemId, system] of Object.entries(systems)) {
            const objects = [
                ...(system.planets || []), ...(system.suns || []), ...(system.stations || []),
                ...(system.jumpgates || []), ...(system.jumpholes || [])
            ];
            for (const object of objects) {
                const id = String(object.nickname || object.id || '').toLowerCase();
                assert.ok(id, `${systemId} contains an object without an id`);
                assert.ok(Number.isFinite(Number(object.x)), `${systemId}/${id} has invalid x`);
                assert.ok(Number.isFinite(Number(object.z)), `${systemId}/${id} has invalid z`);
            }
        }
    });

    test(`${name} trade lane routes preserve complete ordered ring chains`, () => {
        for (const [systemId, system] of Object.entries(systems)) {
            for (const [routeIndex, lane] of (system.tradelanes || []).entries()) {
                const rings = lane.rings || [];
                assert.ok(rings.length >= 2, `${systemId} route ${routeIndex} is too short`);
                const ids = new Set(rings.map(ring => String(ring.nickname || ring.id || '').toLowerCase()));
                assert.equal(ids.size, rings.length, `${systemId} route ${routeIndex} contains duplicate rings`);
                for (const ring of rings) {
                    const id = ring.nickname || ring.id;
                    assert.ok(Number.isFinite(Number(ring.x)), `${systemId}/${id} has invalid x`);
                    assert.ok(Number.isFinite(Number(ring.z)), `${systemId}/${id} has invalid z`);
                    for (const neighbor of [ring.prev_ring, ring.next_ring].filter(Boolean)) {
                        assert.ok(ids.has(String(neighbor).toLowerCase()), `${systemId}/${id} references missing ring ${neighbor}`);
                    }
                }
            }
        }
    });
}

test('vanilla jump destinations resolve to extracted systems', () => {
    for (const [, relativePath] of datasets.slice(0, 2)) {
        const systems = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
        const ids = new Set(Object.keys(systems).map(id => id.toLowerCase()));
        for (const [systemId, system] of Object.entries(systems)) {
            for (const jump of [...(system.jumpgates || []), ...(system.jumpholes || [])]) {
                if (jump.dest_system) assert.ok(ids.has(String(jump.dest_system).toLowerCase()), `${systemId}/${jump.nickname} points to missing ${jump.dest_system}`);
            }
        }
    }
});
