const test = require('node:test');
const assert = require('node:assert/strict');
const logic = require('../js/active/game-logic.js');

test('shield absorbs damage before the hull', () => {
    assert.deepEqual(logic.resolveShieldDamage({ hull: 100, shield: 50, amount: 30 }), {
        hull: 100,
        shield: 20,
        hullDamage: 0,
        shieldDamage: 30
    });
});

test('remaining damage reaches the hull after shield break', () => {
    assert.deepEqual(logic.resolveShieldDamage({ hull: 100, shield: 10, amount: 30 }), {
        hull: 80,
        shield: 0,
        hullDamage: 20,
        shieldDamage: 10
    });
});

test('explicit penetration bypasses part of the shield', () => {
    const result = logic.resolveShieldDamage({ hull: 100, shield: 100, amount: 40, penetration: 0.25 });
    assert.equal(result.hull, 90);
    assert.equal(result.shield, 70);
});

test('fleet combat time advances once per simulation step', () => {
    assert.equal(logic.advanceFleetCombatTimer(2, 0.5, true), 2.5);
    assert.equal(logic.advanceFleetCombatTimer(2, 1, false), 1.65);
});

test('intercept angle leads a moving target', () => {
    const direct = Math.atan2(100, 1000);
    const lead = logic.interceptAngle({ x: 0, z: 0 }, { x: 1000, z: 100, vx: 0, vz: 80 }, 500);
    assert.ok(lead > direct);
});

test('base services reflect available market data', () => {
    assert.deepEqual(logic.baseServices({ commodities: [{}], equipment: [], ships: [{}], bar: { news: [] } }), {
        launch: true,
        bar: false,
        trade: true,
        equipment: false,
        ship: true,
        repair: false
    });
});

test('base archetypes select stable layout families', () => {
    assert.equal(logic.classifyBaseKind({ isPlanet: true }), 'planet');
    assert.equal(logic.classifyBaseKind({ archetype: 'l_dreadnought' }), 'battleship');
    assert.equal(logic.classifyBaseKind({ archetype: 'miningbase_badlands' }), 'mining');
    assert.equal(logic.classifyBaseKind({ faction: 'fc_lr_grp' }), 'pirate');
    assert.equal(logic.classifyBaseKind({ name: 'Deep Space Research Laboratory' }), 'research');
    assert.equal(logic.classifyBaseKind({ archetype: 'smallstation1' }), 'station');
});

test('spawned combat mission is safely reset when restored without its NPCs', () => {
    const restored = logic.restoreMissionState({
        id: 'mission-1',
        systemId: 'Li01',
        type: 'combat',
        status: 'combat',
        spawned: true,
        enemyCount: 4,
        remaining: 2
    });
    assert.equal(restored.spawned, false);
    assert.equal(restored.status, 'accepted');
    assert.equal(restored.remaining, 4);
});

test('restored escort mission requests a fresh convoy', () => {
    const restored = logic.restoreMissionState({
        id: 'mission-2',
        systemId: 'Li01',
        type: 'escort',
        status: 'enroute',
        spawned: true,
        escortNpcId: 'npc-old'
    });
    assert.equal(restored.spawned, false);
    assert.equal(restored.status, 'accepted');
    assert.equal(restored.escortNpcId, '');
});

test('mission offer rotation guarantees all supported mission types', () => {
    assert.deepEqual(Array.from({ length: 8 }, (_, index) => logic.missionTypeForIndex(index)), [
        'combat', 'transport', 'patrol', 'escort',
        'combat', 'transport', 'patrol', 'escort'
    ]);
});

test('patrol route advances only inside the checkpoint radius', () => {
    const checkpoints = [{ x: 100, z: 100 }, { x: 500, z: 100 }];
    assert.deepEqual(logic.advancePatrolRoute(checkpoints, 0, { x: 1000, z: 1000 }, 100), {
        index: 0,
        reached: false,
        complete: false
    });
    assert.deepEqual(logic.advancePatrolRoute(checkpoints, 0, { x: 120, z: 100 }, 100), {
        index: 1,
        reached: true,
        complete: false
    });
    assert.deepEqual(logic.advancePatrolRoute(checkpoints, 1, { x: 500, z: 100 }, 100), {
        index: 2,
        reached: true,
        complete: true
    });
});

