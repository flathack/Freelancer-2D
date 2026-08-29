// NPC Ship
function createNPC(type, options = {}) {
    const colors = { trader: '#44aa44', pirate: '#aa4444', police: '#4444aa', civilian: '#888888' };
    const difficulty = Number(options.difficulty || 1);
    const optionFaction = normalizeFactionId(options.faction || (type === 'pirate' ? 'fc_lr_grp' : type === 'police' ? 'li_p_grp' : type === 'trader' ? 'co_ss_grp' : ''));
    const npcShip = options.npcShip || chooseNpcShipForRole(type, difficulty, optionFaction);
    const details = npcLoadoutDetails(npcShip, difficulty);
    const ship = details.ship;
    const shieldItem = details.shieldItem;
    const factionId = optionFaction;
    const shipVisual = resolveNpcShipVisual(npcShip, ship, type, factionId);
    const shipIdText = String(npcShip?.ship || shipVisual.shipId || '').toLowerCase();
    const transportScale = shipIdText.includes('ge_train') || shipIdText.includes('large_train') ? 2.6 : shipIdText.includes('transport') ? 1.9 : 1;
    const hullValue = options.hull || Math.round(Math.max(90, Math.min(1800, (Number(ship?.hitPts || 650) * 0.14 + difficulty * 28) * transportScale)));
    const shieldValue = options.shield || Math.round(Math.max(50, Math.min(520, Number(shieldItem?.hitPts || 180) * 0.35 + difficulty * 18)));
    const handling = ship?.handling || {};
    return {
        id: 'npc-' + Math.random().toString(36).substr(2, 9),
        name: options.name || ((type === 'pirate' ? 'SH' : type === 'trader' ? 'MV' : 'PD') + '-' + (Math.floor(Math.random() * 9000) + 1000)),
        x: Number.isFinite(options.x) ? options.x : (Math.random() - 0.5) * 60000,
        z: Number.isFinite(options.z) ? options.z : (Math.random() - 0.5) * 60000,
        rotation: Math.random() * Math.PI * 2,
        speed: 0, throttle: 0.3,
        role: type, hull: hullValue, maxHull: hullValue,
        faction: factionId,
        populationZoneId: options.populationZoneId || '',
        encounter: options.encounter || '',
        shield: shieldValue, maxShield: shieldValue,
        shieldRegen: Math.max(0, shieldRegenFromEquipment(shieldItem)),
        maxSpeed: options.maxSpeed || (type === 'trader' ? 85 + Math.random() * 18 : 110 + difficulty * 18 + Math.random() * 35),
        turnRate: Math.max(0.65, Math.min(2.9, Number(handling.turnRate) || (type === 'trader' ? 1.15 : 2.0))),
        radius: shipVisualWorldRadius(shipVisual.shipRecord || ship, { shipId: shipVisual.shipId, type }),
        color: colors[type], stateTimer: 0,
        shieldRotation: 0,
        missionId: options.missionId || '',
        fireCooldown: 0,
        weaponDamage: 12 + difficulty * 5,
        npcShipId: npcShip?.id || '',
        shipId: shipVisual.shipId,
        shipName: shipVisual.shipName,
        shipIcon: shipVisual.shipIcon,
        shipIconFallback: shipVisual.shipIconFallback,
        cruiseActive: false,
        cruiseSpeed: Math.max(220, Math.min(cruiseSpeedForMod() * (type === 'trader' ? 0.86 : 0.76), 390)),
        loadoutId: npcShip?.loadout || '',
        shieldName: shieldItem?.name || '',
        weapons: details.weaponStats.length ? details.weaponStats : [weaponStatsFromEquipment(getEquipment('li_gun01_mark01'), difficulty)],
        nextWeaponIndex: 0
    };
}

function spawnMissionEnemies(mission) {
    if (!mission || mission.spawned || mission.systemId !== currentSystemId) return;
    const count = clamp(Number(mission.enemyCount) || MISSION_ENEMY_MIN_COUNT, MISSION_ENEMY_MIN_COUNT, MISSION_ENEMY_MAX_COUNT);
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.45;
        const distance = 420 + Math.random() * 760;
        const npcShip = chooseNpcShipForMission(mission.difficulty);
        game.npcs.push(createNPC('pirate', {
            name: (npcShip?.ship || 'Raider') + '-' + (i + 1),
            x: mission.x + Math.cos(angle) * distance,
            z: mission.z + Math.sin(angle) * distance,
            difficulty: mission.difficulty,
            npcShip,
            missionId: mission.id
        }));
    }
    mission.spawned = true;
    mission.status = 'combat';
    mission.remaining = count;
    addLog(tf('missionContactHostile', { count }), 'alert');
    saveGame();
}

function spawnEscortMission(mission) {
    if (!mission || mission.type !== 'escort' || mission.spawned || mission.systemId !== currentSystemId || !game.player) return;
    const destination = missionDestinationTarget(mission);
    if (!destination) {
        failMission(mission, game.language === 'de' ? 'Eskortziel nicht verfügbar.' : 'Escort destination unavailable.');
        return;
    }
    const routeAngle = Math.atan2(destination.z - game.player.z, destination.x - game.player.x);
    const convoy = createNPC('trader', {
        name: game.language === 'de' ? 'Missionsfrachter' : 'Mission Freighter',
        x: game.player.x + Math.cos(routeAngle + Math.PI / 2) * 260,
        z: game.player.z + Math.sin(routeAngle + Math.PI / 2) * 260,
        difficulty: mission.difficulty,
        faction: game.player.faction,
        maxSpeed: 92 + mission.difficulty * 4
    });
    convoy.escortMissionId = mission.id;
    convoy.isTradeConvoy = true;
    assignNpcTradeRoute(convoy, { id: mission.originBaseId, name: mission.originName, x: game.player.x, z: game.player.z }, destination);
    convoy.throttle = 0.6;
    game.npcs.push(convoy);

    const hostileCount = clamp(Number(mission.enemyCount) || 2, 2, 5);
    for (let i = 0; i < hostileCount; i++) {
        const angle = routeAngle + Math.PI + (i - (hostileCount - 1) / 2) * 0.42;
        const distance = 1250 + i * 170;
        const hostile = createNPC('pirate', {
            name: `Interceptor-${i + 1}`,
            x: convoy.x + Math.cos(angle) * distance,
            z: convoy.z + Math.sin(angle) * distance,
            difficulty: mission.difficulty,
            missionId: mission.id
        });
        hostile.escortHostileFor = mission.id;
        hostile.responseTargetId = convoy.id;
        hostile.responseUntil = Number.POSITIVE_INFINITY;
        hostile.hostileToPlayer = true;
        game.npcs.push(hostile);
    }
    mission.spawned = true;
    mission.status = 'enroute';
    mission.escortNpcId = convoy.id;
    mission.remaining = hostileCount;
    addLog(t('missionEscortContact'), 'alert');
    saveGame();
}

