async function init() {
    game.canvas = document.getElementById('game-canvas');
    game.ctx = game.canvas.getContext('2d');
    startStartMenuBackground();
    renderStartMenuScreenPicker();
    game.width = window.innerWidth;
    game.height = window.innerHeight;
    game.canvas.width = game.width;
    game.canvas.height = game.height;

    game.activeModId = normalizeModId(localStorage.getItem(ACTIVE_MOD_KEY) || 'vanilla-en');
    await loadActiveModData();
    currentSystemId = 'Li01';
    systemData = buildSystemData(currentSystemId);

    const forceNewGame = sessionStorage.getItem('freelancer2d.forceNewGame') === '1';
    if (forceNewGame) sessionStorage.removeItem('freelancer2d.forceNewGame');
    const slots = readSaveSlots();
    game.activeSaveSlotId = forceNewGame ? (localStorage.getItem(activeSaveStorageKey()) || game.activeSaveSlotId) : getActiveSaveSlotId(slots);
    const savedGame = forceNewGame ? null : readSavedGame(game.activeSaveSlotId);
    game.saveLoaded = !!savedGame;
    const activeSlot = slots.find(slot => slot.id === game.activeSaveSlotId);
    game.saveSlotName = forceNewGame ? selectedSaveName() : (activeSlot?.name || savedGame?.name || 'Pilot');
    if (savedGame?.currentSystemId) {
        currentSystemId = savedGame.currentSystemId;
        systemData = buildSystemData(currentSystemId);
    }
    if (savedGame?.language === 'en' || savedGame?.language === 'de') game.language = savedGame.language;
    if (Number.isFinite(savedGame?.gameTime)) game.gameTime = savedGame.gameTime;
    if (Number.isFinite(savedGame?.zoom)) game.zoom = Math.max(game.minZoom, Math.min(game.maxZoom, savedGame.zoom));
    updateSystemHud();
    updateSaveHint(savedGame);
    applyLanguage();
    
    window.addEventListener('resize', () => {
        game.width = window.innerWidth;
        game.height = window.innerHeight;
        game.canvas.width = game.width;
        game.canvas.height = game.height;
    });
    
    setupInput();
    setupMusicPlayer();
    bindScannerPanelEvents();
    initStars();
    
    game.player = new PlayerShip(6173, -50515);
    applyShipPackage('gf1_package');
    initializePlayerReputations('li_n_grp');
    if (savedGame) restorePlayerFromSave(savedGame);
    rebuildEntities();
    
    game.npcs = [];
    game.npcFleets = [];
    seedAmbientTradeTrafficForSystem();
    
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-new-game')?.addEventListener('click', () => {
        if (createNewSaveSlot()) window.location.reload();
    });
    document.getElementById('btn-language-menu')?.addEventListener('click', () => toggleLanguage());
    document.getElementById('btn-delete-save')?.addEventListener('click', () => {
        const activeSlot = readSaveSlots().find(slot => slot.id === game.activeSaveSlotId);
        if (!activeSlot) return;
        if (confirm(tf('deleteSaveConfirm', { name: activeSlot.name || 'Pilot' }))) clearSavedGame(activeSlot.id);
    });
    document.getElementById('btn-edit-save-name')?.addEventListener('click', startSaveNameEdit);
    document.getElementById('btn-save-name')?.addEventListener('click', commitSaveNameEdit);
    document.getElementById('save-name-input')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && game.saveNameEditing) commitSaveNameEdit();
    });
    window.addEventListener('beforeunload', () => saveGame());
}

function startGame() {
    ensureAudio();
    clearTimeout(game.playerDeathTimer);
    game.playerDeathTimer = null;
    game.playerDeathPending = false;
    document.getElementById('death-overlay')?.classList.add('hidden');
    if (!game.musicStoppedByUser) playMusicTrack(defaultMusicTrack('space'), 'space');
    document.getElementById('start-screen').classList.add('hidden');
    game.running = true;
    game.hasStarted = true;
    game.lastTime = performance.now();
    
    if (!game.saveLoaded) {
        // Start ship at Ft. Bush Station position (safe area, not in sun)
        game.player.x = 6173;
        game.player.z = -50515;
        game.player.throttle = 0.8; // 80% throttle
        game.player.rotation = -Math.PI / 2; // Face right (toward open space)
        game.zoom = 0.8; // Zoom out a bit
    }
    
    addLog(game.saveLoaded ? tf('gameLoaded', { system: systemData.name }) : tf('welcomePilot', { system: systemData.name }));
    addLog('W/S: throttle | A/D: approach/dock | M: map');
    playSound('launch', 0.7);
    saveGame();
    console.log('Game started! Player at:', game.player.x, game.player.z);
    console.log('Throttle:', game.player.throttle, 'MaxSpeed:', game.player.maxSpeed);
    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', init);
