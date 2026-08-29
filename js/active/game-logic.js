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

    return {
        advanceFleetCombatTimer,
        baseServices,
        classifyBaseKind,
        clamp,
        interceptAngle,
        normalizeAngle,
        regenerateShield,
        resolveShieldDamage
    };
});
