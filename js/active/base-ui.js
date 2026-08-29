// Command bar functions
function setMode(mode) {
    if (mode === 'freeflight') {
        playVoice('freeflight', 1);
        returnToFreeflight('Freeflight mode - no autopilot', { preserveMotion: true });
        return;
    }
    
    if (!game.selectedTarget) {
        addLog('Select a target first!', 'alert');
        return;
    }
    
    switch(mode) {
        case 'approach':
            playVoice('goingTo', 1);
            game.approachTarget = game.selectedTarget;
            game.dockTarget = null;
            game.dockLandingTarget = null;
            game.approachArrivalLogged = false;
            game.commandMode = 'approach';
            updateCommandModeButtons();
            startAutopilotCruise();
            updateSpeedControl();
            addLog('Approaching: ' + game.selectedTarget.name);
            break;
        case 'dock':
            playVoice('dock', 1);
            if (isDockableTarget(game.selectedTarget)) {
                startDocking(game.selectedTarget);
            } else {
                addLog('Can only dock at stations, planets, jump gates, jump holes, and trade lane rings!', 'alert');
            }
            break;
    }
}

function showInventory() {
    toggleInventoryPanel(true);
}

function inventoryRow(name, quantity, meta = '') {
    return `<div class="inventory-row"><span>${escapeHtml(name)}</span><span>x${Number(quantity || 0).toLocaleString()}</span><span class="inventory-meta">${escapeHtml(meta)}</span></div>`;
}