function completeMission(mission) {
    if (!mission || mission.status === 'complete') return;
    mission.status = 'complete';
    game.player.credits += mission.reward;
    removeMissionCargo(mission);
    game.npcs = (game.npcs || []).filter(npc => npc.escortMissionId !== mission.id && npc.escortHostileFor !== mission.id);
    if (game.waypoint?.type === 'Mission') game.waypoint = null;
    if (game.selectedTarget?.type === 'Mission') game.selectedTarget = null;
    addLog(`${t('missionComplete')}: +${mission.reward.toLocaleString()} CR`);
    game.activeMission = null;
    saveGame();
    updateHUD();
}

function failMission(mission, reason = '') {
    if (!mission || mission.status === 'failed') return;
    mission.status = 'failed';
    removeMissionCargo(mission);
    game.npcs = (game.npcs || []).filter(npc => npc.escortMissionId !== mission.id && npc.escortHostileFor !== mission.id);
    if (game.waypoint?.type === 'Mission') game.waypoint = null;
    addLog(`${t('missionFailed')}${reason ? ': ' + reason : ''}`, 'alert');
    game.activeMission = null;
    saveGame();
    updateHUD();
}

function handleMissionDock(target) {
    const mission = game.activeMission;
    if (!mission || mission.type !== 'transport') return;
    if (String(getBaseId(target) || '').toLowerCase() === String(mission.targetBaseId || '').toLowerCase()) completeMission(mission);
}

function addCommodityCargo(commodityId, quantity = 1, sourceName = 'Loot') {
    if (!game.player) return false;
    const id = String(commodityId || '').toLowerCase();
    const commodity = getCommodity(id);
    const amount = Math.max(1, Math.floor(Number(quantity) || 1));
    const cargoSpace = Math.max(0, game.player.maxCargo - cargoUnits());
    if (!commodity || cargoSpace <= 0) return false;
    const added = Math.min(amount, cargoSpace);
    let cargoItem = findCargoItem(id);
    if (!cargoItem) {
        cargoItem = { id, name: commodity.name || id, quantity: 0, avgPrice: commodityBasePrice(id) };
        game.player.cargo.push(cargoItem);
    }
    cargoItem.quantity += added;
    addLog(`${sourceName}: ${commodity.name || id} +${added}`);
    return true;
}

function addAsteroidLootDrop(x, z, field, quantity = 1) {
    const commodities = (field?.lootCommodities || []).filter(Boolean);
    const commodityId = commodities.length ? commodities[Math.floor(Math.random() * commodities.length)] : '';
    if (!commodityId || !getCommodity(commodityId)) {
        addLootDrop(x, z, 'random');
        return;
    }
    const commodity = getCommodity(commodityId);
    game.loot.push({
        id: 'loot-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
        x, z,
        radius: 20,
        age: 0,
        type: 'commodity',
        commodityId: String(commodityId).toLowerCase(),
        quantity: Math.max(1, Math.floor(Number(quantity) || 1)),
        name: commodity?.name || commodityId,
        color: '#d8b46a'
    });
}

function destroyFieldObstacle(obstacle, attacker = null) {
    if (!obstacle) return;
    createExplosion(obstacle.x, obstacle.z, Math.max(18, obstacle.radius * 1.15), { flash: obstacle.small !== true });
    const field = obstacle.field || game.entities.find(entity => entity instanceof AsteroidField && entity.id === obstacle.fieldId);
    if (field?.obstacles) field.obstacles = field.obstacles.filter(item => item !== obstacle);
    game.obstacles = game.obstacles.filter(item => item !== obstacle);
    if (attacker === game.player && obstacle.destructible && Math.random() < (Number(obstacle.lootChance) || 0)) {
        addAsteroidLootDrop(obstacle.x, obstacle.z, field || obstacle.field, obstacle.lootQuantity || 1);
    }
}

function damageFieldObstacle(obstacle, amount, attacker = null, hitX = null, hitZ = null) {
    if (!obstacle || !obstacle.destructible || obstacle.hull === Infinity) return false;
    obstacle.hull -= Math.max(0, Number(amount) || 0);
    addShieldHitEffect({ ...obstacle, maxShield: 1, shield: 1, hull: 1, hidden: false }, hitX, hitZ, 0.7);
    if (obstacle.hull > 0) return false;
    destroyFieldObstacle(obstacle, attacker);
    return true;
}

function updateMissionState() {
    const mission = game.activeMission;
    if (!mission || !game.player || mission.systemId !== currentSystemId) return;
    const type = mission.type || 'combat';
    if (type === 'transport') return;
    if (type === 'patrol') {
        const progress = Freelancer2DLogic.advancePatrolRoute(mission.checkpoints, mission.currentCheckpoint, game.player, MISSION_PATROL_CHECKPOINT_RADIUS);
        if (!progress.reached) return;
        mission.currentCheckpoint = progress.index;
        addLog(tf('missionCheckpoint', { current: Math.min(progress.index, mission.checkpoints.length), total: mission.checkpoints.length }));
        if (progress.complete) completeMission(mission);
        else {
            setMissionWaypoint(mission);
            saveGame();
        }
        return;
    }
    if (type === 'escort') {
        if (!mission.spawned) spawnEscortMission(mission);
        if (!game.activeMission || !mission.spawned) return;
        const convoy = game.npcs.find(npc => npc.id === mission.escortNpcId);
        if (!convoy) {
            failMission(mission, game.language === 'de' ? 'Der Frachter wurde zerstört.' : 'The freighter was destroyed.');
            return;
        }
        mission.remaining = game.npcs.filter(npc => npc.escortHostileFor === mission.id).length;
        const arrived = convoy.hidden && String(getBaseId(convoy.tradeOrigin) || '').toLowerCase() === String(mission.targetBaseId || '').toLowerCase();
        if (arrived || Math.hypot(convoy.x - mission.targetX, convoy.z - mission.targetZ) < 220) completeMission(mission);
        return;
    }
    const distance = Math.hypot(mission.x - game.player.x, mission.z - game.player.z);
    if (!mission.spawned && distance < MISSION_SPAWN_DISTANCE) spawnMissionEnemies(mission);
    if (mission.spawned) {
        mission.remaining = game.npcs.filter(npc => npc.missionId === mission.id).length;
        if (mission.remaining <= 0) completeMission(mission);
    }
}