test('distance and ETA formatting cover short, long, and invalid values', () => {
    assert.equal(logic.formatDistance(850), '850 m');
    assert.equal(logic.formatDistance(1500), '1.5 km');
    assert.equal(logic.formatDistance(12500), '13 km');
    assert.equal(logic.formatDistance(Infinity), '-');
    assert.equal(logic.formatEta(0), '0:00');
    assert.equal(logic.formatEta(60.1), '1:01');
    assert.equal(logic.formatEta(-1), '--:--');
});

test('reputation thresholds are stable at their boundaries', () => {
    assert.equal(logic.reputationStatus(-0.6), 'hostile');
    assert.equal(logic.reputationStatus(-0.59), 'neutral');
    assert.equal(logic.reputationStatus(0.59), 'neutral');
    assert.equal(logic.reputationStatus(0.6), 'friendly');
});

test('trade lane entry chooses endpoints and pilot-facing direction', () => {
    const rings = [{ x: 0, z: 0 }, { x: 100, z: 0 }, { x: 200, z: 0 }];
    assert.deepEqual(logic.tradeLaneStart(rings, 0, 0), { targetIndex: 1, direction: 1 });
    assert.deepEqual(logic.tradeLaneStart(rings, 2, 0), { targetIndex: 1, direction: -1 });
    assert.deepEqual(logic.tradeLaneStart(rings, 1, Math.PI), { targetIndex: 0, direction: -1 });
    assert.equal(logic.tradeLaneStart([{ x: 0, z: 0 }], 0, 0), null);
});

test('distance to a route segment clamps to its endpoints', () => {
    assert.equal(logic.distancePointToSegment(5, 4, 0, 0, 10, 0), 4);
    assert.equal(logic.distancePointToSegment(-3, 4, 0, 0, 10, 0), 5);
    assert.equal(logic.distancePointToSegment(3, 4, 0, 0, 0, 0), 5);
});

test('zone geometry supports ellipse, sphere, rotated box, and margins', () => {
    assert.equal(logic.pointInsideZone({ x: 0, z: 0, sizeX: 100, sizeZ: 50 }, 90, 0), true);
    assert.equal(logic.pointInsideZone({ x: 0, z: 0, sizeX: 100, sizeZ: 50 }, 0, 60), false);
    assert.equal(logic.pointInsideZone({ x: 0, z: 0, shape: 'SPHERE', size: 100 }, 70, 70), true);
    assert.equal(logic.pointInsideZone({ x: 0, z: 0, shape: 'BOX', sizeX: 100, sizeZ: 40, rotateY: 90 }, 0, 45), true);
    assert.equal(logic.pointInsideZone({ x: 0, z: 0, shape: 'BOX', sizeX: 100, sizeZ: 40 }, 58, 0, 10), true);
});

test('trade purchase quote respects cargo, credits, and stock', () => {
    assert.deepEqual(logic.tradePurchaseQuote({ requested: 20, cargoUsed: 5, cargoCapacity: 15, credits: 700, unitPrice: 100, stock: 4 }), {
        quantity: 4,
        total: 400,
        freeCargo: 10,
        affordable: 7
    });
    assert.equal(logic.tradePurchaseQuote({ requested: 3, cargoUsed: 10, cargoCapacity: 10, credits: 1000, unitPrice: 10 }).quantity, 0);
});

test('trade sale quote never sells more than owned cargo', () => {
    assert.deepEqual(logic.tradeSaleQuote({ requested: 8, owned: 3, unitPrice: 125 }), { quantity: 3, total: 375 });
    assert.deepEqual(logic.tradeSaleQuote({ requested: -2, owned: 3, unitPrice: 125 }), { quantity: 0, total: 0 });
});

test('invalid and negative combat inputs are safely clamped', () => {
    assert.deepEqual(logic.resolveShieldDamage({ hull: -5, shield: -10, amount: -20 }), {
        hull: 0,
        shield: 0,
        hullDamage: 0,
        shieldDamage: 0
    });
    assert.equal(logic.regenerateShield(90, 100, 50, 1), 100);
    assert.equal(logic.regenerateShield(20, 0, 50, 1), 0);
});