function renderInventoryPanel() {
    const content = document.getElementById('inventory-content');
    if (!content || !game.player) return;
    const p = game.player;
    const shieldText = p.maxShield > 0 ? `${Math.round(p.shield).toLocaleString()}/${Math.round(p.maxShield).toLocaleString()}` : 'none';
    const thrustPercent = (p.thrustCapacity || 0) > 0 ? Math.round(clamp((p.thrustEnergy || 0) / p.thrustCapacity, 0, 1) * 100) : 0;
    const thrustText = `${thrustPercent}% (${Math.round(p.thrustEnergy || 0).toLocaleString()}/${Math.round(p.thrustCapacity || 0).toLocaleString()})`;
    const h = Math.floor(game.gameTime / 75);
    const m = Math.floor((game.gameTime % 75) / 1.25);
    let modeText = game.approachTarget ? t('approach') : t('freeflight');
    if ((game.commandMode === 'approach' || game.commandMode === 'dock') && game.approachTarget) modeText = game.commandMode === 'dock' ? t('dock') : t('approach');
    else if (isManualSteeringActive()) modeText = t('modeRotate');
    else if (p.cruiseCharging) modeText = t('modeCruiseCharge');
    else if (p.cruiseActive) modeText = t('modeCruise');
    else if (p.afterburnerActive) modeText = t('modeAfterburner');
    let html = '<div class="inventory-summary">';
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('credits'))}</strong>${p.credits.toLocaleString()} CR</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('cargo'))}</strong>${cargoUnits()}/${p.maxCargo}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('uiSystem'))}</strong>${escapeHtml(systemData?.name || currentSystemId)}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('uiSpeed'))}</strong>${Math.round(p.speed).toLocaleString()} m/s</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('uiZoom'))}</strong>${game.zoom.toFixed(1)}x</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('uiTime'))}</strong>${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('uiMode'))}</strong>${escapeHtml(modeText)}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('hudHull'))}</strong>${Math.round(p.hull).toLocaleString()}/${Math.round(p.maxHull).toLocaleString()}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('hudShield'))}</strong>${shieldText}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('hudEnergy'))}</strong>${Math.round(p.energy).toLocaleString()}/${Math.round(p.maxEnergy).toLocaleString()}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('hudThrust'))}</strong>${thrustText}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('labelNanobots'))}</strong>${p.nanobots}/${p.maxNanobots}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('labelShieldBatteries'))}</strong>${p.shieldBatteries}/${p.maxShieldBatteries}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('missileAmmo'))}</strong>${totalMissileAmmoCount()}/${p.maxMissileAmmo}</div>`;
    html += `<div class="inventory-stat"><strong>${escapeHtml(t('countermeasures'))}</strong>${totalCountermeasureAmmoCount()}</div>`;
    html += '</div>';

    html += `<div class="inventory-section"><div class="inventory-section-title">${escapeHtml(t('cargo'))}</div>`;
    if (p.cargo?.length) {
        for (const item of p.cargo) {
            const commodity = getCommodity(item.id);
            const avgPrice = Number(item.avgPrice || 0) > 0 ? `Avg ${Number(item.avgPrice).toLocaleString()} CR` : '';
            html += inventoryRow(item.name || commodity?.name || item.id, item.quantity, avgPrice);
        }
    } else {
        html += '<div class="inventory-empty">No cargo loaded.</div>';
    }
    html += '</div>';

    html += `<div class="inventory-section"><div class="inventory-section-title">Mounted Equipment</div>`;
    const mountedEntries = [
        ...(currentPowerPlantItem() ? [['powerplant', currentPowerPlantItem().id]] : []),
        ...Object.entries(p.mountedEquipment || {}).filter(([slot]) => slot !== 'powerplant')
    ].filter(([, itemId]) => itemId);
    if (mountedEntries.length) {
        for (const [slot, itemId] of mountedEntries) {
            const item = slot === 'powerplant' ? currentPowerPlantItem() : getEquipment(itemId);
            html += inventoryRow(item?.name || itemId, 1, equipmentSlotLabel(slot));
        }
    } else {
        html += '<div class="inventory-empty">No equipment mounted.</div>';
    }
    html += '</div>';

    html += `<div class="inventory-section"><div class="inventory-section-title">Equipment Inventory</div>`;
    const inventory = cleanEquipmentInventory(p.equipmentInventory || []).filter(item => (Number(item.quantity) || 0) > 0);
    if (inventory.length) {
        for (const item of inventory) {
            const equipment = getEquipment(item.id);
            const available = availableEquipmentQuantity(item.id);
            html += inventoryRow(item.name || equipment?.name || item.id, item.quantity, `${equipment?.category || item.category || 'equipment'} | available ${available}`);
        }
    } else {
        html += '<div class="inventory-empty">No equipment in inventory.</div>';
    }
    html += '</div>';
    content.innerHTML = html;
}

function toggleInventoryPanel(force = null) {
    const overlay = document.getElementById('inventory-overlay');
    if (!overlay) return;
    const shouldShow = force === null ? overlay.classList.contains('hidden') : Boolean(force);
    if (shouldShow) {
        renderInventoryPanel();
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function toggleInfoPanel() {
    const panel = document.getElementById('info-panel');
    if (!panel) return;
    if (getComputedStyle(panel).display === 'none') {
        panel.style.display = 'block';
        updateInfoPanel();
    } else {
        panel.style.display = 'none';
    }
}

function updateInfoPanel() {
    if (!game.selectedTarget) {
        document.getElementById('info-name').innerHTML = '<span>Name:</span><span>-</span>';
        document.getElementById('info-type').innerHTML = '<span>Type:</span><span>-</span>';
        document.getElementById('info-faction').innerHTML = '<span>Faction:</span><span>-</span>';
        document.getElementById('info-distance').innerHTML = '<span>Distance:</span><span>-</span>';
        document.getElementById('info-status').innerHTML = '<span>Status:</span><span>-</span>';
        document.getElementById('info-desc').textContent = '-';
        return;
    }
    
    const target = game.selectedTarget;
    const dx = target.x - game.player.x;
    const dz = target.z - game.player.z;
    const dist = Math.round(Math.sqrt(dx*dx + dz*dz));
    
    document.getElementById('info-name').innerHTML = '<span>Name:</span><span>' + escapeHtml(target.name) + '</span>';
    document.getElementById('info-type').innerHTML = '<span>Type:</span><span>' + escapeHtml(target.type || target.constructor.name) + '</span>';
    document.getElementById('info-faction').innerHTML = '<span>Faction:</span><span>' + escapeHtml(target.faction || '-') + '</span>';
    document.getElementById('info-distance').innerHTML = '<span>Distance:</span><span>' + dist + 'm</span>';
    document.getElementById('info-status').innerHTML = '<span>Status:</span><span>' + (target instanceof Station ? 'Docked' : 'Active') + '</span>';
    document.getElementById('info-desc').textContent = target.info || 'No infocard available';
}

function getBaseId(location = game.landedBase) {
    return String(location?.base || location?.dockWith || location?.baseId || '').toLowerCase();
}

function getCommodityMarket(location = game.landedBase) {
    const baseId = getBaseId(location);
    if (!baseId) return [];
    return commodityMarketsData()[baseId] || [];
}

function commodityBasePrice(commodityId) {
    const commodity = getCommodity(commodityId);
    return Math.max(1, Number(commodity?.basePrice) || 1);
}

function getCommodityMarketEntry(commodityId, location = game.landedBase) {
    const wanted = String(commodityId || '').toLowerCase();
    return getCommodityMarket(location).find(entry => String(entry.id || '').toLowerCase() === wanted) || null;
}

function getCommoditySellPrice(commodityId, location = game.landedBase) {
    const marketEntry = getCommodityMarketEntry(commodityId, location);
    const marketPrice = Number(marketEntry?.price || 0);
    return marketPrice > 0 ? marketPrice : commodityBasePrice(commodityId);
}

function canonicalSystemId(systemId) {
    const wanted = String(systemId || '').toLowerCase();
    return Object.keys(gameSystemsData() || {}).find(id => id.toLowerCase() === wanted) || systemId || '';
}

function systemJumpDistances(startSystemId = currentSystemId) {
    const systems = gameSystemsData() || {};
    const start = canonicalSystemId(startSystemId);
    const distances = { [start]: 0 };
    const queue = [start];
    for (let cursor = 0; cursor < queue.length; cursor++) {
        const systemId = queue[cursor];
        const raw = systems[canonicalSystemId(systemId)] || {};
        const links = [...(raw.jumpgates || []), ...(raw.jumpholes || [])]
            .map(link => canonicalSystemId(link.dest_system))
            .filter(Boolean);
        for (const next of links) {
            if (distances[next] !== undefined) continue;
            distances[next] = distances[systemId] + 1;
            queue.push(next);
        }
    }
    return distances;
}

function baseLocationsById() {
    const locations = {};
    for (const systemId of Object.keys(gameSystemsData() || {})) {
        const built = buildSystemData(systemId);
        const dockables = [...(built.planets || []), ...(built.stations || [])];
        for (const dockable of dockables) {
            const baseId = getBaseId(dockable);
            if (!baseId || locations[baseId]) continue;
            locations[baseId] = { ...dockable, baseId, systemId: canonicalSystemId(systemId), systemName: built.name || systemId };
        }
    }
    return locations;
}

function tradeDestinationDistance(location) {
    if (!location) return Infinity;
    if (location.systemId?.toLowerCase() === currentSystemId.toLowerCase()) {
        return game.player ? Math.hypot((location.x || 0) - game.player.x, (location.z || 0) - game.player.z) : 0;
    }
    const built = buildSystemData(location.systemId);
    const gates = built.jumpgates || [];
    if (!gates.length) return Infinity;
    return Math.min(...gates.map(gate => Math.hypot((location.x || 0) - gate.x, (location.z || 0) - gate.z)));
}

function commoditySellDestinations(commodityId, sourceBaseId, sourcePrice) {
    const markets = commodityMarketsData();
    const locations = baseLocationsById();
    const jumpsBySystem = systemJumpDistances(currentSystemId);
    const commodity = getCommodity(commodityId);
    if (!commodity) return [];
    const basePriceEntry = {
        id: commodity.id,
        price: commodityBasePrice(commodity.id),
        forSale: false,
        stockMin: 0,
        stockMax: 0,
        basePriceFallback: true
    };
    const baseIds = new Set([...Object.keys(locations), ...Object.keys(markets)]);
    return Array.from(baseIds).flatMap(baseId => {
        if (baseId === sourceBaseId) return [];
        const market = markets[baseId] || [];
        const entry = (market || []).find(item => String(item.id || '').toLowerCase() === String(commodityId || '').toLowerCase());
        const sellEntry = Number(entry?.price || 0) > 0 ? entry : basePriceEntry;
        const location = locations[baseId] || { baseId, name: baseId, systemId: '', systemName: '' };
        const jumps = jumpsBySystem[location.systemId];
        const distance = tradeDestinationDistance(location);
        return [{ baseId, location, entry: sellEntry, jumps, distance, profit: Number(sellEntry.price) - Number(sourcePrice || 0) }];
    }).sort((a, b) => {
        const aJumps = a.jumps ?? Infinity;
        const bJumps = b.jumps ?? Infinity;
        if (aJumps !== bJumps) return aJumps - bJumps;
        if (a.distance !== b.distance) return a.distance - b.distance;
        return b.entry.price - a.entry.price;
    });
}

function getEquipmentMarket(location = game.landedBase) {
    const baseId = getBaseId(location);
    if (!baseId) return [];
    return equipmentMarketsData()[baseId] || [];
}

function getBarData(location = game.landedBase) {
    const baseId = getBaseId(location);
    if (!baseId) return { npcs: [], news: [], factions: [] };
    return barData()[baseId] || { npcs: [], news: [], factions: [] };
}

function getShipMarket(location = game.landedBase) {
    const baseId = getBaseId(location);
    return baseId ? (shipMarketsData()[baseId] || []) : [];
}

function baseArchetypeKind(location) {
    return Freelancer2DLogic.classifyBaseKind({
        archetype: location?.archetype,
        name: location?.name,
        faction: normalizeFactionId(location?.faction || ''),
        isPlanet: isPlanetDockTarget(location)
    });
}

function getBaseDefinition(location = game.landedBase) {
    const bar = getBarData(location);
    const commodities = getCommodityMarket(location);
    const equipment = getEquipmentMarket(location);
    const ships = getShipMarket(location);
    const services = Freelancer2DLogic.baseServices({ bar, commodities, equipment, ships });
    return {
        id: getBaseId(location) || String(location?.id || location?.nickname || 'unknown-base').toLowerCase(),
        name: location?.name || systemData.name || 'Base',
        kind: baseArchetypeKind(location),
        faction: normalizeFactionId(location?.faction || ''),
        security: String(location?.faction || '').includes('_n_grp') || String(location?.faction || '').includes('_p_grp') ? 'high' : services.trade ? 'standard' : 'low',
        services
    };
}

const BASE_LAYOUT_TEMPLATES = {
    planet: { dock: [0, -260, 680, 250], hub: [0, 70, 430, 190], slots: [[-500, 40], [500, 40], [-310, 390], [310, 390]] },
    station: { dock: [0, -250, 560, 220], hub: [0, 60, 360, 170], slots: [[-430, 40], [430, 40], [-250, 360], [250, 360]] },
    battleship: { dock: [-470, 0, 420, 210], hub: [0, 0, 300, 150], slots: [[430, -220], [430, 0], [430, 220], [0, 280]] },
    mining: { dock: [-330, -230, 480, 210], hub: [0, 40, 330, 160], slots: [[-440, 170], [420, -120], [420, 170], [0, 350]] },
    pirate: { dock: [230, -240, 500, 210], hub: [0, 50, 320, 160], slots: [[-430, -120], [430, 120], [-300, 330], [280, 360]] },
    research: { dock: [0, -260, 500, 210], hub: [0, 40, 330, 160], slots: [[-420, 20], [420, 20], [-230, 350], [230, 350]] }
};

function centeredRoom(id, type, name, centerX, centerY, width, height, color, action = '') {
    return {
        id, type, name,
        x: centerX - width / 2,
        y: centerY - height / 2,
        w: width,
        h: height,
        color,
        action,
        interaction: action ? { x: centerX, y: centerY } : null
    };
}

function corridorBetween(first, second, width = 72) {
    const ax = first.x + first.w / 2;
    const ay = first.y + first.h / 2;
    const bx = second.x + second.w / 2;
    const by = second.y + second.h / 2;
    return [
        { x: Math.min(ax, bx), y: ay - width / 2, w: Math.max(width, Math.abs(bx - ax)), h: width },
        { x: bx - width / 2, y: Math.min(ay, by), w: width, h: Math.max(width, Math.abs(by - ay)) }
    ];
}

function createBaseInteriorDefinition(location) {
    const base = getBaseDefinition(location);
    const template = BASE_LAYOUT_TEMPLATES[base.kind] || BASE_LAYOUT_TEMPLATES.station;
    const roomColors = { bar: '#302033', equipment: '#17394a', trade: '#34301f', ship: '#26335a' };
    const serviceLabels = { bar: 'Bar & Mission Board', equipment: 'Equipment Bay', trade: 'Commodity Exchange', ship: 'Ship Dealer' };
    const dock = centeredRoom('dock', 'deck', `${base.name} Dock`, template.dock[0], template.dock[1], template.dock[2], template.dock[3], '#17324a', 'launch');
    const hub = centeredRoom('hub', 'hall', base.kind === 'planet' ? 'Customs Concourse' : 'Operations Spine', template.hub[0], template.hub[1], template.hub[2], template.hub[3], '#142438');
    const rooms = [dock, hub];
    const serviceOrder = ['bar', 'equipment', 'trade', 'ship'].filter(service => base.services[service]);
    serviceOrder.forEach((service, index) => {
        const [x, y] = template.slots[index] || [0, 350 + index * 220];
        rooms.push(centeredRoom(service, service, serviceLabels[service], x, y, 270, 190, roomColors[service], service));
    });
    const corridors = [...corridorBetween(dock, hub), ...rooms.slice(2).flatMap(room => corridorBetween(hub, room))];
    const props = [
        { type: 'ship', x: template.dock[0], y: template.dock[1], w: 150, h: 64, label: game.player?.shipName || 'Ship' },
        { type: 'terminal', x: template.hub[0], y: template.hub[1], w: 120, h: 28, label: `${base.security.toUpperCase()} SECURITY` }
    ];
    for (const room of rooms.slice(2)) {
        if (room.type === 'bar') props.push({ type: 'table', x: room.interaction.x, y: room.interaction.y, r: 26, label: 'Contracts' });
        if (room.type === 'equipment') props.push({ type: 'console', x: room.interaction.x, y: room.interaction.y, w: 120, h: 34, label: 'Loadout' });
        if (room.type === 'trade') props.push({ type: 'crate', x: room.interaction.x, y: room.interaction.y, w: 62, h: 48, label: 'Cargo' });
        if (room.type === 'ship') props.push({ type: 'holo', x: room.interaction.x, y: room.interaction.y, r: 42, label: 'Ships' });
    }
    return { baseId: base.id, name: base.name, kind: base.kind, services: base.services, rooms, corridors, props, spawn: { x: template.dock[0], y: template.dock[1] + 45 } };
}

function enterBaseInterior(location) {
    game.isDocked = true;
    game.landedBase = location;
    game.lastLanding = createLandingRecord(location);
    game.player.cancelCruise?.();
    game.player.afterburnerActive = false;
    game.player.reverseActive = false;
    game.player.throttle = 0;
    game.player.speed = 0;
    game.interior = {
        active: true,
        location,
        layout: createBaseInteriorDefinition(location),
        player: { x: 0, y: 0, radius: 13, speed: 210, facing: 0 },
        camera: { x: 0, y: 0 },
        prompt: '',
        activeAction: ''
    };
    game.interior.player.x = game.interior.layout.spawn.x;
    game.interior.player.y = game.interior.layout.spawn.y;
    game.interior.camera.x = game.interior.player.x;
    game.interior.camera.y = game.interior.player.y;
    game.interiorKeys = {};
    document.getElementById('hud')?.classList.add('interior-mode');
    document.getElementById('landing-overlay')?.classList.add('hidden');
    document.getElementById('btn-return-interior')?.classList.add('hidden');
    const title = document.getElementById('landing-title');
    if (title) title.textContent = t('landedAt') + ': ' + location.name;
    syncLandingTabs();
    addLog(`${t('landedAt')}: ${location.name}`);
    playSound('dock', 1);
    handleMissionDock(location);
    updateCruiseButton();
    updateSpeedControl();
    saveGame();
}

function interiorRects() {
    const layout = game.interior?.layout;
    return layout ? [...layout.rooms, ...layout.corridors] : [];
}

function pointInRect(x, y, rect, padding = 0) {
    return x >= rect.x - padding && x <= rect.x + rect.w + padding && y >= rect.y - padding && y <= rect.y + rect.h + padding;
}

function isInteriorWalkable(x, y) {
    const radius = game.interior?.player?.radius || 12;
    return interiorRects().some(rect => pointInRect(x, y, rect, -radius));
}

function nearestInteriorAction() {
    const interior = game.interior;
    if (!interior?.active) return null;
    const p = interior.player;
    let best = null;
    for (const room of interior.layout.rooms) {
        if (!room.action) continue;
        const cx = room.interaction?.x ?? room.x + room.w * 0.5;
        const cy = room.interaction?.y ?? room.y + room.h * 0.5;
        const distance = Math.hypot(cx - p.x, cy - p.y);
        if (distance < 105 && (!best || distance < best.distance)) best = { ...room, distance };
    }
    return best;
}

function performInteriorAction() {
    const action = nearestInteriorAction();
    if (!action) return;
    if (action.action === 'launch') {
        game.interior = null;
        launchFromBase();
        return;
    }
    const overlay = document.getElementById('landing-overlay');
    if (overlay) overlay.classList.remove('hidden');
    document.getElementById('btn-return-interior')?.classList.remove('hidden');
    syncLandingTabs();
    showLandingDeck(action.action);
}

function returnToBaseInterior() {
    document.getElementById('landing-overlay')?.classList.add('hidden');
    document.getElementById('btn-return-interior')?.classList.add('hidden');
}

function updateInterior(dt) {
    const interior = game.interior;
    if (!interior?.active) return;
    const keys = game.interiorKeys || {};
    let dx = 0, dy = 0;
    if (keys.KeyW || keys.ArrowUp) dy -= 1;
    if (keys.KeyS || keys.ArrowDown) dy += 1;
    if (keys.KeyA || keys.ArrowLeft) dx -= 1;
    if (keys.KeyD || keys.ArrowRight) dx += 1;
    if (dx || dy) {
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
        const p = interior.player;
        const step = p.speed * dt;
        const nx = p.x + dx * step;
        const ny = p.y + dy * step;
        if (isInteriorWalkable(nx, p.y)) p.x = nx;
        if (isInteriorWalkable(p.x, ny)) p.y = ny;
        p.facing = Math.atan2(dy, dx);
    }
    const action = nearestInteriorAction();
    interior.activeAction = action?.action || '';
    interior.prompt = action ? `E - ${action.name}` : '';
    interior.camera.x += (interior.player.x - interior.camera.x) * Math.min(1, dt * 8);
    interior.camera.y += (interior.player.y - interior.camera.y) * Math.min(1, dt * 8);
}

function drawInteriorProp(ctx, prop) {
    ctx.save();
    if (prop.type === 'ship') {
        ctx.translate(prop.x, prop.y);
        ctx.fillStyle = '#9edfff';
        ctx.strokeStyle = '#d8f7ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(prop.w * 0.5, 0);
        ctx.lineTo(-prop.w * 0.35, -prop.h * 0.5);
        ctx.lineTo(-prop.w * 0.18, 0);
        ctx.lineTo(-prop.w * 0.35, prop.h * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (prop.type === 'table' || prop.type === 'holo') {
        ctx.fillStyle = prop.type === 'holo' ? 'rgba(80,190,255,0.24)' : '#4c3344';
        ctx.strokeStyle = prop.type === 'holo' ? '#69d8ff' : '#8b657f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(prop.x, prop.y, prop.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } else {
        ctx.fillStyle = prop.type === 'crate' ? '#71643a' : '#24455c';
        ctx.strokeStyle = prop.type === 'crate' ? '#b79e58' : '#6ccfff';
        ctx.lineWidth = 2;
        ctx.fillRect(prop.x - prop.w / 2, prop.y - prop.h / 2, prop.w, prop.h);
        ctx.strokeRect(prop.x - prop.w / 2, prop.y - prop.h / 2, prop.w, prop.h);
    }
    if (prop.label) {
        ctx.fillStyle = '#b9efff';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'center';
        const labelX = prop.type === 'ship' ? 0 : prop.x;
        const labelY = prop.type === 'ship' ? -(prop.h || 30) * 0.65 : prop.y - (prop.r || prop.h || 30) * 0.65;
        ctx.fillText(prop.label, labelX, labelY);
    }
    ctx.restore();
}

function renderInterior(ctx) {
    const interior = game.interior;
    if (!interior?.active) return;
    const { layout, player, camera } = interior;
    const cx = game.width * 0.5 - camera.x;
    const cy = game.height * 0.5 - camera.y;
    const grad = ctx.createLinearGradient(0, 0, game.width, game.height);
    grad.addColorStop(0, '#050914');
    grad.addColorStop(0.55, '#071a24');
    grad.addColorStop(1, '#120b18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.save();
    ctx.translate(cx, cy);
    for (const rect of layout.corridors) {
        ctx.fillStyle = '#101f30';
        ctx.strokeStyle = '#24445c';
        ctx.lineWidth = 2;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
    for (const room of layout.rooms) {
        ctx.fillStyle = room.color || '#142438';
        ctx.strokeStyle = room.action && interior.activeAction === room.action ? '#ffaa00' : '#356b8a';
        ctx.lineWidth = room.action && interior.activeAction === room.action ? 4 : 2;
        ctx.fillRect(room.x, room.y, room.w, room.h);
        ctx.strokeRect(room.x, room.y, room.w, room.h);
        ctx.fillStyle = '#b9efff';
        ctx.font = '15px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(room.name, room.x + 14, room.y + 25);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let gx = room.x + 40; gx < room.x + room.w; gx += 40) {
            ctx.beginPath(); ctx.moveTo(gx, room.y); ctx.lineTo(gx, room.y + room.h); ctx.stroke();
        }
        for (let gy = room.y + 40; gy < room.y + room.h; gy += 40) {
            ctx.beginPath(); ctx.moveTo(room.x, gy); ctx.lineTo(room.x + room.w, gy); ctx.stroke();
        }
    }
    for (const prop of layout.props) drawInteriorProp(ctx, prop);
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.facing);
    ctx.fillStyle = '#ffcc66';
    ctx.strokeStyle = '#fff0b7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#1b1208';
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(player.radius + 8, 0);
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    ctx.fillStyle = 'rgba(0,15,25,0.78)';
    ctx.fillRect(18, game.height - 78, Math.min(760, game.width - 36), 58);
    ctx.strokeStyle = '#1d75a5';
    ctx.strokeRect(18, game.height - 78, Math.min(760, game.width - 36), 58);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00ff99';
    ctx.font = '14px Courier New';
    ctx.fillText(`${layout.name} · ${String(layout.kind || 'station').toUpperCase()}`, 34, game.height - 52);
    ctx.fillStyle = '#9edfff';
    ctx.fillText(interior.prompt || 'WASD laufen | E interagieren | Launch Pad zum Starten', 34, game.height - 30);
}

function equipmentSlot(itemOrCategory) {
    return firstAvailableSlot(itemOrCategory);
}

function updateMissileWarning() {
    const warning = document.getElementById('missile-warning');
    if (!warning) return;
    warning.textContent = t('missileIncoming');
    warning.classList.toggle('hidden', !hasIncomingPlayerMissile());
}

function isFixedEquipmentItem(item) {
    const mountType = equipmentMountType(item);
    return mountType === 'powerplant' || mountType === 'engine' || mountType === 'tractor' || (!isCrossfireActive() && mountType === 'scanner');
}

function applyMountedEquipmentEffects() {
    if (!game.player) return;
    game.player.firePower = Math.max(1, game.player.baseFirePower || game.player.firePower || 1);
    const previousMaxShield = Math.max(0, Number(game.player.maxShield) || 0);
    const previousShieldRatio = previousMaxShield > 0 ? clamp((Number(game.player.shield) || 0) / previousMaxShield, 0, 1) : 1;
    const mounted = game.player.mountedEquipment || {};
    if (mounted.weapon && !mounted.weapon1) {
        mounted.weapon1 = mounted.weapon;
        delete mounted.weapon;
    }
    for (const slot of Object.keys(mounted)) {
        const item = getEquipment(mounted[slot]);
        if ((slot.startsWith('weapon') && !getWeaponSlotKeys().includes(slot)) || !item || !equipmentCompatibility(item, slot).ok) delete mounted[slot];
    }
    game.player.maxShield = 0;
    game.player.shieldRegen = 0;
    game.player.shieldOfflineRebuildTime = 0;
    game.player.shieldOfflineThreshold = 0;
    game.player.shieldRebuildPowerDraw = 0;
    game.player.shieldType = '';
    game.player.maxEnergy = game.player.baseMaxEnergy || game.player.maxEnergy;
    game.player.powerGen = game.player.basePowerGen || game.player.powerGen;
    game.player.thrustCapacity = game.player.baseThrustCapacity || game.player.thrustCapacity;
    game.player.thrustChargeRate = game.player.baseThrustChargeRate || game.player.thrustChargeRate;
    game.player.acceleration = game.player.baseAcceleration || game.player.acceleration;
    game.player.baseMaxSpeed = COMBAT_MAX_SPEED;
    game.player.maxSpeed = game.player.baseMaxSpeed;
    for (const itemId of Object.values(mounted)) {
        const item = getEquipment(itemId);
        if (!item) continue;
        const name = item.id.toLowerCase();
        const mountType = equipmentMountType(item);
        if (['weapon', 'turret', 'missile', 'torpedo', 'cruise_disruptor'].includes(mountType)) game.player.firePower = Math.max(game.player.firePower, 4 + equipmentClass(item));
        if (item.category === 'shield') {
            game.player.maxShield = shieldCapacityFromEquipment(item);
            game.player.shieldRegen = shieldRegenFromEquipment(item);
            game.player.shieldOfflineRebuildTime = Math.max(0, Number(item.shieldOfflineRebuildTime) || 0);
            game.player.shieldOfflineThreshold = Math.max(0, Number(item.shieldOfflineThreshold) || 0);
            game.player.shieldRebuildPowerDraw = Math.max(0, Number(item.shieldRebuildPowerDraw) || 0);
            game.player.shieldType = item.shieldType || '';
        }
        if (item.category === 'thruster') game.player.acceleration = Math.max(game.player.acceleration, 1.8 + (Number((name.match(/_(\d+)$/) || [])[1]) || 1) * 0.2);
        if (mountType === 'powerplant') {
            game.player.maxEnergy = Math.max(game.player.maxEnergy, Number(item.capacity) || 0);
            game.player.powerGen = Math.max(game.player.powerGen, Number(item.chargeRate) || 0);
            game.player.thrustCapacity = Math.max(game.player.thrustCapacity || 0, Number(item.thrustCapacity) || 0);
            game.player.thrustChargeRate = Math.max(game.player.thrustChargeRate || 0, Number(item.thrustChargeRate) || 0);
            game.player.energy = Math.min(game.player.maxEnergy, Math.max(game.player.energy || 0, game.player.maxEnergy));
        }
        if (mountType === 'engine') {
            game.player.baseMaxSpeed = Math.max(game.player.baseMaxSpeed || COMBAT_MAX_SPEED, Number(item.maxSpeed) || 0);
            game.player.maxSpeed = game.player.baseMaxSpeed;
        }
    }
    game.player.thrustEnergy = Math.min(game.player.thrustCapacity, Number.isFinite(game.player.thrustEnergy) ? game.player.thrustEnergy : game.player.thrustCapacity);
    if (!hasMountedThruster()) game.player.afterburnerActive = false;
    game.player.shield = game.player.maxShield > 0 ? Math.min(game.player.maxShield, game.player.maxShield * previousShieldRatio) : 0;
}

function openLandingWindow(target) {
    enterBaseInterior(target);
}

function launchFromBase() {
    const launchTarget = game.landedBase || findLandingTarget();
    const launchPoint = launchPointFromDockTarget(launchTarget);
    document.getElementById('landing-overlay')?.classList.add('hidden');
    document.getElementById('btn-return-interior')?.classList.add('hidden');
    document.getElementById('hud')?.classList.remove('interior-mode');
    game.interior = null;
    game.isDocked = false;
    game.landedBase = null;
    game.player.cancelCruise?.();
    game.player.afterburnerActive = false;
    game.player.reverseActive = false;
    game.player.throttle = 0;
    game.player.speed = 0;
    game.player.inTradeLane = false;
    game.player.laneRoute = null;
    if (launchPoint) {
        game.player.x = launchPoint.x;
        game.player.z = launchPoint.z;
        game.player.rotation = launchPoint.rotation;
    }
    updateCruiseButton();
    updateSpeedControl();
    playVoice('launch', 1);
    playSound('launch', 1);
    saveGame();
}

function syncLandingTabs() {
    const definition = getBaseDefinition(game.landedBase);
    document.querySelectorAll('.landing-tab[data-deck]').forEach(button => {
        const deck = button.dataset.deck;
        const available = deck === 'launch' || Boolean(definition.services[deck]);
        button.classList.toggle('hidden', !available);
        button.disabled = !available;
    });
    return definition;
}

function showLandingDeck(deck) {
    const definition = syncLandingTabs();
    if (deck !== 'launch' && !definition.services[deck]) deck = 'launch';
    game.landingDeck = deck;
    document.querySelectorAll('.landing-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.deck === deck));
    const content = document.getElementById('landing-content');
    if (!content) return;
    const baseName = escapeHtml(game.landedBase?.name || systemData.name);
    if (deck === 'launch') {
        content.innerHTML = `<div style="color:#b9efff;font-size:14px;line-height:1.6;">${t('landedAt')}: <strong>${baseName}</strong><br>${t('credits')}: ${game.player.credits.toLocaleString()} CR<br>${t('cargo')}: ${cargoUnits()}/${game.player.maxCargo}</div>`;
    } else if (deck === 'bar') {
        renderBarDeck();
    } else if (deck === 'equipment') {
        renderEquipmentDealer();
    } else if (deck === 'trade') {
        renderTradeDealer();
    } else if (deck === 'ship') {
        openShipShop();
    }
}

function renderBarDeck() {
    const content = document.getElementById('landing-content');
    if (!content) return;
    const baseName = escapeHtml(game.landedBase?.name || systemData.name);
    const bar = getBarData();
    const systemInfo = (systemData.info || '').split('\n').filter(Boolean).slice(0, 8);
    const subDeck = game.barSubDeck || 'news';
    let html = `<div style="color:#9edfff;line-height:1.55;"><strong>${baseName} Bar</strong><div class="bar-subtabs"><button class="bar-subtab ${subDeck === 'news' ? 'active' : ''}" onclick="showBarSubDeck('news')">News</button><button class="bar-subtab ${subDeck === 'npcs' ? 'active' : ''}" onclick="showBarSubDeck('npcs')">NPCs</button><button class="bar-subtab ${subDeck === 'missions' ? 'active' : ''}" onclick="showBarSubDeck('missions')">${t('missions')}</button></div>`;
    if (subDeck === 'news') {
        if (bar.news?.length) {
            for (const item of bar.news.slice(0, 12)) {
                html += `<div style="margin:7px 0 12px;color:#b9efff;"><strong>${escapeHtml(item.headline || item.category || 'News')}</strong><br><span style="color:#9edfff;">${escapeHtml(item.text || '')}</span></div>`;
            }
        } else if (systemInfo.length) {
            html += '<div style="margin-top:10px;color:#ffaa00;">Local Data</div>';
            html += systemInfo.map(line => '<div style="margin-bottom:4px;color:#b9efff;">' + escapeHtml(line) + '</div>').join('');
        } else {
            html += `<br><span style="color:#ffaa00;">${t('barText')}</span>`;
        }
    } else if (subDeck === 'npcs') {
        if (bar.npcs?.length) {
            for (const [index, npc] of bar.npcs.slice(0, 24).entries()) {
                const rumor = npc.rumors?.find(Boolean) || '';
                html += `<div class="npc-row"><div><strong>${escapeHtml(npc.name || npc.id)}</strong><br><span style="color:#88a;">${escapeHtml(npc.affiliation || '')}</span></div><button class="speech-button" title="Geruecht lesen" onclick="showRumor(${index})" ${rumor ? '' : 'disabled'}>...</button></div>`;
            }
            if (game.activeRumor) html += `<div class="rumor-box"><strong>${escapeHtml(game.activeRumor.name)}</strong><br>${escapeHtml(game.activeRumor.text)}</div>`;
        } else {
            html += `<div style="color:#ffaa00;">${escapeHtml(t('noBarNpcs'))}</div>`;
        }
    } else {
        html += renderMissionOffers();
    }
    html += '</div>';
    content.innerHTML = html;
}

function showBarSubDeck(deck) {
    game.barSubDeck = deck;
    if (deck !== 'npcs') game.activeRumor = null;
    renderBarDeck();
}

function missionTypeLabel(type) {
    const key = {
        combat: 'missionTypeCombat',
        transport: 'missionTypeTransport',
        patrol: 'missionTypePatrol',
        escort: 'missionTypeEscort'
    }[type || 'combat'];
    return t(key || 'missionTypeCombat');
}

function missionProgressText(mission) {
    const hostiles = game.language === 'de' ? 'Feinde' : 'hostiles';
    if (mission.type === 'transport') return `${mission.targetName} | ${mission.cargoUnits || 1} ${t('cargo')}`;
    if (mission.type === 'patrol') return `${Math.min((mission.currentCheckpoint || 0) + 1, mission.checkpoints?.length || 1)}/${mission.checkpoints?.length || 1}`;
    if (mission.type === 'escort') return `${mission.targetName} | ${mission.remaining ?? mission.enemyCount} ${hostiles}`;
    return `${mission.spawned ? mission.remaining : mission.enemyCount} ${hostiles}`;
}

function renderMissionOffers() {
    const mission = game.activeMission;
    if (mission) {
        const activeLabel = game.language === 'de' ? 'Aktive Mission' : 'Active mission';
        const rewardLabel = game.language === 'de' ? 'Belohnung' : 'Reward';
        return `<div class="mission-row mission-active"><div><strong>${activeLabel}: ${escapeHtml(mission.title)}</strong><div class="mission-meta">${escapeHtml(missionTypeLabel(mission.type))} | ${escapeHtml(missionProgressText(mission))} | ${rewardLabel}: ${mission.reward.toLocaleString()} CR</div></div><button class="trade-button" disabled>${game.language === 'de' ? 'AKTIV' : 'ACTIVE'}</button></div>`;
    }
    const offers = getMissionOffers();
    if (!offers.length) return `<div style="color:#ffaa00;">${escapeHtml(t('noDestroyMission'))}</div>`;
    let html = '<div class="mission-list">';
    for (const offer of offers) {
        const targetX = Number.isFinite(offer.targetX) ? offer.targetX : offer.x;
        const targetZ = Number.isFinite(offer.targetZ) ? offer.targetZ : offer.z;
        const distance = game.player ? Math.round(Math.hypot(targetX - game.player.x, targetZ - game.player.z)) : 0;
        const difficultyLabel = game.language === 'de' ? 'Schwierigkeit' : 'Difficulty';
        const acceptLabel = game.language === 'de' ? 'ANNEHMEN' : 'ACCEPT';
        const detail = offer.type === 'transport'
            ? `${offer.cargoUnits} ${t('cargo')}`
            : offer.type === 'patrol'
                ? `${offer.checkpoints.length} ${game.language === 'de' ? 'Kontrollpunkte' : 'checkpoints'}`
                : `${offer.enemyCount} ${game.language === 'de' ? 'Feinde' : 'hostiles'}`;
        html += `<div class="mission-row"><div><strong>${escapeHtml(offer.title)}</strong><div>${escapeHtml(offer.description)}</div><div class="mission-meta">${escapeHtml(missionTypeLabel(offer.type))} | ${difficultyLabel} ${offer.difficulty} | ${escapeHtml(detail)} | ${distance.toLocaleString()} m | ${offer.reward.toLocaleString()} CR</div></div><button class="trade-button" onclick="acceptMission('${offer.id}')">${acceptLabel}</button></div>`;
    }
    html += '</div>';
    return html;
}

function showRumor(npcIndex) {
    const npc = (getBarData().npcs || [])[npcIndex];
    const text = npc?.rumors?.find(Boolean);
    if (!text) return;
    game.activeRumor = { name: npc.name || npc.id || 'NPC', text };
    renderBarDeck();
}

function renderEquipmentDealer() {
    const content = document.getElementById('landing-content');
    if (!content) return;
    const market = getEquipmentMarket();
    const inventory = cleanEquipmentInventory(game.player.equipmentInventory || []);
    const repairCost = shipRepairCost();
    const dealerTab = game.equipmentDealerTab || 'equipment';
    let html = `<div style="display:flex;justify-content:space-between;margin-bottom:10px;color:#b9efff;gap:12px;flex-wrap:wrap;"><span>${t('credits')}: ${game.player.credits.toLocaleString()} CR</span><span>Ship: ${escapeHtml(game.player.shipName || 'Unknown')}</span><span>Hull: ${Math.round(game.player.hull).toLocaleString()}/${Math.round(game.player.maxHull).toLocaleString()}</span><span>Shield: ${game.player.maxShield > 0 ? `${Math.round(game.player.shield).toLocaleString()}/${Math.round(game.player.maxShield).toLocaleString()}` : 'none'}</span><span>Power: ${Math.round(game.player.maxEnergy).toLocaleString()} / +${Math.round(game.player.powerGen).toLocaleString()}/s</span><span>Thrust: ${Math.round(game.player.thrustEnergy || 0).toLocaleString()}/${Math.round(game.player.thrustCapacity || 0).toLocaleString()} / +${Math.round(game.player.thrustChargeRate || 0).toLocaleString()}/s</span><span>Nanobots: ${game.player.nanobots}/${game.player.maxNanobots}</span><span>Shield Batteries: ${game.player.shieldBatteries}/${game.player.maxShieldBatteries}</span><span>${tf('missileAmmoCount', { count: totalMissileAmmoCount(), max: game.player.maxMissileAmmo })}</span><span>${tf('mineAmmoCount', { count: totalMineAmmoCount(), max: game.player.maxMineAmmo })}</span><span>${tf('countermeasureAmmoCount', { count: totalCountermeasureAmmoCount() })}</span></div>`;
    html += `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;padding:8px;border:1px solid #24445c;background:#07141f;"><span style="color:#b9efff;">Ship repair: ${repairCost > 0 ? repairCost.toLocaleString() + ' CR' : 'no damage'}</span><button class="trade-button" onclick="repairPlayerShip()" ${repairCost > 0 && game.player.credits >= repairCost ? '' : 'disabled'}>REPAIR</button></div>`;
    if (!market.length) {
        html += `<div style="color:#ffaa00;">${t('noEquipment')}</div>`;
        content.innerHTML = html;
        return;
    }
    html += `<div class="bar-subtabs"><button class="bar-subtab ${dealerTab === 'equipment' ? 'active' : ''}" onclick="showEquipmentDealerTab('equipment')">${escapeHtml(t('equipmentDealer'))}</button><button class="bar-subtab ${dealerTab === 'ammo' ? 'active' : ''}" onclick="showEquipmentDealerTab('ammo')">${escapeHtml(t('ammoTab'))}</button></div>`;
    const slots = [...getWeaponSlotKeys(), 'shield', 'thruster', 'scanner', 'tractor', 'engine', 'powerplant', 'mine', 'countermeasure'];
    html += '<div class="equipment-layout"><div class="equipment-panel"><h4>Mounted Slots</h4>';
    for (const slot of slots) {
        const item = mountedEquipmentItem(slot);
        const rangeMeta = item && slot === 'scanner' ? ` | ${formatDistance(scannerRangeForItem(item))}` : item && slot === 'tractor' ? ` | ${formatDistance(tractorRangeForItem(item))}` : '';
        const itemMeta = item ? `${equipmentMountType(item)} class ${equipmentClass(item)}${rangeMeta}` : '';
        const lockedSlot = isFixedEquipmentSlot(slot);
        html += `<div class="slot-row"><div><strong>${escapeHtml(equipmentSlotLabel(slot))}</strong><br><span style="color:${item ? '#b9efff' : '#667f8f'};">${item ? escapeHtml(item.name) : 'Empty'}</span>${item ? `<br><span style="color:#88a;">${escapeHtml(itemMeta)}${lockedSlot ? ' | fixed' : ''}</span>` : ''}</div><button class="trade-button" onclick="unmountEquipment('${slot}')" ${item && !lockedSlot ? '' : 'disabled'}>Unmount</button></div>`;
    }
    html += '</div><div class="equipment-panel"><h4>Inventory</h4>';
    const availableInventory = inventory.map(inv => {
        const item = getEquipment(inv.id);
        return { ...inv, availableQuantity: availableEquipmentQuantity(inv.id) };
    }).filter(inv => inv.availableQuantity > 0);
    if (availableInventory.length) {
        for (const inv of availableInventory) {
            const sellPrice = equipmentSellPrice(inv.id);
            const inventoryItem = getEquipment(inv.id);
            const compatibility = equipmentCompatibility(inventoryItem);
            const canMount = !inventoryItem?.combinable && compatibility.ok;
            const invType = equipmentMountType(inventoryItem);
            const rangeMeta = invType === 'scanner' ? ` | ${formatDistance(scannerRangeForItem(inventoryItem))}` : invType === 'tractor' ? ` | ${formatDistance(tractorRangeForItem(inventoryItem))}` : '';
            const meta = `${invType} class ${equipmentClass(inventoryItem)}${rangeMeta} x${inv.availableQuantity} | ${sellPrice.toLocaleString()} CR`;
            html += `<div class="slot-row"><div>${escapeHtml(inv.name)}<br><span style="color:#88a;">${escapeHtml(meta)}</span>${compatibility.ok ? '' : `<br><span style="color:#ff7777;">${escapeHtml(compatibility.reason)}</span>`}</div><div style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;"><button class="trade-button" onclick="mountEquipment('${inv.id}')" ${canMount ? '' : 'disabled'}>Mount</button><button class="trade-button" onclick="sellEquipment('${inv.id}')" ${sellPrice > 0 ? '' : 'disabled'}>${t('sell')}</button></div></div>`;
        }
    } else {
        html += '<div style="color:#667f8f;">No equipment in inventory.</div>';
    }
    html += '</div></div>';
    const marketEntries = dealerTab === 'ammo'
        ? market.filter(entry => {
            const item = getEquipment(entry.id);
            return item && ((String(item.category || '').toLowerCase() === 'missile' && item.combinable) || isMineAmmo(item) || isCountermeasureAmmo(item));
        })
        : market.filter(entry => {
            const item = getEquipment(entry.id);
            return item && !isFixedEquipmentItem(item) && !(String(item.category || '').toLowerCase() === 'missile' && item.combinable) && !isMineAmmo(item) && !isCountermeasureAmmo(item);
        });
    html += '<table class="trade-table"><tr><th>Item</th><th>Type</th><th>Class</th><th>Power</th><th>Damage/Range</th><th>Price</th><th>Stock</th><th>Owned</th><th></th></tr>';
    for (const entry of marketEntries.slice(0, 120)) {
        const item = getEquipment(entry.id);
        if (!item) continue;
        const inv = inventory.find(i => i.id === item.id);
        const owned = inv ? availableEquipmentQuantity(item.id) : 0;
        const needsShipCompatibility = !item.combinable && categorySlotKeys(item.category).length > 0;
        const compatibility = needsShipCompatibility ? equipmentCompatibility(item) : { ok: true, reason: '' };
        const ammoReason = ammoCompatibilityReason(item);
        const canBuy = entry.forSale && game.player.credits >= entry.price && compatibility.ok && !ammoReason;
        const damageLabel = isMineDropper(item)
            ? `${Math.round(mineStatsFromEquipment(item).damage)}`
            : isMissileLauncher(item)
            ? `${Math.round(missileDamageForItem(item, getEquipment(missileAmmoItemId(item))))}`
            : (item.hullDamage || item.energyDamage ? `${Math.round(Number(item.hullDamage || 0))}/${Math.round(Number(item.energyDamage || 0))}` : '-');
        const typeLabel = equipmentMountType(item);
        const rangeLabel = typeLabel === 'scanner'
            ? formatDistance(scannerRangeForItem(item))
            : typeLabel === 'tractor'
                ? formatDistance(tractorRangeForItem(item))
                : damageLabel;
        const powerLabel = item.category === 'thruster'
            ? `${Math.round(thrusterPowerUsage(item)).toLocaleString()}/s thrust`
            : (item.powerUsage ? Number(item.powerUsage).toFixed(1) : (item.capacity ? `${Math.round(item.capacity).toLocaleString()} / +${Math.round(item.chargeRate || 0).toLocaleString()}` : '-'));
        const muted = !compatibility.ok || Boolean(ammoReason);
        const rowStyle = muted ? ' style="opacity:0.48;color:#778899;"' : '';
        const mutedCellStyle = muted ? ' style="color:#778899;"' : '';
        const reasonText = compatibility.reason || ammoReason;
        const reasonHtml = muted ? `<br><span style="color:#ff7777;font-size:11px;">${escapeHtml(reasonText)}</span>` : '';
        const titleAttr = muted ? ` title="${escapeHtml(reasonText)}"` : '';
        html += `<tr${rowStyle}${titleAttr}><td style="color:${muted ? '#778899' : '#00ff00'};">${escapeHtml(item.name)}${reasonHtml}</td><td${mutedCellStyle}>${escapeHtml(typeLabel)}</td><td${mutedCellStyle}>${equipmentClass(item)}</td><td${mutedCellStyle}>${escapeHtml(powerLabel)}</td><td${mutedCellStyle}>${escapeHtml(rangeLabel)}</td><td style="color:${muted ? '#777' : '#ffaa00'};">${entry.price.toLocaleString()} CR</td><td${mutedCellStyle}>${entry.forSale ? `${entry.stockMin}-${entry.stockMax}` : '-'}</td><td${mutedCellStyle}>${owned}</td><td><button class="trade-button" onclick="buyEquipment('${item.id}')" ${canBuy ? '' : 'disabled'}>${t('buy')}</button></td></tr>`;
    }
    html += '</table>';
    content.innerHTML = html;
}