function fireNPCWeapon(npc, target = game.player) {
    if (!target || npc.fireCooldown > 0) return;
    const dx = target.x - npc.x;
    const dz = target.z - npc.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 1) return;
    const targetMotion = entityMotion(target);
    const targetAngle = Freelancer2DLogic.interceptAngle(npc, {
        x: target.x,
        z: target.z,
        vx: targetMotion.vx,
        vz: targetMotion.vz
    }, Math.max(1, (npc.weapons || [])[npc.nextWeaponIndex % Math.max(1, (npc.weapons || []).length)]?.speed || 650));
    let angleDiff = targetAngle - npc.rotation;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    if (Math.abs(angleDiff) > 0.45) return;
    const weapons = (npc.weapons || []).filter(Boolean);
    const targetCruising = Boolean(target.cruiseActive || target.cruiseCharging);
    const disruptor = weapons.find(weapon => weapon.cruiseDisruptor && distance <= (weapon.seekerRange || 2500));
    const regularWeapons = weapons.filter(weapon => !weapon.cruiseDisruptor);
    const cyclePool = targetCruising && disruptor ? [disruptor] : (regularWeapons.length ? regularWeapons : weapons);
    const weapon = cyclePool[npc.nextWeaponIndex % cyclePool.length] || weaponStatsFromEquipment(getEquipment('li_gun01_mark01'), 1);
    const weaponRange = weapon.cruiseDisruptor
        ? (weapon.seekerRange || 2500)
        : clamp((Number(weapon.speed) || 650) * (Number(weapon.lifetime) || 1.5) * 0.88, 650, 1800);
    if (distance > weaponRange) return;
    if (weapon.cruiseDisruptor && !targetCruising && Math.random() > 0.08) return;
    npc.nextWeaponIndex = (npc.nextWeaponIndex || 0) + 1;
    npc.fireCooldown = weapon.cooldown + Math.random() * 0.08;
    playWeaponFireAt(npc.x, npc.z, 0.52);
    game.projectiles.push({
        x: npc.x + Math.cos(targetAngle) * 30,
        z: npc.z + Math.sin(targetAngle) * 30,
        vx: Math.cos(targetAngle) * weapon.speed,
        vz: Math.sin(targetAngle) * weapon.speed,
        damage: weapon.damage,
        radius: weapon.radius,
        lifetime: weapon.lifetime,
        owner: 'npc',
        ownerId: npc.id,
        targetId: target === game.player ? 'player' : target.id,
        faction: npc.faction || '',
        color: weapon.color,
        trailColor: weapon.trailColor,
        homing: Boolean(weapon.homing),
        turnRate: weapon.turnRate || 0,
        detonationRadius: weapon.detonationRadius || 0,
        seekerRange: weapon.seekerRange || 0,
        cruiseDisruptor: Boolean(weapon.cruiseDisruptor),
        disruptDuration: weapon.disruptDuration || 0
    });
}

function findStaticCombatTarget(source) {
    const sourceFaction = targetFaction(source);
    if (!sourceFaction) return null;
    let bestTarget = null;
    let bestDistance = Infinity;
    const range = Number(source.weaponRange || 2600);
    if (game.player && playerIsHostileToFaction(sourceFaction)) {
        const distance = Math.hypot(game.player.x - source.x, game.player.z - source.z);
        if (distance < range) {
            bestTarget = game.player;
            bestDistance = distance;
        }
    }
    for (const npc of game.npcs) {
        if (!npc.faction || npc.hull <= 0 || npc.hidden || npc.inTradeLane || !factionsAreHostile(sourceFaction, npc.faction)) continue;
        const distance = Math.hypot(npc.x - source.x, npc.z - source.z);
        if (distance < range && distance < bestDistance) {
            bestTarget = npc;
            bestDistance = distance;
        }
    }
    return bestTarget;
}

function fireStaticWeapon(source, target) {
    if (!source || !target || source.weaponCooldown > 0) return;
    const weapons = (source.weapons || []).filter(Boolean);
    if (!weapons.length) return;
    const dx = target.x - source.x;
    const dz = target.z - source.z;
    const distance = Math.hypot(dx, dz);
    if (distance > (source.weaponRange || 2600) || distance < 1) return;
    const weapon = weapons[source.nextWeaponIndex % weapons.length] || weapons[0];
    source.nextWeaponIndex = (source.nextWeaponIndex || 0) + 1;
    source.weaponCooldown = weapon.cooldown + 0.12 + Math.random() * 0.16;
    const angle = Math.atan2(dz, dx);
    const muzzleDistance = Math.max(34, Math.min(160, Number(source.radius || 80) * 0.45));
    playWeaponFireAt(source.x, source.z, 0.48);
    game.projectiles.push({
        x: source.x + Math.cos(angle) * muzzleDistance,
        z: source.z + Math.sin(angle) * muzzleDistance,
        vx: Math.cos(angle) * weapon.speed,
        vz: Math.sin(angle) * weapon.speed,
        damage: weapon.damage,
        radius: weapon.radius,
        lifetime: weapon.lifetime,
        owner: 'npc',
        ownerId: source.id,
        targetId: target === game.player ? 'player' : target.id,
        faction: targetFaction(source),
        color: weapon.color,
        trailColor: weapon.trailColor,
        homing: Boolean(weapon.homing),
        turnRate: weapon.turnRate || 0,
        detonationRadius: weapon.detonationRadius || 0,
        seekerRange: weapon.seekerRange || 0,
        cruiseDisruptor: Boolean(weapon.cruiseDisruptor),
        disruptDuration: weapon.disruptDuration || 0
    });
}

function updateStaticWeapons(source, dt) {
    if (!source?.weapons?.length || game.isDocked) return;
    source.weaponCooldown = Math.max(0, (source.weaponCooldown || 0) - dt);
    const target = findStaticCombatTarget(source);
    if (target) fireStaticWeapon(source, target);
}

function entityMotion(entity) {
    if (!entity) return { vx: 0, vz: 0 };
    if (Number.isFinite(entity.vx) && Number.isFinite(entity.vz)) return { vx: entity.vx, vz: entity.vz };
    const speed = Number(entity.speed) || 0;
    const rotation = Number(entity.rotation) || 0;
    return { vx: Math.cos(rotation) * speed, vz: Math.sin(rotation) * speed };
}

function npcSpatialKey(x, z) {
    const size = game.npcSpatialCellSize || 3200;
    return `${Math.floor(x / size)}:${Math.floor(z / size)}`;
}

function rebuildNpcSpatialGrid() {
    const grid = new Map();
    for (const npc of game.npcs) {
        if (!npc || npc.hidden || npc.hull <= 0) continue;
        const key = npcSpatialKey(npc.x, npc.z);
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(npc);
    }
    game.npcSpatialGrid = grid;
}

function nearbyNpcs(npc, range = 3200) {
    const size = game.npcSpatialCellSize || 3200;
    const cells = Math.max(1, Math.ceil(range / size));
    const centerX = Math.floor(npc.x / size);
    const centerZ = Math.floor(npc.z / size);
    const nearby = [];
    for (let x = centerX - cells; x <= centerX + cells; x++) {
        for (let z = centerZ - cells; z <= centerZ + cells; z++) {
            nearby.push(...(game.npcSpatialGrid.get(`${x}:${z}`) || []));
        }
    }
    return nearby;
}

