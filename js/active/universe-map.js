// Universe View
function toggleUniverseView() {
    // Open the map dialog and switch to the universe tab
    game.showMap = true;
    const overlay = document.getElementById('map-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        switchMapTab('universe');
    }
}

let universeBackgroundImage = null;
let universeBackgroundImageRequested = false;

function getUniverseBackgroundImage() {
    if (!universeBackgroundImage && !universeBackgroundImageRequested && typeof Image !== 'undefined') {
        universeBackgroundImageRequested = true;
        universeBackgroundImage = new Image();
        universeBackgroundImage.onload = () => {
            drawUniverseMapInMapDialog();
            drawUniverseMap();
        };
        universeBackgroundImage.src = UNIVERSE_BACKGROUND_IMAGE_PATH;
    }
    return universeBackgroundImage && universeBackgroundImage.complete && universeBackgroundImage.naturalWidth > 0
        ? universeBackgroundImage
        : null;
}

function drawUniverseBackground(ctx, w, h) {
    ctx.fillStyle = '#000508';
    ctx.fillRect(0, 0, w, h);

    const image = getUniverseBackgroundImage();
    if (image) {
        const imageRatio = image.naturalWidth / Math.max(1, image.naturalHeight);
        const canvasRatio = w / Math.max(1, h);
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;
        if (imageRatio > canvasRatio) {
            drawH = h;
            drawW = h * imageRatio;
            drawX = (w - drawW) / 2;
        } else {
            drawW = w;
            drawH = w / imageRatio;
            drawY = (h - drawH) / 2;
        }
        ctx.save();
        ctx.globalAlpha = 0.72;
        ctx.drawImage(image, drawX, drawY, drawW, drawH);
        ctx.globalAlpha = 1;
        const fade = ctx.createRadialGradient(w * 0.5, h * 0.48, Math.min(w, h) * 0.18, w * 0.5, h * 0.48, Math.max(w, h) * 0.72);
        fade.addColorStop(0, 'rgba(0, 7, 14, 0.10)');
        fade.addColorStop(0.72, 'rgba(0, 7, 14, 0.34)');
        fade.addColorStop(1, 'rgba(0, 0, 0, 0.72)');
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 4, 10, 0.28)';
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }
}

function drawUniverseGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(40, 140, 125, 0.22)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * w / 20, 0);
        ctx.lineTo(i * w / 20, h);
        ctx.moveTo(0, i * h / 20);
        ctx.lineTo(w, i * h / 20);
        ctx.stroke();
    }
}