function showEquipmentDealerTab(tab) {
    game.equipmentDealerTab = tab === 'ammo' ? 'ammo' : 'equipment';
    renderEquipmentDealer();
}

function equipmentSellPrice(itemId) {
    const item = getEquipment(itemId);
    const marketEntry = getEquipmentMarket().find(entry => String(entry.id || '').toLowerCase() === String(itemId || '').toLowerCase());
    const buyPrice = Number(marketEntry?.price || item?.price || 0);
    return Math.max(0, Math.floor(buyPrice / 3));
}

function shipRepairCost() {
    if (!game.player) return 0;
    const missingHull = Math.max(0, Math.ceil((Number(game.player.maxHull) || 0) - (Number(game.player.hull) || 0)));
    return missingHull > 0 ? Math.max(25, missingHull * 4) : 0;
}

function repairPlayerShip() {
    const cost = shipRepairCost();
    if (!game.player || cost <= 0 || game.player.credits < cost) return;
    game.player.credits -= cost;
    game.player.hull = game.player.maxHull;
    addLog('Ship repaired at equipment dealer.');
    playSound('buy', 0.6);
    playVoice('repairComplete', 1);
    saveGame();
    renderEquipmentDealer();
    updateHUD();
}

function buyEquipment(itemId) {
    const marketEntry = getEquipmentMarket().find(entry => entry.id === itemId);
    const item = getEquipment(itemId);
    if (!marketEntry || !item || !marketEntry.forSale || game.player.credits < marketEntry.price) return;
    if (isFixedEquipmentItem(item)) {
        addLog('Fixed ship equipment cannot be bought separately.', 'alert');
        return;
    }
    const ammoReason = ammoCompatibilityReason(item);
    if (ammoReason) {
        addLog(ammoReason, 'alert');
        return;
    }
    const needsShipCompatibility = !item.combinable && categorySlotKeys(item.category).length > 0;
    if (needsShipCompatibility) {
        const compatibility = equipmentCompatibility(item);
        if (!compatibility.ok) {
            addLog(compatibility.reason, 'alert');
            return;
        }
    }
    if (String(item.category || '').toLowerCase() === 'missile' && item.combinable && totalMissileAmmoCount() >= game.player.maxMissileAmmo) {
        addLog(t('ammoFull'), 'alert');
        return;
    }
    if (isMineAmmo(item) && totalMineAmmoCount() >= game.player.maxMineAmmo) {
        addLog(t('mineAmmoFull'), 'alert');
        return;
    }
    game.player.credits -= marketEntry.price;
    if (item.category === 'nanobot') game.player.nanobots = Math.min(game.player.maxNanobots, game.player.nanobots + 1);
    else if (item.category === 'shield_battery') game.player.shieldBatteries = Math.min(game.player.maxShieldBatteries, game.player.shieldBatteries + 1);
    else {
        let inv = findEquipmentItem(item.id);
        if (!inv) {
            inv = { id: item.id, name: item.name, quantity: 0, category: item.category };
            game.player.equipmentInventory.push(inv);
        }
        inv.quantity += 1;
    }
    playSound('buy', 0.65);
    saveGame();
    renderEquipmentDealer();
    updateHUD();
}