function findNpcCombatTarget(npc) {
    if (npc.hidden || npc.inTradeLane) return null;
    const fleet = fleetById(npc.fleetId);
    if (fleet?.state === 'forming' || npc.role === 'trader' || npc.role === 'civilian') return null;
    const fleetThreat = npcThreatTarget(fleet?.threatTargetId || npc.responseTargetId);
    if (fleetThreat) return fleetThreat;
    let bestTarget = null;
    let bestDistance = Infinity;
    if (game.player && (npc.hostileToPlayer || npc.missionId || playerIsHostileToFaction(npc.faction) || (npc.role === 'pirate' && !npc.faction))) {
        const distance = Math.hypot(game.player.x - npc.x, game.player.z - npc.z);
        const playerTargetRange = (game.player.cruiseActive || game.player.cruiseCharging) ? 2600 : (npc.missionId ? 2400 : 1800);
        if (distance < playerTargetRange && (!fleet || distance < 2800)) {
            bestTarget = game.player;
            bestDistance = distance;
        }
    }
    if (npc.faction) {
        for (const other of nearbyNpcs(npc, 2800)) {
            if (other === npc || other.hull <= 0 || other.hidden || other.inTradeLane || !other.faction) continue;
            if (!factionsAreHostile(npc.faction, other.faction)) continue;
            const distance = Math.hypot(other.x - npc.x, other.z - npc.z);
            const npcTargetRange = (other.cruiseActive || other.cruiseCharging) ? 2600 : 2200;
            if (distance < npcTargetRange && distance < bestDistance) {
                bestTarget = other;
                bestDistance = distance;
            }
        }
    }
    return bestTarget;
}

function shouldNpcHoldFormation(npc, combatTarget, dt) {
    const fleet = fleetById(npc.fleetId);
    if (!fleet || !combatTarget) return false;
    if (fleet.type === 'trade' && npc.role === 'trader') return true;
    const anchor = fleetLeader(fleet) || fleet.gather || npc;
    const distanceFromAnchor = Math.hypot(npc.x - anchor.x, npc.z - anchor.z);
    if (fleet.combatTimer > 14 || distanceFromAnchor > 4200) {
        fleet.state = 'reforming';
        fleet.reformTimer = 4;
        fleet.combatTimer = 0;
        return true;
    }
    return false;
}

function npcWeaponEnvelope(npc) {
    const ranges = (npc.weapons || []).filter(weapon => !weapon.cruiseDisruptor).map(weapon =>
        clamp((Number(weapon.speed) || 650) * (Number(weapon.lifetime) || 1.5) * 0.82, 650, 1700)
    );
    const maximum = ranges.length ? Math.max(...ranges) : 900;
    return { minimum: Math.max(180, maximum * 0.42), preferred: maximum * 0.72, maximum };
}

function updateNpcCombatManeuver(npc, target, dt) {
    if (!target) return false;
    const dx = target.x - npc.x;
    const dz = target.z - npc.z;
    const distance = Math.max(1, Math.hypot(dx, dz));
    const envelope = npcWeaponEnvelope(npc);
    npc.aiDecisionTimer = Math.max(0, (npc.aiDecisionTimer || 0) - dt);
    if (!npc.maneuverSide) npc.maneuverSide = Math.random() < 0.5 ? -1 : 1;
    if (npc.aiDecisionTimer <= 0) {
        npc.aiDecisionTimer = 0.65 + Math.random() * 0.9;
        npc.aiState = Freelancer2DLogic.npcCombatState({
            distance,
            minimumRange: envelope.minimum,
            maximumRange: envelope.maximum,
            hull: npc.hull,
            maxHull: npc.maxHull,
            shield: npc.shield,
            maxShield: npc.maxShield
        });
        if (Math.random() < 0.28) npc.maneuverSide *= -1;
    }

    const targetMotion = entityMotion(target);
    const weaponSpeed = Math.max(...(npc.weapons || []).map(weapon => Number(weapon.speed) || 0), 650);
    const leadAngle = Freelancer2DLogic.interceptAngle(npc, {
        x: target.x,
        z: target.z,
        vx: targetMotion.vx,
        vz: targetMotion.vz
    }, weaponSpeed);
    let desiredAngle = leadAngle;
    if (npc.aiState === 'flee') {
        desiredAngle = Math.atan2(-dz, -dx) + npc.maneuverSide * 0.18;
        npc.throttle = 1;
    } else if (npc.aiState === 'break') {
        desiredAngle = Math.atan2(-dz, -dx) + npc.maneuverSide * 0.7;
        npc.throttle = 0.95;
    } else if (npc.aiState === 'intercept') {
        npc.throttle = 1;
    } else {
        const distanceError = (distance - envelope.preferred) / Math.max(1, envelope.preferred);
        desiredAngle = leadAngle + npc.maneuverSide * clamp(distanceError * -0.32, -0.28, 0.28);
        npc.throttle = clamp(0.48 + Math.abs(distanceError) * 0.42, 0.42, 0.9);
    }

    const avoidance = getAvoidanceVector(npc.x, npc.z, 900 + npc.radius * 5);
    if (avoidance.magnitude > 0.04) {
        const desiredX = Math.cos(desiredAngle) + avoidance.x * 2.4;
        const desiredZ = Math.sin(desiredAngle) + avoidance.z * 2.4;
        desiredAngle = Math.atan2(desiredZ, desiredX);
    }
    const hazardAvoidance = getAutopilotDeathZoneAvoidance(npc.x, npc.z, target.x, target.z, 900);
    if (hazardAvoidance.magnitude > 0) desiredAngle = Math.atan2(hazardAvoidance.z, hazardAvoidance.x);
    npc.targetAngle = desiredAngle;
    setNpcCruise(npc, false);
    if (npc.aiState !== 'flee') fireNPCWeapon(npc, target);
    return true;
}

function npcThreatTarget(targetId) {
    if (!targetId) return null;
    if (targetId === 'player') return game.player?.destroyed ? null : game.player;
    return game.npcs.find(item => item.id === targetId && item.hull > 0 && !item.hidden) || null;
}

function markNpcThreat(npc, attacker) {
    if (!npc || !attacker) return;
    const targetId = attacker === game.player ? 'player' : attacker.id;
    if (!targetId) return;
    const now = performance.now();
    const fleet = fleetById(npc.fleetId);
    if (fleet) {
        fleet.threatTargetId = targetId;
        fleet.threatenedUntil = now + 14000;
        if (fleet.state !== 'forming') fleet.state = 'combat';
    }
    for (const responder of game.npcs) {
        if (responder.role !== 'police' || responder.hull <= 0 || responder.hidden) continue;
        if (!npc.faction || normalizeFactionId(responder.faction) !== normalizeFactionId(npc.faction)) continue;
        if (Math.hypot(responder.x - npc.x, responder.z - npc.z) > 5200) continue;
        responder.responseTargetId = targetId;
        responder.responseUntil = now + 12000;
    }
}

