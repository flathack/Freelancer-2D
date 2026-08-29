function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < String(value).length; i++) {
        hash ^= String(value).charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function seededRandom(seed) {
    let value = seed >>> 0;
    return () => {
        value = Math.imul(value + 0x6D2B79F5, 1);
        let t = value;
        t ^= t >>> 15;
        t = Math.imul(t, t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function planetPalette(archetype = '') {
    const type = archetype.toLowerCase();
    if (type.includes('earthsnw') || type.includes('ice')) return ['#315f8d', '#d9eef7', '#6f8f78', '#ffffff'];
    if (type.includes('earth')) return ['#1f5f8f', '#2d8b5d', '#8fcf9b', '#f2f8ff'];
    if (type.includes('des') || type.includes('red') || type.includes('mercury')) return ['#8e4d2f', '#d09a55', '#5a2b22', '#f1c27a'];
    if (type.includes('moon')) return ['#606978', '#aab3c1', '#343a45', '#d5d9df'];
    if (type.includes('gas')) return ['#35577c', '#7aa6c9', '#d8b46b', '#ffffff'];
    return ['#2f597d', '#6f9eb6', '#314f42', '#d8f4ff'];
}

const PLANET_TEXTURE_PATHS = {
    planet_ice: 'data/planet_textures/planet_ice.png',
    planet_mercury: 'data/planet_textures/planet_mercury.png',
    planet_icemoon: 'data/planet_textures/planet_icemoon.png',
    planet_ice_purple: 'data/planet_textures/planet_ice_purple.png',
    planet_moonblu: 'data/planet_textures/planet_moonblu.png',
    planet_gasblucld: 'data/planet_textures/planet_gasblucld.png',
    planet_desert: 'data/planet_textures/planet_desert.png',
    planet_earthgrncld_4000: 'data/planet_textures/planet_earthgrncld_4000.png',
    planet_earthgrncld: 'data/planet_textures/planet_earthgrncld.png',
    planet_watblucld: 'data/planet_textures/planet_watblucld.png',
    planet_desored: 'data/planet_textures/planet_desored.png',
    planet_crater: 'data/planet_textures/planet_crater.png',
    planet_rckbrn: 'data/planet_textures/planet_rckbrn.png',
    planet_earthgaia: 'data/planet_textures/planet_earthgaia.png',
    planet_desorgrck: 'data/planet_textures/planet_desorgrck.png',
    planet_moonred: 'data/planet_textures/planet_moonred.png',
    planet_storm: 'data/planet_textures/planet_storm.png'
};

function planetTextureFamily(archetype = '') {
    return String(archetype || '').toLowerCase().replace(/_\d+$/, '');
}

function planetTexturePath(archetype = '') {
    const exact = String(archetype || '').toLowerCase();
    if (PLANET_TEXTURE_PATHS[exact]) return PLANET_TEXTURE_PATHS[exact];
    const family = planetTextureFamily(archetype);
    if (PLANET_TEXTURE_PATHS[family]) return PLANET_TEXTURE_PATHS[family];
    if (family.includes('custom')) {
        const customChoices = [
            PLANET_TEXTURE_PATHS.planet_crater,
            PLANET_TEXTURE_PATHS.planet_desorgrck,
            PLANET_TEXTURE_PATHS.planet_rckbrn,
            PLANET_TEXTURE_PATHS.planet_ice_purple,
            PLANET_TEXTURE_PATHS.planet_storm,
            PLANET_TEXTURE_PATHS.planet_mercury
        ];
        const index = Math.abs(hashString(family)) % customChoices.length;
        return customChoices[index];
    }
    if (family.includes('saturn') || family.includes('uranus') || family.includes('neptune')) return PLANET_TEXTURE_PATHS.planet_storm;
    if (family.includes('neutron')) return PLANET_TEXTURE_PATHS.planet_crater;
    if (family.includes('earthsnw') || family.includes('earthgrnice')) return PLANET_TEXTURE_PATHS.planet_icemoon;
    if (family.includes('earthcity')) return PLANET_TEXTURE_PATHS.planet_earthgrncld;
    if (family.includes('earthgrncld')) return PLANET_TEXTURE_PATHS.planet_earthgrncld;
    if (family.includes('earthgaia')) return PLANET_TEXTURE_PATHS.planet_earthgaia;
    if (family.includes('earth')) return PLANET_TEXTURE_PATHS.planet_earthgaia;
    if (family.includes('watblu') || family.includes('watgrn') || family.includes('watdrk') || family.includes('icewat')) return PLANET_TEXTURE_PATHS.planet_watblucld;
    if (family.includes('gasice')) return PLANET_TEXTURE_PATHS.planet_ice_purple;
    if (family.includes('gasorg') || family.includes('gaspur')) return PLANET_TEXTURE_PATHS.planet_storm;
    if (family.includes('gasgrn') || family.includes('gasblu')) return PLANET_TEXTURE_PATHS.planet_gasblucld;
    if (family.includes('desorgrck')) return PLANET_TEXTURE_PATHS.planet_desorgrck;
    if (family.includes('desored')) return PLANET_TEXTURE_PATHS.planet_desored;
    if (family.includes('desormed') || family.includes('desorcld') || family.includes('rckdes')) return PLANET_TEXTURE_PATHS.planet_desorgrck;
    if (family.includes('desert') || family.includes('des')) return PLANET_TEXTURE_PATHS.planet_desert;
    if (family.includes('moonred')) return PLANET_TEXTURE_PATHS.planet_moonred;
    if (family.includes('moonblu')) return PLANET_TEXTURE_PATHS.planet_moonblu;
    if (family.includes('icemoon')) return PLANET_TEXTURE_PATHS.planet_icemoon;
    if (family.includes('ice_purple')) return PLANET_TEXTURE_PATHS.planet_ice_purple;
    if (family.includes('icemnt') || family.includes('icelnd')) return PLANET_TEXTURE_PATHS.planet_icemoon;
    if (family.includes('ice')) return PLANET_TEXTURE_PATHS.planet_ice;
    if (family.includes('mercury')) return PLANET_TEXTURE_PATHS.planet_mercury;
    if (family.includes('crater')) return PLANET_TEXTURE_PATHS.planet_crater;
    if (family.includes('rckmnt')) return PLANET_TEXTURE_PATHS.planet_crater;
    if (family.includes('rckbrn')) return PLANET_TEXTURE_PATHS.planet_rckbrn;
    if (family.includes('storm')) return PLANET_TEXTURE_PATHS.planet_storm;
    return '';
}

function loadPlanetTextureImage(archetype = '') {
    const path = planetTexturePath(archetype);
    if (!path) return null;
    const key = 'asset:' + path;
    if (!game.planetTextures[key]) {
        const image = new Image();
        image.src = path;
        image.onload = () => { if (game.running) render(); };
        game.planetTextures[key] = image;
    }
    const image = game.planetTextures[key];
    return image.complete && image.naturalWidth > 0 ? image : null;
}

function makePlanetTexture(planet) {
    const asset = loadPlanetTextureImage(planet.type);
    if (asset) return asset;
    const key = currentSystemId + ':' + planet.id + ':' + planet.type;
    if (game.planetTextures[key]) return game.planetTextures[key];
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const rng = seededRandom(hashString('planet:' + key));
    const [base, land, dark, cloud] = planetPalette(planet.type);

    const baseGradient = ctx.createRadialGradient(88, 78, 10, 128, 128, 140);
    baseGradient.addColorStop(0, cloud);
    baseGradient.addColorStop(0.18, land);
    baseGradient.addColorStop(0.68, base);
    baseGradient.addColorStop(1, dark);
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, 256, 256);

    ctx.globalCompositeOperation = 'overlay';
    for (let i = 0; i < 46; i++) {
        const x = rng() * 256;
        const y = rng() * 256;
        const rx = 12 + rng() * 58;
        const ry = 5 + rng() * 26;
        ctx.fillStyle = rng() < 0.55 ? land : dark;
        ctx.globalAlpha = 0.18 + rng() * 0.3;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, rng() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 22; i++) {
        ctx.strokeStyle = cloud;
        ctx.globalAlpha = 0.08 + rng() * 0.18;
        ctx.lineWidth = 2 + rng() * 8;
        ctx.beginPath();
        const y = rng() * 256;
        ctx.moveTo(-20, y);
        ctx.bezierCurveTo(70, y + rng() * 40 - 20, 150, y + rng() * 50 - 25, 276, y + rng() * 35 - 18);
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    game.planetTextures[key] = canvas;
    return canvas;
}

function planetAtmosphereRadius(planet) {
    const deathZoneRadius = Number(planet.deathZoneRadius || 0);
    if (deathZoneRadius > 0) return deathZoneRadius + 80;
    const iniRange = Number(planet.atmosphereRange || 0);
    if (iniRange > planet.radius) return Math.max(planet.radius * 1.18, iniRange * 0.72);
    return planet.radius * 1.55 + 260;
}

function drawTexturedPlanet(ctx, planet) {
    const pos = worldToScreen(planet.x, planet.z);
    const size = planet.radius * game.zoom;
    if (size < 1) return;
    const texture = makePlanetTexture(planet);
    const atmosphereSize = planetAtmosphereRadius(planet) * game.zoom;

    const atmoGradient = ctx.createRadialGradient(pos.x, pos.y, size * 0.92, pos.x, pos.y, atmosphereSize);
    atmoGradient.addColorStop(0, 'rgba(120,190,255,0.34)');
    atmoGradient.addColorStop(0.42, 'rgba(78,150,255,0.14)');
    atmoGradient.addColorStop(1, 'rgba(80,130,255,0)');
    ctx.fillStyle = atmoGradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, atmosphereSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(texture, pos.x - size, pos.y - size, size * 2, size * 2);
    const shade = ctx.createLinearGradient(pos.x - size, pos.y - size, pos.x + size, pos.y + size);
    shade.addColorStop(0, 'rgba(255,255,255,0.18)');
    shade.addColorStop(0.48, 'rgba(255,255,255,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = shade;
    ctx.fillRect(pos.x - size, pos.y - size, size * 2, size * 2);
    ctx.restore();

    if (planet.hasRing) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(-0.28);
        ctx.strokeStyle = 'rgba(210,220,190,0.42)';
        ctx.lineWidth = Math.max(2, game.zoom * 5);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.72, size * 0.52, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(120,140,130,0.22)';
        ctx.lineWidth = Math.max(1, game.zoom * 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 2.08, size * 0.68, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    ctx.strokeStyle = 'rgba(160,220,255,0.32)';
    ctx.lineWidth = Math.max(1, game.zoom * 2);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#88aacc';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, pos.x, pos.y + size + 15);
}

function renderSuns(ctx) {
    const suns = systemData.suns?.length ? systemData.suns : (systemData.sun ? [systemData.sun] : []);
    for (const sun of suns) {
        const pos = worldToScreen(sun.x, sun.z);
        const pulse = (Math.sin(game.gameTime * 3.4 + hashString(sun.type || 'sun')) + 1) * 0.5;
        const core = Math.max(54, (sun.radius || 240) * game.zoom);
        const corona = core * (4.3 + pulse * 0.55);
        const halo = ctx.createRadialGradient(pos.x, pos.y, core * 0.3, pos.x, pos.y, corona);
        halo.addColorStop(0, 'rgba(255,255,230,0.96)');
        halo.addColorStop(0.16, 'rgba(255,214,104,0.74)');
        halo.addColorStop(0.42, 'rgba(255,132,42,0.22)');
        halo.addColorStop(1, 'rgba(255,80,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, corona, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 10; i++) {
            const angle = i * Math.PI / 5 + game.gameTime * 0.08;
            ctx.strokeStyle = `rgba(255,190,70,${0.08 + pulse * 0.05})`;
            ctx.lineWidth = Math.max(1, core * 0.035);
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * core * 0.75, Math.sin(angle) * core * 0.75);
            ctx.lineTo(Math.cos(angle) * corona * 0.72, Math.sin(angle) * corona * 0.72);
            ctx.stroke();
        }
        ctx.restore();

        const coreGradient = ctx.createRadialGradient(pos.x - core * 0.28, pos.y - core * 0.32, 0, pos.x, pos.y, core);
        coreGradient.addColorStop(0, '#fffde8');
        coreGradient.addColorStop(0.35, '#ffd96a');
        coreGradient.addColorStop(0.78, '#ff8b24');
        coreGradient.addColorStop(1, '#7a2200');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, core, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderDamageZones(ctx) {
    for (const zone of systemData.zones || []) {
        if (!zone.damage || zone.damage <= 0) continue;
        const pos = worldToScreen(zone.x, zone.z);
        const rx = Math.max(1, zone.sizeX * game.zoom);
        const rz = Math.max(1, zone.sizeZ * game.zoom);
        if (Math.max(rx, rz) < 20) continue;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(flYawToCanvasRotation(zone.rotateY || 0));
        ctx.fillStyle = 'rgba(255,90,20,0.045)';
        ctx.strokeStyle = 'rgba(255,120,35,0.22)';
        ctx.lineWidth = Math.max(1, game.zoom * 2);
        ctx.beginPath();
        if (String(zone.shape || '').toUpperCase() === 'SPHERE') ctx.arc(0, 0, Math.max(rx, rz), 0, Math.PI * 2);
        else ctx.ellipse(0, 0, rx, rz, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

function updateRadiationWarning(active) {
    const warning = document.getElementById('radiation-warning');
    if (!warning) return;
    const label = game.language === 'de' ? 'Strahlungsschaden' : 'Radiation damage';
    warning.title = label;
    warning.setAttribute('aria-label', label);
    warning.classList.toggle('hidden', !active);
}

function checkPlanetAtmosphereHazards(dt) {
    if (!game.player || game.isDocked || game.player.destroyed) return;
    let activeAtmospherePlanetId = '';
    for (const planet of systemData.planets) {
        const dx = game.player.x - planet.x;
        const dz = game.player.z - planet.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const atmosphere = planetAtmosphereRadius(planet);
        if (dist > atmosphere) continue;
        activeAtmospherePlanetId = planet.id || planet.name || '';
        if (game.player.atmospherePlanetId !== activeAtmospherePlanetId) {
            playVoice('atmosphere', 1);
            game.player.atmospherePlanetId = activeAtmospherePlanetId;
        }
        game.player.cancelCruise?.();
        game.player.afterburnerActive = false;
        game.player.reverseActive = false;
        updateCruiseButton();
        if (game.player.inTradeLane) {
            game.player.inTradeLane = false;
            game.player.laneRoute = null;
            game.player.laneDirection = 1;
            game.player.maxSpeed = game.player.baseMaxSpeed;
        }
        const depth = 1 - Math.max(0, dist - planet.radius) / Math.max(1, atmosphere - planet.radius);
        const impact = dist < planet.radius * 1.03;
        const damage = impact ? 140 * dt : (10 + depth * 42) * dt;
        game.player.takeDamage(damage);
        game.player.throttle = Math.min(game.player.throttle, impact ? 0 : 0.25);
        game.player.speed *= impact ? 0.35 : 0.88;
        if (!game.player.lastAtmosphereWarning || performance.now() - game.player.lastAtmosphereWarning > 1000) {
            addLog((impact ? t('planetImpact') : t('atmosphereWarning')) + ': ' + planet.name, 'alert');
            game.player.lastAtmosphereWarning = performance.now();
        }
        break;
    }
    if (!activeAtmospherePlanetId) game.player.atmospherePlanetId = '';
}

function isPointInsideZone(zone, x, z) {
    return Freelancer2DLogic.pointInsideZone(zone, x, z);
}

function isPointInsideExpandedZone(zone, x, z, margin = 0) {
    return Freelancer2DLogic.pointInsideZone(zone, x, z, margin);
}

function isPointInsideZoneExclusion(zone, x, z, margin = 0) {
    return (zone.exclusionZones || []).some(exclusion => isPointInsideExpandedZone(exclusion, x, z, margin));
}

function isPointInsideActiveZone(zone, x, z, margin = 0) {
    if (!isPointInsideExpandedZone(zone, x, z, margin)) return false;
    return !isPointInsideZoneExclusion(zone, x, z, 0);
}

function damagingZones() {
    const zones = (systemData.zones || []).filter(zone => Number(zone.damage || 0) >= 1000 && Number.isFinite(zone.x) && Number.isFinite(zone.z));
    const minefields = (systemData.asteroidfields || [])
        .filter(field => field.hazardKind === 'explosive_mines' && Number.isFinite(field.x) && Number.isFinite(field.z))
        .map(field => ({
            ...field,
            id: field.id || field.nickname || field.zone,
            name: field.name || field.id || field.zone || 'Minefield',
            damage: Math.max(1000, Number(field.zone_damage || field.zoneDamage || 0)),
            size: field.size || 2000,
            sizeX: field.sizeX || field.size_x || field.size || 2000,
            sizeZ: field.sizeZ || field.size_z || field.size || 2000,
            rotateY: field.rotateY || field.rotate_y || 0,
            exclusionZones: field.exclusionZones || [],
            isMinefieldHazard: true
        }));
    return [...zones, ...minefields];
}

function autopilotHazardZones() {
    const hazards = damagingZones().map(zone => ({
        ...zone,
        hazardKind: zone.hazardKind || 'death_zone',
        blockRadius: circularDeathZoneRadius(zone),
        orbitRadius: circularDeathZoneRadius(zone) + 500
    }));
    for (const planet of systemData.planets || []) {
        const deathRadius = Number(planet.deathZoneRadius || 0);
        const atmosphereRadius = planetAtmosphereRadius(planet);
        const blockRadius = Math.max(deathRadius, atmosphereRadius);
        if (blockRadius <= 0) continue;
        const duplicate = hazards.find(zone => Math.hypot(zone.x - planet.x, zone.z - planet.z) <= Math.max(1000, blockRadius * 0.08));
        if (duplicate) {
            duplicate.blockRadius = Math.max(duplicate.blockRadius || 0, blockRadius);
            duplicate.orbitRadius = Math.max(duplicate.orbitRadius || 0, blockRadius + 500);
            duplicate.atmosphereRadius = Math.max(Number(duplicate.atmosphereRadius || 0), atmosphereRadius);
            duplicate.name = duplicate.name || planet.name;
            duplicate.hazardKind = 'planet_hazard';
            continue;
        }
        hazards.push({
            id: planet.id + '_autopilot_hazard',
            name: planet.name,
            x: planet.x,
            z: planet.z,
            size: blockRadius,
            sizeX: blockRadius,
            sizeZ: blockRadius,
            shape: 'SPHERE',
            rotateY: 0,
            damage: 1000,
            blockRadius,
            deathRadius,
            atmosphereRadius,
            orbitRadius: blockRadius + 500,
            hazardKind: 'planet_hazard'
        });
    }
    return hazards;
}

function segmentCrossesActiveZone(zone, x1, z1, x2, z2, margin = 0) {
    const distance = Math.hypot(x2 - x1, z2 - z1);
    const steps = clamp(Math.ceil(distance / 1000), 10, 96);
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x1 + (x2 - x1) * t;
        const z = z1 + (z2 - z1) * t;
        if (isPointInsideActiveZone(zone, x, z, margin)) return t;
    }
    return -1;
}

function segmentCrossesExpandedZone(zone, x1, z1, x2, z2, margin = 0) {
    const distance = Math.hypot(x2 - x1, z2 - z1);
    const steps = clamp(Math.ceil(distance / 1200), 8, 72);
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (isPointInsideExpandedZone(zone, x1 + (x2 - x1) * t, z1 + (z2 - z1) * t, margin)) return t;
    }
    return -1;
}

function circularDeathZoneRadius(zone) {
    return Math.max(1, Number(zone.sizeX || zone.size || 1), Number(zone.sizeZ || zone.size || 1));
}

function segmentCircleIntersection(zone, x1, z1, x2, z2, radius) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const fx = x1 - zone.x;
    const fz = z1 - zone.z;
    const a = dx * dx + dz * dz;
    if (a <= 0) return null;
    const b = 2 * (fx * dx + fz * dz);
    const c = fx * fx + fz * fz - radius * radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return null;
    const root = Math.sqrt(discriminant);
    const t1 = (-b - root) / (2 * a);
    const t2 = (-b + root) / (2 * a);
    const hits = [t1, t2].filter(t => t >= 0 && t <= 1).sort((left, right) => left - right);
    if (!hits.length) return null;
    return { enter: hits[0], exit: hits[hits.length - 1] };
}

function autopilotZoneSide(zone, x, z, targetX, targetZ, routeNormalX, routeNormalZ, avoidRadius) {
    const routeCandidates = [1, -1].map(side => {
        const angle = Math.atan2(z - zone.z, x - zone.x) + side * 0.72;
        const point = {
            x: zone.x + Math.cos(angle) * avoidRadius,
            z: zone.z + Math.sin(angle) * avoidRadius,
            side
        };
        const blocked = autopilotHazardZones().some(other => (other.id || other.name) !== (zone.id || zone.name) && Math.hypot(point.x - other.x, point.z - other.z) <= (other.blockRadius || circularDeathZoneRadius(other)) + 500);
        const pathCost = Math.hypot(point.x - x, point.z - z) + Math.hypot(targetX - point.x, targetZ - point.z);
        return { side, score: pathCost + (blocked ? 100000000 : 0) };
    });
    const centerSide = Math.sign((zone.x - x) * routeNormalX + (zone.z - z) * routeNormalZ);
    routeCandidates.sort((a, b) => a.score - b.score || (a.side === -centerSide ? -1 : 1));
    return routeCandidates[0]?.side || 1;
}

function segmentCrossesAutopilotHazard(zone, x1, z1, x2, z2, margin = 0) {
    if (zone.isMinefieldHazard) return segmentCrossesActiveZone(zone, x1, z1, x2, z2, margin);
    return segmentCircleIntersection(zone, x1, z1, x2, z2, (zone.blockRadius || circularDeathZoneRadius(zone)) + margin)?.enter ?? -1;
}

function pointInsideAutopilotHazard(zone, x, z, margin = 0) {
    if (zone.isMinefieldHazard) return isPointInsideActiveZone(zone, x, z, margin);
    return Math.hypot(x - zone.x, z - zone.z) <= (zone.blockRadius || circularDeathZoneRadius(zone)) + margin;
}

function getAutopilotDeathZoneAvoidance(x, z, targetX, targetZ, margin = 1400) {
    const clearance = 500;
    const dx = targetX - x;
    const dz = targetZ - z;
    const routeLength = Math.hypot(dx, dz);
    if (routeLength < 1) return { x: 0, z: 0, magnitude: 0 };
    const ux = dx / routeLength;
    const uz = dz / routeLength;
    const nx = -uz;
    const nz = ux;
    let threat = null;
    for (const zone of autopilotHazardZones()) {
        if (pointInsideAutopilotHazard(zone, targetX, targetZ)) continue;
        const activeHit = segmentCrossesAutopilotHazard(zone, x, z, targetX, targetZ, 0);
        if (activeHit >= 0 && (!threat || activeHit < threat.t)) threat = { zone, t: activeHit };
    }
    if (!threat) return { x: 0, z: 0, magnitude: 0 };

    const zone = threat.zone;
    const blockRadius = Math.max(zone.blockRadius || 0, circularDeathZoneRadius(zone));
    const avoidRadius = Math.max(zone.orbitRadius || 0, blockRadius + clearance);
    const avoidHit = segmentCircleIntersection(zone, x, z, targetX, targetZ, avoidRadius);
    if (!avoidHit && Math.hypot(x - zone.x, z - zone.z) > avoidRadius + 1200) return { x: 0, z: 0, magnitude: 0 };

    const currentRadius = Math.hypot(x - zone.x, z - zone.z);
    const entry = {
        x: avoidHit ? x + dx * avoidHit.enter : zone.x + ((x - zone.x) / Math.max(1, currentRadius)) * avoidRadius,
        z: avoidHit ? z + dz * avoidHit.enter : zone.z + ((z - zone.z) / Math.max(1, currentRadius)) * avoidRadius
    };
    const distanceToEntry = Math.hypot(entry.x - x, entry.z - z);
    let detour = entry;
    if (currentRadius <= avoidRadius + 1200 || distanceToEntry < 1100) {
        const side = autopilotZoneSide(zone, x, z, targetX, targetZ, nx, nz, avoidRadius);
        const currentAngle = Math.atan2(z - zone.z, x - zone.x);
        const stepAngle = clamp(Math.max(0.22, 1800 / avoidRadius), 0.22, 0.72);
        detour = {
            x: zone.x + Math.cos(currentAngle + side * stepAngle) * avoidRadius,
            z: zone.z + Math.sin(currentAngle + side * stepAngle) * avoidRadius
        };
        const radiusError = Math.abs(currentRadius - avoidRadius);
        if (radiusError > 650) {
            const radialAngle = Math.atan2(z - zone.z, x - zone.x);
            detour = {
                x: zone.x + Math.cos(radialAngle + side * stepAngle * 0.45) * avoidRadius,
                z: zone.z + Math.sin(radialAngle + side * stepAngle * 0.45) * avoidRadius
            };
        }
    }
    const vx = detour.x - x;
    const vz = detour.z - z;
    return { x: vx, z: vz, magnitude: Math.hypot(vx, vz), zone };
}

function checkZoneHazards(dt) {
    if (!game.player || game.isDocked || game.player.destroyed) {
        updateRadiationWarning(false);
        if (game.player) game.player.zoneDamageVoicePlayed = false;
        return;
    }
    let activeZoneDamage = false;
    for (const field of systemData.asteroidfields || []) {
        if (field.hazardKind !== 'explosive_mines' || !isPointInsideActiveZone(field, game.player.x, game.player.z)) continue;
        game.player.cancelCruise?.();
        game.player.afterburnerActive = false;
        game.player.reverseActive = false;
        updateCruiseButton();
        game.player.takeHullDamage(260 * dt, 'Minefield damage');
        game.player.speed *= 0.82;
        if (!game.player.lastMinefieldWarning || performance.now() - game.player.lastMinefieldWarning > 1200) {
            addLog('Minefield hazard: ' + (field.name || field.id || 'minefield'), 'alert');
            game.player.lastMinefieldWarning = performance.now();
        }
        break;
    }
    for (const zone of systemData.zones || []) {
        const damage = Number(zone.damage || 0);
        if (damage <= 0 || !isPointInsideZone(zone, game.player.x, game.player.z)) continue;
        if (zone.dragModifier && zone.dragModifier < 1) {
            game.player.cancelCruise?.();
            game.player.afterburnerActive = false;
            game.player.reverseActive = false;
            updateCruiseButton();
        }
        const damagePerSecond = damage / 60;
        game.player.takeHullDamage(damagePerSecond * dt, 'Radiation damage');
        activeZoneDamage = true;
        if (zone.dragModifier && zone.dragModifier !== 1) game.player.speed *= Math.max(0.25, Math.min(1, zone.dragModifier));
        if (!game.player.zoneDamageVoicePlayed) {
            playVoice('radioDamage', 1);
            game.player.zoneDamageVoicePlayed = true;
        }
        break;
    }
    updateRadiationWarning(activeZoneDamage);
    if (!activeZoneDamage) game.player.zoneDamageVoicePlayed = false;
}

function addShieldHitEffect(target, hitX = null, hitZ = null, strength = 1) {
    if (!target || (Number(target.maxShield) || 0) <= 0) return;
    const angle = Number.isFinite(hitX) && Number.isFinite(hitZ) ? Math.atan2(hitZ - target.z, hitX - target.x) : target.rotation || 0;
    game.effects.push({
        type: 'shield-hit',
        target,
        angle,
        age: 0,
        life: 0.34,
        radius: Math.max(28, (Number(target.radius) || 20) + 10),
        strength: clamp(Number(strength) || 1, 0.5, 2.4)
    });
}

function addCruiseDisruptEffect(target, hitX = null, hitZ = null) {
    if (!target) return;
    game.effects.push({
        type: 'cruise-disrupt',
        target,
        x: Number.isFinite(hitX) ? hitX : target.x,
        z: Number.isFinite(hitZ) ? hitZ : target.z,
        age: 0,
        life: 0.72,
        radius: Math.max(42, (Number(target.radius) || 20) + 26)
    });
}

function playCruiseDisruptSound(x = null, z = null, intensity = 1) {
    if (Number.isFinite(x) && Number.isFinite(z) && game.player) {
        const distance = Math.hypot(x - game.player.x, z - game.player.z);
        if (distance > 2800) return;
        intensity *= 1 - clamp(distance / 2800, 0, 1);
    }
    if (playBufferedSound('cruiseDisrupt', CRUISE_DISRUPTOR_SOUND_PATH, clamp(0.22 * intensity, 0.08, 0.58)) === 'failed') {
        playTone(1150, 0.08, 'sawtooth', 0.035 * intensity, 360);
        playTone(180, 0.16, 'square', 0.026 * intensity, 70);
    }
}

function applyCruiseDisruption(target, projectile = null, hitX = null, hitZ = null) {
    if (!target || !projectile?.cruiseDisruptor) return false;
    const now = performance.now();
    const wasCruising = Boolean(target.cruiseActive || target.cruiseCharging);
    target.cruiseDisruptedUntil = Math.max(Number(target.cruiseDisruptedUntil) || 0, now + (projectile.disruptDuration || CRUISE_DISRUPT_LOCKOUT_MS));
    target.cruiseActive = false;
    target.cruiseCharging = false;
    target.cruiseCharge = 0;
    if (target === game.player) {
        target.afterburnerActive = false;
        target.speed = Math.min(Number(target.speed) || 0, COMBAT_MAX_SPEED * 0.78);
        updateCruiseButton();
        addLog(t('cruiseDisrupted'), 'alert');
    } else {
        target.speed = Math.min(Number(target.speed) || 0, Math.max(60, Number(target.maxSpeed) || COMBAT_MAX_SPEED));
        target.throttle = Math.min(Number(target.throttle) || 0.4, 0.45);
    }
    addCruiseDisruptEffect(target, hitX, hitZ);
    playCruiseDisruptSound(hitX ?? target.x, hitZ ?? target.z, wasCruising ? 1.25 : 0.85);
    return true;
}

function createExplosion(x, z, radius = 40, options = {}) {
    const size = Math.max(28, Number(radius) || 40);
    const count = Math.round(clamp(size * 0.42, 18, 90));
    const particles = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (60 + Math.random() * 260) * (0.65 + size / 140);
        const life = 0.45 + Math.random() * 0.95 + Math.min(0.55, size / 240);
        particles.push({
            x: x + Math.cos(angle) * Math.random() * size * 0.22,
            z: z + Math.sin(angle) * Math.random() * size * 0.22,
            vx: Math.cos(angle) * speed,
            vz: Math.sin(angle) * speed,
            size: 5 + Math.random() * Math.max(8, size * 0.16),
            life,
            age: 0,
            color: Math.random() < 0.28 ? 'rgba(140,220,255,' : (Math.random() < 0.62 ? 'rgba(255,196,80,' : 'rgba(255,76,36,')
        });
    }
    game.effects.push({
        type: 'explosion',
        x, z,
        age: 0,
        life: Math.max(1.0, 1.15 + size / 150),
        radius: size,
        flash: options.flash !== false,
        particles
    });
    playSound('explosion', Math.min(1.6, 0.55 + size / 120));
}

function updateEffects(dt) {
    for (let i = game.effects.length - 1; i >= 0; i--) {
        const effect = game.effects[i];
        effect.age = (effect.age || 0) + dt;
        if (effect.type === 'explosion') {
            for (const particle of effect.particles || []) {
                particle.age += dt;
                particle.x += particle.vx * dt;
                particle.z += particle.vz * dt;
                particle.vx *= Math.max(0, 1 - dt * 0.72);
                particle.vz *= Math.max(0, 1 - dt * 0.72);
            }
        }
        if (effect.age >= effect.life) game.effects.splice(i, 1);
    }
}

function showDeathOverlay() {
    const overlay = document.getElementById('death-overlay');
    if (!overlay) return;
    const message = document.getElementById('death-message');
    const button = document.getElementById('btn-death-restart');
    if (message) message.textContent = t('playerDead');
    if (button) button.textContent = t('restart');
    overlay.classList.remove('hidden');
}

function destroyPlayerShip() {
    if (!game.player || game.player.destroyed) return;
    game.player.destroyed = true;
    game.player.hull = 0;
    game.player.throttle = 0;
    game.player.speed = 0;
    game.player.cruiseActive = false;
    game.player.cruiseCharging = false;
    game.player.afterburnerActive = false;
    game.player.inTradeLane = false;
    game.player.laneRoute = null;
    game.playerDeathPending = true;
    createExplosion(game.player.x, game.player.z, Math.max(55, game.player.radius * 2.8), { flash: true });
    clearTimeout(game.playerDeathTimer);
    game.playerDeathTimer = setTimeout(showDeathOverlay, 2000);
    updateCruiseButton();
}

function restartAfterDeath() {
    clearTimeout(game.playerDeathTimer);
    game.playerDeathTimer = null;
    game.playerDeathPending = false;
    document.getElementById('death-overlay')?.classList.add('hidden');
    game.effects = [];
    respawnAtLastLanding();
}

function createLandingRecord(target) {
    const baseId = getBaseId(target);
    return {
        systemId: currentSystemId,
        baseId,
        targetId: target?.id || target?.nickname || '',
        dockWith: target?.dockWith || target?.dock_with || '',
        base: target?.base || '',
        name: target?.name || baseId || systemData.name,
        x: Number(target?.x) || 0,
        z: Number(target?.z) || 0,
        type: target?.type || target?.constructor?.name || 'Base'
    };
}

function isPlanetDockTarget(target) {
    return target instanceof PlanetLocation || String(target?.type || '').toLowerCase().includes('planet');
}

function isDockingRingTarget(target) {
    const type = String(target?.type || target?.archetype || '').toLowerCase();
    const solarType = String(target?.solarType || target?.solar_type || '').toLowerCase();
    return solarType === 'docking_ring' || type.includes('dock_ring');
}

function findPlanetForBase(baseId) {
    const normalized = String(baseId || '').toLowerCase();
    if (!normalized) return null;
    return (systemData.planets || []).find(planet => getBaseId(planet) === normalized) || null;
}

function findDockingRingForBase(baseId) {
    const normalized = String(baseId || '').toLowerCase();
    if (!normalized) return null;
    const candidates = [...(systemData.stations || []), ...game.entities.filter(entity => entity instanceof Station)];
    return candidates.find(entity => getBaseId(entity) === normalized && isDockingRingTarget(entity)) || null;
}

function findDockingRingForPlanet(planet) {
    const baseId = getBaseId(planet);
    const matchingRing = findDockingRingForBase(baseId);
    if (matchingRing) return matchingRing;
    const rings = [...(systemData.stations || []), ...game.entities.filter(entity => entity instanceof Station)].filter(isDockingRingTarget);
    if (!rings.length) return null;
    const maxDistance = planetAtmosphereRadius(planet) + 9000;
    return rings
        .map(ring => ({ ring, distance: Math.hypot(ring.x - planet.x, ring.z - planet.z) }))
        .filter(entry => entry.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)[0]?.ring || null;
}

function resolveDockingTargets(target) {
    if (isPlanetDockTarget(target)) {
        const dockingRing = findDockingRingForPlanet(target);
        if (dockingRing) return { flightTarget: dockingRing, landingTarget: target };
    }
    if (isDockingRingTarget(target)) {
        const planet = findPlanetForBase(getBaseId(target));
        if (planet) return { flightTarget: target, landingTarget: planet };
    }
    return { flightTarget: target, landingTarget: target };
}

function launchPointFromDockTarget(target) {
    if (!target) return null;
    const baseId = getBaseId(target);
    const planet = isPlanetDockTarget(target) ? target : findPlanetForBase(baseId);
    const dockingRing = planet ? findDockingRingForPlanet(planet) : (isDockingRingTarget(target) ? target : null);
    if (dockingRing) {
        const anchor = planet || findPlanetForBase(getBaseId(dockingRing));
        let dx = anchor ? dockingRing.x - anchor.x : Math.cos(flYawToCanvasRotation(dockingRing.rotateY || 0));
        let dz = anchor ? dockingRing.z - anchor.z : Math.sin(flYawToCanvasRotation(dockingRing.rotateY || 0));
        const length = Math.hypot(dx, dz) || 1;
        dx /= length;
        dz /= length;
        return {
            x: dockingRing.x + dx * 700,
            z: dockingRing.z + dz * 700,
            rotation: Math.atan2(dz, dx)
        };
    }
    if (planet) {
        const angle = game.player?.rotation || 0;
        const distance = planetAtmosphereRadius(planet) + 650;
        return {
            x: planet.x + Math.cos(angle) * distance,
            z: planet.z + Math.sin(angle) * distance,
            rotation: angle
        };
    }
    return null;
}

function findLandingTarget(landing = game.lastLanding) {
    if (!landing) return null;
    const baseId = String(landing.baseId || '').toLowerCase();
    const candidates = [...game.entities, ...(systemData.planets || []), ...(systemData.stations || [])];
    if (baseId) {
        const dockable = candidates.find(entity => getBaseId(entity) === baseId);
        if (dockable) return dockable;
    }
    return {
        name: landing.name || 'Base',
        base: landing.baseId || '',
        dockWith: landing.baseId || '',
        x: Number(landing.x) || 0,
        z: Number(landing.z) || 0
    };
}

function respawnAtLastLanding() {
    if (!game.player) return;
    const fallbackStation = systemData.stations?.find(station => String(station.base || station.dockWith || '').toLowerCase() === 'li01_11_base') || systemData.stations?.[0];
    const landing = game.lastLanding || (fallbackStation ? createLandingRecord(fallbackStation) : null);
    if (landing?.systemId && landing.systemId.toLowerCase() !== currentSystemId.toLowerCase()) {
        currentSystemId = landing.systemId;
        systemData = buildSystemData(currentSystemId);
        rebuildEntities();
        updateSystemHud();
    }
    const target = findLandingTarget(landing) || fallbackStation || { name: systemData.name, x: 0, z: 0, base: '' };
    game.lastLanding = createLandingRecord(target);
    game.player.destroyed = false;
    game.player.hull = game.player.maxHull;
    game.player.shield = game.player.maxShield;
    game.player.energy = game.player.maxEnergy;
    game.player.throttle = 0;
    game.player.speed = 0;
    game.player.x = Number(target.x) + 320;
    game.player.z = Number(target.z) + 120;
    game.player.rotation = -Math.PI / 2;
    game.player.inTradeLane = false;
    game.player.laneRoute = null;
    game.player.laneDirection = 1;
    game.selectedTarget = target;
    game.approachTarget = null;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    game.running = true;
    addLog('Respawn at last landing: ' + target.name, 'alert');
    openLandingWindow(target);
}

function getCurrentSystemKey() {
    const source = gameSystemsData();
    return Object.keys(source || {}).find(k => k.toLowerCase() === currentSystemId.toLowerCase()) || currentSystemId;
}

function createFieldObstacles(field, kind) {
    const rng = seededRandom(hashString(currentSystemId + ':' + field.id + ':' + kind));
    const count = kind === 'mine'
        ? Math.min(1040, Math.max(180, Math.floor(field.size / 60)))
        : kind === 'debris'
            ? Math.min(720, Math.max(140, Math.floor(field.size / 82)))
            : kind === 'asteroid'
                ? Math.min(680, Math.max(104, Math.floor(field.size / 92)))
                : Math.min(46, Math.max(10, Math.floor(field.size / 1100)));
    const fieldKind = String(field.fieldKind || '').toLowerCase();
    const hasDynamicAsteroids = Array.isArray(field.dynamicAsteroids) && field.dynamicAsteroids.length > 0;
    const hasLoot = Array.isArray(field.lootCommodities) && field.lootCommodities.length > 0;
    const smallChance = kind === 'asteroid' ? (hasDynamicAsteroids || hasLoot || fieldKind.includes('mineable') ? 0.26 : 0.15) : (kind === 'debris' ? 0.12 : 0);
    const radiusX = Math.max(800, field.sizeX || field.size || 2000);
    const radiusZ = Math.max(800, field.sizeZ || field.size || 2000);
    const fieldRotation = flYawToCanvasRotation(field.rotateY || 0);
    const obstacles = [];
    for (let i = 0; i < count; i++) {
        const angle = rng() * Math.PI * 2;
        const dist = Math.sqrt(rng());
        const localX = Math.cos(angle) * dist * radiusX;
        const localZ = Math.sin(angle) * dist * radiusZ;
        const rotated = rotatePoint(localX, localZ, fieldRotation);
        const worldX = field.x + rotated.x;
        const worldZ = field.z + rotated.z;
        if (isPointInsideZoneExclusion(field, worldX, worldZ)) {
            i--;
            continue;
        }
        const roll = rng();
        const isSmall = kind !== 'mine' && roll < smallChance;
        const radius = isSmall
            ? 14 + rng() * 28
            : kind === 'mine'
            ? 32 + rng() * 56
            : kind === 'debris'
                ? 65 + rng() * 260
                : kind === 'asteroid'
                    ? 55 + rng() * 190
                    : 120 + rng() * 420;
        const depthRoll = rng();
        const depthLayer = kind === 'mine' || isSmall
            ? 0
            : depthRoll < 0.58
                ? 0
                : (depthRoll < 0.79 ? -1 : 1);
        const collidable = kind === 'mine' || (!isSmall && depthLayer === 0);
        const destructible = (kind === 'asteroid' || kind === 'debris') && (isSmall || fieldKind.includes('mineable') || hasDynamicAsteroids || hasLoot);
        obstacles.push({
            id: field.id + '_obstacle_' + i,
            fieldId: field.id,
            kind,
            field,
            localX,
            localZ,
            x: worldX,
            z: worldZ,
            radius,
            visualRadius: radius * (depthLayer === 1 ? 1.18 : depthLayer === -1 ? 0.82 : 1),
            depthLayer,
            collidable,
            destructible,
            hull: destructible ? Math.max(8, Math.round(radius * (isSmall ? 1.4 : 2.8))) : Infinity,
            maxHull: destructible ? Math.max(8, Math.round(radius * (isSmall ? 1.4 : 2.8))) : Infinity,
            lootChance: hasLoot ? (isSmall ? 0.72 : 0.38) : (fieldKind.includes('mineable') ? 0.22 : 0.04),
            lootQuantity: isSmall ? 1 : 1 + Math.floor(rng() * 2),
            small: isSmall,
            rotation: rng() * Math.PI * 2,
            spinSpeed: kind === 'mine' ? 0 : (kind === 'nebula' ? 0 : (rng() - 0.5) * 0.18),
            driftPhase: rng() * Math.PI * 2,
            driftSpeed: kind === 'asteroid' || kind === 'debris' ? 0.045 + rng() * 0.075 : 0,
            driftRadius: kind === 'asteroid' || kind === 'debris' ? 18 + rng() * 70 : 0,
            damage: kind === 'mine' ? 2000000 : (kind === 'debris' ? 14 : 8)
        });
    }
    return obstacles;
}

function rebuildEntities() {
    game.entities = [];
    game.obstacles = [];
    for (const planetData of systemData.planets) game.entities.push(new PlanetLocation(planetData));
    for (const stationData of systemData.stations) game.entities.push(new Station(stationData));
    for (const gateData of systemData.jumpgates) game.entities.push(new JumpGate(gateData));
    for (const lane of systemData.tradeLanes) {
        lane.rings.forEach((ring, i) => {
            game.entities.push(new TradeLaneRing({
                ...ring,
                laneId: lane.id || lane.nickname || 'trade_lane',
                laneRings: lane.rings,
                visualRotation: tradeLaneRingRotation(lane.rings, i)
            }, i));
        });
    }
    for (const fieldData of systemData.asteroidfields) {
        const field = new AsteroidField(fieldData);
        game.entities.push(field);
        game.obstacles.push(...field.obstacles);
    }
    for (const nebulaData of systemData.nebulae) {
        const nebula = new Nebula(nebulaData);
        game.entities.push(nebula);
        game.obstacles.push(...nebula.obstacles);
    }
}

function updateSystemHud() {
    const systemName = document.getElementById('system-name');
    if (systemName) systemName.textContent = activeModConfig().name.toUpperCase() + ' | SYSTEM: ' + systemData.name;
    const mapTitle = document.querySelector('#map-header h3');
    if (mapTitle) mapTitle.textContent = 'SYSTEM MAP - ' + systemData.name.toUpperCase();
    updateDocumentTitle();
}

function findArrivalObject(destObjectId) {
    return findArrivalObjectInSystem(currentSystemId, destObjectId);
}

function jumpArrivalPose(arrival, fallbackAngle) {
    const angle = arrival instanceof JumpGate || arrival?.kind
        ? flYawToCanvasRotation(arrival.rotateY || 0)
        : fallbackAngle;
    const isJumpHole = arrival instanceof JumpGate && arrival.kind === 'hole' || arrival?.kind === 'hole';
    const distance = arrival instanceof JumpGate || arrival?.kind
        ? (isJumpHole
            ? Math.max(1800, (arrival.visualRadius || arrival.radius || 600) * 2.2)
            : Math.max(650, Math.min(1600, (arrival.radius || 600) + 260)))
        : 200;
    return {
        x: (arrival?.x || 0) + Math.cos(angle) * distance,
        z: (arrival?.z || 0) + Math.sin(angle) * distance,
        rotation: angle
    };
}

function loadSystem(systemId, arrivalObjectId = null) {
    const previousSystemId = currentSystemId;
    currentSystemId = canonicalSystemId(systemId || currentSystemId);
    systemData = buildSystemData(currentSystemId);
    game.selectedTarget = null;
    game.approachTarget = null;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    game.loot = [];
    game.missionOffers = {};
    game.npcs = previousSystemId === currentSystemId ? game.npcs.filter(npc => !npc.missionId) : [];
    if (previousSystemId !== currentSystemId) game.npcFleets = [];
    if (game.player) {
        const arrival = findArrivalObject(arrivalObjectId) || systemData.stations[0] || systemData.jumpgates[0] || { x: 0, z: 0 };
        const fallbackAngle = game.jumpTransition ? game.jumpTransition.angle : game.player.rotation;
        const pose = game.jumpTransition
            ? jumpArrivalPose(arrival, fallbackAngle)
            : {
                x: arrival.x + Math.cos(fallbackAngle) * 200,
                z: arrival.z + Math.sin(fallbackAngle) * 200,
                rotation: fallbackAngle
            };
        game.player.x = pose.x;
        game.player.z = pose.z;
        game.player.rotation = pose.rotation;
        game.player.inTradeLane = false;
        game.player.laneRoute = null;
        game.player.laneDirection = 1;
        game.player.tradeLaneCooldownUntil = performance.now() + 1800;
        game.jumpHoleCaptureCooldownUntil = performance.now() + 3200;
        setNormalFlightSpeed(game.player);
    }
    returnToFreeflight('', { preserveMotion: true });
    rebuildEntities();
    if (previousSystemId !== currentSystemId) game.ambientTradeSeededSystemId = '';
    seedAmbientTradeTrafficForSystem();
    updateSystemHud();
    if (game.showMap) drawMapCanvas();
    addLog('Entered system: ' + systemData.name);
    saveGame();
}

function getAvoidanceVector(x, z, lookAhead = 1500) {
    let ax = 0;
    let az = 0;
    for (const obstacle of game.obstacles) {
        if (obstacle.collidable === false) continue;
        const dx = x - obstacle.x;
        const dz = z - obstacle.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const avoidRadius = obstacle.radius + lookAhead;
        if (dist > 0 && dist < avoidRadius) {
            const strength = (avoidRadius - dist) / avoidRadius;
            ax += (dx / dist) * strength;
            az += (dz / dist) * strength;
        }
    }
    return { x: ax, z: az, magnitude: Math.sqrt(ax * ax + az * az) };
}

// Player Ship
class PlayerShip {
    constructor(x, z) {
        this.x = x; this.z = z;
        this.rotation = -Math.PI / 2; // Face right
        this.speed = 0;
        this.throttle = 0.8; // Start at 80%
        this.maxSpeed = COMBAT_MAX_SPEED;
        this.baseMaxSpeed = COMBAT_MAX_SPEED;
        this.cruiseSpeed = cruiseSpeedForMod();
        this.afterburnerSpeed = AFTERBURNER_SPEED;
        this.cruiseActive = false;
        this.cruiseCharging = false;
        this.cruiseCharge = 0;
        this.afterburnerActive = false;
        this.reverseActive = false;
        this.afterburnerPulse = 0;
        this.turnRate = 2.0;
        this.agility = 1.4;
        this.acceleration = 1.5;
        this.brakeRate = 3.0;
        this.strafePower = 1.0;
        this.linearDrag = 1.0;
        this.bankFactor = 1.0;
        this.shipMass = 100;
        this.shipClass = 0;
        this.hull = 100; this.maxHull = 100;
        this.shield = 0; this.maxShield = 0; this.shieldRegen = 0;
        this.shieldOfflineRebuildTime = 0;
        this.shieldOfflineThreshold = 0;
        this.shieldRebuildPowerDraw = 0;
        this.shieldType = '';
        this.energy = 100; this.maxEnergy = 100; this.powerGen = 15;
        this.powerPlantId = '';
        this.powerPlantName = 'Powerplant';
        this.thrustCapacity = 1000;
        this.thrustChargeRate = 100;
        this.thrustEnergy = this.thrustCapacity;
        this.credits = 100000; this.cargo = []; this.maxCargo = 50;
        this.equipmentInventory = [];
        this.mountedEquipment = {};
        this.nanobots = 3;
        this.maxNanobots = 25;
        this.shieldBatteries = 3;
        this.maxShieldBatteries = 25;
        this.maxMissileAmmo = 50;
        this.mineAmmo = MAX_MINE_AMMO;
        this.maxMineAmmo = MAX_MINE_AMMO;
        this.countermeasureAutoEnabled = true;
        this.primaryCooldown = 0;
        this.missileCooldown = 0;
        this.mineCooldown = 0;
        this.countermeasureCooldown = 0;
        this.radius = 20;
        this.inTradeLane = false; this.laneSpeed = 2500;
        this.laneRoute = null; this.laneIndex = 0; this.laneDirection = 1;
        this.tradeLaneCooldownUntil = 0;
        this.fireHeld = false; this.lastFireTime = 0;
        this.strafeLeftActive = false;
        this.strafeRightActive = false;
        this.shipPackageId = null;
        this.shipId = null;
        this.shipName = 'Starflier';
        this.shipIcon = '';
        this.faction = 'li_n_grp';
        this.reputations = null;
        this.firePower = 4;
        this.weaponSlots = 1;
        
        console.log('PlayerShip created at:', x, z, 'throttle:', this.throttle);
    }
    
    update(dt) {
        // Debug: log every second
        if (game.frameCount % 60 === 0) {
            console.log('Player update:', {
                x: this.x.toFixed(0),
                z: this.z.toFixed(0),
                speed: this.speed.toFixed(1),
                throttle: this.throttle,
                targetSpeed: (this.throttle * this.maxSpeed).toFixed(0)
            });
        }
        
        // Energy regen from powerplant
        this.energy = Math.min(this.maxEnergy, this.energy + this.powerGen * dt);
        this.thrustCapacity = Math.max(0, Number(this.thrustCapacity) || 0);
        this.thrustEnergy = Math.min(this.thrustCapacity, Math.max(0, Number(this.thrustEnergy) || 0));
        if (this.afterburnerActive && !canUseAfterburner()) this.afterburnerActive = false;
        if (this.afterburnerActive) {
            this.thrustEnergy = Math.max(0, this.thrustEnergy - thrusterPowerUsage() * dt);
            if (this.thrustEnergy <= 0) this.afterburnerActive = false;
        } else {
            this.thrustEnergy = Math.min(this.thrustCapacity, this.thrustEnergy + Math.max(0, Number(this.thrustChargeRate) || 0) * dt);
        }
        if (!this.afterburnerActive) syncTouchAfterburnerButton();
        
        // Shield regen (only when not taking damage)
        if (this.maxShield > 0 && this.shield < this.maxShield) {
            this.shield = Math.min(this.maxShield, this.shield + this.shieldRegen * dt);
        } else if (this.maxShield <= 0) {
            this.shield = 0;
        }

        this.maxSpeed = this.baseMaxSpeed || COMBAT_MAX_SPEED;
        if ((Number(this.cruiseDisruptedUntil) || 0) > performance.now() && (this.cruiseActive || this.cruiseCharging)) {
            this.cancelCruise();
            updateCruiseButton();
        }
        if (this.cruiseCharging) {
            this.cruiseCharge += dt;
            if (this.cruiseCharge >= CRUISE_CHARGE_SECONDS) {
                this.cruiseCharging = false;
                this.cruiseActive = true;
                this.cruiseCharge = CRUISE_CHARGE_SECONDS;
                playSound('select', 1.25);
                addLog(t('cruiseEnabled'));
            }
            updateCruiseButton();
        }
        
        // Manual steering from mouse or optional touch joystick.
        if (isManualSteeringActive()) {
            const world = screenToWorld(game.mouseX, game.mouseY);
            const targetAngle = game.joystickActive ? game.joystickAngle : Math.atan2(world.y - this.z, world.x - this.x);
            
            let angleDiff = targetAngle - this.rotation;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            const turnPower = game.joystickActive ? Math.max(0.25, game.joystickPower) : 1;
            this.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnRate * turnPower * dt);
        }
        
        // Approach autopilot pauses while the player is steering manually.
        if (game.approachTarget && !isManualSteeringActive()) {
            const dx = game.approachTarget.x - this.x;
            const dz = game.approachTarget.z - this.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const arrivalDistance = game.dockTarget ? 180 : 100;
            const brakeDistance = 700;
            const shouldBrakeForArrival = !game.dockTarget && dist <= brakeDistance;
            const shouldDropDockCruise = game.dockTarget && !(game.dockTarget instanceof TradeLaneRing) && !(game.dockTarget instanceof JumpGate) && dist <= 500;
            if (shouldDropDockCruise && (this.cruiseActive || this.cruiseCharging || this.afterburnerActive)) {
                this.cancelCruise();
                this.afterburnerActive = false;
                this.reverseActive = false;
                this.throttle = 1;
                if (!game.dockApproachVoicePlayed) {
                    playVoice('allowedToDock', 1);
                    game.dockApproachVoicePlayed = true;
                }
                updateCruiseButton();
                updateSpeedControl();
            }
            if (shouldBrakeForArrival) {
                this.cancelCruise();
                this.afterburnerActive = false;
                this.reverseActive = false;
                this.throttle = 0;
                updateCruiseButton();
            }
            
            if (dist > arrivalDistance) {
                const avoidance = getAvoidanceVector(this.x, this.z, game.dockTarget ? 1900 : 1500);
                const deathZoneAvoidance = getAutopilotDeathZoneAvoidance(this.x, this.z, game.approachTarget.x, game.approachTarget.z, game.dockTarget ? 1700 : 1400);
                const isAvoidingDeathZone = deathZoneAvoidance.magnitude > 0;
                const steerX = isAvoidingDeathZone
                    ? deathZoneAvoidance.x + avoidance.x * Math.min(dist, 2600)
                    : dx + avoidance.x * Math.min(dist, 4500);
                const steerZ = isAvoidingDeathZone
                    ? deathZoneAvoidance.z + avoidance.z * Math.min(dist, 2600)
                    : dz + avoidance.z * Math.min(dist, 4500);
                const targetAngle = Math.atan2(steerZ, steerX);
                let angleDiff = targetAngle - this.rotation;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                if (Math.abs(angleDiff) > 0.05) {
                    this.rotation += Math.sign(angleDiff) * this.turnRate * dt * (isAvoidingDeathZone || avoidance.magnitude > 0.05 ? 1.1 : 0.5);
                }
                if (shouldBrakeForArrival) {
                    this.throttle = 0;
                } else if (!this.cruiseActive && !this.cruiseCharging && !this.afterburnerActive) {
                    this.throttle = isAvoidingDeathZone ? 0.85 : (avoidance.magnitude > 0.35 ? 0.55 : 1);
                }
                if (isAvoidingDeathZone && (!game.lastDeathZoneAvoidanceLog || performance.now() - game.lastDeathZoneAvoidanceLog > 3500)) {
                    addLog('Autopilot avoiding death zone: ' + (deathZoneAvoidance.zone?.name || deathZoneAvoidance.zone?.id || 'hazard'), 'alert');
                    game.lastDeathZoneAvoidanceLog = performance.now();
                }
            } else {
                const finishedName = game.approachTarget.name;
                this.cancelCruise();
                this.afterburnerActive = false;
                this.reverseActive = false;
                this.throttle = 0;
                updateCruiseButton();
                if (!game.dockTarget && Math.abs(this.speed) <= 2) {
                    this.speed = 0;
                    if (!game.approachArrivalLogged) {
                        addLog('Arrived near ' + finishedName);
                        game.approachArrivalLogged = true;
                    }
                }
            }
        }
        
        // Trade lane speed check
        if (this.inTradeLane) {
            const targetSpeed = this.tradeLaneTargetSpeed();
            const rate = targetSpeed >= this.speed ? TRADE_LANE_ACCELERATION : TRADE_LANE_DECELERATION;
            const delta = targetSpeed - this.speed;
            this.speed += Math.sign(delta) * Math.min(Math.abs(delta), rate * dt);
            // Check if reached end of lane
            if (this.laneIndex >= this.laneRoute.length || this.laneIndex < 0) {
                this.exitTradeLane('Exited trade lane - returning to normal flight');
            }
        } else {
            let targetSpeed = this.throttle * COMBAT_MAX_SPEED;
            if (this.cruiseActive) targetSpeed = this.cruiseSpeed;
            else if (this.afterburnerActive) targetSpeed = this.afterburnerSpeed;
            else if (this.reverseActive) targetSpeed = REVERSE_SPEED;
            targetSpeed = Math.max(REVERSE_SPEED, Math.min(this.cruiseSpeed, targetSpeed));
            const response = targetSpeed >= this.speed ? (this.cruiseActive ? 1.65 : this.acceleration) : this.brakeRate;
            const drag = this.throttle <= 0.01 && !this.reverseActive ? this.linearDrag * 0.22 : 0;
            const blend = Math.min(1, Math.max(0.02, response * dt));
            this.speed += (targetSpeed - this.speed) * blend;
            this.speed = Math.max(REVERSE_SPEED, Math.min(this.cruiseSpeed, this.speed - drag * this.speed * dt));
            if (Math.abs(this.speed) < 0.05) this.speed = 0;
        }
        
        // Movement
        if (this.inTradeLane && this.laneRoute) {
            let remaining = this.speed * dt;
            while (remaining > 0 && this.inTradeLane && this.laneRoute) {
                if (this.laneIndex >= this.laneRoute.length || this.laneIndex < 0) {
                    this.exitTradeLane('Exited trade lane - returning to normal flight');
                    break;
                }
                const target = this.laneRoute[this.laneIndex];
                const dx = target.x - this.x;
                const dz = target.z - this.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist <= Math.max(1, remaining)) {
                    this.x = target.x;
                    this.z = target.z;
                    if (dist > 0.001) this.rotation = Math.atan2(dz, dx);
                    remaining -= dist;
                    this.laneIndex += this.laneDirection || 1;
                    continue;
                }
                this.rotation = Math.atan2(dz, dx);
                this.x += (dx / dist) * remaining;
                this.z += (dz / dist) * remaining;
                remaining = 0;
            }
        } else {
            const oldX = this.x;
            const oldZ = this.z;
            this.x += Math.cos(this.rotation) * this.speed * dt;
            this.z += Math.sin(this.rotation) * this.speed * dt;
            if (!this.cruiseActive && !this.cruiseCharging) {
                const strafeInput = (this.strafeRightActive ? 1 : 0) - (this.strafeLeftActive ? 1 : 0);
                if (strafeInput !== 0) {
                    const strafeSpeed = COMBAT_MAX_SPEED * 0.72 * this.strafePower;
                    this.x += Math.cos(this.rotation + Math.PI / 2) * strafeSpeed * dt * strafeInput;
                    this.z += Math.sin(this.rotation + Math.PI / 2) * strafeSpeed * dt * strafeInput;
                }
            }
            this.resolveObstacleCollisions(oldX, oldZ);
        }

        checkPlanetAtmosphereHazards(dt);
        checkZoneHazards(dt);
        
        // Weapon cooldown
        if (this.primaryCooldown > 0) this.primaryCooldown -= dt;
        if (this.missileCooldown > 0) this.missileCooldown -= dt;
        if (this.mineCooldown > 0) this.mineCooldown -= dt;
        if (this.countermeasureCooldown > 0) this.countermeasureCooldown -= dt;
        if (this.countermeasureAutoEnabled && this.countermeasureCooldown <= 0 && hasIncomingPlayerMissile()) {
            this.dropCountermeasure({ automatic: true });
        }
        
        // Fire (right mouse held)
        if (!this.inTradeLane && !this.cruiseActive && !this.cruiseCharging && this.fireHeld && this.primaryCooldown <= 0 && this.energy >= 5) {
            this.firePrimaryWeapons();
        }
    }

    exitTradeLane(message = '') {
        this.inTradeLane = false;
        this.laneIndex = 0;
        this.laneRoute = null;
        this.laneDirection = 1;
        this.maxSpeed = this.baseMaxSpeed;
        setNormalFlightSpeed(this);
        this.tradeLaneCooldownUntil = performance.now() + 1800;
        if (message) addLog(message);
        returnToFreeflight('', { preserveMotion: true });
    }

    tradeLaneTargetSpeed() {
        if (!this.laneRoute || this.laneIndex >= this.laneRoute.length || this.laneIndex < 0) return NORMAL_FLIGHT_EXIT_SPEED;
        const target = this.laneRoute[this.laneIndex];
        const dx = target.x - this.x;
        const dz = target.z - this.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const finalIndex = this.laneDirection >= 0 ? this.laneRoute.length - 1 : 0;
        if (this.laneIndex === finalIndex) {
            const speedRatio = smoothStep(distance / TRADE_LANE_BRAKE_DISTANCE);
            return NORMAL_FLIGHT_EXIT_SPEED + (this.laneSpeed - NORMAL_FLIGHT_EXIT_SPEED) * speedRatio;
        }
        return this.laneSpeed;
    }

    startCruiseCharge() {
        if (this.inTradeLane || this.destroyed) return;
        const disruptedMs = Math.max(0, (Number(this.cruiseDisruptedUntil) || 0) - performance.now());
        if (disruptedMs > 0) {
            addLog(tf('cruiseDisruptorLock', { seconds: Math.ceil(disruptedMs / 1000) }), 'alert');
            return;
        }
        this.cruiseActive = false;
        this.cruiseCharging = true;
        this.cruiseCharge = 0;
        this.afterburnerActive = false;
        this.reverseActive = false;
    }

    cancelCruise() {
        this.cruiseActive = false;
        this.cruiseCharging = false;
        this.cruiseCharge = 0;
    }
    
    firePrimaryWeapons() {
        if (this.inTradeLane || this.cruiseActive || this.cruiseCharging) return;
        const weapons = this.primaryWeapons();
        if (!weapons.length) return;
        const totalEnergy = weapons.reduce((sum, weapon) => sum + weapon.energyCost, 0);
        if (this.energy < totalEnergy) return;
        this.primaryCooldown = weapons.reduce((cooldown, weapon) => Math.max(cooldown, weapon.cooldown), 0.12);
        this.energy -= totalEnergy;
        playWeaponFireAt(this.x, this.z, 0.75);
        const normalX = -Math.sin(this.rotation);
        const normalZ = Math.cos(this.rotation);
        for (const weapon of weapons) {
            game.projectiles.push({
                x: this.x + Math.cos(this.rotation) * 30 + normalX * weapon.offset,
                z: this.z + Math.sin(this.rotation) * 30 + normalZ * weapon.offset,
                vx: Math.cos(this.rotation) * weapon.speed,
                vz: Math.sin(this.rotation) * weapon.speed,
                damage: weapon.damage,
                radius: weapon.radius,
                lifetime: weapon.lifetime,
                owner: 'player',
                color: weapon.color,
                trailColor: weapon.trailColor,
                homing: false,
                turnRate: 0,
                detonationRadius: 0
            });
        }
    }

    fireMissiles() {
        if (this.inTradeLane || this.cruiseActive || this.cruiseCharging || this.missileCooldown > 0) return;
        const target = game.selectedTarget;
        if (!target || !game.npcs.includes(target)) {
            addLog('Raketen brauchen ein angeklicktes NPC-Ziel.', 'alert');
            return;
        }
        const weapons = this.missileWeapons();
        if (!weapons.length) return;
        const simulatedAmmo = new Map(missileAmmoInventoryEntries().map(entry => [String(entry.id || '').toLowerCase(), Math.max(0, Number(entry.quantity) || 0)]));
        const fireableWeapons = [];
        for (const weapon of weapons) {
            const ammoId = String(weapon.ammoItemId || '').toLowerCase();
            const remaining = simulatedAmmo.get(ammoId) || 0;
            if (remaining <= 0) continue;
            simulatedAmmo.set(ammoId, remaining - 1);
            fireableWeapons.push(weapon);
        }
        if (!fireableWeapons.length) {
            addLog(t('ammoMissing'), 'alert');
            return;
        }
        const normalX = -Math.sin(this.rotation);
        const normalZ = Math.cos(this.rotation);
        for (const weapon of fireableWeapons) {
            consumeMissileAmmo(weapon.sourceItem);
            game.projectiles.push({
                x: this.x + Math.cos(this.rotation) * 30 + normalX * weapon.offset,
                z: this.z + Math.sin(this.rotation) * 30 + normalZ * weapon.offset,
                vx: Math.cos(this.rotation) * weapon.speed,
                vz: Math.sin(this.rotation) * weapon.speed,
                damage: weapon.damage,
                radius: weapon.radius,
                lifetime: weapon.lifetime,
                owner: 'player',
                targetId: target.id,
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
        this.missileCooldown = fireableWeapons.reduce((cooldown, weapon) => Math.max(cooldown, weapon.cooldown), 0.12);
        playWeaponFireAt(this.x, this.z, 0.78);
        saveGame();
        updateHUD();
    }

    canDropMine() {
        return !game.isDocked
            && !game.jumpTransition
            && !this.inTradeLane
            && !this.cruiseActive
            && !this.cruiseCharging
            && !this.afterburnerActive
            && Math.abs(Number(this.speed) || 0) <= COMBAT_MAX_SPEED + 0.5
            && this.mineCooldown <= 0;
    }

    dropMine() {
        if (!this.canDropMine()) {
            addLog(t('mineDropLocked'), 'alert');
            return false;
        }
        const mineDropper = equippedMineDropperItem();
        if (!mineDropper) {
            addLog(t('mineDropperMissing'), 'alert');
            return false;
        }
        if (mineAmmoCount(mineDropper) <= 0) {
            addLog(t('mineAmmoEmpty'), 'alert');
            return false;
        }
        const mine = mineStatsFromEquipment(mineDropper);
        consumeMineAmmo(mineDropper);
        this.mineCooldown = mine.cooldown;
        const backAngle = this.rotation + Math.PI;
        game.projectiles.push({
            x: this.x + Math.cos(backAngle) * 42,
            z: this.z + Math.sin(backAngle) * 42,
            vx: Math.cos(backAngle) * mine.speed + Math.cos(this.rotation) * Math.min(Math.max(this.speed * 0.18, -12), 12),
            vz: Math.sin(backAngle) * mine.speed + Math.sin(this.rotation) * Math.min(Math.max(this.speed * 0.18, -12), 12),
            damage: mine.damage,
            radius: mine.radius,
            lifetime: mine.lifetime,
            owner: 'player',
            type: 'mine',
            color: '#ff8844',
            trailColor: 'rgba(255,120,30,0.28)',
            homing: true,
            targetId: '',
            turnRate: mine.turnRate,
            detonationRadius: mine.detonationRadius,
            seekRange: mine.seekRange,
            maxSpeed: mine.maxSpeed,
            acceleration: mine.acceleration,
            armedAfter: 0.25
        });
        addLog(t('mineDropped') + ' ' + mine.name);
        playTone(180, 0.12, 'sawtooth', 0.34, 90);
        saveGame();
        updateHUD();
        return true;
    }

    canDropCountermeasure() {
        return !game.isDocked
            && !game.jumpTransition
            && !this.inTradeLane
            && this.countermeasureCooldown <= 0;
    }

    dropCountermeasure(options = {}) {
        const automatic = Boolean(options.automatic);
        if (!this.canDropCountermeasure()) {
            if (!automatic) addLog(t('countermeasureDropLocked'), 'alert');
            return false;
        }
        const dropper = equippedCountermeasureDropperItem();
        if (!dropper) {
            if (!automatic) addLog(t('countermeasureDropperMissing'), 'alert');
            return false;
        }
        if (countermeasureAmmoCount(dropper) <= 0) {
            if (!automatic) addLog(t('countermeasureAmmoEmpty'), 'alert');
            return false;
        }
        const cm = countermeasureStatsFromEquipment(dropper);
        consumeCountermeasureAmmo(dropper);
        this.countermeasureCooldown = cm.cooldown;
        const backAngle = this.rotation + Math.PI;
        const carrySpeed = Math.min(Math.max(Number(this.speed) || 0, -40), this.cruiseActive ? this.cruiseSpeed : 180);
        const countermeasure = {
            id: 'countermeasure_' + Math.round(performance.now() * 1000) + '_' + Math.floor(Math.random() * 10000),
            x: this.x + Math.cos(backAngle) * 44,
            z: this.z + Math.sin(backAngle) * 44,
            vx: Math.cos(backAngle) * cm.speed + Math.cos(this.rotation) * carrySpeed * 0.24,
            vz: Math.sin(backAngle) * cm.speed + Math.sin(this.rotation) * carrySpeed * 0.24,
            damage: 0,
            radius: 7,
            lifetime: cm.lifetime,
            owner: 'player',
            type: 'countermeasure',
            color: '#b7f6ff',
            trailColor: 'rgba(150,230,255,0.34)',
            homing: false,
            targetId: '',
            range: cm.range,
            diversionChance: cm.diversionChance,
            linearDrag: cm.linearDrag
        };
        game.projectiles.push(countermeasure);
        const diverted = divertIncomingMissiles(countermeasure);
        if (!automatic || diverted) addLog(t('countermeasureDropped') + (diverted ? ` ${diverted}` : ''));
        playTone(640, 0.08, 'triangle', 0.22, 240);
        if (!automatic) saveGame();
        updateHUD();
        return true;
    }

    primaryWeapons() {
        return this.activeWeapons().filter(weapon => !weapon.requiresAmmo);
    }

    missileWeapons() {
        return this.activeWeapons().filter(weapon => weapon.requiresAmmo);
    }

    activeWeapons() {
        const slotKeys = getWeaponSlotKeys();
        const mounted = slotKeys.map((slot, index) => ({ slot, index, item: mountedEquipmentItem(slot) })).filter(entry => entry.item);
        const entries = mounted;
        const maxLateralOffset = Math.max(6, Math.min(22, this.radius * 0.65));
        return entries.map((entry, order) => {
            const item = entry.item;
            const offset = entries.length > 1 ? ((order / (entries.length - 1)) - 0.5) * 2 * maxLateralOffset : 0;
            return {
                ...weaponStatsFromEquipment(item),
                sourceItem: item,
                offset
            };
        });
    }

    resolveObstacleCollisions(oldX, oldZ) {
        for (const obstacle of game.obstacles) {
            if (obstacle.collidable === false) continue;
            if (this.inTradeLane && obstacle.kind !== 'mine') continue;
            const dx = this.x - obstacle.x;
            const dz = this.z - obstacle.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const minDist = this.radius + obstacle.radius;
            if (dist > 0 && dist < minDist) {
                const nx = dx / dist;
                const nz = dz / dist;
                this.x = obstacle.x + nx * minDist;
                this.z = obstacle.z + nz * minDist;
                this.cancelCruise();
                this.afterburnerActive = false;
                this.reverseActive = false;
                updateCruiseButton();
                this.speed *= 0.25;
                this.throttle = Math.min(this.throttle, 0.25);
                if (!this.lastObstacleHit || performance.now() - this.lastObstacleHit > 1200) {
                    const impactDamage = obstacle.kind === 'mine' ? Number(obstacle.damage || 2000000) : (obstacle.kind === 'debris' ? 14 : (obstacle.kind === 'asteroid' ? 8 : 3));
                    this.takeDamage(impactDamage);
                    const label = obstacle.kind === 'mine' ? 'explosive mine' : (obstacle.kind === 'debris' ? 'debris' : (obstacle.kind === 'asteroid' ? 'asteroid' : 'nebula debris'));
                    addLog('Obstacle impact: ' + label, 'alert');
                    this.lastObstacleHit = performance.now();
                }
                if (this.inTradeLane) {
                    this.inTradeLane = false;
                    this.laneRoute = null;
                    this.laneDirection = 1;
                    this.maxSpeed = this.baseMaxSpeed;
                    addLog('Trade lane disrupted by obstacle', 'alert');
                }
            }
        }
    }
    
    takeDamage(amount, hitX = null, hitZ = null) {
        const previousHull = this.hull;
        let shieldDamage = 0;
        if (this.maxShield > 0 && this.shield > 0) {
            const sDamage = Math.min(this.shield, amount);
            this.shield -= sDamage;
            amount -= sDamage;
            shieldDamage = sDamage;
        }
        if (shieldDamage > 0) addShieldHitEffect(this, hitX, hitZ, Math.max(0.7, shieldDamage / 18));
        this.hull -= amount;
        if (amount > 4) playSound('hit', Math.min(1.4, amount / 16));
        this.checkHullBreachVoice(previousHull);
        if (this.hull <= 0) {
            this.hull = 0;
            addLog('Ship destroyed!', 'alert');
            destroyPlayerShip();
        }
    }

    takeHullDamage(amount, source = 'Hull damage') {
        const damage = Math.max(0, Number(amount) || 0);
        if (damage <= 0) return;
        const previousHull = this.hull;
        this.hull -= damage;
        if (damage > 4) playSound('hit', Math.min(1.4, damage / 16));
        this.checkHullBreachVoice(previousHull);
        if (this.hull <= 0) {
            this.hull = 0;
            addLog(source + ': ship destroyed!', 'alert');
            destroyPlayerShip();
        }
    }

    checkHullBreachVoice(previousHull) {
        const maxHull = Math.max(1, Number(this.maxHull) || 1);
        const threshold = maxHull * 0.2;
        if (previousHull > threshold && this.hull > 0 && this.hull <= threshold) playVoice('hullBreach', 1);
    }

    useNanobot() {
        if (this.nanobots <= 0 || this.hull >= this.maxHull) return false;
        this.nanobots -= 1;
        this.hull = Math.min(this.maxHull, this.hull + Math.max(120, this.maxHull * 0.32));
        addLog('Nanobot used. Hull repaired.');
        playSound('buy', 0.55);
        saveGame();
        updateHUD();
        return true;
    }

    useShieldBattery() {
        if (this.maxShield <= 0) {
            addLog(t('noShieldInstalled'), 'alert');
            return false;
        }
        if (this.shieldBatteries <= 0 || this.shield >= this.maxShield) return false;
        this.shieldBatteries -= 1;
        this.shield = Math.min(this.maxShield, this.shield + Math.max(100, this.maxShield * 0.55));
        addLog('Shield battery used. Shield restored.');
        playSound('buy', 0.55);
        saveGame();
        updateHUD();
        return true;
    }
    
    render(ctx) {
        const pos = worldToScreen(this.x, this.z);
        
        // Debug: make sure player is rendering
        if (game.frameCount % 120 === 0) {
            console.log('Player render at screen:', pos.x, pos.y, 'zoom:', game.zoom);
        }
        
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.rotation);
        const depthScale = game.jumpTransition?.mode === 'hole' ? Math.max(0.035, Number(game.jumpTransition.depthScale) || 1) : 1;
        if (game.jumpTransition?.mode === 'hole') ctx.globalAlpha = Math.max(0.05, Number(game.jumpTransition.depthAlpha ?? 1));
        const visualScale = Math.max(0.2, Math.min(3.2, game.zoom)) * depthScale;
        
        // Shield (blue glow) - always visible
        if (this.maxShield > 0 && this.shield > 0) {
            const shieldAlpha = (this.shield / this.maxShield) * 0.5;
            ctx.fillStyle = `rgba(100, 180, 255, ${shieldAlpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(0, 0, 35 * visualScale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const shipImage = getShipImage(this.shipIcon);
        const shipDrawSize = this.radius * 2.8 * visualScale;
        if (this.cruiseActive) {
            const trailLength = shipDrawSize * 5;
            const flicker = 0.86 + Math.sin(game.gameTime * 42) * 0.08;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const trail = ctx.createLinearGradient(-shipDrawSize * 0.42, 0, -shipDrawSize * 0.42 - trailLength, 0);
            trail.addColorStop(0, 'rgba(235,255,255,0.92)');
            trail.addColorStop(0.18, 'rgba(80,205,255,0.62)');
            trail.addColorStop(0.72, 'rgba(40,120,255,0.20)');
            trail.addColorStop(1, 'rgba(0,60,190,0)');
            ctx.strokeStyle = trail;
            ctx.lineWidth = Math.max(2, shipDrawSize * 0.12) * flicker;
            ctx.beginPath();
            ctx.moveTo(-shipDrawSize * 0.48, 0);
            ctx.lineTo(-shipDrawSize * 0.48 - trailLength, 0);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(190,245,255,0.36)';
            ctx.lineWidth = Math.max(1, shipDrawSize * 0.035);
            ctx.beginPath();
            ctx.moveTo(-shipDrawSize * 0.42, -shipDrawSize * 0.16);
            ctx.lineTo(-shipDrawSize * 0.42 - trailLength * 0.72, -shipDrawSize * 0.48);
            ctx.moveTo(-shipDrawSize * 0.42, shipDrawSize * 0.16);
            ctx.lineTo(-shipDrawSize * 0.42 - trailLength * 0.72, shipDrawSize * 0.48);
            ctx.stroke();
            ctx.restore();
        }
        if (shipImage) {
            ctx.save();
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(shipImage, -shipDrawSize / 2, -shipDrawSize / 2, shipDrawSize, shipDrawSize);
            ctx.restore();
        } else {
            // Ship body fallback while PNG assets are still loading.
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2 * visualScale;
            ctx.beginPath();
            ctx.moveTo(25 * visualScale, 0);
            ctx.lineTo(-18 * visualScale, -15 * visualScale);
            ctx.lineTo(-10 * visualScale, 0);
            ctx.lineTo(-18 * visualScale, 15 * visualScale);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(8 * visualScale, 0, 4 * visualScale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Red damage indicator
        if (this.hull < 50) {
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = Math.max(1, visualScale);
            ctx.beginPath();
            ctx.arc(0, 0, 22 * visualScale, 0, Math.PI * 2 * (1 - this.hull / 50));
            ctx.stroke();
        }
        
        const flameTime = game.gameTime * 18;
        const chargeRatio = this.cruiseCharging ? clamp(this.cruiseCharge / CRUISE_CHARGE_SECONDS, 0, 1) : 0;
        if (this.cruiseCharging) {
            for (let i = 0; i < 5; i++) {
                const phase = flameTime + i * 1.7;
                const length = (18 + 36 * chargeRatio + Math.sin(phase) * 5) * visualScale;
                const width = (5 + 12 * chargeRatio + Math.cos(phase * 1.4) * 2) * visualScale;
                const gradient = ctx.createLinearGradient(-12 * visualScale, 0, -12 * visualScale - length, 0);
                gradient.addColorStop(0, `rgba(190,245,255,${0.2 + chargeRatio * 0.5})`);
                gradient.addColorStop(0.45, `rgba(45,145,255,${0.18 + chargeRatio * 0.42})`);
                gradient.addColorStop(1, 'rgba(0,30,160,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(-14 * visualScale, 0);
                ctx.quadraticCurveTo(-12 * visualScale - length * 0.45, -width, -12 * visualScale - length, Math.sin(phase) * 2 * visualScale);
                ctx.quadraticCurveTo(-12 * visualScale - length * 0.45, width, -14 * visualScale, 0);
                ctx.fill();
            }
        }
        if (this.cruiseActive || this.afterburnerActive || this.speed > 20) {
            const intensity = this.cruiseActive ? 1 : this.afterburnerActive ? 0.82 : Math.min(1, this.speed / COMBAT_MAX_SPEED);
            const length = (this.cruiseActive ? 92 : this.afterburnerActive ? 62 : 28) * intensity * visualScale;
            const width = (this.cruiseActive ? 18 : this.afterburnerActive ? 14 : 8) * intensity * visualScale;
            const flicker = 1 + Math.sin(flameTime * 1.9) * 0.08;
            const gradient = ctx.createLinearGradient(-12 * visualScale, 0, -12 * visualScale - length * flicker, 0);
            gradient.addColorStop(0, this.cruiseActive ? 'rgba(230,255,255,0.95)' : 'rgba(255,240,160,0.8)');
            gradient.addColorStop(0.35, this.cruiseActive ? 'rgba(55,180,255,0.72)' : 'rgba(255,130,40,0.62)');
            gradient.addColorStop(1, 'rgba(0,90,255,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(-14 * visualScale, 0);
            ctx.quadraticCurveTo(-12 * visualScale - length * 0.48, -width, -12 * visualScale - length * flicker, Math.sin(flameTime) * 3 * visualScale);
            ctx.quadraticCurveTo(-12 * visualScale - length * 0.48, width, -14 * visualScale, 0);
            ctx.fill();

        }
        
        ctx.restore();

        if (this.cruiseCharging) {
            const chargeRatio = clamp(this.cruiseCharge / CRUISE_CHARGE_SECONDS, 0, 1);
            const width = Math.max(58, Math.min(116, this.radius * 5.4 * Math.max(0.7, Math.min(1.4, game.zoom))));
            const height = 7;
            const y = pos.y - Math.max(38, shipDrawSize * 0.58);
            ctx.save();
            ctx.fillStyle = 'rgba(0, 12, 26, 0.88)';
            ctx.strokeStyle = 'rgba(100, 210, 255, 0.86)';
            ctx.lineWidth = 1;
            ctx.fillRect(pos.x - width / 2, y, width, height);
            ctx.strokeRect(pos.x - width / 2, y, width, height);
            const fill = ctx.createLinearGradient(pos.x - width / 2, y, pos.x + width / 2, y);
            fill.addColorStop(0, '#38b8ff');
            fill.addColorStop(1, '#d8ffff');
            ctx.fillStyle = fill;
            ctx.fillRect(pos.x - width / 2 + 1, y + 1, Math.max(0, (width - 2) * chargeRatio), height - 2);
            ctx.fillStyle = '#bff8ff';
            ctx.font = '9px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(Math.ceil(Math.max(0, CRUISE_CHARGE_SECONDS - this.cruiseCharge)) + 's', pos.x, y - 3);
            ctx.restore();
        }
        
        // Approach indicator
        if (game.approachTarget) {
            ctx.fillStyle = '#ffaa00';
            ctx.font = '10px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('APPROACHING', pos.x, pos.y - 35);
        }
    }
}

class PlanetLocation {
    constructor(data) {
        Object.assign(this, data);
        this.faction = normalizeFactionId(data.faction || data.reputation || '');
        this.loadout = data.loadout || '';
        this.weapons = loadoutWeaponStats(this.loadout, 4);
        this.weaponCooldown = 0;
        this.nextWeaponIndex = 0;
        this.weaponRange = 3000;
        this.radius = Math.max(180, Number(data.radius || 500));
        this.type = 'Planet';
    }
    update(dt) { updateStaticWeapons(this, dt); }
    render(ctx) {}
    containsPoint(x, z) {
        const dx = x - this.x;
        const dz = z - this.z;
        return Math.sqrt(dx * dx + dz * dz) <= this.radius;
    }
}

// Station
class Station {
    constructor(data) {
        Object.assign(this, data);
        this.faction = normalizeFactionId(data.faction || data.reputation || '');
        this.loadout = data.loadout || '';
        this.weapons = loadoutWeaponStats(this.loadout, 4);
        this.weaponCooldown = 0;
        this.nextWeaponIndex = 0;
        this.weaponRange = 2800;
        this.archetype = data.archetype || this.type || '';
        this.sourceRadius = solarObjectRawRadiusFromData(data, this.archetype, 600);
        this.radius = solarObjectWorldRadius(this.sourceRadius, this.archetype, 600);
        this.visualRadius = solarObjectVisualWorldRadius(this.sourceRadius, this.archetype, 600);
        this.rotation = flYawToCanvasRotation(this.rotateY || 0);
    }
    update(dt) { updateStaticWeapons(this, dt); }
    render(ctx) {
        const pos = worldToScreen(this.x, this.z);
        const objectImage = getObjectImage(this.archetype || this.type);
        ctx.save();
        ctx.translate(pos.x, pos.y);
        
        const size = solarObjectScreenRadius(this.visualRadius || this.radius);
        
        ctx.rotate(this.rotation);
        if (objectImage) {
            const imageSize = size * SOLAR_OBJECT_ICON_DRAW_SCALE;
            ctx.drawImage(objectImage, -imageSize / 2, -imageSize / 2, imageSize, imageSize);
        } else {
            ctx.fillStyle = '#445566';
            ctx.strokeStyle = '#667788';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                ctx.fillStyle = i % 2 === 0 ? '#00ff00' : '#ff4400';
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * size * 0.9, Math.sin(angle) * size * 0.9, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
        
        // Selected highlight
        if (game.selectedTarget === this) {
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.fillStyle = '#00aaff';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, pos.x, pos.y + size + 12);
    }
    
    containsPoint(px, pz) {
        const dx = this.x - px, dz = this.z - pz;
        return Math.sqrt(dx * dx + dz * dz) < Math.max(45, this.visualRadius || this.radius);
    }
}

// Jump Gate
function renderJumpHoleVortex(ctx, size, rotation, seed = 0) {
    const now = performance.now() * 0.001;
    const t = now + (seed % 997) * 0.013;
    const pulse = (Math.sin(t * 2.7) + 1) * 0.5;
    const shimmer = (Math.sin(t * 5.1 + seed) + 1) * 0.5;
    const outer = size * (1.42 + pulse * 0.12);
    const core = size * (0.23 + pulse * 0.035);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const halo = ctx.createRadialGradient(0, 0, core * 0.2, 0, 0, outer);
    halo.addColorStop(0, `rgba(230,255,255,${0.58 + shimmer * 0.18})`);
    halo.addColorStop(0.18, `rgba(60,235,255,${0.34 + pulse * 0.16})`);
    halo.addColorStop(0.48, `rgba(40,100,255,${0.15 + pulse * 0.08})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, outer, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 7; i++) {
        const ringT = i / 7;
        const ringPulse = (pulse + ringT) % 1;
        ctx.save();
        ctx.rotate(rotation * (1.2 + i * 0.18) + i * Math.PI / 7);
        ctx.strokeStyle = `rgba(${70 + i * 12},${210 + i * 5},255,${0.18 + (1 - ringT) * 0.2})`;
        ctx.lineWidth = Math.max(1, size * (0.012 + ringPulse * 0.01));
        ctx.beginPath();
        ctx.ellipse(0, 0, size * (0.58 + ringT * 0.52 + pulse * 0.06), size * (0.21 + ringT * 0.24), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    for (let arm = 0; arm < 4; arm++) {
        ctx.beginPath();
        for (let step = 0; step <= 56; step++) {
            const u = step / 56;
            const radius = core * 0.72 + u * size * 1.18;
            const angle = arm * Math.PI / 2 + u * 4.8 - t * 1.35;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * (0.48 + u * 0.22);
            if (step === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${120 + arm * 24},240,255,${0.18 + pulse * 0.14})`;
        ctx.lineWidth = Math.max(1.2, size * 0.026);
        ctx.stroke();
    }

    for (let i = 0; i < 18; i++) {
        const local = (i * 97 + seed) % 360;
        const drift = (t * (0.16 + (i % 5) * 0.025) + i * 0.11) % 1;
        const angle = (local / 360) * Math.PI * 2 + drift * Math.PI * 2;
        const radius = size * (0.42 + ((i * 37 + seed) % 100) / 100 * 0.9);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.58;
        const alpha = 0.1 + (1 - drift) * 0.28;
        ctx.fillStyle = `rgba(190,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, size * (0.012 + (i % 3) * 0.004)), 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    const well = ctx.createRadialGradient(0, 0, core * 0.12, 0, 0, core * 1.42);
    well.addColorStop(0, `rgba(245,255,255,${0.92})`);
    well.addColorStop(0.18, `rgba(58,240,255,${0.62 + pulse * 0.18})`);
    well.addColorStop(0.42, 'rgba(16,24,78,0.92)');
    well.addColorStop(1, 'rgba(0,0,8,0)');
    ctx.fillStyle = well;
    ctx.beginPath();
    ctx.arc(0, 0, core * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(185,255,255,${0.76 + pulse * 0.18})`;
    ctx.lineWidth = Math.max(1.5, size * 0.035);
    ctx.beginPath();
    ctx.arc(0, 0, size * (0.64 + pulse * 0.035), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

class JumpGate {
    constructor(data) {
        Object.assign(this, data);
        this.faction = normalizeFactionId(data.faction || data.reputation || '');
        this.loadout = data.loadout || '';
        this.weapons = loadoutWeaponStats(this.loadout, 4);
        this.weaponCooldown = 0;
        this.nextWeaponIndex = 0;
        this.weaponRange = 3000;
        const archetype = data.archetype || (data.kind === 'hole' ? 'jumphole' : 'jumpgate');
        this.sourceRadius = solarObjectRawRadiusFromData(data, archetype, 600);
        this.radius = solarObjectWorldRadius(this.sourceRadius, archetype, 600);
        this.rotation = flYawToCanvasRotation(this.rotateY || 0);
        this.kind = data.kind || 'gate';
        this.type = data.type || (this.kind === 'hole' ? 'Jump Hole' : 'Jump Gate');
        this.archetype = archetype;
        this.visualRadius = solarObjectVisualWorldRadius(this.sourceRadius, archetype, 600);
        this.animationSeed = hashString('jump-hole:' + (this.id || this.nickname || this.name || '') + ':' + this.x + ':' + this.z);
    }
    update(dt) {
        if (this.kind === 'hole') this.rotation += 0.72 * dt;
        updateStaticWeapons(this, dt);
    }
    render(ctx) {
        const pos = worldToScreen(this.x, this.z);
        const isHole = this.kind === 'hole';
        const size = solarObjectScreenRadius(this.visualRadius || this.radius);
        ctx.save();
        ctx.translate(pos.x, pos.y);
        if (isHole) {
            renderJumpHoleVortex(ctx, size, this.rotation, this.animationSeed);
        } else {
            ctx.rotate(this.rotation);
            ctx.strokeStyle = '#8844ff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.stroke();
            const gradient = ctx.createRadialGradient(0, 0, size * 0.3, 0, 0, size);
            gradient.addColorStop(0, 'rgba(100,50,255,0.3)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        ctx.restore();
        
        if (game.selectedTarget === this) {
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.fillStyle = isHole ? '#66eaff' : '#aa66ff';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, pos.x, pos.y + size + 10);
    }
    
    containsPoint(px, pz) {
        const dx = this.x - px, dz = this.z - pz;
        return Math.sqrt(dx * dx + dz * dz) < Math.max(60, this.visualRadius || this.radius);
    }
}

// Trade Lane Ring
class TradeLaneRing {
    constructor(x, z, index) {
        let sourceData = {};
        if (typeof x === 'object') {
            const data = x;
            sourceData = data;
            this.x = data.x;
            this.z = data.z;
            this.index = z || 0;
            this.id = data.id || data.nickname || `${data.laneId || 'trade_lane'}_${this.index}`;
            this.name = data.name || 'Trade Lane Ring ' + (this.index + 1);
            this.laneId = data.laneId || 'trade_lane';
            this.laneRings = data.laneRings || [];
            this.rotateY = data.rotate_y || data.rotateY || 0;
            this.visualRotation = data.visualRotation;
            this.faction = normalizeFactionId(data.faction || data.reputation || '');
            this.loadout = data.loadout || '';
        } else {
            this.x = x;
            this.z = z;
            this.index = index;
            this.id = 'trade_lane_ring_' + index;
            this.name = 'Trade Lane Ring ' + ((index || 0) + 1);
            this.laneId = 'trade_lane';
            this.laneRings = [];
            this.rotateY = 0;
            this.visualRotation = null;
            this.faction = '';
            this.loadout = '';
        }
        this.weapons = loadoutWeaponStats(this.loadout, 3);
        this.weaponCooldown = 0;
        this.nextWeaponIndex = 0;
        this.weaponRange = 2400;
        this.sourceRadius = solarObjectRawRadiusFromData(sourceData, 'trade_lane_ring', 300);
        this.radius = solarObjectWorldRadius(this.sourceRadius, 'trade_lane_ring', 300);
        this.visualRadius = solarObjectVisualWorldRadius(this.sourceRadius, 'trade_lane_ring', 300);
        this.rotation = Number.isFinite(this.visualRotation) ? this.visualRotation : flYawToCanvasRotation(this.rotateY || 0);
        this.type = 'trade_lane_ring';
    }
    update(dt) { updateStaticWeapons(this, dt); }
    render(ctx) {
        const pos = worldToScreen(this.x, this.z);
        const objectImage = getObjectImage(this.type);
        const size = solarObjectScreenRadius(this.visualRadius || this.radius) * SOLAR_OBJECT_ICON_DRAW_SCALE;
        const glowRadius = Math.max(16, size * 0.43);
        const active = this.index === 0 || game.player?.inTradeLane;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.rotation);
        if (objectImage) {
            ctx.drawImage(objectImage, -size / 2, -size / 2, size, size);
        }

        // The source model stands perpendicular to the system plane, so its
        // generated top-down icon is almost edge-on. Always draw the energy
        // hoop as a route-oriented silhouette instead of relying on the icon.
        const hoopWidth = Math.max(10, size * 0.38);
        const hoopDepth = Math.max(3.5, size * 0.12);
        ctx.shadowColor = active ? 'rgba(78, 255, 181, 0.95)' : 'rgba(40, 214, 155, 0.72)';
        ctx.shadowBlur = active ? 9 : 5;
        ctx.strokeStyle = active ? '#8dffd0' : '#35dca3';
        ctx.lineWidth = active ? 2.6 : 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, hoopWidth, hoopDepth, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = active ? 'rgba(223,255,244,0.88)' : 'rgba(166,255,221,0.56)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(7, hoopWidth - 2.5), Math.max(2, hoopDepth - 1.2), 0, 0, Math.PI * 2);
        ctx.stroke();

        if (active) {
            const gradient = ctx.createRadialGradient(0, 0, glowRadius * 0.18, 0, 0, glowRadius);
            gradient.addColorStop(0, 'rgba(0,255,136,0.3)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        if (game.selectedTarget === this) {
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, glowRadius + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    containsPoint(px, pz) {
        const dx = this.x - px;
        const dz = this.z - pz;
        return Math.sqrt(dx * dx + dz * dz) < Math.max(120, this.visualRadius || this.radius);
    }
}

// Asteroid Field
class AsteroidField {
    constructor(data) {
        this.id = data.nickname || data.zone || 'asteroid_field';
        this.name = data.name || this.id;
        this.x = data.x || 0;
        this.z = data.z || 0;
        this.size = data.size || 2000;
        this.sizeX = data.size_x || data.sizeX || this.size;
        this.sizeZ = data.size_z || data.sizeZ || this.size;
        this.shape = data.shape || 'ELLIPSOID';
        this.rotation = flYawToCanvasRotation(data.rotate_y || data.rotateY || 0);
        this.fieldKind = String(data.fieldKind || data.field_kind || 'asteroid').toLowerCase();
        this.hazardKind = String(data.hazardKind || data.hazard_kind || '').toLowerCase();
        this.densityHint = data.densityHint || data.density_hint || '';
        this.exclusionZones = data.exclusionZones || [];
        this.obstacleKind = this.hazardKind === 'explosive_mines'
            ? 'mine'
            : this.fieldKind === 'debris'
                ? 'debris'
                : 'asteroid';
        this.obstacles = createFieldObstacles(this, this.obstacleKind);
    }
    update(dt) {
        for (const obstacle of this.obstacles) {
            obstacle.driftPhase += obstacle.driftSpeed * dt;
            obstacle.rotation += obstacle.spinSpeed * dt;
            const driftX = Math.cos(obstacle.driftPhase) * obstacle.driftRadius;
            const driftZ = Math.sin(obstacle.driftPhase * 0.73) * obstacle.driftRadius * 0.55;
            const rotated = rotatePoint(obstacle.localX + driftX, obstacle.localZ + driftZ, this.rotation);
            obstacle.x = this.x + rotated.x;
            obstacle.z = this.z + rotated.z;
        }
    }
    render(ctx) {
        const pos = worldToScreen(this.x, this.z);
        const screenRadiusX = this.sizeX * game.zoom;
        const screenRadiusZ = this.sizeZ * game.zoom;
        const screenSize = Math.max(screenRadiusX, screenRadiusZ);
        
        // Only render if visible
        if (screenSize < 5) return;
        
        ctx.save();
        ctx.translate(pos.x, pos.y);
        
        const isMinefield = this.hazardKind === 'explosive_mines';
        const isDebris = this.fieldKind === 'debris';
        ctx.fillStyle = isMinefield ? 'rgba(160, 30, 20, 0.28)' : isDebris ? 'rgba(95, 105, 108, 0.28)' : 'rgba(100, 90, 70, 0.3)';
        ctx.strokeStyle = isMinefield ? 'rgba(255, 70, 40, 0.5)' : isDebris ? 'rgba(170, 185, 185, 0.35)' : 'rgba(120, 110, 80, 0.4)';
        ctx.lineWidth = 1;
        
        for (const obstacle of this.obstacles) {
            if (obstacle.depthLayer === 1) continue;
            const px = (obstacle.x - this.x) * game.zoom;
            const pz = (obstacle.z - this.z) * game.zoom;
            const pSize = Math.max(obstacle.small ? 1.4 : 2, (obstacle.visualRadius || obstacle.radius) * game.zoom);
            const distanceToPlayer = game.player ? Math.hypot(game.player.x - obstacle.x, game.player.z - obstacle.z) : Infinity;
            const nonColliding = obstacle.collidable === false;
            const overheadFade = obstacle.depthLayer === 1 && distanceToPlayer < (game.player?.radius || 20) + obstacle.radius * 1.8;
            const baseAlpha = nonColliding ? (obstacle.depthLayer === 1 ? 0.56 : 0.38) : 1;
            ctx.globalAlpha = overheadFade ? Math.max(0.14, baseAlpha * 0.28) : baseAlpha;
            ctx.save();
            ctx.translate(px, pz);
            ctx.rotate(obstacle.rotation + this.rotation);
            if (obstacle.kind === 'mine') {
                const glow = pSize * 2.9;
                const gradient = ctx.createRadialGradient(0, 0, pSize * 0.3, 0, 0, glow);
                gradient.addColorStop(0, 'rgba(255,210,90,0.55)');
                gradient.addColorStop(0.32, 'rgba(255,50,20,0.24)');
                gradient.addColorStop(1, 'rgba(255,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, glow, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,80,40,0.85)';
                ctx.lineWidth = Math.max(1, game.zoom * 2);
                ctx.beginPath();
                ctx.arc(0, 0, pSize, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                for (let j = 0; j < 8; j++) {
                    const angle = (j / 8) * Math.PI * 2;
                    ctx.moveTo(Math.cos(angle) * pSize * 0.45, Math.sin(angle) * pSize * 0.45);
                    ctx.lineTo(Math.cos(angle) * pSize * 1.45, Math.sin(angle) * pSize * 1.45);
                }
                ctx.stroke();
            } else {
                const gray = nonColliding;
                ctx.beginPath();
                ctx.moveTo(pSize, 0);
                const points = obstacle.small ? 5 : (isDebris ? 5 : 7);
                for (let j = 1; j < points; j++) {
                    const angle = (j / points) * Math.PI * 2;
                    const rough = j % 2 === 0 ? (isDebris ? 0.45 : 0.72) : (obstacle.small ? 0.84 : 1);
                    ctx.lineTo(Math.cos(angle) * pSize * rough, Math.sin(angle) * pSize * rough);
                }
                ctx.closePath();
                ctx.fillStyle = gray
                    ? (obstacle.depthLayer === 1 ? 'rgba(150,158,164,0.72)' : 'rgba(100,108,114,0.55)')
                    : (isDebris ? 'rgba(95,105,108,0.72)' : 'rgba(116,94,62,0.82)');
                ctx.fill();
                ctx.strokeStyle = gray ? 'rgba(190,205,210,0.24)' : (isDebris ? 'rgba(210,225,220,0.32)' : 'rgba(210,190,150,0.35)');
                ctx.stroke();
            }
            ctx.restore();
            ctx.globalAlpha = 1;
        }
        
        // Zone boundary
        ctx.save();
        ctx.rotate(this.rotation);
        ctx.beginPath();
        if (this.shape === 'SPHERE') {
            ctx.arc(0, 0, screenSize, 0, Math.PI * 2);
        } else {
            ctx.ellipse(0, 0, screenRadiusX, screenRadiusZ, 0, 0, Math.PI * 2);
        }
        ctx.strokeStyle = isMinefield ? 'rgba(255,70,40,0.32)' : isDebris ? 'rgba(150,170,175,0.18)' : 'rgba(150, 130, 100, 0.15)';
        ctx.stroke();
        ctx.restore();

        for (const exclusion of this.exclusionZones || []) {
            const ex = worldToScreen(exclusion.x, exclusion.z);
            ctx.save();
            ctx.translate(ex.x - pos.x, ex.y - pos.y);
            ctx.rotate(flYawToCanvasRotation(exclusion.rotateY || 0));
            const isBoxExclusion = String(exclusion.shape || '').toUpperCase() === 'BOX';
            const exScale = isBoxExclusion ? 0.5 : 1;
            const exRx = Math.max(1, (exclusion.sizeX || exclusion.size || 1) * exScale * game.zoom);
            const exRz = Math.max(1, (exclusion.sizeZ || exclusion.size || 1) * exScale * game.zoom);
            ctx.strokeStyle = isMinefield ? 'rgba(120,255,210,0.42)' : 'rgba(150,230,255,0.22)';
            ctx.lineWidth = Math.max(1, game.zoom * 2);
            ctx.setLineDash([10, 7]);
            ctx.beginPath();
            if (isBoxExclusion) ctx.rect(-exRx, -exRz, exRx * 2, exRz * 2);
            else ctx.ellipse(0, 0, exRx, exRz, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }
        
        ctx.restore();
        
        // Label
        if (screenSize > 50) {
            ctx.fillStyle = isMinefield ? 'rgba(255,100,70,0.72)' : isDebris ? 'rgba(170,190,190,0.58)' : 'rgba(150, 130, 100, 0.5)';
            ctx.font = '9px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, pos.x, pos.y + screenSize * 0.8 + 12);
        }
    }
}

function renderForegroundAsteroids(ctx) {
    if (!game.player) return;
    const foreground = (game.obstacles || []).filter(obstacle => obstacle.depthLayer === 1);
    for (const obstacle of foreground) {
        const pos = worldToScreen(obstacle.x, obstacle.z);
        const pSize = Math.max(obstacle.small ? 1.4 : 2, (obstacle.visualRadius || obstacle.radius) * game.zoom);
        const distanceToPlayer = Math.hypot(game.player.x - obstacle.x, game.player.z - obstacle.z);
        const nearPlayer = distanceToPlayer < game.player.radius + obstacle.radius * 1.8;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate((obstacle.rotation || 0) + game.gameTime * (obstacle.spinSpeed || 0));
        ctx.globalAlpha = nearPlayer ? 0.18 : 0.46;
        ctx.fillStyle = 'rgba(150,158,164,0.72)';
        ctx.strokeStyle = 'rgba(205,220,224,0.22)';
        ctx.beginPath();
        const points = obstacle.small ? 5 : 7;
        ctx.moveTo(pSize, 0);
        for (let j = 1; j < points; j++) {
            const angle = (j / points) * Math.PI * 2;
            const rough = j % 2 === 0 ? 0.72 : 1;
            ctx.lineTo(Math.cos(angle) * pSize * rough, Math.sin(angle) * pSize * rough);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

// Nebula
class Nebula {
    constructor(data) {
        this.id = data.nickname || data.zone || 'nebula';
        this.name = data.name || this.id;
        this.x = data.x || 0;
        this.z = data.z || 0;
        this.size = data.size || 5000;
        this.sizeX = data.size_x || data.sizeX || this.size;
        this.sizeZ = data.size_z || data.sizeZ || this.size;
        this.shape = data.shape || 'ELLIPSOID';
        this.color = '#8888ff';
        this.rotation = flYawToCanvasRotation(data.rotate_y || data.rotateY || 0);
        this.obstacles = createFieldObstacles(this, 'nebula');
    }
    update(dt) {}
    render(ctx) {
        const pos = worldToScreen(this.x, this.z);
        const screenRadiusX = this.sizeX * game.zoom;
        const screenRadiusZ = this.sizeZ * game.zoom;
        const screenSize = Math.max(screenRadiusX, screenRadiusZ);
        
        // Only render if visible
        if (screenSize < 10) return;
        
        ctx.save();
        ctx.translate(pos.x, pos.y);

        ctx.save();
        ctx.rotate(this.rotation);
        
        // Nebula cloud effect - use simple alpha fills
        ctx.fillStyle = 'rgba(136, 136, 255, 0.15)';
        ctx.beginPath();
        if (this.shape === 'SPHERE') {
            ctx.arc(0, 0, screenSize, 0, Math.PI * 2);
        } else {
            ctx.ellipse(0, 0, screenRadiusX, screenRadiusZ, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Inner glow
        ctx.fillStyle = 'rgba(136, 136, 255, 0.05)';
        ctx.beginPath();
        ctx.ellipse(0, 0, screenRadiusX * 0.5, screenRadiusZ * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'rgba(120, 210, 255, 0.35)';
        ctx.strokeStyle = 'rgba(180, 240, 255, 0.28)';
        for (const obstacle of this.obstacles) {
            const px = (obstacle.x - this.x) * game.zoom;
            const pz = (obstacle.z - this.z) * game.zoom;
            const pSize = Math.max(3, obstacle.radius * game.zoom);
            ctx.beginPath();
            ctx.arc(px, pz, pSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Label
        if (screenSize > 50) {
            ctx.fillStyle = 'rgba(150, 150, 255, 0.4)';
            ctx.font = '9px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, pos.x, pos.y - screenSize - 5);
        }
    }
}