function sellEquipment(itemId) {
    const inv = findEquipmentItem(itemId);
    if (!inv || availableEquipmentQuantity(itemId) <= 0) return;
    if (isFixedEquipmentItem(getEquipment(itemId))) {
        addLog('Fixed ship equipment cannot be sold.', 'alert');
        return;
    }
    const sellPrice = equipmentSellPrice(itemId);
    if (sellPrice <= 0) return;
    inv.quantity = Math.max(0, (Number(inv.quantity) || 0) - 1);
    game.player.credits += sellPrice;
    game.player.equipmentInventory = (game.player.equipmentInventory || []).filter(item => (Number(item.quantity) || 0) > 0);
    playSound('buy', 0.45);
    saveGame();
    renderEquipmentDealer();
    updateHUD();
}

function mountEquipment(itemId) {
    const item = getEquipment(itemId);
    const inv = findEquipmentItem(itemId);
    const slot = equipmentSlot(item);
    if (!item || !inv || inv.quantity <= 0 || !slot) return;
    if (isFixedEquipmentItem(item)) {
        addLog('Fixed ship equipment cannot be mounted manually.', 'alert');
        return;
    }
    const compatibility = equipmentCompatibility(item, slot);
    if (!compatibility.ok) {
        addLog(compatibility.reason, 'alert');
        return;
    }
    const mountedCopies = Object.entries(game.player.mountedEquipment || {}).filter(([mountedSlot, mountedId]) => mountedSlot !== slot && mountedId === item.id).length;
    if (mountedCopies >= inv.quantity) {
        addLog('No free owned copy to mount: ' + item.name, 'alert');
        return;
    }
    game.player.mountedEquipment[slot] = item.id;
    applyMountedEquipmentEffects();
    addLog('Mounted: ' + item.name);
    playSound('select', 0.7);
    saveGame();
    renderEquipmentDealer();
    updateHUD();
}