function updateNpcTraderFlee(npc, dt) {
    if (npc.role !== 'trader') return false;
    const fleet = fleetById(npc.fleetId);
    const threat = npcThreatTarget(fleet?.threatTargetId);
    if (!threat || (fleet?.threatenedUntil || 0) <= performance.now()) return false;
    const safeTarget = npcDockingTargets()
        .filter(target => !targetFaction(target) || !factionsAreHostile(npc.faction, targetFaction(target)))
        .sort((a, b) => Math.hypot(a.x - npc.x, a.z - npc.z) - Math.hypot(b.x - npc.x, b.z - npc.z))[0];
    const fleeX = safeTarget?.x ?? (npc.x + (npc.x - threat.x) * 2);
    const fleeZ = safeTarget?.z ?? (npc.z + (npc.z - threat.z) * 2);
    const distance = Math.hypot(fleeX - npc.x, fleeZ - npc.z);
    npc.targetAngle = Math.atan2(fleeZ - npc.z, fleeX - npc.x);
    npc.throttle = 1;
    updateNpcCruiseForDistance(npc, distance, { enterDistance: 4200, exitDistance: 1800 });
    npc.aiState = 'flee';
    return true;
}

function updateNpcEscort(npc) {
    const leader = game.npcs.find(item => item.id === npc.escortFor && item.hull > 0);
    if (leader?.hidden) {
        npc.hidden = true;
        npc.tradeDockTimer = leader.tradeDockTimer || 4;
        npc.speed = 0;
        npc.throttle = 0;
        npc.cruiseActive = false;
        return true;
    }
    if (!leader) {
        npc.escortFor = '';
        npc.role = npc.role || 'police';
        return false;
    }
    if (leader.inTradeLane) {
        placeEscortNearLeader(npc, leader, npc.formationIndex || (npc.escortIndex || 0) + 1);
        npc.inTradeLane = true;
        npc.tradeLaneRoute = leader.tradeLaneRoute;
        npc.tradeLaneIndex = leader.tradeLaneIndex;
        npc.tradeLaneExitIndex = leader.tradeLaneExitIndex;
        npc.tradeLaneDirection = leader.tradeLaneDirection;
        return true;
    }
    if (npc.inTradeLane && !leader.inTradeLane) {
        npc.inTradeLane = false;
        npc.tradeLaneRoute = null;
    }
    const fleet = fleetById(npc.fleetId);
    const point = fleet ? formationWorldPoint(fleet, npc) : null;
    const side = npc.escortIndex % 2 === 0 ? -1 : 1;
    const back = 260 + Math.floor((npc.escortIndex || 0) / 2) * 130;
    const lateral = 180 * side;
    const lx = point?.x ?? (leader.x - Math.cos(leader.rotation) * back + Math.cos(leader.rotation + Math.PI / 2) * lateral);
    const lz = point?.z ?? (leader.z - Math.sin(leader.rotation) * back + Math.sin(leader.rotation + Math.PI / 2) * lateral);
    npc.targetAngle = Math.atan2(lz - npc.z, lx - npc.x);
    const distance = Math.hypot(lx - npc.x, lz - npc.z);
    npc.throttle = clamp(distance / (fleet?.state === 'forming' ? 260 : 450), 0.2, leader.inTradeLane ? 1 : 0.95);
    if (leader.cruiseActive && distance > 650) {
        setNpcCruise(npc, true);
        npc.throttle = 1;
    } else {
        updateNpcCruiseForDistance(npc, distance, {
            disabled: !leader.cruiseActive && distance < NPC_CRUISE_ENTER_DISTANCE
        });
    }
    if (distance > 3600) {
        npc.x = lx + (Math.random() - 0.5) * 80;
        npc.z = lz + (Math.random() - 0.5) * 80;
        npc.speed = leader.speed;
    }
    return true;
}

function updateNpcFleetLeader(npc, dt) {
    const fleet = fleetById(npc.fleetId);
    if (!fleet || !npc.isFleetLeader) return false;
    if (fleet.state === 'forming' || fleet.state === 'reforming') {
        fleet.reformTimer = Math.max(0, (fleet.reformTimer || 0) - dt);
        if (fleet.state === 'reforming' && fleet.reformTimer <= 0 && fleetIsFormed(fleet)) fleet.state = 'enroute';
        const point = formationWorldPoint(fleet, npc);
        if (point) {
            npc.targetAngle = Math.atan2(point.z - npc.z, point.x - npc.x);
            npc.throttle = clamp(Math.hypot(point.x - npc.x, point.z - npc.z) / 420, 0.15, 0.65);
            updateNpcCruiseForDistance(npc, Math.hypot(point.x - npc.x, point.z - npc.z), { disabled: true });
        }
        return true;
    }
    return false;
}

function updateNpcSecurityPatrol(npc, dt) {
    if (!npc.isFleetLeader || npc.trafficRole !== 'security') return false;
    const fleet = fleetById(npc.fleetId);
    const route = npc.patrolRoute || [];
    if (!fleet || !route.length) return false;
    const target = route[npc.patrolIndex % route.length];
    if (!target) return false;
    const dx = (target.x || 0) - npc.x;
    const dz = (target.z || 0) - npc.z;
    const distance = Math.hypot(dx, dz);
    npc.targetAngle = Math.atan2(dz, dx);
    npc.throttle = distance < 900 ? 0.38 : 0.72;
    updateNpcCruiseForDistance(npc, distance, { enterDistance: 5600, exitDistance: 1600 });
    if (distance < 420) {
        npc.patrolIndex = (npc.patrolIndex + 1) % route.length;
        fleet.patrolIndex = npc.patrolIndex;
    }
    return true;
}

