(function exposeFreelancer2DLogic(root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (root) root.Freelancer2DLogic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFreelancer2DLogic() {
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function normalizeAngle(angle) {
        let normalized = Number(angle) || 0;
        while (normalized > Math.PI) normalized -= Math.PI * 2;
        while (normalized < -Math.PI) normalized += Math.PI * 2;
        return normalized;
    }

    function resolveShieldDamage({ hull, shield, amount, penetration = 0 }) {
        const incoming = Math.max(0, Number(amount) || 0);
        const currentHull = Math.max(0, Number(hull) || 0);
        const currentShield = Math.max(0, Number(shield) || 0);
        const penetrationRatio = clamp(Number(penetration) || 0, 0, 1);
        const penetratingDamage = incoming * penetrationRatio;
        const shieldableDamage = incoming - penetratingDamage;
        const shieldDamage = Math.min(currentShield, shieldableDamage);
        const hullDamage = penetratingDamage + Math.max(0, shieldableDamage - shieldDamage);
        return {
            hull: Math.max(0, currentHull - hullDamage),
            shield: Math.max(0, currentShield - shieldDamage),
            hullDamage,
            shieldDamage
        };
    }

    function regenerateShield(shield, maxShield, regenerationPerSecond, dt) {
        const maximum = Math.max(0, Number(maxShield) || 0);
        if (maximum <= 0) return 0;
        return clamp(
            (Number(shield) || 0) + Math.max(0, Number(regenerationPerSecond) || 0) * Math.max(0, Number(dt) || 0),
            0,
            maximum
        );
    }

    function interceptAngle(source, target, projectileSpeed) {
        const sx = Number(source?.x) || 0;
        const sz = Number(source?.z) || 0;
        const tx = Number(target?.x) || 0;
        const tz = Number(target?.z) || 0;
        const tvx = Number(target?.vx) || 0;
        const tvz = Number(target?.vz) || 0;
        const speed = Math.max(1, Number(projectileSpeed) || 1);
        const rx = tx - sx;
        const rz = tz - sz;
        const a = tvx * tvx + tvz * tvz - speed * speed;
        const b = 2 * (rx * tvx + rz * tvz);
        const c = rx * rx + rz * rz;
        let time = 0;
        if (Math.abs(a) < 0.0001) {
            if (Math.abs(b) > 0.0001) time = -c / b;
        } else {
            const discriminant = b * b - 4 * a * c;
            if (discriminant >= 0) {
                const root = Math.sqrt(discriminant);
                const first = (-b - root) / (2 * a);
                const second = (-b + root) / (2 * a);
                time = [first, second].filter(value => value > 0).sort((x, y) => x - y)[0] || 0;
            }
        }
        const aimX = tx + tvx * Math.max(0, time);
        const aimZ = tz + tvz * Math.max(0, time);
        return Math.atan2(aimZ - sz, aimX - sx);
    }

    function advanceFleetCombatTimer(timer, dt, inCombat) {
        const current = Math.max(0, Number(timer) || 0);
        const step = Math.max(0, Number(dt) || 0);
        return inCombat ? current + step : Math.max(0, current - step * 0.35);
    }

    function npcCruiseDecision({ active = false, distance = 0, disrupted = false, hidden = false, inTradeLane = false, combat = false, disabled = false, enterDistance = 4200, exitDistance = 1350 } = {}) {
        if (disrupted || hidden || inTradeLane || combat || disabled) return false;
        const range = Math.max(0, Number(distance) || 0);
        const enter = Math.max(0, Number(enterDistance) || 4200);
        const exit = Math.max(0, Math.min(enter, Number(exitDistance) || 1350));
        return active ? range > exit : range > enter;
    }

    function npcCombatState({ distance = 0, minimumRange = 180, maximumRange = 900, hull = 1, maxHull = 1, shield = 0, maxShield = 0 } = {}) {
        const hullRatio = Math.max(0, Number(hull) || 0) / Math.max(1, Number(maxHull) || 1);
        const shieldRatio = Number(maxShield) > 0
            ? Math.max(0, Number(shield) || 0) / Math.max(1, Number(maxShield) || 1)
            : hullRatio;
        const range = Math.max(0, Number(distance) || 0);
        const minimum = Math.max(0, Number(minimumRange) || 0);
        const maximum = Math.max(minimum, Number(maximumRange) || minimum);
        if (hullRatio < 0.22 || (hullRatio < 0.38 && shieldRatio < 0.08)) return 'flee';
        if (range > maximum * 1.15) return 'intercept';
        if (range < minimum) return 'break';
        return 'engage';
    }

    function baseServices({ bar, commodities, equipment, ships } = {}) {
        return {
            launch: true,
            bar: Boolean((bar?.npcs || []).length || (bar?.news || []).length),
            trade: Boolean(commodities?.length),
            equipment: Boolean(equipment?.length),
            ship: Boolean(ships?.length),
            repair: Boolean(equipment?.length)
        };
    }

    function classifyBaseKind({ archetype = '', name = '', faction = '', isPlanet = false } = {}) {
        const archetypeText = String(archetype).toLowerCase();
        const nameText = String(name).toLowerCase();
        const factionText = String(faction).toLowerCase();
        if (isPlanet || archetypeText.includes('planet')) return 'planet';
        if (archetypeText.includes('battleship') || archetypeText.includes('dreadnought') || archetypeText.includes('carrier')) return 'battleship';
        if (factionText.startsWith('fc_')) return 'pirate';
        if (archetypeText.includes('mining') || archetypeText.includes('miner') || archetypeText.includes('depot')) return 'mining';
        if (archetypeText.includes('research') || nameText.includes('research') || nameText.includes('laboratory')) return 'research';
        return 'station';
    }

    function restoreMissionState(mission) {
        if (!mission || typeof mission !== 'object' || !mission.systemId) return null;
        const restored = { ...mission };
        const type = String(restored.type || 'combat').toLowerCase();
        if ((type === 'combat' || type === 'destroy') && restored.spawned) {
            restored.spawned = false;
            restored.status = 'accepted';
            restored.remaining = Math.max(1, Number(restored.enemyCount) || 1);
        }
        if (type === 'escort' && restored.spawned) {
            restored.spawned = false;
            restored.status = 'accepted';
            restored.escortNpcId = '';
        }
        return restored;
    }

    function missionTypeForIndex(index) {
        const types = ['combat', 'transport', 'patrol', 'escort'];
        const numericIndex = Math.max(0, Math.floor(Number(index) || 0));
        return types[numericIndex % types.length];
    }

    function advancePatrolRoute(checkpoints, currentIndex, position, radius = 650) {
        const route = Array.isArray(checkpoints) ? checkpoints : [];
        const index = clamp(Math.floor(Number(currentIndex) || 0), 0, route.length);
        const target = route[index];
        if (!target || !position) return { index, reached: false, complete: index >= route.length };
        const distance = Math.hypot((Number(target.x) || 0) - (Number(position.x) || 0), (Number(target.z) || 0) - (Number(position.z) || 0));
        if (distance > Math.max(1, Number(radius) || 650)) return { index, reached: false, complete: false };
        const nextIndex = index + 1;
        return { index: nextIndex, reached: true, complete: nextIndex >= route.length };
    }

    function formatDistance(meters) {
        const value = Number(meters);
        if (!Number.isFinite(value)) return '-';
        if (value >= 1000) return (value / 1000).toFixed(value >= 10000 ? 0 : 1) + ' km';
        return Math.round(value) + ' m';
    }

    function formatEta(seconds) {
        const value = Number(seconds);
        if (!Number.isFinite(value) || value < 0) return '--:--';
        const total = Math.ceil(value);
        return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
    }

    function reputationStatus(value) {
        const reputation = Number(value) || 0;
        if (reputation <= -0.6) return 'hostile';
        if (reputation >= 0.6) return 'friendly';
        return 'neutral';
    }

    function tradeLaneStart(rings, ringIndex, playerRotation = 0) {
        const route = Array.isArray(rings) ? rings : [];
        const index = Math.floor(Number(ringIndex));
        if (route.length < 2 || !Number.isInteger(index) || index < 0 || index >= route.length) return null;
        let direction = 1;
        if (index === route.length - 1) direction = -1;
        else if (index > 0) {
            const current = route[index];
            const forward = route[index + 1];
            const backward = route[index - 1];
            const vx = Math.cos(Number(playerRotation) || 0);
            const vz = Math.sin(Number(playerRotation) || 0);
            const forwardDot = (forward.x - current.x) * vx + (forward.z - current.z) * vz;
            const backwardDot = (backward.x - current.x) * vx + (backward.z - current.z) * vz;
            direction = backwardDot > forwardDot ? -1 : 1;
        }
        return { targetIndex: index + direction, direction };
    }

    function distancePointToSegment(px, pz, ax, az, bx, bz) {
        const dx = bx - ax;
        const dz = bz - az;
        const lengthSquared = dx * dx + dz * dz;
        if (lengthSquared <= 0) return Math.hypot(px - ax, pz - az);
        const progress = clamp(((px - ax) * dx + (pz - az) * dz) / lengthSquared, 0, 1);
        return Math.hypot(px - (ax + dx * progress), pz - (az + dz * progress));
    }

    function pointInsideZone(zone, x, z, margin = 0) {
        const rotation = (Number(zone?.rotateY ?? zone?.rotate_y) || 0) * Math.PI / 180;
        const dx = (Number(x) || 0) - (Number(zone?.x) || 0);
        const dz = (Number(z) || 0) - (Number(zone?.z) || 0);
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const localX = dx * cos - dz * sin;
        const localZ = dx * sin + dz * cos;
        const shape = String(zone?.shape || '').toUpperCase();
        const boxScale = shape === 'BOX' ? 0.5 : 1;
        const radiusX = Math.max(1, Number(zone?.sizeX ?? zone?.size_x ?? zone?.size) || 1) * boxScale + Math.max(0, Number(margin) || 0);
        const radiusZ = Math.max(1, Number(zone?.sizeZ ?? zone?.size_z ?? zone?.size) || 1) * boxScale + Math.max(0, Number(margin) || 0);
        if (shape === 'SPHERE') return Math.hypot(localX, localZ) <= Math.max(radiusX, radiusZ);
        if (shape === 'BOX') return Math.abs(localX) <= radiusX && Math.abs(localZ) <= radiusZ;
        return (localX * localX) / (radiusX * radiusX) + (localZ * localZ) / (radiusZ * radiusZ) <= 1;
    }

    function tradePurchaseQuote({ requested, cargoUsed, cargoCapacity, credits, unitPrice, stock = Infinity } = {}) {
        const price = Math.max(0, Number(unitPrice) || 0);
        const freeCargo = Math.max(0, (Number(cargoCapacity) || 0) - (Number(cargoUsed) || 0));
        const affordable = price > 0 ? Math.floor(Math.max(0, Number(credits) || 0) / price) : freeCargo;
        const availableStock = Number.isFinite(Number(stock)) && Number(stock) > 0 ? Number(stock) : Infinity;
        const quantity = Math.floor(Math.max(0, Math.min(Number(requested) || 0, freeCargo, affordable, availableStock)));
        return { quantity, total: quantity * price, freeCargo, affordable };
    }

    function tradeSaleQuote({ requested, owned, unitPrice } = {}) {
        const price = Math.max(0, Number(unitPrice) || 0);
        const quantity = Math.floor(Math.max(0, Math.min(Number(requested) || 0, Math.max(0, Number(owned) || 0))));
        return { quantity, total: quantity * price };
    }

    function uniqueObjectIds(records, prefix = 'object') {
        const counts = new Map();
        return (Array.isArray(records) ? records : []).map((record, index) => {
            const base = String(record?.nickname || record?.id || `${prefix}_${index + 1}`).trim() || `${prefix}_${index + 1}`;
            const key = base.toLowerCase();
            const count = (counts.get(key) || 0) + 1;
            counts.set(key, count);
            return count === 1 ? base : `${base}__${count}`;
        });
    }

    return {
        advanceFleetCombatTimer,
        baseServices,
        classifyBaseKind,
        clamp,
        advancePatrolRoute,
        distancePointToSegment,
        formatDistance,
        formatEta,
        interceptAngle,
        missionTypeForIndex,
        npcCombatState,
        npcCruiseDecision,
        normalizeAngle,
        pointInsideZone,
        regenerateShield,
        reputationStatus,
        restoreMissionState,
        resolveShieldDamage,
        tradeLaneStart,
        tradePurchaseQuote,
        tradeSaleQuote,
        uniqueObjectIds
    };
});