function unmountEquipment(slot) {
    if (!game.player?.mountedEquipment?.[slot]) return;
    if (isFixedEquipmentSlot(slot)) {
        addLog('Fixed ship equipment cannot be unmounted.', 'alert');
        return;
    }
    const item = getEquipment(game.player.mountedEquipment[slot]);
    delete game.player.mountedEquipment[slot];
    applyMountedEquipmentEffects();
    if (item) addLog('Unmounted: ' + item.name);
    saveGame();
    renderEquipmentDealer();
    updateHUD();
}

function renderTradeDealer() {
    const content = document.getElementById('landing-content');
    if (!content) return;
    const market = getCommodityMarket();
    const cargo = game.player.cargo || [];
    const marketIds = new Set(market.map(entry => String(entry.id || '').toLowerCase()));
    const cargoOnlyEntries = cargo
        .filter(item => !marketIds.has(String(item.id || '').toLowerCase()) && getCommodity(item.id))
        .map(item => ({
            id: String(item.id || '').toLowerCase(),
            price: getCommoditySellPrice(item.id),
            forSale: false,
            stockMin: 0,
            stockMax: 0,
            basePriceFallback: true
        }));
    const tradeEntries = [...market, ...cargoOnlyEntries];
    if (!tradeEntries.length) {
        content.innerHTML = `<div style="color:#ffaa00;">${t('noCommodityMarket')}</div>`;
        return;
    }
    if (game.tradeInfoCommodityId && !tradeEntries.some(entry => entry.id === game.tradeInfoCommodityId)) game.tradeInfoCommodityId = '';
    let html = `<div style="display:flex;justify-content:space-between;margin-bottom:10px;color:#b9efff;"><span>${t('credits')}: ${game.player.credits.toLocaleString()} CR</span><span>${t('cargo')}: ${cargoUnits()}/${game.player.maxCargo}</span></div>`;
    html += renderTradeInfoPanel(tradeEntries);
    html += `<table class="trade-table"><tr><th>${t('commodity')}</th><th>${t('price')}</th><th>${t('stock')}</th><th>${t('quantity')}</th><th></th><th>${t('owned')}</th><th>${t('quantity')}</th><th></th></tr>`;
    for (const entry of tradeEntries) {
        const commodity = getCommodity(entry.id);
        if (!commodity) continue;
        const cargoItem = findCargoItem(entry.id);
        const cargoSpace = Math.max(0, game.player.maxCargo - cargoUnits());
        const affordable = entry.price > 0 ? Math.floor(game.player.credits / entry.price) : cargoSpace;
        const marketStock = Number.isFinite(Number(entry.stockMax)) && Number(entry.stockMax) > 0 ? Number(entry.stockMax) : Infinity;
        const maxBuy = Math.max(0, Math.min(cargoSpace, affordable, marketStock));
        const canBuy = entry.forSale && maxBuy > 0;
        const canSell = !!cargoItem && cargoItem.quantity > 0;
        const buyInputId = 'buy-qty-' + safeDomId(entry.id);
        const sellInputId = 'sell-qty-' + safeDomId(entry.id);
        const selected = game.tradeInfoCommodityId === entry.id ? ' class="selected"' : '';
        html += `<tr${selected}><td><span class="trade-commodity-link" onclick="selectTradeInfoCommodity('${entry.id}')">${escapeHtml(commodity.name)}</span></td><td style="color:#ffaa00;">${entry.price.toLocaleString()} CR</td><td>${entry.forSale ? `${entry.stockMin}-${entry.stockMax}` : '-'}</td><td><input class="trade-qty-input" id="${buyInputId}" type="number" min="1" max="${maxBuy || 1}" value="${canBuy ? 1 : 0}" onkeydown="if(event.key==='Enter') buyCommodity('${entry.id}')" ${canBuy ? '' : 'disabled'}></td><td><button class="trade-button" onclick="buyCommodity('${entry.id}')" ${canBuy ? '' : 'disabled'}>${t('buy')}</button></td><td>${cargoItem ? cargoItem.quantity : 0}</td><td><input class="trade-qty-input" id="${sellInputId}" type="number" min="1" max="${cargoItem ? cargoItem.quantity : 1}" value="${canSell ? 1 : 0}" onkeydown="if(event.key==='Enter') sellCommodity('${entry.id}')" ${canSell ? '' : 'disabled'}></td><td><button class="trade-button" onclick="sellCommodity('${entry.id}')" ${canSell ? '' : 'disabled'}>${t('sell')}</button></td></tr>`;
    }
    html += '</table>';
    content.innerHTML = html;
}