function updateNpcTraderRoute(npc, dt) {
    if (!npc.isTradeConvoy) return false;
    const fleet = fleetById(npc.fleetId);
    if (fleet && (fleet.state === 'forming' || fleet.state === 'reforming')) return updateNpcFleetLeader(npc, dt);
    if (npc.hidden) {
        npc.tradeDockTimer = Math.max(0, (npc.tradeDockTimer || 0) - dt);
        if (npc.tradeDockTimer > 0) return true;
        npc.hidden = false;
        npc.cruiseActive = false;
        const origin = npc.tradeDestination || npc.tradeOrigin;
        const destination = randomNpcTradeDestination(origin, { irregular: npc.irregularTraffic });
        const angle = destination ? Math.atan2(destination.z - origin.z, destination.x - origin.x) : Math.random() * Math.PI * 2;
        const launch = offscreenSpawnPointForRoute(origin, destination, npc.irregularTraffic ? 'pirate' : 'trade');
        const routeAngle = Number.isFinite(launch.rotation) ? launch.rotation : angle;
        npc.x = launch.x;
        npc.z = launch.z;
        npc.rotation = routeAngle;
        npc.speed = 0;
        assignNpcTradeRoute(npc, origin, destination);
        maybeNpcRadio(npc, 'departure', origin, 45);
        if (fleet) {
            fleet.origin = origin;
            fleet.destination = destination;
            fleet.gather = {
                x: launch.x + Math.cos(routeAngle) * 650,
                z: launch.z + Math.sin(routeAngle) * 650,
                rotation: routeAngle
            };
            fleet.state = 'forming';
            fleet.wait = 0;
        }
        convoyMembersForLeader(npc).forEach((escort, index) => {
            escort.hidden = false;
            escort.escortFor = npc.id;
            escort.escortIndex = index;
            placeEscortNearLeader(escort, npc, index);
        });
        return true;
    }
    if (updateNpcTradeLane(npc, dt)) return true;
    if (!npc.tradeRoute?.length || npc.tradeWaypointIndex >= npc.tradeRoute.length) {
        if (npc.role === 'pirate' && npc.patrolRoute?.length) {
            npc.tradeRoute = npc.patrolRoute.map(point => ({ type: 'patrol', target: point }));
            npc.tradeWaypointIndex = 0;
        } else {
            assignNpcTradeRoute(npc, npc.tradeDestination || npc.tradeOrigin);
        }
    }
    const waypoint = npc.tradeRoute?.[npc.tradeWaypointIndex || 0];
    if (!waypoint?.target) return false;
    const target = waypoint.target;
    const dx = target.x - npc.x;
    const dz = target.z - npc.z;
    const distance = Math.hypot(dx, dz);
    npc.targetAngle = Math.atan2(dz, dx);
    npc.throttle = waypoint.type === 'dock' && distance < 900 ? 0.45 : 0.82;
    if (waypoint.type === 'dock' && distance < 1350 && npc.lastDockRadioTarget !== target.id) {
        npc.lastDockRadioTarget = target.id;
        maybeNpcRadio(npc, 'dockRequest', target, 40);
        maybeNpcRadio(npc, 'dockApproved', target, 40);
    }
    updateNpcCruiseForDistance(npc, distance, {
        enterDistance: waypoint.type === 'dock' ? 5200 : 3600,
        exitDistance: waypoint.type === 'dock' ? 1800 : 1150
    });
    if (waypoint.type === 'tradelane' && distance < 260) {
        startNpcTradeLane(npc, target, waypoint.exit);
        return true;
    }
    if (waypoint.type === 'patrol' && distance < 520) {
        npc.tradeWaypointIndex = ((npc.tradeWaypointIndex || 0) + 1) % Math.max(1, npc.tradeRoute.length);
        maybeNpcRadio(npc, 'patrolReport', target);
        return true;
    }
    if (waypoint.type === 'dock' && distance < 220) {
        npc.hidden = true;
        npc.tradeDockTimer = 8 + Math.random() * 8;
        npc.tradeOrigin = target;
        npc.speed = 0;
        npc.throttle = 0;
        npc.cruiseActive = false;
        if (fleet) {
            fleet.state = 'docked';
            fleetMembers(fleet).forEach(member => {
                if (member !== npc) {
                    member.hidden = true;
                    member.tradeDockTimer = npc.tradeDockTimer;
                    member.speed = 0;
                    member.throttle = 0;
                    member.cruiseActive = false;
                }
            });
        }
        return true;
    }
    return true;
}

function damageNpc(npc, amount, attacker = null, hitX = null, hitZ = null) {
    if (!npc || npc.hull <= 0 || npc.hidden || npc.inTradeLane) return false;
    if (attacker === game.player) npc.hostileToPlayer = true;
    markNpcThreat(npc, attacker);
    const result = Freelancer2DLogic.resolveShieldDamage({
        hull: npc.hull,
        shield: npc.shield,
        amount,
        penetration: 0
    });
    npc.hull = result.hull;
    npc.shield = result.shield;
    npc.lastDamageAt = performance.now();
    if (result.shieldDamage > 0) addShieldHitEffect(npc, hitX, hitZ, Math.max(0.7, result.shieldDamage / 18));
    if (npc.hull > 0) return false;
    addLog(npc.name + ' destroyed!');
    createExplosion(npc.x, npc.z, Math.max(42, (Number(npc.radius) || 22) * 2.2), { flash: true });
    if (npc.missionId) addLootDrop(npc.x, npc.z);
    if (attacker === game.player) applyReputationForKill(npc.faction);
    game.npcs = game.npcs.filter(item => item !== npc);
    return true;
}

function updateNPC(npc, dt) {
    if (npc.hidden) {
        npc.cruiseActive = false;
        updateNpcTraderRoute(npc, dt);
        return;
    }
    npc.stateTimer += dt;
    npc.shieldRotation += dt * 0.5;
    npc.shield = Freelancer2DLogic.regenerateShield(npc.shield, npc.maxShield, npc.shieldRegen, dt);
    npc.fireCooldown = Math.max(0, (npc.fireCooldown || 0) - dt);
    if ((npc.responseUntil || 0) <= performance.now()) npc.responseTargetId = '';

    let combatTarget = findNpcCombatTarget(npc);
    if (shouldNpcHoldFormation(npc, combatTarget, dt)) combatTarget = null;
    if (updateNpcTraderFlee(npc, dt)) {
        // Traders seek a friendly dock or open distance while escorts intercept.
    } else if (combatTarget) {
        updateNpcCombatManeuver(npc, combatTarget, dt);
    } else if (updateNpcFleetLeader(npc, dt)) {
        // Fleet leader is gathering/re-forming the group.
    } else if (npc.escortFor && updateNpcEscort(npc)) {
        // Escort navigation is handled by updateNpcEscort.
    } else if (updateNpcTraderRoute(npc, dt)) {
        // Trader navigation is handled by updateNpcTraderRoute.
    } else if (updateNpcSecurityPatrol(npc, dt)) {
        // Security patrol route is handled by fleet logic.
    } else {
        if (npc.stateTimer > 4) {
            npc.targetAngle = Math.random() * Math.PI * 2;
            npc.throttle = 0.2 + Math.random() * 0.3;
            setNpcCruise(npc, false);
            npc.stateTimer = 0;
        }
    }
    
    let angleDiff = npc.targetAngle - npc.rotation;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    if (Math.abs(angleDiff) > 0.01) npc.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), npc.turnRate * dt);
    
    if (!npc.inTradeLane) {
        const previousX = npc.x;
        const previousZ = npc.z;
        const targetSpeed = npc.cruiseActive ? (npc.cruiseSpeed || cruiseSpeedForMod() * 0.8) : npc.throttle * npc.maxSpeed;
        const response = Math.min(1, dt * (npc.cruiseActive ? 1.15 : 0.75));
        npc.speed += (targetSpeed - npc.speed) * response;
        npc.x += Math.cos(npc.rotation) * npc.speed * dt;
        npc.z += Math.sin(npc.rotation) * npc.speed * dt;
        npc.vx = dt > 0 ? (npc.x - previousX) / dt : 0;
        npc.vz = dt > 0 ? (npc.z - previousZ) / dt : 0;
    }
}