function drawUniverseMapInMapDialog() {
    const canvas = document.getElementById('map-universe-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    
    drawUniverseBackground(ctx, w, h);
    drawUniverseGrid(ctx, w, h);
    
    const systemColor = (id) => {
        const lower = id.toLowerCase();
        if (lower.startsWith('li')) return '#00aaff';
        if (lower.startsWith('br')) return '#ff6644';
        if (lower.startsWith('rh')) return '#ffaa00';
        if (lower.startsWith('ku')) return '#ff55cc';
        if (lower.startsWith('bw') || lower.startsWith('ew')) return '#aaaaaa';
        return '#44ff88';
    };
    const universeSystems = dataSet('UNIVERSE_SYSTEMS', typeof UNIVERSE_SYSTEMS !== 'undefined' ? UNIVERSE_SYSTEMS : []);
    const universeConnections = dataSet('UNIVERSE_CONNECTIONS', typeof UNIVERSE_CONNECTIONS !== 'undefined' ? UNIVERSE_CONNECTIONS : {});
    const sectors = availableUniverseSectors();
    
    // Check if we should show sector overview
    if (universeViewMode() === 'overview' && sectors.length > 1) {
        drawUniverseSectorOverview(ctx, canvas, sectors, universeConnections);
        return;
    }
    
    const selectedSector = currentUniverseSector();
    const sourceSystems = selectedSector ? (selectedSector.systems || []) : universeSystems;
    const systems = sourceSystems.map(sys => ({
        id: sys.nickname,
        name: displayName(sys.name, sys.nickname),
        x: Number(sys.x || 0),
        y: Number(sys.z || 0),
        color: systemColor(sys.nickname)
    }));
    
    if (!systems.length) {
        ctx.fillStyle = '#88aa99';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('No universe data available.', w / 2, h / 2);
        return;
    }
    
    const connections = [];
    if (universeConnections && typeof universeConnections === 'object') {
        for (const [from, list] of Object.entries(universeConnections)) {
            const targets = Array.isArray(list) ? list : Object.values(list || {});
            for (const to of targets) connections.push([from, String(to)]);
        }
    }
    
    const universeTransform = getUniverseTransform(canvas, systems);
    const systemById = new Map(systems.map(system => [system.id.toLowerCase(), system]));
    const visibleConnections = connections.filter(([from, to]) => systemById.has(from.toLowerCase()) && systemById.has(to.toLowerCase()));
    
    // Draw connections
    const seenConnections = new Set();
    for (const [from, to] of visibleConnections) {
        const key = [from.toLowerCase(), to.toLowerCase()].sort().join('>');
        if (seenConnections.has(key)) continue;
        seenConnections.add(key);
        const sys1 = systemById.get(from.toLowerCase());
        const sys2 = systemById.get(to.toLowerCase());
        if (!sys1 || !sys2) continue;
        const p1 = universeToScreen(sys1, universeTransform);
        const p2 = universeToScreen(sys2, universeTransform);
        ctx.strokeStyle = 'rgba(38, 210, 255, 0.42)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(180, 255, 240, 0.78)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    
    // Draw system nodes
    for (const sys of systems) {
        const pos = universeToScreen(sys, universeTransform);
        const sx = pos.x;
        const sy = pos.y;
        ctx.fillStyle = sys.color;
        ctx.beginPath();
        ctx.arc(sx, sy, sys.id.toLowerCase() === currentSystemId.toLowerCase() ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#888888';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(sys.name, sx, sy + 15);
        ctx.fillStyle = '#444444';
        ctx.font = '8px Courier New';
        ctx.fillText(sys.id.toUpperCase(), sx, sy - 12);
    }
    
    // Highlight current system
    const currentSys = systems.find(s => s.id.toLowerCase() === currentSystemId.toLowerCase());
    if (currentSys) {
        const pos = universeToScreen(currentSys, universeTransform);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Legend
    ctx.fillStyle = '#666666';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', 10, h - 60);
    const legends = [
        { color: '#00aaff', text: 'Liberty' },
        { color: '#ff4400', text: 'Bretonia' },
        { color: '#ffaa00', text: 'Rheinland' },
        { color: '#ff00ff', text: 'Kusari' },
        { color: '#44ff44', text: 'Independent' },
        { color: '#aaaaaa', text: 'Pirate' }
    ];
    legends.forEach((legend, index) => {
        ctx.fillStyle = legend.color;
        ctx.beginPath();
        ctx.arc(15, h - 40 + index * 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#888888';
        ctx.fillText(legend.text, 25, h - 36 + index * 15);
    });
    ctx.fillStyle = '#444444';
    ctx.textAlign = 'right';
    ctx.fillText('Wheel zoom / drag pan: ' + game.universeZoom.toFixed(1) + 'x', w - 10, h - 10);
}

function getUniverseTransform(canvas, systems) {
    const w = canvas.width;
    const h = canvas.height;
    const xs = systems.map(s => s.x);
    const ys = systems.map(s => s.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const baseScale = Math.min((w - 80) / Math.max(1, maxX - minX), (h - 80) / Math.max(1, maxY - minY));
    const scale = baseScale * game.universeZoom;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return {
        scale,
        offsetX: w / 2 - centerX * scale + game.universePanX,
        offsetY: h / 2 - centerY * scale + game.universePanY
    };
}

function universeToScreen(system, transform) {
    return { x: transform.offsetX + system.x * transform.scale, y: transform.offsetY + system.y * transform.scale };
}

function resetUniverseViewport() {
    game.universeZoom = 1;
    game.universePanX = 0;
    game.universePanY = 0;
}

function availableUniverseSectors() {
    return (universeSectorsData() || []).filter(sector => Array.isArray(sector?.systems) && sector.systems.length);
}

function currentUniverseSector() {
    const sectors = availableUniverseSectors();
    return sectors.find(sector => sector.key === game.universeSector) || null;
}

function universeViewMode() {
    return availableUniverseSectors().length > 1 && (!game.universeSector || game.universeSector === 'all') ? 'overview' : 'sector';
}

function setUniverseSector(sectorKey = 'all') {
    game.universeSector = sectorKey || 'all';
    resetUniverseViewport();
    renderUniverseSectorTabs();
    drawUniverseMap();
}

function renderUniverseSectorTabs() {
    const container = document.getElementById('universe-sector-tabs');
    if (!container) return;
    const sectors = availableUniverseSectors();
    if (sectors.length <= 1) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    const buttons = [`<button type="button" data-sector="all" class="${game.universeSector === 'all' ? 'active' : ''}" style="padding: 6px 10px; border: 1px solid ${game.universeSector === 'all' ? '#66ffaa' : '#335544'}; background: ${game.universeSector === 'all' ? '#10351c' : '#08150d'}; color: ${game.universeSector === 'all' ? '#ccffe0' : '#77aa88'}; cursor: pointer;">OVERVIEW</button>`];
    buttons.push(...sectors.map(sector => `<button type="button" data-sector="${escapeHtml(sector.key)}" class="${game.universeSector === sector.key ? 'active' : ''}" style="padding: 6px 10px; border: 1px solid ${game.universeSector === sector.key ? '#66ffaa' : '#335544'}; background: ${game.universeSector === sector.key ? '#10351c' : '#08150d'}; color: ${game.universeSector === sector.key ? '#ccffe0' : '#77aa88'}; cursor: pointer;">${escapeHtml(sector.name || sector.key.toUpperCase())}</button>`));
    container.innerHTML = buttons.join('');
    container.style.display = 'flex';
    container.querySelectorAll('button[data-sector]').forEach(button => {
        button.addEventListener('click', () => setUniverseSector(button.dataset.sector || 'all'));
    });
}

function drawUniverseConnections(ctx, systemById, connections, transform) {
    const seenConnections = new Set();
    for (const [from, to] of connections) {
        const key = [from.toLowerCase(), to.toLowerCase()].sort().join('>');
        if (seenConnections.has(key)) continue;
        seenConnections.add(key);
        const sys1 = systemById.get(from.toLowerCase());
        const sys2 = systemById.get(to.toLowerCase());
        if (!sys1 || !sys2) continue;
        const p1 = universeToScreen(sys1, transform);
        const p2 = universeToScreen(sys2, transform);
        ctx.strokeStyle = 'rgba(38, 210, 255, 0.42)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(180, 255, 240, 0.78)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
}

function drawUniverseSystemNodes(ctx, systems, transform) {
    for (const sys of systems) {
        const pos = universeToScreen(sys, transform);
        const sx = pos.x;
        const sy = pos.y;
        ctx.fillStyle = sys.color;
        ctx.beginPath();
        ctx.arc(sx, sy, sys.id.toLowerCase() === currentSystemId.toLowerCase() ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#888888';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(sys.name, sx, sy + 15);
        ctx.fillStyle = '#444444';
        ctx.font = '8px Courier New';
        ctx.fillText(sys.id.toUpperCase(), sx, sy - 12);
    }
}

function drawUniverseCurrentSystemHighlight(ctx, systems, transform) {
    const currentSys = systems.find(s => s.id.toLowerCase() === currentSystemId.toLowerCase());
    if (!currentSys) return;
    const pos = universeToScreen(currentSys, transform);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawUniverseLegend(ctx, w, h, footerText) {
    ctx.fillStyle = '#666666';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', 10, h - 100);
    const legends = [
        { color: '#00aaff', text: 'Liberty' },
        { color: '#ff4400', text: 'Bretonia' },
        { color: '#ffaa00', text: 'Rheinland' },
        { color: '#ff00ff', text: 'Kusari' },
        { color: '#44ff44', text: 'Independent' },
        { color: '#aaaaaa', text: 'Pirate' }
    ];
    legends.forEach((legend, index) => {
        ctx.fillStyle = legend.color;
        ctx.beginPath();
        ctx.arc(15, h - 80 + index * 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#888888';
        ctx.fillText(legend.text, 25, h - 76 + index * 15);
    });
    ctx.fillStyle = '#444444';
    ctx.textAlign = 'right';
    ctx.fillText(footerText, w - 10, h - 10);
}

function drawUniverseSectorOverview(ctx, canvas, sectors, universeConnections) {
    const w = canvas.width;
    const h = canvas.height;
    const layoutXs = sectors.map(sector => Number(sector.layout?.x || 0));
    const layoutYs = sectors.map(sector => Number(sector.layout?.y || 0));
    const minLayoutX = Math.min(...layoutXs);
    const maxLayoutX = Math.max(...layoutXs);
    const minLayoutY = Math.min(...layoutYs);
    const maxLayoutY = Math.max(...layoutYs);
    const panelWidth = 250;
    const panelHeight = 165;
    const paddingX = 36;
    const paddingY = 42;
    const spanX = Math.max(0.001, maxLayoutX - minLayoutX);
    const spanY = Math.max(0.001, maxLayoutY - minLayoutY);
    for (const sector of sectors) {
        const panelX = paddingX + ((Number(sector.layout?.x || 0) - minLayoutX) / spanX) * (w - panelWidth - paddingX * 2);
        const panelY = paddingY + ((Number(sector.layout?.y || 0) - minLayoutY) / spanY) * (h - panelHeight - 150 - paddingY);
        ctx.fillStyle = 'rgba(5, 20, 16, 0.9)';
        ctx.strokeStyle = 'rgba(82, 180, 140, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        const containsCurrent = sector.systems?.some(sys => String(sys.nickname).toLowerCase() === currentSystemId.toLowerCase());
        if (containsCurrent) {
            ctx.strokeStyle = '#88ffb0';
            ctx.lineWidth = 2;
            ctx.strokeRect(panelX - 2, panelY - 2, panelWidth + 4, panelHeight + 4);
        }
        ctx.fillStyle = '#b8ffd8';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(sector.name || sector.key.toUpperCase(), panelX + 10, panelY + 18);
        ctx.fillStyle = '#4e7a68';
        ctx.font = '10px Courier New';
        ctx.fillText(`${(sector.systems || []).length} systems`, panelX + 10, panelY + 34);
        const localSystems = (sector.systems || []).map(sys => ({
            id: sys.nickname,
            name: displayName(sys.name, sys.nickname),
            x: Number(sys.x || 0),
            y: Number(sys.z || 0),
            color: (function(id) {
                const lower = String(id || '').toLowerCase();
                if (lower.startsWith('li')) return '#00aaff';
                if (lower.startsWith('br')) return '#ff6644';
                if (lower.startsWith('rh')) return '#ffaa00';
                if (lower.startsWith('ku')) return '#ff55cc';
                if (lower.startsWith('bw') || lower.startsWith('ew')) return '#aaaaaa';
                return '#44ff88';
            })(sys.nickname)
        }));
        if (!localSystems.length) continue;
        const transform = getUniverseTransform({ width: panelWidth - 20, height: panelHeight - 52 }, localSystems);
        transform.offsetX += panelX + 10;
        transform.offsetY += panelY + 42;
        const systemById = new Map(localSystems.map(system => [system.id.toLowerCase(), system]));
        const localConnections = [];
        for (const [from, list] of Object.entries(universeConnections || {})) {
            const targets = Array.isArray(list) ? list : Object.values(list || {});
            for (const to of targets) {
                if (systemById.has(String(from).toLowerCase()) && systemById.has(String(to).toLowerCase())) localConnections.push([from, String(to)]);
            }
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(panelX + 4, panelY + 40, panelWidth - 8, panelHeight - 44);
        ctx.clip();
        drawUniverseConnections(ctx, systemById, localConnections, transform);
        for (const sys of localSystems) {
            const pos = universeToScreen(sys, transform);
            ctx.fillStyle = sys.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, sys.id.toLowerCase() === currentSystemId.toLowerCase() ? 4.5 : 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#a0b7a8';
            ctx.font = '8px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(sys.id.toUpperCase(), pos.x, pos.y - 7);
        }
        ctx.restore();
    }
    ctx.fillStyle = '#88aa99';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('Crossfire Multiverse: choose a sector tab above for a full map.', 16, h - 118);
    drawUniverseLegend(ctx, w, h, 'Overview mode');
}

function drawUniverseSectorMap(ctx, canvas, systems, universeConnections, sectorName) {
    const w = canvas.width;
    const h = canvas.height;
    const connections = [];
    if (universeConnections && typeof universeConnections === 'object') {
        for (const [from, list] of Object.entries(universeConnections)) {
            const targets = Array.isArray(list) ? list : Object.values(list || {});
            for (const to of targets) connections.push([from, String(to)]);
        }
    }
    const universeTransform = getUniverseTransform(canvas, systems);
    const systemById = new Map(systems.map(system => [system.id.toLowerCase(), system]));
    const visibleConnections = connections.filter(([from, to]) => systemById.has(from.toLowerCase()) && systemById.has(to.toLowerCase()));
    drawUniverseConnections(ctx, systemById, visibleConnections, universeTransform);
    drawUniverseSystemNodes(ctx, systems, universeTransform);
    drawUniverseCurrentSystemHighlight(ctx, systems, universeTransform);
    if (sectorName) {
        ctx.fillStyle = '#88ccaa';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`Sector: ${sectorName}`, 12, 22);
    }
    drawUniverseLegend(ctx, w, h, 'Wheel zoom / drag pan: ' + game.universeZoom.toFixed(1) + 'x');
}

function drawUniverseMap() {
    const canvas = document.getElementById('universe-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    renderUniverseSectorTabs();
    
    drawUniverseBackground(ctx, w, h);
    drawUniverseGrid(ctx, w, h);
    
    const systemColor = (id) => {
        const lower = id.toLowerCase();
        if (lower.startsWith('li')) return '#00aaff';
        if (lower.startsWith('br')) return '#ff6644';
        if (lower.startsWith('rh')) return '#ffaa00';
        if (lower.startsWith('ku')) return '#ff55cc';
        if (lower.startsWith('bw') || lower.startsWith('ew')) return '#aaaaaa';
        return '#44ff88';
    };
    const universeSystems = dataSet('UNIVERSE_SYSTEMS', typeof UNIVERSE_SYSTEMS !== 'undefined' ? UNIVERSE_SYSTEMS : []);
    const universeConnections = dataSet('UNIVERSE_CONNECTIONS', typeof UNIVERSE_CONNECTIONS !== 'undefined' ? UNIVERSE_CONNECTIONS : {});
    const sectors = availableUniverseSectors();
    if (universeViewMode() === 'overview' && sectors.length > 1) {
        drawUniverseSectorOverview(ctx, canvas, sectors, universeConnections);
        return;
    }
    const selectedSector = currentUniverseSector();
    const sourceSystems = selectedSector ? (selectedSector.systems || []) : universeSystems;
    const systems = sourceSystems.map(sys => ({
        id: sys.nickname,
        name: displayName(sys.name, sys.nickname),
        x: Number(sys.x || 0),
        y: Number(sys.z || 0),
        color: systemColor(sys.nickname)
    }));
    if (!systems.length) {
        ctx.fillStyle = '#88aa99';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('No universe data for this sector.', w / 2, h / 2);
        return;
    }
    drawUniverseSectorMap(ctx, canvas, systems, universeConnections, selectedSector?.name || 'Sirius');
}

document.getElementById('universe-canvas')?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    game.universeZoom = clamp(game.universeZoom * factor, game.minUniverseZoom, game.maxUniverseZoom);
    drawUniverseMap();
});

document.getElementById('universe-canvas')?.addEventListener('mousedown', (e) => {
    game.universeDragging = true;
    game.universeDragged = false;
    game.universeDragStartX = e.clientX;
    game.universeDragStartY = e.clientY;
    game.universeDragOriginX = game.universePanX;
    game.universeDragOriginY = game.universePanY;
});

document.getElementById('universe-canvas')?.addEventListener('mousemove', (e) => {
    if (!game.universeDragging) return;
    const dx = e.clientX - game.universeDragStartX;
    const dy = e.clientY - game.universeDragStartY;
    if (Math.abs(dx) + Math.abs(dy) > 3) game.universeDragged = true;
    game.universePanX = game.universeDragOriginX + dx;
    game.universePanY = game.universeDragOriginY + dy;
    drawUniverseMap();
});

function stopUniverseDrag() {
    game.universeDragging = false;
}

document.getElementById('universe-canvas')?.addEventListener('mouseup', stopUniverseDrag);
document.getElementById('universe-canvas')?.addEventListener('mouseleave', stopUniverseDrag);

// Universe canvas events for the map dialog
document.getElementById('map-universe-canvas')?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    game.universeZoom = clamp(game.universeZoom * factor, game.minUniverseZoom, game.maxUniverseZoom);
    drawUniverseMapInMapDialog();
});

document.getElementById('map-universe-canvas')?.addEventListener('mousedown', (e) => {
    game.universeDragging = true;
    game.universeDragged = false;
    game.universeDragStartX = e.clientX;
    game.universeDragStartY = e.clientY;
    game.universeDragOriginX = game.universePanX;
    game.universeDragOriginY = game.universePanY;
});

document.getElementById('map-universe-canvas')?.addEventListener('mousemove', (e) => {
    if (!game.universeDragging) return;
    const dx = e.clientX - game.universeDragStartX;
    const dy = e.clientY - game.universeDragStartY;
    if (Math.abs(dx) + Math.abs(dy) > 3) game.universeDragged = true;
    game.universePanX = game.universeDragOriginX + dx;
    game.universePanY = game.universeDragOriginY + dy;
    drawUniverseMapInMapDialog();
});

document.getElementById('map-universe-canvas')?.addEventListener('mouseup', stopUniverseDrag);
document.getElementById('map-universe-canvas')?.addEventListener('mouseleave', stopUniverseDrag);

document.getElementById('map-canvas')?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / Math.max(1, rect.width));
    const my = (e.clientY - rect.top) * (canvas.height / Math.max(1, rect.height));
    const before = screenToSystemMap(mx, my, getSystemMapTransform(canvas));
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const nextZoom = clamp(game.mapZoom * factor, game.minMapZoom, game.maxMapZoom);
    if (nextZoom === game.mapZoom) return;
    game.mapZoom = nextZoom;
    const after = systemMapToScreen(before.x, before.z, getSystemMapTransform(canvas));
    game.mapPanX += mx - after.x;
    game.mapPanY += my - after.y;
    clampSystemMapPan(canvas);
    drawMapCanvas();
});

document.getElementById('map-canvas')?.addEventListener('mousedown', (e) => {
    game.mapDragging = true;
    game.mapDragged = false;
    game.mapDragStartX = e.clientX;
    game.mapDragStartY = e.clientY;
    game.mapDragOriginX = game.mapPanX;
    game.mapDragOriginY = game.mapPanY;
});

document.getElementById('map-canvas')?.addEventListener('mousemove', (e) => {
    if (!game.mapDragging) return;
    const dx = e.clientX - game.mapDragStartX;
    const dy = e.clientY - game.mapDragStartY;
    if (Math.abs(dx) + Math.abs(dy) > 3) game.mapDragged = true;
    game.mapPanX = game.mapDragOriginX + dx;
    game.mapPanY = game.mapDragOriginY + dy;
    clampSystemMapPan(e.currentTarget);
    drawMapCanvas();
});

function stopMapDrag() {
    game.mapDragging = false;
}

document.getElementById('map-canvas')?.addEventListener('mouseup', stopMapDrag);
document.getElementById('map-canvas')?.addEventListener('mouseleave', stopMapDrag);

function selectMapTarget(target, name = '') {
    if (!target) return;
    game.selectedTarget = target;
    addLog('Selected: ' + (name || target.name || scannerObjectKind(target)));
    playSound('select', 0.7);
    updateHUD();
    drawMapCanvas();
}

// Click on map to select
document.getElementById('map-canvas')?.addEventListener('click', (e) => {
    if (game.mapDragged) {
        game.mapDragged = false;
        return;
    }
    const rect = e.target.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (e.target.width / Math.max(1, rect.width));
    const my = (e.clientY - rect.top) * (e.target.height / Math.max(1, rect.height));
    const world = screenToSystemMap(mx, my, getSystemMapTransform(e.target));
    const worldX = world.x;
    const worldZ = world.z;
    
    for (const station of systemData.stations) {
        const dx = station.x - worldX;
        const dz = station.z - worldZ;
        if (Math.sqrt(dx * dx + dz * dz) < 5000) {
            selectMapTarget(game.entities.find(e => e.id === station.id) || station, station.name);
            return;
        }
    }

    let nearestRing = null;
    let nearestRingDist = Infinity;
    for (const lane of systemData.tradeLanes) {
        for (let i = 0; i < lane.rings.length; i++) {
            const ring = lane.rings[i];
            const dx = ring.x - worldX;
            const dz = ring.z - worldZ;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 4200 && dist < nearestRingDist) {
                nearestRing = findTradeLaneRingEntity(ring, i);
                nearestRingDist = dist;
            }
        }
    }
    if (nearestRing) {
        selectMapTarget(nearestRing, nearestRing.name);
        return;
    }

    for (const planet of systemData.planets) {
        const dx = planet.x - worldX;
        const dz = planet.z - worldZ;
        if (Math.sqrt(dx * dx + dz * dz) < Math.max(8000, planet.radius)) {
            selectMapTarget(game.entities.find(e => e instanceof PlanetLocation && e.id === planet.id) || planet, planet.name);
            return;
        }
    }

    for (const gate of systemData.jumpgates) {
        const dx = gate.x - worldX;
        const dz = gate.z - worldZ;
        if (Math.sqrt(dx * dx + dz * dz) < 5000) {
            selectMapTarget(game.entities.find(e => e.id === gate.id) || gate, gate.name);
            return;
        }
    }

    setFreeSpaceWaypoint(worldX, worldZ);
    drawMapCanvas();
});

document.getElementById('btn-clear-waypoint')?.addEventListener('click', clearWaypoint);
document.getElementById('btn-waypoint-selection')?.addEventListener('click', createWaypointFromSelection);
document.getElementById('btn-close-map')?.addEventListener('click', toggleMap);
document.getElementById('btn-close-inventory')?.addEventListener('click', () => toggleInventoryPanel(false));
document.getElementById('btn-close-universe')?.addEventListener('click', () => {
    // Close the map dialog instead of the old universe overlay
    game.showMap = false;
    const overlay = document.getElementById('map-overlay');
    if (overlay) overlay.classList.add('hidden');
});