function renderTradeInfoPanel(market) {
    const selectedId = game.tradeInfoCommodityId;
    if (!selectedId) return `<div class="trade-info-panel"><div class="trade-info-title"><strong>${escapeHtml(t('tradeInfo'))}</strong></div><span style="color:#8fb8c8;">${escapeHtml(t('tradeInfoHint'))}</span></div>`;
    const sourceEntry = market.find(entry => entry.id === selectedId);
    const commodity = getCommodity(selectedId);
    if (!sourceEntry || !commodity) return '';
    const sourceBaseId = getBaseId(game.landedBase);
    const destinations = commoditySellDestinations(selectedId, sourceBaseId, sourceEntry.price).slice(0, 20);
    let html = `<div class="trade-info-panel"><div class="trade-info-title"><strong>${escapeHtml(t('tradeInfo'))}: ${escapeHtml(commodity.name)}</strong><span>${escapeHtml(t('price'))}: ${Number(sourceEntry.price || 0).toLocaleString()} CR</span></div>`;
    if (!destinations.length) {
        html += `<div style="color:#ffaa00;">${escapeHtml(t('noSellTargets'))}</div></div>`;
        return html;
    }
    html += `<table class="trade-info-table"><tr><th>${escapeHtml(t('sellAt'))}</th><th>System</th><th>${escapeHtml(t('jumps'))}</th><th>${escapeHtml(t('distance'))}</th><th>${escapeHtml(t('price'))}</th><th>${escapeHtml(t('profit'))}</th></tr>`;
    for (const destination of destinations) {
        const jumps = destination.jumps === undefined ? t('unreachable') : destination.jumps;
        const distance = Number.isFinite(destination.distance) ? formatDistance(destination.distance) : '-';
        const profitColor = destination.profit >= 0 ? '#00ff00' : '#ff7777';
        html += `<tr><td>${escapeHtml(destination.location.name || destination.baseId)}</td><td>${escapeHtml(destination.location.systemName || destination.location.systemId || '-')}</td><td>${escapeHtml(jumps)}</td><td>${escapeHtml(distance)}</td><td style="color:#ffaa00;">${Number(destination.entry.price || 0).toLocaleString()} CR</td><td style="color:${profitColor};">${destination.profit >= 0 ? '+' : ''}${destination.profit.toLocaleString()} CR</td></tr>`;
    }
    html += '</table></div>';
    return html;
}