function renderNpcStatusBars(ctx, npc, screenPos, visualScale) {
    const hullRatio = clamp((Number(npc.hull) || 0) / Math.max(1, Number(npc.maxHull) || 1), 0, 1);
    const shieldRatio = clamp((Number(npc.shield) || 0) / Math.max(1, Number(npc.maxShield) || 1), 0, 1);
    const barWidth = Math.max(34, Math.min(58, (npc.radius || 18) * 2.2 * visualScale));
    const barHeight = 4;
    const gap = 2;
    const y = screenPos.y + Math.max(20, (npc.radius || 18) * 1.65 * visualScale);
    const x = screenPos.x - barWidth / 2;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight * 2 + gap + 2);

    ctx.fillStyle = '#06314f';
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = '#44aaff';
    ctx.fillRect(x, y, barWidth * shieldRatio, barHeight);
    ctx.strokeRect(x - 0.5, y - 0.5, barWidth + 1, barHeight + 1);

    const hullY = y + barHeight + gap;
    ctx.fillStyle = '#4a0505';
    ctx.fillRect(x, hullY, barWidth, barHeight);
    ctx.fillStyle = hullRatio > 0.35 ? '#ff4444' : '#ff9b35';
    ctx.fillRect(x, hullY, barWidth * hullRatio, barHeight);
    ctx.strokeRect(x - 0.5, hullY - 0.5, barWidth + 1, barHeight + 1);
    ctx.restore();
}

function renderNpcFactionLabel(ctx, npc, screenPos, visualScale) {
    const factionName = factionDisplayName(npc.faction);
    const name = npc.name || npc.ship || 'NPC';
    const role = npc.formationRole || (npc.isFleetLeader ? 'Lead' : '');
    const text = `${name}${role ? ' [' + role + ']' : ''} - ${factionName}`;
    const y = screenPos.y - Math.max(28, (npc.radius || 18) * 1.85 * visualScale);
    ctx.save();
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const width = Math.min(260, ctx.measureText(text).width + 12);
    ctx.fillStyle = 'rgba(0,10,18,0.72)';
    ctx.fillRect(screenPos.x - width / 2, y - 8, width, 16);
    ctx.strokeStyle = 'rgba(0,170,255,0.38)';
    ctx.strokeRect(screenPos.x - width / 2, y - 8, width, 16);
    ctx.fillStyle = reputationColor(getPlayerReputation(npc.faction));
    ctx.fillText(text, screenPos.x, y);
    ctx.restore();
}

function roundedRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function wrapCanvasText(ctx, text, maxWidth, maxLines = 3) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (ctx.measureText(candidate).width <= maxWidth || !line) {
            line = candidate;
            continue;
        }
        lines.push(line);
        line = word;
        if (lines.length >= maxLines) break;
    }
    if (line && lines.length < maxLines) lines.push(line);
    if (words.length && lines.length === maxLines) {
        let last = lines[lines.length - 1];
        while (last.length > 4 && ctx.measureText(`${last}...`).width > maxWidth) last = last.slice(0, -1).trimEnd();
        lines[lines.length - 1] = `${last}...`;
    }
    return lines;
}

function renderNpcSpeechBubble(ctx, npc, screenPos, visualScale) {
    const bubble = npc?.speechBubble;
    if (!bubble?.text) return;
    const now = performance.now();
    if (now >= bubble.expiresAt) {
        npc.speechBubble = null;
        return;
    }
    const life = Math.max(1, bubble.expiresAt - bubble.createdAt);
    const age = now - bubble.createdAt;
    const fadeIn = clamp(age / 220, 0, 1);
    const fadeOut = clamp((bubble.expiresAt - now) / 620, 0, 1);
    const alpha = Math.min(fadeIn, fadeOut) * 0.86;
    if (alpha <= 0.02) return;

    ctx.save();
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const maxTextWidth = Math.min(245, Math.max(130, game.width * 0.22));
    const lines = wrapCanvasText(ctx, bubble.text, maxTextWidth, 3);
    if (!lines.length) {
        ctx.restore();
        return;
    }
    const lineHeight = 14;
    const paddingX = 10;
    const paddingY = 7;
    const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    const width = Math.ceil(textWidth + paddingX * 2);
    const height = Math.ceil(lines.length * lineHeight + paddingY * 2);
    const shipTop = screenPos.y - Math.max(34, (npc.radius || 18) * 2.4 * visualScale);
    let x = screenPos.x - width / 2;
    let y = shipTop - height - 16;
    x = clamp(x, 8, Math.max(8, game.width - width - 8));
    y = clamp(y, 44, Math.max(44, game.height - height - 44));
    const tailX = clamp(screenPos.x, x + 18, x + width - 18);
    const tailY = Math.min(y + height + 10, game.height - 8);

    ctx.globalAlpha = alpha;
    ctx.shadowColor = 'rgba(0, 210, 255, 0.42)';
    ctx.shadowBlur = 10;
    roundedRectPath(ctx, x, y, width, height, 7);
    ctx.fillStyle = 'rgba(0, 18, 31, 0.58)';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(100, 220, 255, 0.58)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tailX - 7, y + height - 1);
    ctx.lineTo(tailX, tailY);
    ctx.lineTo(tailX + 7, y + height - 1);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 18, 31, 0.50)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 220, 255, 0.42)';
    ctx.stroke();

    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = 'rgba(205, 248, 255, 0.96)';
    lines.forEach((line, index) => {
        ctx.fillText(line, x + paddingX, y + paddingY + lineHeight * index + lineHeight / 2);
    });
    ctx.restore();
}

function drawCruiseTrail(ctx, shipDrawSize, intensity = 1) {
    const trailLength = shipDrawSize * 5;
    const flicker = (0.86 + Math.sin(game.gameTime * 42) * 0.08) * intensity;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const trail = ctx.createLinearGradient(-shipDrawSize * 0.42, 0, -shipDrawSize * 0.42 - trailLength, 0);
    trail.addColorStop(0, `rgba(235,255,255,${0.82 * intensity})`);
    trail.addColorStop(0.18, `rgba(80,205,255,${0.58 * intensity})`);
    trail.addColorStop(0.72, `rgba(40,120,255,${0.18 * intensity})`);
    trail.addColorStop(1, 'rgba(0,60,190,0)');
    ctx.strokeStyle = trail;
    ctx.lineWidth = Math.max(2, shipDrawSize * 0.12) * flicker;
    ctx.beginPath();
    ctx.moveTo(-shipDrawSize * 0.48, 0);
    ctx.lineTo(-shipDrawSize * 0.48 - trailLength, 0);
    ctx.stroke();
    ctx.strokeStyle = `rgba(190,245,255,${0.32 * intensity})`;
    ctx.lineWidth = Math.max(1, shipDrawSize * 0.035);
    ctx.beginPath();
    ctx.moveTo(-shipDrawSize * 0.42, -shipDrawSize * 0.16);
    ctx.lineTo(-shipDrawSize * 0.42 - trailLength * 0.72, -shipDrawSize * 0.48);
    ctx.moveTo(-shipDrawSize * 0.42, shipDrawSize * 0.16);
    ctx.lineTo(-shipDrawSize * 0.42 - trailLength * 0.72, shipDrawSize * 0.48);
    ctx.stroke();
    ctx.restore();
}

