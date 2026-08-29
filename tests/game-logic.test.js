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