test('duplicate extracted object names receive deterministic runtime ids', () => {
    assert.deepEqual(logic.uniqueObjectIds([
        { nickname: 'CF14_Depot' },
        { nickname: 'cf14_depot' },
        { id: 'station' },
        {}
    ], 'Li01_object'), ['CF14_Depot', 'cf14_depot__2', 'station', 'Li01_object_4']);
});

test('angle normalization and intercept fallback cover circular edge cases', () => {
    assert.ok(Math.abs(logic.normalizeAngle(Math.PI * 5) - Math.PI) < 1e-10);
    assert.ok(Math.abs(logic.normalizeAngle(-Math.PI * 5) + Math.PI) < 1e-10);
    assert.equal(logic.normalizeAngle('invalid'), 0);
    assert.equal(logic.interceptAngle({ x: 0, z: 0 }, { x: 100, z: 0, vx: 1000, vz: 0 }, 10), 0);
    assert.equal(logic.interceptAngle(null, null, 0), 0);
});

test('NPC cruise hysteresis prevents flicker and honors blockers', () => {
    assert.equal(logic.npcCruiseDecision({ distance: 5000 }), true);
    assert.equal(logic.npcCruiseDecision({ distance: 3000 }), false);
    assert.equal(logic.npcCruiseDecision({ active: true, distance: 3000 }), true);
    assert.equal(logic.npcCruiseDecision({ active: true, distance: 1200 }), false);
    for (const blocker of ['disrupted', 'hidden', 'inTradeLane', 'combat', 'disabled']) {
        assert.equal(logic.npcCruiseDecision({ active: true, distance: 9000, [blocker]: true }), false, blocker);
    }
});

test('NPC combat state selects flee, intercept, break, and engage maneuvers', () => {
    const ranges = { minimumRange: 300, maximumRange: 1000, maxHull: 100, maxShield: 100 };
    assert.equal(logic.npcCombatState({ ...ranges, distance: 500, hull: 20, shield: 100 }), 'flee');
    assert.equal(logic.npcCombatState({ ...ranges, distance: 500, hull: 35, shield: 5 }), 'flee');
    assert.equal(logic.npcCombatState({ ...ranges, distance: 1300, hull: 100, shield: 100 }), 'intercept');
    assert.equal(logic.npcCombatState({ ...ranges, distance: 200, hull: 100, shield: 100 }), 'break');
    assert.equal(logic.npcCombatState({ ...ranges, distance: 700, hull: 100, shield: 100 }), 'engage');
    assert.equal(logic.npcCombatState({ distance: 1, hull: 1, maxHull: 1 }), 'break');
});

test('base service defaults and bar NPCs remain safe without market arrays', () => {
    assert.deepEqual(logic.baseServices(), {
        launch: true, bar: false, trade: false, equipment: false, ship: false, repair: false
    });
    assert.equal(logic.baseServices({ bar: { npcs: [{}] } }).bar, true);
});

test('mission restoration rejects invalid saves and preserves passive missions', () => {
    assert.equal(logic.restoreMissionState(null), null);
    assert.equal(logic.restoreMissionState({ type: 'combat' }), null);
    assert.deepEqual(logic.restoreMissionState({ systemId: 'Li01', type: 'transport', spawned: true }), {
        systemId: 'Li01', type: 'transport', spawned: true
    });
    assert.equal(logic.restoreMissionState({ systemId: 'Li01', type: 'destroy', spawned: true }).status, 'accepted');
});

test('free goods and invalid stock values are quoted without infinities', () => {
    assert.deepEqual(logic.tradePurchaseQuote({ requested: 3, cargoCapacity: 5, credits: 0, unitPrice: 0, stock: 2 }), {
        quantity: 2, total: 0, freeCargo: 5, affordable: 5
    });
    assert.equal(logic.tradePurchaseQuote({ requested: 3, cargoCapacity: 5, credits: 100, unitPrice: 1, stock: -1 }).quantity, 3);
});

test('ID generation accepts empty and blank records', () => {
    assert.deepEqual(logic.uniqueObjectIds(null), []);
    assert.deepEqual(logic.uniqueObjectIds([{ nickname: '  ' }, { id: '' }], 'gate'), ['gate_1', 'gate_2']);
});