function renderEffects(ctx) {
    for (const effect of game.effects || []) {
        const ratio = clamp((effect.age || 0) / Math.max(0.001, effect.life || 1), 0, 1);
        if (effect.type === 'shield-hit') {
            const target = effect.target;
            if (!target || target.destroyed || target.hull <= 0 || target.hidden) continue;
            const pos = worldToScreen(target.x, target.z);
            const visualScale = Math.max(0.35, Math.min(2.8, game.zoom));
            const radius = effect.radius * visualScale * (1 + ratio * 0.18);
            const alpha = (1 - ratio) * 0.72 * (effect.strength || 1);
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(effect.angle || 0);
            ctx.globalCompositeOperation = 'lighter';
            const glow = ctx.createRadialGradient(0, 0, radius * 0.45, 0, 0, radius * 1.08);
            glow.addColorStop(0, `rgba(160,235,255,${alpha * 0.12})`);
            glow.addColorStop(0.72, `rgba(70,170,255,${alpha * 0.18})`);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 1.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = `rgba(180,245,255,${alpha})`;
            ctx.lineWidth = Math.max(1.2, 3.2 * visualScale * (1 - ratio * 0.35));
            ctx.beginPath();
            ctx.arc(0, 0, radius, -0.92, 0.92);
            ctx.stroke();
            ctx.strokeStyle = `rgba(75,170,255,${alpha * 0.55})`;
            ctx.lineWidth = Math.max(1, 1.7 * visualScale);
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.82, -0.68, 0.68);
            ctx.stroke();
            ctx.restore();
            continue;
        }
        if (effect.type === 'cruise-disrupt') {
            const target = effect.target;
            if (!target || target.destroyed || target.hidden) continue;
            const pos = worldToScreen(target.x, target.z);
            const visualScale = Math.max(0.25, Math.min(2.8, game.zoom));
            const radius = effect.radius * visualScale;
            const alpha = (1 - ratio) * 0.8;
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 3; i++) {
                const r = radius * (0.54 + ratio * 1.15 + i * 0.18);
                ctx.strokeStyle = `rgba(125,225,255,${alpha * (0.55 - i * 0.12)})`;
                ctx.lineWidth = Math.max(1, (3 - i * 0.55) * visualScale);
                ctx.setLineDash([Math.max(3, 9 * visualScale), Math.max(3, 7 * visualScale)]);
                ctx.lineDashOffset = -game.gameTime * 42 - i * 6;
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2 + ratio * 2.8;
                const inner = radius * 0.32;
                const outer = radius * (0.72 + ratio * 0.42);
                ctx.strokeStyle = `rgba(205,250,255,${alpha * 0.38})`;
                ctx.lineWidth = Math.max(1, 1.5 * visualScale);
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
                ctx.lineTo(Math.cos(a + 0.12) * outer, Math.sin(a + 0.12) * outer);
                ctx.stroke();
            }
            ctx.restore();
            continue;
        }
        if (effect.type === 'explosion') {
            const pos = worldToScreen(effect.x, effect.z);
            const visualScale = Math.max(0.22, Math.min(2.8, game.zoom));
            const radius = effect.radius * visualScale;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            if (effect.flash && ratio < 0.45) {
                const flashAlpha = (1 - ratio / 0.45) * 0.78;
                const flash = ctx.createRadialGradient(pos.x, pos.y, radius * 0.08, pos.x, pos.y, radius * (1.4 + ratio * 1.8));
                flash.addColorStop(0, `rgba(255,255,245,${flashAlpha})`);
                flash.addColorStop(0.28, `rgba(255,185,70,${flashAlpha * 0.5})`);
                flash.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = flash;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius * (1.5 + ratio * 1.9), 0, Math.PI * 2);
                ctx.fill();
            }
            for (const particle of effect.particles || []) {
                const pr = clamp(particle.age / Math.max(0.001, particle.life), 0, 1);
                if (pr >= 1) continue;
                const ppos = worldToScreen(particle.x, particle.z);
                const alpha = (1 - pr) * 0.88;
                ctx.fillStyle = `${particle.color}${alpha})`;
                ctx.beginPath();
                ctx.arc(ppos.x, ppos.y, Math.max(1.5, particle.size * visualScale * (1 - pr * 0.45)), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.strokeStyle = `rgba(255,210,110,${Math.max(0, 0.34 * (1 - ratio))})`;
            ctx.lineWidth = Math.max(1, radius * 0.04);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius * (0.8 + ratio * 2.6), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}

function renderNPC(ctx, npc) {
    if (npc.hidden) return;
    const pos = worldToScreen(npc.x, npc.z);
    const margin = Math.max(120, (npc.radius || 20) * Math.max(1, game.zoom) * 4);
    if (pos.x < -margin || pos.x > game.width + margin || pos.y < -margin || pos.y > game.height + margin) return;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(npc.rotation);
    const visualScale = Math.max(0.35, Math.min(2.8, game.zoom));
    
    // Shield
    if (npc.shield > 0) {
        const shieldAlpha = (npc.shield / npc.maxShield) * 0.25;
        ctx.strokeStyle = `rgba(100,180,255,${shieldAlpha})`;
        ctx.lineWidth = 3;
        ctx.save();
        ctx.rotate(npc.shieldRotation);
        ctx.beginPath();
        ctx.arc(0, 0, (npc.radius + 7) * visualScale, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();
    }

    const shipImage = getShipImage(npc.shipIcon, npc.shipIconFallback || 'data/ship_icons/_fallback.png');
    const size = Math.max(28, npc.radius * 2.7) * visualScale;
    if (npc.cruiseActive) drawCruiseTrail(ctx, size, 0.75);
    if (shipImage) {
        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(shipImage, -size / 2, -size / 2, size, size);
        ctx.restore();
    } else {
        ctx.fillStyle = npc.color;
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(18 * visualScale, 0);
        ctx.lineTo(-12 * visualScale, -10 * visualScale);
        ctx.lineTo(-12 * visualScale, 10 * visualScale);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
    renderNpcFactionLabel(ctx, npc, pos, visualScale);
    renderNpcStatusBars(ctx, npc, pos, visualScale);
    renderNpcSpeechBubble(ctx, npc, pos, visualScale);
}