function selectTradeInfoCommodity(commodityId) {
    game.tradeInfoCommodityId = commodityId;
    renderTradeDealer();
}

function buyCommodity(commodityId, requestedQuantity = null) {
    const marketEntry = getCommodityMarket().find(entry => entry.id === commodityId);
    const commodity = getCommodity(commodityId);
    if (!marketEntry || !commodity || !marketEntry.forSale || cargoUnits() >= game.player.maxCargo || game.player.credits < marketEntry.price) return;
    const input = document.getElementById('buy-qty-' + safeDomId(commodityId));
    const rawQuantity = requestedQuantity ?? Number(input?.value || 1);
    const marketStock = Number.isFinite(Number(marketEntry.stockMax)) && Number(marketEntry.stockMax) > 0 ? Number(marketEntry.stockMax) : Infinity;
    const { quantity, total } = Freelancer2DLogic.tradePurchaseQuote({
        requested: rawQuantity,
        cargoUsed: cargoUnits(),
        cargoCapacity: game.player.maxCargo,
        credits: game.player.credits,
        unitPrice: marketEntry.price,
        stock: marketStock
    });
    if (quantity <= 0) return;
    game.player.credits -= total;
    let cargoItem = findCargoItem(commodityId);
    if (!cargoItem) {
        cargoItem = { id: commodityId, name: commodity.name, quantity: 0, avgPrice: marketEntry.price };
        game.player.cargo.push(cargoItem);
    }
    cargoItem.avgPrice = Math.round(((cargoItem.avgPrice || marketEntry.price) * cargoItem.quantity + marketEntry.price * quantity) / (cargoItem.quantity + quantity));
    cargoItem.quantity += quantity;
    playSound('buy', 0.65);
    saveGame();
    renderTradeDealer();
    updateHUD();
}

function sellCommodity(commodityId, requestedQuantity = null) {
    const sellPrice = getCommoditySellPrice(commodityId);
    const commodity = getCommodity(commodityId);
    const cargoItem = findCargoItem(commodityId);
    if (!commodity || sellPrice <= 0 || !cargoItem || cargoItem.quantity <= 0) return;
    const input = document.getElementById('sell-qty-' + safeDomId(commodityId));
    const rawQuantity = requestedQuantity ?? Number(input?.value || 1);
    const { quantity, total } = Freelancer2DLogic.tradeSaleQuote({ requested: rawQuantity, owned: cargoItem.quantity, unitPrice: sellPrice });
    if (quantity <= 0) return;
    game.player.credits += total;
    cargoItem.quantity -= quantity;
    if (cargoItem.quantity <= 0) game.player.cargo = game.player.cargo.filter(item => item.id !== commodityId);
    playSound('buy', 0.45);
    saveGame();
    renderTradeDealer();
    updateHUD();
}

function openShipShop() {
    const content = document.getElementById('landing-content');
    if (!game.isDocked || !game.landedBase || !content) {
        addLog(t('shipDealerDockOnly'), 'alert');
        return;
    }
    
    const dealer = findCurrentShipDealer();
    const baseId = dealer ? String(dealer.base || dealer.dockWith || '').toLowerCase() : '';
    const market = baseId ? (shipMarketsData()[baseId] || []) : [];
    const ships = market.map(packageId => getShipPackage(packageId)).filter(Boolean);
    let html = `<div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:10px;color:#b9efff;flex-wrap:wrap;"><span>${t('shipDealer')}: ${escapeHtml(dealer ? dealer.name : systemData.name)}</span><span>${t('credits')}: ${game.player.credits.toLocaleString()} CR</span><span>Current Ship: ${escapeHtml(game.player.shipName || 'Unknown')}</span></div>`;

    if (!ships.length) {
        const dealerText = dealer && baseId ? escapeHtml(dealer.name + ' (' + baseId + ')') : 'No selected dockable base';
        content.innerHTML = html + '<div style="padding:16px;color:#ffaa00;">' + t('noShipsSold') + '<br><span style="color:#88a;">Dealer: ' + dealerText + '</span></div>';
        return;
    }

    html += '<table style="width:100%;border-collapse:collapse;">';
    html += '<tr style="text-align:left;background:#002244;"><th style="padding:8px;">Ship</th><th style="padding:8px;">Type</th><th style="padding:8px;">Hull</th><th style="padding:8px;">Shield</th><th style="padding:8px;">Powerplant</th><th style="padding:8px;">Cargo</th><th style="padding:8px;">Handling</th><th style="padding:8px;">Price</th><th></th></tr>';
    
    for (const ship of ships) {
        const canAfford = game.player.credits >= ship.price;
        const stats = ship.stats || {};
        const isCurrent = game.player.shipPackageId === ship.id;
        const icon = ship.icon ? `<img src="${escapeHtml(ship.icon)}" onerror="this.onerror=null;this.src='data/ship_icons/_fallback.png';" style="width:34px;height:34px;object-fit:contain;vertical-align:middle;margin-right:8px;">` : '';
        html += `<tr style="border-bottom:1px solid #222;">
            <td style="padding:6px;color:#00ff00;">${icon}${escapeHtml(ship.name)}</td>
            <td style="padding:6px;color:#888;">${escapeHtml(ship.type || '-')}</td>
            <td style="padding:6px;color:#ff4444;">${stats.hull || '-'}</td>
            <td style="padding:6px;color:#44aaff;">${stats.shield || '-'}</td>
            <td style="padding:6px;color:#ffcc44;">${stats.powerCapacity ? `${Math.round(stats.powerCapacity).toLocaleString()} / +${Math.round(stats.powerChargeRate || 0).toLocaleString()}` : '-'}</td>
            <td style="padding:6px;color:#ffaa00;">${stats.holdSize || '-'}</td>
            <td style="padding:6px;color:#9edfff;">T ${stats.turnRate || '-'} / A ${stats.acceleration || '-'}</td>
            <td style="padding:6px;color:#ffaa00;">${ship.price.toLocaleString()} CR</td>
            <td style="padding:6px;">
                <button onclick="buyShip('${ship.id}')" ${(!canAfford || isCurrent) ? 'disabled' : ''}
                    style="padding:5px 10px;background:${canAfford && !isCurrent?'#003300':'#222'};border:1px solid ${canAfford && !isCurrent?'#00aa00':'#555'};color:${canAfford && !isCurrent?'#00ff00':'#888'};cursor:${canAfford && !isCurrent?'pointer':'not-allowed'};">
                    ${isCurrent ? 'OWNED' : 'BUY'}
                </button>
            </td>
        </tr>`;
    }
    
    html += '</table>';
    content.innerHTML = html;
}

function findCurrentShipDealer() {
    if ((game.landedBase instanceof Station || game.landedBase instanceof PlanetLocation) && (game.landedBase.base || game.landedBase.dockWith)) {
        return game.landedBase;
    }
    if ((game.selectedTarget instanceof Station || game.selectedTarget instanceof PlanetLocation) && (game.selectedTarget.base || game.selectedTarget.dockWith)) {
        return game.selectedTarget;
    }
    let nearest = null;
    let nearestDist = Infinity;
    for (const entity of game.entities) {
        if (!(entity instanceof Station) || !(entity.base || entity.dockWith)) continue;
        const dx = entity.x - game.player.x;
        const dz = entity.z - game.player.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearest = entity;
        }
    }
    return nearestDist < 2500 ? nearest : (nearest || null);
}

window.buyShip = function(packageId) {
    if (!game.isDocked || !game.landedBase) {
        addLog(t('shipDealerDockOnly'), 'alert');
        return;
    }
    const shipPackage = getShipPackage(packageId);
    if (!shipPackage) {
        addLog('Ship package not found: ' + packageId, 'alert');
        return;
    }
    if (game.player.shipPackageId === shipPackage.id) return;
    if (game.player.credits >= shipPackage.price) {
        game.player.credits -= shipPackage.price;
        applyShipPackage(shipPackage.id, true);
        playVoice('shipPurchase', 1);
        saveGame(true);
        openShipShop(); // Refresh list
    } else {
        addLog('Not enough credits!', 'alert');
    }
};
