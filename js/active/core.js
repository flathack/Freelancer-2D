// Freelancer ID Lookup Table (extracted from INI files)
// Maps numeric IDs to human-readable names
const FREELANCER_IDS = {
    // Systems (strid_name from universe.ini)
    '196766': 'New York',
    '196767': 'Tomahawk',
    '196768': 'Magellan',
    '196769': 'Colorado',
    '196770': 'Nebraska',
    '196771': 'Kyoto',
    '196772': 'Honshu',
    '196773': 'Shikoku',
    '196774': 'Hokkaido',
    '196775': 'Chugoku',
    '196776': 'Nagasaki',
    '196777': 'Osaka',
    '196778': 'Planet Manhattan',
    '196779': 'New Berlin',
    '196658': 'Cambridge',
    '196659': 'Oxford',
    '196660': 'Leeds',
    '196661': 'Manchester',
    '196662': 'Edinburgh',
    '196663': 'Belfast',
    '196664': 'New London',
    '196665': 'York',
    '196666': 'Birmingham',
    '196667': 'Colchester',
    '196668': 'Caerleon',
    '196669': 'Basildon',
    '196670': 'Perth',
    '196671': 'Durham',
    '196672': 'Ipswich',
    '196673': 'Newcastle',
    '196674': 'Glasgow',
    '196675': 'Blackpool',
    '196676': 'Dublin',
    '196677': 'Luton',
    '196678': 'Reading',
    '196679': 'Hull',
    '196680': 'Norfolk',
    '196681': 'Hampshire',
    '196682': 'Kent',
    '196683': 'Penrith',
    '196684': 'Somerset',
    '196685': 'Avon',
    '196686': 'Lancaster',
    '196687': 'Preston',
    '196688': 'Leicester',
    '196689': 'Sheffield',
    '196690': 'Frankfurt',
    '196691': 'Stuttgart',
    '196692': 'Munich',
    '196693': 'Hamburg',
    '196694': 'Nuremberg',
    '196695': 'Augsburg',
    '196696': 'Koblenz',
    '196697': 'Koln',
    '196698': 'Dusseldorf',
    '196699': 'Dortmund',
    '196700': 'Essen',
    '196701': 'Duisburg',
    '196702': 'Bochum',
    '196703': 'Wuppertal',
    '196704': 'Bielefeld',
    '196705': 'Mannheim',
    '196706': 'Karlsruhe',
    '196707': 'Wiesbaden',
    '196708': 'Gelsenkirchen',
    '196709': 'Monchengladbach',
    '196710': 'Braunschweig',
    '196711': 'Hannover',
    '196712': 'Munster',
    '196713': 'Kiel',
    '196714': 'Lubeck',
    '196715': 'Rostock',
    '196716': 'Magdeburg',
    '196717': 'Erfurt',
    '196718': 'Dresden',
    '196719': 'Leipzig',
    '196720': 'Halle',
    '196721': 'Bonn',
    '196722': 'Mainz',
    '196735': 'Sigma',
    '196736': 'Proxton',
    '196737': 'Omega',
    '196738': 'Dathomir',
    '196739': 'Voru',
    '196740': 'Testre',
    '196741': 'Kria',
    '196723': 'Planet Los Angeles',
    '196724': 'Planet Houston',
    '196725': 'Planet Chicago',
    '196726': 'Planet Dallas',
    '196727': 'Planet Denver',
    '196728': 'Planet Newark',
    '196729': 'Planet Detroit',
    '196730': 'Planet Philadelphia',
    '196731': 'Planet Pittsburgh',
    '196732': 'Planet St. Louis',
    '196733': 'Planet San Francisco',
    '196734': 'Planet Seattle',
    '196743': 'Planet Shizuoka',
    '196744': 'Planet Osaka',
    '196745': 'Planet Yokohama',
    '196746': 'Planet Nagoya',
    '196747': 'Planet Hiroshima',
    '196748': 'Planet Sapporo',
    '196749': 'Planet Fukuoka',
    '196750': 'Planet Sasebo',
    '196751': 'Planet Kobe',
    '196752': 'Planet Kyoto',
    '196753': 'Planet Tokyo',
    '196754': 'Planet Keiun',
    '196755': 'Planet Kirishima',
    '196756': 'Planet Nomad',
    '196757': 'Planet Tau',
    '196758': 'Planet Omega',
    '196759': 'Planet Sigma',
    '196760': 'Planet Alpha',
    '196761': 'Planet Beta',
    '196762': 'Planet Gamma',
    '196763': 'Planet Delta',
    '196764': 'Planet Epsilon',
    '196765': 'Planet Zeta',
    
    // Base/Station names (ids_name)
    '261008': 'New York',
    '196766': 'New York',
    '260911': 'Tomahawk Gate',
    '260912': 'Magellan Gate',
    '260913': 'Colorado Gate',
    '260914': 'Nebraska Gate',
    '196776': 'Nagasaki',
    '261168': 'BDArmstrong Station',
    '261211': 'West Point',
    '196768': 'Magellan',
    '196774': 'Nagasaki Station',
    '196777': 'Osaka Base',
    '196775': 'Chugoku Base',
    '60245': 'Unknown Location',
    '261210': 'Detroit Depot',
    '196767': 'Tomahawk',
    '261169': 'Freelancer Port',
    '260910': 'New York Gate',
    '261212': 'Gate to Colorado',
    '261208': 'Gate to Nebraska',
    '261119': 'Gate to Kyushu',
    '261209': 'Gate to Honshu',
    '196773': 'Shikoku Base',
    '55022': 'Iwayama Station',
    '196771': 'Kyoto',
    '196779': 'New Berlin',
    '196772': 'Honshu',
    '260916': 'Gate to Magellan',
    '261161': 'Trade Lane Entrance',
    '261164': 'Trade Lane Junction',
    '260915': 'Gate to Tomahawk',
    '60243': 'Jump Gate',
    '196778': 'Planet Manhattan',
    '261166': 'Spaceport',
    '261708': 'Station Entry',
    '261348': 'Hangar',
    '261709': 'Repair Bay',
    '261710': 'Commodity Exchange',
    '260622': 'Trading Floor',
    '196770': 'Nebraska',
};

// Infocards (text descriptions for objects)
const FREELANCER_INFOCARDS = {
    '196766': 'The heart of Liberty, New York is the most populous system in the Sirius sector.',
    '196767': 'Tomahawk system - industrial hub of the Liberty Coalition.',
    '196768': 'Magellan system - scientific research outpost.',
    '196769': 'Colorado system - agricultural frontier.',
    '196770': 'Nebraska system - mining and resource extraction.',
    '196778': 'Planet Manhattan - the jewel of Liberty, home to millions.',
    '196779': 'New Berlin - Kusari colony in the Bretonia space.',
};

// Helper function to get name from ID
function getNameFromID(id) {
    if (!id) return 'Unknown';
    const strId = String(id);
    return FREELANCER_IDS[strId] || null;
}

// Freelancer game data
const FALLBACK_GAME_SYSTEMS = {
    'li01': {
        name: 'New York',
        stations: [
            { nickname: 'ft_bush_station', name: 'Ft. Bush Station', x: 6173, z: -50515, faction: 'li_p_grp', archetype: 'smallstation1' },
            { nickname: 'west_point_outpost', name: 'West Point Outpost', x: -35488, z: 28321, faction: 'li_n_grp', archetype: 'outpost' },
            { nickname: 'detroit_depot', name: 'Detroit Depot', x: -92447, z: -12925, faction: 'co_vr_grp', archetype: 'depot' },
            { nickname: 'norfolk_station', name: 'USS Missouri (Norfolk)', x: 48523, z: 6690, faction: 'li_n_grp', archetype: 'l_dreadnought' },
            { nickname: 'freelancer_port', name: 'Freelancer Port', x: 25390, z: 74163, faction: 'fc_lr_grp', archetype: 'miningbase_badlands' }
        ],
        jumpgates: [
            { nickname: 'Li01_to_Li02', name: 'Gate to Tomahawk', x: -83176, z: 44831, dest_system: 'Li02', dest_gate: 'Li02_to_Li01' },
            { nickname: 'Li01_to_Li03', name: 'Gate to Magellan', x: -12831, z: -81511, dest_system: 'Li03', dest_gate: 'Li03_to_Li01' },
            { nickname: 'Li01_to_Li04', name: 'Gate to Colorado', x: 68666, z: 60396, dest_system: 'Li04', dest_gate: 'Li04_to_Li01' },
            { nickname: 'Li01_to_Li05', name: 'Gate to Nebraska', x: 80632, z: 12299, dest_system: 'Li05', dest_gate: 'Li05_to_Li01' },
            { nickname: 'Li01_to_BR05', name: 'Gate to Edinburgh', x: -120450, z: -52120, dest_system: 'BR05', dest_gate: 'BR05_to_Li01' }
        ],
        tradeLanes: [
            { rings: [{x: 3628, z: -52369}, {x: -70, z: -58894}, {x: -3768, z: -65419}, {x: -7466, z: -71944}, {x: -11163, z: -78469}] }
        ],
        asteroidfields: [
            { nickname: 'Zone_Li01_ice_debris', name: 'Ice Debris Field', x: -50000, z: -40000, size: 8000 },
            { nickname: 'Zone_Li01_trade_debris', name: 'Trade Lane Debris', x: 30000, z: -40000, size: 5000 }
        ],
        nebulae: [
            { nickname: 'Zone_Li01_cloud', name: 'New York Cloud', x: 60000, z: 20000, size: 15000 }
        ],
        planets: [
            { nickname: 'li01_sun_2000', name: 'New York Sun', x: 0, z: 0, archetype: 'sun_2000', size: 1000 },
            { nickname: 'li01_earthgrncld', name: 'Manhattan', x: -33270, z: -33039, archetype: 'planet_earthgrncld_4000', size: 400 },
            { nickname: 'li01_desored', name: 'Desor', x: 54080, z: -74878, archetype: 'planet_desored_1500', size: 150 },
            { nickname: 'li01_icemoon', name: 'New Berlin Moon', x: -12831, z: -81511, archetype: 'planet_icemoon_800', size: 80 }
        ]
    }
};
// Game State
const game = {
    canvas: null, ctx: null, width: 0, height: 0,
    running: false, lastTime: 0, gameTime: 0,
    loopErrorCount: 0,
    player: null, entities: [], npcs: [], npcFleets: [], projectiles: [], loot: [], effects: [],
    npcSpatialGrid: new Map(), npcSpatialCellSize: 3200,
    isDocked: false, showMap: false, showCursor: false,
    hasStarted: false,
    mouseX: 0, mouseY: 0, mouseDown: false, rightMouseDown: false,
    touchJoystickEnabled: false, joystickActive: false, joystickPointerId: null, joystickAngle: 0, joystickPower: 0,
    touchAfterburnerActive: false, touchFireActive: false,
    zoom: 1.0, minZoom: 0.15, maxZoom: 3.0,
    stars: [], starLayers: 3,
    selectedTarget: null,
    scannerTargetMap: new Map(),
    stars: [],
    approachTarget: null,
    dockTarget: null,
    dockLandingTarget: null,
    dockApproachVoicePlayed: false,
    commandMode: 'freeflight',
    obstacles: [],
    jumpTransition: null,
    jumpHoleCapture: null,
    jumpHoleCaptureCooldownUntil: 0,
    playerDeathPending: false,
    playerDeathTimer: null,
    shipImages: {},
    objectImages: {},
    systemWallpapers: {},
    planetTextures: {},
    sunTextures: {},
    saveLoaded: false,
    activeModId: 'vanilla-en',
    modData: null,
    activeSaveSlotId: '',
    saveSlotName: 'Pilot',
    saveNameEditing: false,
    suppressAutoSave: false,
    lastSavedAt: 0,
    lastAutoSaveAt: 0,
    autoSaveInterval: 5000,
        language: 'en',
    landedBase: null,
    lastLanding: null,
    interior: null,
    interiorKeys: {},
    landingDeck: 'launch',
    barSubDeck: 'news',
    activeRumor: null,
    mapZoom: 1,
    mapPanX: 0,
    mapPanY: 0,
    mapLastRenderedAt: 0,
    mapRenderInterval: 180,
    mapDragging: false,
    mapDragged: false,
    mapDragStartX: 0,
    mapDragStartY: 0,
    mapDragOriginX: 0,
    mapDragOriginY: 0,
    minMapZoom: 0.45,
    maxMapZoom: 8,
    universeZoom: 1,
    universePanX: 0,
    universePanY: 0,
    universeSector: 'all',
    universeDragging: false,
    universeDragged: false,
    universeDragStartX: 0,
    universeDragStartY: 0,
    universeDragOriginX: 0,
    universeDragOriginY: 0,
    minUniverseZoom: 0.55,
    maxUniverseZoom: 6,
    waypoint: null,
    equipmentDealerTab: 'equipment',
    tradeInfoCommodityId: '',
    activeMission: null,
    missionOffers: {},
    radioCooldowns: {},
    populationSpawnTimer: 0,
    stationLaunchTimer: 0,
    freeSpaceTrafficTimer: 0,
    ambientTradeSeededSystemId: '',
    audioContext: null,
    audioEnabled: false,
    audioBuffers: {},
    audioBufferLoads: {},
    audioBufferFailures: {},
    musicAudio: null,
    musicFadeAudio: null,
    musicFadeTimer: null,
    musicMode: 'space',
    musicStoppedByUser: false,
    currentMusicTrackPath: '',
    manualMusicTrackPath: '',
    lastEngineSoundAt: 0
};

const SAVE_KEY = 'freelancer2d.save.v1';
const SAVE_INDEX_KEY = 'freelancer2d.saveSlots.v1';
const ACTIVE_SAVE_SLOT_KEY = 'freelancer2d.activeSaveSlot.v1';
const ACTIVE_MOD_KEY = 'freelancer2d.activeMod.v1';
const START_MENU_SCREEN_KEY = 'freelancer2d.startMenuScreen.v1';
const SAVE_VERSION = 1;
const MAX_SAVE_SLOTS = 5;
const GAME_TITLE = 'Freelancer 2D - a 2d adventure';
const DATA_CACHE_VERSION = '2026-05-13-textured-icons-orientation';
const JUSTICE_FIRE_SOUND_PATH = 'assets/audio/justice-fire.wav';
const UNIVERSE_BACKGROUND_IMAGE_PATH = 'assets/universe-nebula-background.png';
const MUSIC_VOLUME = 0.315;
const MUSIC_CROSSFADE_MS = 1400;
const MUSIC_BACKGROUND_MUTED = true;
const CRUISE_DISRUPT_LOCKOUT_MS = 4200;
const CRUISE_DISRUPTOR_SOUND_PATH = 'assets/audio/cruise_disrupt.wav';
const VOICE_SOUND_PATHS = {
    dock: { en: 'assets/audio/EN-dock.mp3', de: 'assets/audio/DE-dock.mp3' },
    freeflight: { en: 'assets/audio/EN-free-flight.mp3', de: 'assets/audio/DE-free-flight.mp3' },
    goingTo: { en: 'assets/audio/EN-going-to.mp3', de: 'assets/audio/DE-going-to.mp3' },
    tradeRouteInitiated: { en: 'assets/audio/EN-trade-route-initiated.mp3', de: 'assets/audio/DE-trade-route-initiated.mp3' },
    allowedToDock: { en: 'assets/audio/EN-allowed-to-dock.mp3', de: 'assets/audio/DE-allowed-to-dock.mp3' },
    dockDisallowed: { en: 'assets/audio/EN-dock-disallowed.mp3', de: 'assets/audio/DE-dock-disallowed.mp3' },
    dockDisallowedTooFar: { en: 'assets/audio/EN-dock-disallowed-toofar.mp3', de: 'assets/audio/DE-dock-disallowed-toofar.mp3' },
    launch: { en: 'assets/audio/EN-launch.mp3', de: 'assets/audio/DE-launch.mp3' },
    shipPurchase: { en: 'assets/audio/EN-ship-purchase.mp3', de: 'assets/audio/DE-ship-purchase.mp3' },
    atmosphere: { en: 'assets/audio/EN-atmosphere.mp3', de: 'assets/audio/DE-atmosphere.mp3' },
    radioDamage: { en: 'assets/audio/EN-radio-damage.mp3', de: 'assets/audio/DE-radio-damage.mp3' },
    repairComplete: { en: 'assets/audio/EN-repair-complete.mp3', de: 'assets/audio/DE-repair-complete.mp3' },
    hullBreach: { en: 'assets/audio/EN-hull-breach.mp3', de: 'assets/audio/DE-hull-breach.mp3' }
};
const MUSIC_TRACKS = {
    space: [
        { name: 'Deep Space', path: 'assets/music/space/SPACE-Deep-Space.mp3' },
        { name: 'DeepSpace 2', path: 'assets/music/space/SPACE-DeepSpace2.mp3' },
        { name: 'DeepSpace 5.1', path: 'assets/music/space/SPACE-DeepSpace5.1.mp3' },
        { name: 'DeepSpace 5.2', path: 'assets/music/space/SPACE-DeepSpace5.2.mp3' },
        { name: 'Orbital Drift', path: 'assets/music/space/SPACE-Orbital-Drift.mp3' }
    ],
    fight: [
        { name: 'Fight 1', path: 'assets/music/fight/FIGHT-music1.mp3' }
    ]
};
const ENABLE_CROSSFIRE_MOD = true;
const VANILLA_DE_MOD_ID = 'vanilla-de';
const MODS = [
    { id: VANILLA_DE_MOD_ID, name: 'Vanilla DE', dataPath: 'data/vanilla-de/mod_data.js' },
    { id: 'vanilla-en', name: 'Vanilla EN', dataPath: 'data/vanilla-en/mod_data.js' },
    ...(ENABLE_CROSSFIRE_MOD ? [{ id: 'crossfire', name: 'Crossfire', dataPath: 'data/crossfire/mod_data.js' }] : [])
];
const I18N = {
    de: {
        freeflight: 'FREIFLUG', approach: 'ANFLIEGEN', dock: 'ANDOCKEN', cruise: 'REISEFLUG', menu: 'MENÜ', map: 'KARTE', inventory: 'INVENTAR', reputation: 'RUF', info: 'INFO', shipShop: 'SCHIFFHÄNDLER', universe: 'UNIVERSUM',
        launch: 'Starten', launchDeck: 'Launch Deck', bar: 'Bar', equipmentDealer: 'Equipment Dealer', tradeDealer: 'Trade Dealer', shipDealer: 'Ship Dealer', missions: 'Missionen',
        landedAt: 'Gelandet auf', noCommodityMarket: 'Dieser Ort hat keinen Commodity-Markt.', noEquipment: 'Equipment-Handel ist noch nicht implementiert.', barText: 'Piloten, Gerüchte und Jobangebote folgen später.',
        buy: 'KAUFEN', sell: 'VERKAUFEN', owned: 'BESITZ', credits: 'Credits', cargo: 'Laderaum', price: 'Preis', stock: 'Bestand', commodity: 'Ware', quantity: 'Menge', tradeInfo: 'Trade-Informationen', tradeInfoHint: 'Ware anklicken, um Verkaufsziele zu sehen.', sellAt: 'Verkaufen bei', jumps: 'Spruenge', profit: 'Profit', noSellTargets: 'Keine Verkaufsziele fuer diese Ware gefunden.', unreachable: 'nicht erreichbar',
        shipDealerDockOnly: 'Schiffe koennen nur nach dem Andocken gekauft werden.', noShipsSold: 'Hier werden keine Schiffe verkauft.', atmosphereWarning: 'Atmosphaereneintritt', planetImpact: 'Planetare Kollision',
        startGame: 'SPIEL STARTEN', continueGame: 'WEITER', startNew: 'NEUES SPIEL', startDelete: 'SAVE LOESCHEN', saveNamePlaceholder: 'Name fuer neues Savegame', mainMenuLanguage: 'SPRACHE', editSaveName: 'EDIT', saveSaveName: 'SAVE',
        startControls: 'Steuerung', controlRotate: 'Linke Maustaste halten - Schiff drehen', controlCursor: 'Linke Maustaste loslassen - Cursor-Modus', controlFire: 'Rechte Maustaste - Primärwaffen | Q - Raketen',
        controlSelect: 'Objekt anklicken - Ziel auswählen', controlThrottleUp: 'W - Schub erhöhen', controlThrottleDown: 'S - Schub verringern / Reiseflug abbrechen', controlReverse: 'X - Rückwärtsschub', controlAfterburner: 'Tab - Nachbrenner halten', controlMines: 'E - Mine abwerfen',
        controlDock: 'D - Schiff driftet nach rechts', controlApproach: 'A - Schiff driftet nach links', controlMap: 'M - Karte umschalten', controlNanobots: 'G / N - Nanobot benutzen', controlBatteries: 'F / B - Schildbatterie benutzen', controlCountermeasures: 'C - Gegenmaßnahme abwerfen', controlZoom: 'Mausrad - Zoom',
        noSaveForMod: 'Kein Savegame fuer diesen Mod vorhanden', separateSaves: 'Vanilla DE, Vanilla EN und Crossfire haben getrennte Spielstaende',
        noSavedGameFound: 'Kein gespeicherter Spielstand gefunden.', savegameLabel: 'Spielstand', activeLabel: 'AKTIV', loadLabel: 'LADEN', unknownDate: 'unbekannt',
        maxSavesReached: 'Maximal 5 Savegames. Bitte zuerst einen Spielstand loeschen.', deleteSaveConfirm: 'Savegame "{name}" loeschen?', modDataMissing: '{mod}-Daten nicht gefunden. Starte mit Vanilla DE.',
        hudHull: 'HÜLLE', hudShield: 'SCHILD', hudEnergy: 'ENERGIE', hudThrust: 'SCHUB', uiSystem: 'System', uiSpeed: 'Geschwindigkeit', uiZoom: 'Zoom', uiTime: 'Uhrzeit', uiMode: 'Modus', loadoutTitle: 'WAFFEN', scannerTitle: 'SCANNER', labelNanobots: 'Nanobots', labelShieldBatteries: 'Schildbatterien',
        ammoTab: 'Ammo', missileAmmo: 'Raketen', mines: 'Minen', countermeasures: 'Gegenmaßnahmen', countermeasureAmmoCount: 'Gegenmaßnahmen: {count}', countermeasureDropped: 'Gegenmaßnahme abgeworfen.', countermeasureAmmoEmpty: 'Keine Gegenmaßnahmen uebrig.', countermeasureDropperMissing: 'Kein Gegenmaßnahmen-Werfer montiert.', countermeasureDropLocked: 'Gegenmaßnahmen nicht beim Andocken, in Tradelanes oder Sprüngen nutzbar.', countermeasureAutoOn: 'AUTO AN', countermeasureAutoOff: 'AUTO AUS', missileIncoming: 'Rakete im Anflug!', mineAmmoCount: 'Minen: {count}/{max}', mineDropped: 'Mine abgeworfen.', mineAmmoEmpty: 'Keine Minen uebrig.', mineAmmoFull: 'Minenlager voll.', mineDropperMissing: 'Kein Minenwerfer montiert.', mineDropLocked: 'Minen nur bei Kampfgeschwindigkeit bis 80 m/s, nicht in Cruise, Tradelane oder Sprung.', ammoFull: 'Raketenlager voll.', ammoMissing: 'Keine Raketen-Munition.', missileAmmoCount: 'Raketen: {count}/{max}',
        selected: 'Ausgewählt', distance: 'Distanz', clearSelection: '[-] Ziel/WP', selectionCleared: 'Zielauswahl geloescht.', waypointFromSelection: 'WP AUS AUSWAHL', noWaypointSelection: 'Kein geeignetes Objekt ausgewaehlt.', clearWaypoint: 'Wegpunkt loeschen', modeRotate: 'DREHMODUS', modeCruiseCharge: 'REISEFLUG LÄDT', modeCruise: 'REISEFLUG', modeAfterburner: 'NACHBRENNER',
        scannerNone: 'Keine Schiffe oder Stationen in Reichweite.', scanNoTarget: 'Kein NPC-Ziel ausgewählt.', scanOutOfRange: 'Ziel außerhalb der Scannerreichweite.', scanResultTitle: 'Scan-Ergebnis', noWeaponSlots: 'Keine Waffen-Slots vorhanden.', emptyWeapon: 'Leer', noGunMounted: 'Keine Waffe montiert',
        scannerShip: 'Schiff', scannerPlanet: 'Planet', scannerJumpGate: 'Sprungtor', scannerJumpHole: 'Sprungloch', scannerTradeLane: 'Tradelane', scannerStation: 'Station', scannerWaypoint: 'Wegpunkt', scannerObject: 'Objekt', weaponSlot: 'Waffe',
        repChanged: 'Ruf geändert', repHostile: 'FEINDLICH', repFriendly: 'FREUNDLICH', repNeutral: 'NEUTRAL', noReputationData: 'Keine Rufdaten geladen.',
        missionEliminate: 'Eliminiere feindliche Kontakte in {zone}.', missionTransport: 'Liefere versiegelte Fracht nach {target}.', missionPatrol: 'Pruefe drei Navigationspunkte bei {zone}.', missionEscort: 'Eskortiere einen Frachter sicher nach {target}.', missionWaypointLocked: 'Mission aktiv: Wegpunkt bleibt auf dem Missionsziel.', missionFreeWaypointsLocked: 'Mission aktiv: Freie Wegpunkte sind gesperrt.',
        missionAccepted: 'Mission angenommen', missionComplete: 'Mission abgeschlossen', missionFailed: 'Mission fehlgeschlagen', missionCargoNoSpace: 'Nicht genug freier Laderaum fuer die Missionsfracht.', missionCheckpoint: 'Patrouillenpunkt {current}/{total} erreicht.', missionEscortContact: 'Eskortkonvoi gestartet. Feindliche Kontakte moeglich.', missionTypeCombat: 'KAMPF', missionTypeTransport: 'TRANSPORT', missionTypePatrol: 'PATROUILLE', missionTypeEscort: 'ESKORTE',
        saveStored: 'Spielstand gespeichert', saveStoreFailed: 'Spielstand konnte nicht gespeichert werden', cruiseDisabled: 'Reiseflug deaktiviert', cruiseCharging: 'Reiseflug lädt: {seconds} Sekunden', cruiseEnabled: 'Reiseflug aktiviert',
        cruiseDisrupted: 'Reiseflug unterbrochen!', cruiseDisruptorLock: 'Reiseflugtriebwerk gestoert: {seconds}s',
        dockingDeniedHostile: 'Andocken verweigert: {faction} ist feindlich.', noShieldInstalled: 'Kein Schild installiert.', missionContactHostile: 'Mission contact: {count} feindliche Schiffe erfasst.',
        noBarNpcs: 'Keine NPCs in dieser Bar.', noDestroyMission: 'Keine Missionsangebote in diesem System gefunden.', gameLoaded: 'Spielstand geladen: {system}, pilot!', welcomePilot: 'Willkommen in {system}, Pilot!',
        playerDead: 'Du bist tot!', restart: 'Neustart'
    },
    en: {
        freeflight: 'FREEFLIGHT', approach: 'APPROACH', dock: 'DOCK', cruise: 'CRUISE', menu: 'MENU', map: 'MAP', inventory: 'INVENTORY', reputation: 'REP', info: 'INFO', shipShop: 'SHIP DEALER', universe: 'UNIVERSE',
        launch: 'Launch', launchDeck: 'Launch Deck', bar: 'Bar', equipmentDealer: 'Equipment Dealer', tradeDealer: 'Trade Dealer', shipDealer: 'Ship Dealer', missions: 'Missions',
        landedAt: 'Landed at', noCommodityMarket: 'This location has no commodity market.', noEquipment: 'Equipment trading is not implemented yet.', barText: 'Pilots, rumors, and job offers will arrive later.',
        buy: 'BUY', sell: 'SELL', owned: 'OWNED', credits: 'Credits', cargo: 'Cargo', price: 'Price', stock: 'Stock', commodity: 'Commodity', quantity: 'Qty', tradeInfo: 'Trade Information', tradeInfoHint: 'Click a commodity to see sell destinations.', sellAt: 'Sell at', jumps: 'Jumps', profit: 'Profit', noSellTargets: 'No sell destinations found for this commodity.', unreachable: 'unreachable',
        shipDealerDockOnly: 'Ships can only be bought while docked.', noShipsSold: 'No ships are sold here.', atmosphereWarning: 'Atmosphere entry', planetImpact: 'Planetary collision',
        startGame: 'START GAME', continueGame: 'CONTINUE', startNew: 'NEW GAME', startDelete: 'DELETE SAVE', saveNamePlaceholder: 'Name for new savegame', mainMenuLanguage: 'LANGUAGE', editSaveName: 'EDIT', saveSaveName: 'SAVE',
        startControls: 'Controls', controlRotate: 'Left Mouse (hold) - Rotate ship', controlCursor: 'Left Mouse (release) - Cursor mode', controlFire: 'Right Mouse - Primary fire | Q - Missiles',
        controlSelect: 'Click object - Select target', controlThrottleUp: 'W - Increase throttle', controlThrottleDown: 'S - Reduce throttle / cancel cruise', controlReverse: 'X - Reverse thrust', controlAfterburner: 'Tab - Hold afterburner', controlMines: 'E - Drop mine',
        controlDock: 'D - Drift ship right', controlApproach: 'A - Drift ship left', controlMap: 'M - Toggle map', controlNanobots: 'G / N - Use nanobot', controlBatteries: 'F / B - Use shield battery', controlCountermeasures: 'C - Drop countermeasure', controlZoom: 'Mouse Wheel - Zoom',
        noSaveForMod: 'No savegame exists for this mod yet', separateSaves: 'Vanilla DE, Vanilla EN, and Crossfire use separate save slots',
        noSavedGameFound: 'No saved game found.', savegameLabel: 'Savegame', activeLabel: 'ACTIVE', loadLabel: 'LOAD', unknownDate: 'unknown',
        maxSavesReached: 'Maximum of 5 savegames. Delete one first.', deleteSaveConfirm: 'Delete savegame "{name}"?', modDataMissing: '{mod} data not found. Starting with Vanilla DE.',
        hudHull: 'HULL', hudShield: 'SHIELD', hudEnergy: 'ENERGY', hudThrust: 'THRUST', uiSystem: 'System', uiSpeed: 'Speed', uiZoom: 'Zoom', uiTime: 'Time', uiMode: 'Mode', loadoutTitle: 'WEAPONS', scannerTitle: 'SCANNER', labelNanobots: 'Nanobots', labelShieldBatteries: 'Shield Batteries',
        ammoTab: 'Ammo', missileAmmo: 'Missiles', mines: 'Mines', countermeasures: 'Countermeasures', countermeasureAmmoCount: 'Countermeasures: {count}', countermeasureDropped: 'Countermeasure dropped.', countermeasureAmmoEmpty: 'No countermeasures left.', countermeasureDropperMissing: 'No countermeasure dropper mounted.', countermeasureDropLocked: 'Countermeasures cannot be used while docked, in trade lanes, or during jumps.', countermeasureAutoOn: 'AUTO ON', countermeasureAutoOff: 'AUTO OFF', missileIncoming: 'Incoming missile!', mineAmmoCount: 'Mines: {count}/{max}', mineDropped: 'Mine dropped.', mineAmmoEmpty: 'No mines left.', mineAmmoFull: 'Mine bay full.', mineDropperMissing: 'No mine dropper mounted.', mineDropLocked: 'Mines only at combat speed up to 80 m/s, not in cruise, trade lane, or jump.', ammoFull: 'Missile bay full.', ammoMissing: 'No missile ammo.', missileAmmoCount: 'Missiles: {count}/{max}',
        selected: 'Selected', distance: 'Distance', clearSelection: '[-] Clear', selectionCleared: 'Selection cleared.', waypointFromSelection: 'WP FROM SELECTION', noWaypointSelection: 'No suitable object selected.', clearWaypoint: 'Clear waypoint', modeRotate: 'ROTATE MODE', modeCruiseCharge: 'CRUISE CHARGE', modeCruise: 'CRUISE', modeAfterburner: 'AFTERBURNER',
        scannerNone: 'No ships or stations in range.', scanNoTarget: 'No NPC target selected.', scanOutOfRange: 'Target outside scanner range.', scanResultTitle: 'Scan Result', noWeaponSlots: 'No weapon slots available.', emptyWeapon: 'Empty', noGunMounted: 'No weapon mounted',
        scannerShip: 'Ship', scannerPlanet: 'Planet', scannerJumpGate: 'Jump Gate', scannerJumpHole: 'Jump Hole', scannerTradeLane: 'Trade Lane', scannerStation: 'Station', scannerWaypoint: 'Waypoint', scannerObject: 'Object', weaponSlot: 'Weapon',
        repChanged: 'Reputation changed', repHostile: 'HOSTILE', repFriendly: 'FRIENDLY', repNeutral: 'NEUTRAL', noReputationData: 'No reputation data loaded.',
        missionEliminate: 'Eliminate hostile contacts in {zone}.', missionTransport: 'Deliver sealed cargo to {target}.', missionPatrol: 'Sweep three navigation checkpoints near {zone}.', missionEscort: 'Escort a freighter safely to {target}.', missionWaypointLocked: 'Mission active: waypoint remains on the mission target.', missionFreeWaypointsLocked: 'Mission active: free waypoints are locked.',
        missionAccepted: 'Mission accepted', missionComplete: 'Mission complete', missionFailed: 'Mission failed', missionCargoNoSpace: 'Not enough free cargo space for the mission shipment.', missionCheckpoint: 'Patrol checkpoint {current}/{total} reached.', missionEscortContact: 'Escort convoy launched. Hostile contacts may intercept.', missionTypeCombat: 'COMBAT', missionTypeTransport: 'TRANSPORT', missionTypePatrol: 'PATROL', missionTypeEscort: 'ESCORT',
        saveStored: 'Game saved', saveStoreFailed: 'Could not save game', cruiseDisabled: 'Cruise disabled', cruiseCharging: 'Cruise charging: {seconds} seconds', cruiseEnabled: 'Cruise enabled',
        cruiseDisrupted: 'Cruise disrupted!', cruiseDisruptorLock: 'Cruise engine disrupted: {seconds}s',
        dockingDeniedHostile: 'Docking denied: {faction} is hostile.', noShieldInstalled: 'No shield installed.', missionContactHostile: 'Mission contact: {count} hostile ships detected.',
        noBarNpcs: 'No NPCs in this bar.', noDestroyMission: 'No mission offers found in this system.', gameLoaded: 'Savegame loaded: {system}, pilot!', welcomePilot: 'Welcome to {system}, pilot!',
        playerDead: 'You are dead!', restart: 'Restart'
    }
};

function t(key) {
    return I18N[game.language]?.[key] || I18N.en[key] || key;
}

function tf(key, values = {}) {
    let text = t(key);
    for (const [name, value] of Object.entries(values)) {
        text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
}

function updateDocumentTitle() {
    document.title = GAME_TITLE + ' - ' + activeModConfig().name + ' - ' + (systemData?.name || currentSystemId);
}

function cargoUnits() {
    return (game.player?.cargo || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function findCargoItem(id) {
    return (game.player?.cargo || []).find(item => item.id === id) || null;
}

function dataSet(name, fallback) {
    return game.modData?.[name] || fallback;
}

function universeSectorsData() {
    return dataSet('UNIVERSE_SECTORS', typeof UNIVERSE_SECTORS !== 'undefined' ? UNIVERSE_SECTORS : []);
}

function gameSystemsData() {
    return dataSet('GAME_SYSTEMS', typeof GAME_SYSTEMS !== 'undefined' ? GAME_SYSTEMS : FALLBACK_GAME_SYSTEMS) || FALLBACK_GAME_SYSTEMS;
}

function shipsData() { return dataSet('FL_SHIPS', typeof FL_SHIPS !== 'undefined' ? FL_SHIPS : {}); }
function shipPackagesData() { return dataSet('FL_SHIP_PACKAGES', typeof FL_SHIP_PACKAGES !== 'undefined' ? FL_SHIP_PACKAGES : {}); }
function shipMarketsData() { return dataSet('FL_BASE_SHIP_MARKETS', typeof FL_BASE_SHIP_MARKETS !== 'undefined' ? FL_BASE_SHIP_MARKETS : {}); }
function commoditiesData() { return dataSet('FL_COMMODITIES', typeof FL_COMMODITIES !== 'undefined' ? FL_COMMODITIES : {}); }
function commodityMarketsData() { return dataSet('FL_BASE_COMMODITY_MARKETS', typeof FL_BASE_COMMODITY_MARKETS !== 'undefined' ? FL_BASE_COMMODITY_MARKETS : {}); }
function equipmentData() { return dataSet('FL_EQUIPMENT', typeof FL_EQUIPMENT !== 'undefined' ? FL_EQUIPMENT : {}); }
function equipmentMarketsData() { return dataSet('FL_BASE_EQUIPMENT_MARKETS', typeof FL_BASE_EQUIPMENT_MARKETS !== 'undefined' ? FL_BASE_EQUIPMENT_MARKETS : {}); }
function npcShipsData() { return dataSet('FL_NPC_SHIPS', typeof FL_NPC_SHIPS !== 'undefined' ? FL_NPC_SHIPS : []); }
function npcLoadoutsData() { return dataSet('FL_NPC_LOADOUTS', typeof FL_NPC_LOADOUTS !== 'undefined' ? FL_NPC_LOADOUTS : {}); }
function barData() { return dataSet('FL_BASE_BAR_DATA', typeof FL_BASE_BAR_DATA !== 'undefined' ? FL_BASE_BAR_DATA : {}); }
function reputationData() { return dataSet('FL_REPUTATION', typeof FL_REPUTATION !== 'undefined' ? FL_REPUTATION : {}); }
function objectIconsData() { return dataSet('FL_OBJECT_ICONS', typeof FL_OBJECT_ICONS !== 'undefined' ? FL_OBJECT_ICONS : {}); }

function getCommodity(id) {
    return commoditiesData()[String(id || '').toLowerCase()] || null;
}

function getEquipment(id) {
    return equipmentData()[String(id || '').toLowerCase()] || null;
}

function findEquipmentItem(id) {
    return (game.player?.equipmentInventory || []).find(item => item.id === id) || null;
}

function currentShipRecord() {
    if (!game.player?.shipId) return null;
    return shipsData()[String(game.player.shipId).toLowerCase()] || null;
}

function parseShipWeaponSlots(ship) {
    const counts = parseShipMountCounts(ship);
    if (counts.total) return counts.total;
    return clamp(Number(ship?.firePower || game.player?.firePower || 1), 0, 8);
}

function parseShipMountCounts(ship) {
    const info = String(ship?.info || '');
    const match = info.match(/(?:Geschuetz|Geschütz)-\/Turmsockel:\s*(\d+)\s*\/\s*(\d+)/i);
    if (match) {
        const guns = clamp(Number(match[1]) || 0, 0, 8);
        const turrets = clamp(Number(match[2]) || 0, 0, 8);
        return { guns, turrets, total: clamp(guns + turrets, 0, 8) };
    }
    const singleMatch = info.match(/(?:Geschuetz|Geschütz|Gun)(?:-|\/|-\/| )?(?:Turmsockel|Turret hardpoints?|mounts?)?:\s*(\d+)/i);
    if (singleMatch) {
        const guns = clamp(Number(singleMatch[1]) || 0, 0, 8);
        return { guns, turrets: 0, total: guns };
    }
    const fallback = clamp(Number(ship?.firePower || game.player?.firePower || 1), 0, 8);
    return { guns: fallback, turrets: 0, total: fallback };
}

function getWeaponSlotCount() {
    return clamp(Number(game.player?.weaponSlots || parseShipWeaponSlots(currentShipRecord()) || 1), 0, 8);
}

function getWeaponSlotKeys() {
    return Array.from({ length: getWeaponSlotCount() }, (_, index) => 'weapon' + (index + 1));
}

function currentShipPackage() {
    return game.player?.shipPackageId ? getShipPackage(game.player.shipPackageId) : null;
}

function parseMaxEquipmentClass(source, fallback = 1) {
    const values = [
        source?.maxWeaponClass,
        source?.weaponClassMax,
        source?.maxEquipmentClass,
        source?.stats?.maxWeaponClass,
        source?.stats?.weaponClassMax
    ].map(Number).filter(Number.isFinite);
    if (values.length) return clamp(Math.max(...values), 1, 10);
    const text = String(source?.info || '');
    const patterns = [
        /Max\.?\s*Waffenklasse:\s*(\d+)/i,
        /Max\.?\s*Weapon\s*Class:\s*(\d+)/i,
        /Maximum\s*Weapon\s*Class:\s*(\d+)/i
    ];
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return clamp(Number(match[1]) || fallback, 1, 10);
    }
    return clamp(Number(fallback) || 1, 1, 10);
}

function equipmentClass(item) {
    const explicit = Number(item?.class ?? item?.equipmentClass ?? item?.weaponClass ?? item?.shieldClass);
    if (Number.isFinite(explicit) && explicit > 0) return clamp(explicit, 1, 10);
    const text = `${item?.id || ''} ${item?.name || ''} ${item?.info || ''}`.toLowerCase();
    const markMatch = text.match(/(?:mark|mk|klasse|class)[_\\s.-]*0?(10|[1-9])/i);
    if (markMatch) return clamp(Number(markMatch[1]) || 1, 1, 10);
    const price = Number(item?.price || 0);
    if (item?.category === 'weapon' || item?.category === 'turret' || item?.category === 'missile' || item?.category === 'shield') {
        if (price >= 70000) return 10;
        if (price >= 50000) return 9;
        if (price >= 35000) return 8;
        if (price >= 22000) return 7;
        if (price >= 13000) return 6;
        if (price >= 8000) return 5;
        if (price >= 4000) return 4;
        if (price >= 1800) return 3;
        if (price >= 900) return 2;
    }
    return 1;
}

function equipmentMountType(item) {
    const id = String(item?.id || item?.equipmentId || '').toLowerCase();
    const name = String(item?.name || '').toLowerCase();
    const category = String(item?.category || '').toLowerCase();
    if (category === 'mine' && item?.combinable) return 'mine ammo';
    if (category === 'countermeasure' && item?.combinable) return 'countermeasure ammo';
    if (category === 'weapon') return 'weapon';
    if (category === 'turret') return 'turret';
    if (category === 'shield') return 'shield';
    if (category === 'thruster') return 'thruster';
    if (category === 'engine') return 'engine';
    if (category === 'powerplant') return 'powerplant';
    if (category === 'scanner') return 'scanner';
    if (category === 'tractor') return 'tractor';
    if (category === 'mine') return 'mine';
    if (category === 'countermeasure') return 'countermeasure';
    if (category === 'missile') {
        if (id.includes('torpedo') || name.includes('torpedo')) return 'torpedo';
        if (id.includes('disruptor') || name.includes('disruptor') || name.includes('reiseflug')) return 'cruise_disruptor';
        return 'missile';
    }
    return category || 'equipment';
}

function shipShieldFamily() {
    const shipId = String(game.player?.shipId || '').toLowerCase();
    const packageId = String(game.player?.shipPackageId || '').toLowerCase();
    const type = String(currentShipPackage()?.type || currentShipRecord()?.type || '').toUpperCase();
    if (type.includes('FREIGHTER') || shipId.includes('freighter') || packageId.endsWith('fr_package')) return 'fr';
    if (shipId.includes('elite') || /(^|_)[a-z]*e\d?_package$/.test(packageId) || parseMaxEquipmentClass(currentShipPackage() || currentShipRecord(), 1) >= 6) return 'hf';
    return 'lf';
}

function shieldFamily(item) {
    const text = `${item?.id || ''} ${item?.name || ''} ${item?.info || ''}`.toLowerCase();
    if (/(^|_)fr($|_)|freighter|frachter/.test(text)) return 'fr';
    if (/(^|_)hf($|_)|heavy fighter|schwerer|schwere-jäger|s\. j\./.test(text)) return 'hf';
    if (/(^|_)lf($|_)|light fighter|leichter|leichte-jäger|l\. j\./.test(text)) return 'lf';
    return '';
}

function slotSpec(slot) {
    const maxClass = parseMaxEquipmentClass(currentShipPackage() || currentShipRecord(), game.player?.weaponClassMax || game.player?.firePower || 1);
    if (slot.startsWith('weapon')) {
        const index = Math.max(1, Number(slot.replace('weapon', '')) || 1);
        const counts = parseShipMountCounts(currentShipRecord());
        const isTurretSlot = index > Math.max(0, counts.guns || 0);
        return {
            type: isTurretSlot ? 'turret' : 'weapon',
            accepts: isTurretSlot ? ['turret'] : ['weapon', 'missile', 'torpedo', 'cruise_disruptor'],
            maxClass
        };
    }
    if (slot === 'shield') return { type: 'shield', accepts: ['shield'], maxClass, shieldFamily: shipShieldFamily() };
    if (slot === 'thruster') return { type: 'thruster', accepts: ['thruster'] };
    if (slot === 'engine') return { type: 'engine', accepts: ['engine'] };
    if (slot === 'powerplant') return { type: 'powerplant', accepts: ['powerplant'] };
    if (slot === 'scanner') return { type: 'scanner', accepts: ['scanner'] };
    if (slot === 'tractor') return { type: 'tractor', accepts: ['tractor'] };
    if (slot === 'mine') return { type: 'mine', accepts: ['mine'] };
    if (slot === 'countermeasure') return { type: 'countermeasure', accepts: ['countermeasure'] };
    return { type: slot, accepts: [slot] };
}

function equipmentCompatibility(item, slot = '') {
    if (!item) return { ok: false, reason: 'Item missing.' };
    const mountType = equipmentMountType(item);
    const candidateSlots = slot ? [slot] : categorySlotKeys(item.category);
    for (const candidate of candidateSlots) {
        const spec = slotSpec(candidate);
        if (!spec.accepts.includes(mountType)) continue;
        if (Number.isFinite(spec.maxClass) && equipmentClass(item) > spec.maxClass) {
            return { ok: false, reason: `Class ${equipmentClass(item)} does not fit ${equipmentSlotLabel(candidate)}.` };
        }
        if (mountType === 'shield') {
            const itemFamily = shieldFamily(item);
            if (itemFamily && spec.shieldFamily && itemFamily !== spec.shieldFamily) {
                const labels = { lf: 'Light Fighter', hf: 'Heavy Fighter', fr: 'Freighter' };
                return { ok: false, reason: `${labels[itemFamily] || itemFamily} shield does not fit this ${labels[spec.shieldFamily] || spec.shieldFamily} ship.` };
            }
        }
        return { ok: true, slot: candidate };
    }
    return { ok: false, reason: `${mountType} cannot be mounted on this ship.` };
}

function normalizeFactionId(faction) {
    return String(faction || '').trim().toLowerCase();
}

function getFactionReputation(sourceFaction, targetFaction) {
    const source = normalizeFactionId(sourceFaction);
    const target = normalizeFactionId(targetFaction);
    if (!source || !target) return 0;
    if (source === target) return 1;
    const relationships = reputationData().relationships || {};
    const sourceReps = relationships[source] || relationships[sourceFaction] || {};
    const value = sourceReps[target] ?? sourceReps[targetFaction];
    return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function getPlayerReputation(faction) {
    const id = normalizeFactionId(faction);
    if (!id || !game.player) return 0;
    if (!game.player.reputations) initializePlayerReputations();
    return Number(game.player.reputations?.[id] ?? 0);
}

function setPlayerReputation(faction, value) {
    const id = normalizeFactionId(faction);
    if (!id || !game.player) return;
    if (!game.player.reputations) game.player.reputations = {};
    game.player.reputations[id] = clamp(Number(value) || 0, -1, 1);
}

function reputationStatus(value) {
    return Freelancer2DLogic.reputationStatus(value);
}

function factionDisplayName(faction) {
    const id = normalizeFactionId(faction);
    const factionData = reputationData().factions?.[id];
    return factionData?.name || factionData?.shortName || getNameFromID(factionData?.idsName || factionData?.idsShortName) || id || 'Unknown';
}

function reputationColor(value) {
    const status = reputationStatus(value);
    if (status === 'hostile') return '#ff6666';
    if (status === 'friendly') return '#66ff99';
    return '#d8e8ef';
}

function factionsAreHostile(sourceFaction, targetFaction) {
    return reputationStatus(getFactionReputation(sourceFaction, targetFaction)) === 'hostile';
}

function playerIsHostileToFaction(faction) {
    return reputationStatus(getPlayerReputation(faction)) === 'hostile';
}

function initializePlayerReputations(sourceFaction = null) {
    if (!game.player) return;
    const data = reputationData();
    const factionId = normalizeFactionId(sourceFaction || game.player.faction || data.initialPlayerFaction || 'li_n_grp');
    game.player.faction = factionId;
    game.player.reputations = { ...(data.relationships?.[factionId] || {}) };
    game.player.reputations[factionId] = 1;
}

function applyReputationForKill(victimFaction) {
    const factionId = normalizeFactionId(victimFaction);
    if (!factionId || !game.player) return;
    if (!game.player.reputations) initializePlayerReputations();
    const empathy = reputationData().empathy?.[factionId];
    const baseDelta = Number(empathy?.events?.object_destruction ?? -0.03);
    setPlayerReputation(factionId, getPlayerReputation(factionId) + baseDelta);
    for (const [targetFaction, rate] of Object.entries(empathy?.empathyRates || {})) {
        const targetId = normalizeFactionId(targetFaction);
        if (!targetId || targetId === factionId) continue;
        setPlayerReputation(targetId, getPlayerReputation(targetId) + baseDelta * (Number(rate) || 0));
    }
    addLog(t('repChanged') + ': ' + factionId + ' ' + getPlayerReputation(factionId).toFixed(2));
    const reputationOverlay = document.getElementById('reputation-overlay');
    if (reputationOverlay && !reputationOverlay.classList.contains('hidden')) renderReputationPanel();
}

function renderReputationPanel() {
    const content = document.getElementById('reputation-content');
    if (!content || !game.player) return;
    if (!game.player.reputations) initializePlayerReputations();
    const factions = Object.values(reputationData().factions || {});
    const rows = factions.map(faction => {
        const id = normalizeFactionId(faction.id);
        return { id, name: factionDisplayName(id), value: getPlayerReputation(id) };
    }).sort((a, b) => a.value - b.value || a.name.localeCompare(b.name));
    content.innerHTML = rows.map(row => {
        const status = reputationStatus(row.value);
        const statusText = status === 'hostile' ? t('repHostile') : status === 'friendly' ? t('repFriendly') : t('repNeutral');
        return `<div class="reputation-row reputation-${status}"><div><strong style="color:${reputationColor(row.value)};">${escapeHtml(row.name)}</strong><br><span style="color:#7f9bad;">${escapeHtml(row.id)}</span></div><div class="reputation-value" style="color:${reputationColor(row.value)};">${row.value.toFixed(2)}</div><input type="range" min="-1" max="1" step="0.01" value="${row.value.toFixed(2)}" disabled title="${statusText}"></div>`;
    }).join('') || `<div style="color:#ffaa00;">${escapeHtml(t('noReputationData'))}</div>`;
}

function toggleReputationPanel(force = null) {
    const overlay = document.getElementById('reputation-overlay');
    if (!overlay) return;
    const show = force === null ? overlay.classList.contains('hidden') : !!force;
    overlay.classList.toggle('hidden', !show);
    if (show) renderReputationPanel();
    playSound('ui', 0.35);
}

function loadoutWeaponStats(loadoutId, fallbackDifficulty = 3) {
    const loadout = npcLoadoutsData()[String(loadoutId || '').toLowerCase()] || null;
    return (loadout?.weapons || [])
        .map(entry => getEquipment(entry.id))
        .filter(item => item && (item.category === 'weapon' || item.category === 'turret'))
        .map(item => weaponStatsFromEquipment(item, fallbackDifficulty));
}

function targetFaction(target) {
    return normalizeFactionId(target?.faction || target?.reputation || '');
}

function canPlayerDockWithTarget(target) {
    if (!target) return false;
    const faction = targetFaction(target);
    const isBaseLike = target instanceof Station || target instanceof PlanetLocation || isDockingRingTarget(target);
    if (isBaseLike && faction && playerIsHostileToFaction(faction)) return false;
    return true;
}

function categorySlotKeys(category) {
    const normalized = String(category || '').toLowerCase();
    if (normalized === 'weapon' || normalized === 'turret' || normalized === 'missile') return getWeaponSlotKeys();
    if (normalized === 'shield') return ['shield'];
    if (normalized === 'thruster') return ['thruster'];
    if (normalized === 'engine') return ['engine'];
    if (normalized === 'powerplant') return ['powerplant'];
    if (normalized === 'scanner') return ['scanner'];
    if (normalized === 'tractor') return ['tractor'];
    if (normalized === 'mine') return ['mine'];
    if (normalized === 'countermeasure') return ['countermeasure'];
    return [];
}

function firstAvailableSlot(itemOrCategory) {
    const item = typeof itemOrCategory === 'string' ? null : itemOrCategory;
    const category = item ? item.category : itemOrCategory;
    const slots = categorySlotKeys(category);
    const compatibleSlots = item ? slots.filter(slot => equipmentCompatibility(item, slot).ok) : slots;
    const candidates = compatibleSlots.length ? compatibleSlots : slots;
    return candidates.find(slot => !game.player.mountedEquipment?.[slot]) || candidates[0] || '';
}

function equipmentSlotLabel(slot) {
    const spec = slotSpec(slot);
    if (slot.startsWith('weapon')) return `${spec.type === 'turret' ? 'Turret' : t('weaponSlot')} ${slot.replace('weapon', '')} (Class ${spec.maxClass})`;
    if (slot === 'shield') {
        const labels = { lf: 'Light Fighter', hf: 'Heavy Fighter', fr: 'Freighter' };
        return `Shield (Class ${spec.maxClass}, ${labels[spec.shieldFamily] || spec.shieldFamily})`;
    }
    if (slot === 'scanner') return 'Scanner';
    if (slot === 'tractor') return 'Tractor Beam';
    return slot.charAt(0).toUpperCase() + slot.slice(1);
}

function currentPowerPlantItem() {
    if (!game.player) return null;
    const mountedPowerplant = getEquipment(game.player.mountedEquipment?.powerplant);
    if (mountedPowerplant) return mountedPowerplant;
    const packagePowerplant = currentShipPackage()?.powerplant || null;
    const equipmentPowerplant = getEquipment(game.player.powerPlantId);
    if (equipmentPowerplant) return equipmentPowerplant;
    if (!packagePowerplant && !game.player.powerPlantId) return null;
    return {
        id: game.player.powerPlantId || packagePowerplant?.id || 'ship_powerplant',
        name: game.player.powerPlantName || packagePowerplant?.name || 'Powerplant',
        category: 'powerplant',
        capacity: game.player.baseMaxEnergy || game.player.maxEnergy || packagePowerplant?.capacity || 0,
        chargeRate: game.player.basePowerGen || game.player.powerGen || packagePowerplant?.chargeRate || 0,
        thrustCapacity: game.player.baseThrustCapacity || game.player.thrustCapacity || packagePowerplant?.thrustCapacity || 0,
        thrustChargeRate: game.player.baseThrustChargeRate || game.player.thrustChargeRate || packagePowerplant?.thrustChargeRate || 0
    };
}

function currentEngineItem() {
    if (!game.player) return null;
    const mountedEngine = getEquipment(game.player.mountedEquipment?.engine);
    if (mountedEngine) return mountedEngine;
    const packageEngine = currentShipPackage()?.engine || null;
    const equipmentEngine = getEquipment(game.player.engineId);
    if (equipmentEngine) return equipmentEngine;
    if (!packageEngine && !game.player.engineId) return null;
    return {
        id: game.player.engineId || packageEngine?.id || 'ship_engine',
        name: game.player.engineName || packageEngine?.name || 'Engine',
        category: 'engine',
        maxForce: packageEngine?.maxForce || 0,
        linearDrag: packageEngine?.linearDrag || 0,
        powerUsage: packageEngine?.powerUsage || 0,
        reverseFraction: packageEngine?.reverseFraction || 1,
        cruiseChargeTime: packageEngine?.cruiseChargeTime || CRUISE_CHARGE_SECONDS,
        cruisePowerUsage: packageEngine?.cruisePowerUsage || 20
    };
}

function mountedEquipmentItem(slot) {
    if (slot === 'powerplant') return currentPowerPlantItem();
    if (slot === 'engine') return currentEngineItem();
    return getEquipment(game.player?.mountedEquipment?.[slot]);
}

function equipmentRangeFromInfo(item, fallback = 0) {
    const text = String(item?.info || '');
    const match = text.match(/(?:Reichweite|Range)\s*:\s*([\d.,]+)/i);
    if (!match) return fallback;
    const value = Number(String(match[1]).replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function scannerRangeForItem(item) {
    const id = String(item?.id || '').toLowerCase();
    const explicit = Number(item?.scannerRange || item?.range || 0);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const parsed = equipmentRangeFromInfo(item, 0);
    if (parsed > 0) return parsed;
    if (id.includes('scanner_05')) return 50000;
    if (id.includes('scanner_04')) return 25000;
    if (id.includes('scanner_03')) return 10000;
    if (id.includes('scanner_02')) return 5000;
    return 2500;
}

function tractorRangeForItem(item) {
    const id = String(item?.id || '').toLowerCase();
    const explicit = Number(item?.tractorRange || item?.maxLength || 0);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const parsed = equipmentRangeFromInfo(item, 0);
    if (parsed > 0) return parsed;
    if (id.includes('tractor_03')) return 5000;
    if (id.includes('tractor_02')) return 3000;
    return 1500;
}

function equippedScannerItem() {
    return mountedEquipmentItem('scanner') || getEquipment('ge_s_scanner_01');
}

function equippedTractorItem() {
    return mountedEquipmentItem('tractor') || getEquipment('ge_s_tractor_01');
}

function playerScannerRange() {
    return scannerRangeForItem(equippedScannerItem());
}

function mountedThrusterItem() {
    return mountedEquipmentItem('thruster');
}

function thrusterPowerUsage(item = mountedThrusterItem()) {
    return Math.max(1, Number(item?.powerUsage || item?.thrustPowerUsage || 0) || 100);
}

function hasMountedThruster() {
    return Boolean(mountedThrusterItem());
}

function equippedShieldItem() {
    const item = mountedEquipmentItem('shield');
    return item?.category === 'shield' ? item : null;
}

function shieldCapacityFromEquipment(item) {
    return Math.max(0, Number(item?.shieldCapacity || item?.maxCapacity || item?.capacity || 0));
}

function shieldRegenFromEquipment(item) {
    return Math.max(0, Number(item?.shieldRegenRate || item?.chargeRate || 0));
}

function mountedEquipmentCopies(itemId) {
    return Object.values(game.player?.mountedEquipment || {}).filter(mountedId => mountedId === itemId).length;
}

function availableEquipmentQuantity(itemId) {
    const inv = findEquipmentItem(itemId);
    if (!inv) return 0;
    return Math.max(0, (Number(inv.quantity) || 0) - mountedEquipmentCopies(itemId));
}

function isMissileLauncher(item) {
    return String(item?.category || '').toLowerCase() === 'missile' && Boolean(item?.requiresAmmo || item?.projectileArchetype);
}

function missileAmmoItemId(item) {
    if (!isMissileLauncher(item)) return '';
    return String(item?.projectileArchetype || '').toLowerCase();
}

function missileAmmoInventoryEntries() {
    return (game.player?.equipmentInventory || []).filter(entry => {
        const item = getEquipment(entry.id);
        return item && String(item.category || '').toLowerCase() === 'missile' && item.combinable && ammoFitsAnyMountedLauncher(item);
    });
}

function totalMissileAmmoCount() {
    return missileAmmoInventoryEntries().reduce((sum, entry) => sum + Math.max(0, Number(entry.quantity) || 0), 0);
}

function missileAmmoCount(itemOrAmmoId) {
    const ammoId = typeof itemOrAmmoId === 'string' ? String(itemOrAmmoId || '').toLowerCase() : missileAmmoItemId(itemOrAmmoId);
    if (!ammoId) return 0;
    return Math.max(0, Number(findEquipmentItem(ammoId)?.quantity) || 0);
}

function consumeMissileAmmo(item) {
    const ammoId = missileAmmoItemId(item);
    if (!ammoId) return true;
    const inv = findEquipmentItem(ammoId);
    if (!inv || (Number(inv.quantity) || 0) <= 0) return false;
    inv.quantity = Math.max(0, (Number(inv.quantity) || 0) - 1);
    game.player.equipmentInventory = (game.player.equipmentInventory || []).filter(entry => (Number(entry.quantity) || 0) > 0);
    return true;
}

function missileDamageForItem(item, ammoItem = null) {
    const id = String(item?.id || '').toLowerCase();
    const ammo = ammoItem || getEquipment(missileAmmoItemId(item));
    const ammoPrice = Number(ammo?.price || 0);
    if (id.includes('torpedo')) return Math.max(1800, ammoPrice * 6);
    if (id.includes('cruise_disruptor')) return 60;
    if (id.includes('missile03')) return Math.max(320, ammoPrice * 6);
    if (id.includes('missile02')) return Math.max(260, ammoPrice * 5.5);
    return Math.max(180, ammoPrice * 7);
}

function isCruiseDisruptorItem(item) {
    const id = String(item?.id || item?.equipmentId || '').toLowerCase();
    const ammoId = String(item?.projectileArchetype || '').toLowerCase();
    const name = String(item?.name || '').toLowerCase();
    return id.includes('cruise_disruptor') || ammoId.includes('cruise_disruptor') || name.includes('reiseflugunterbrecher') || name.includes('cruise disruptor');
}

function isMineDropper(item) {
    return String(item?.category || '').toLowerCase() === 'mine' && !item?.combinable && Boolean(item?.projectileArchetype);
}

function isMineAmmo(item) {
    return String(item?.category || '').toLowerCase() === 'mine' && Boolean(item?.combinable);
}

function equippedMineDropperItem() {
    const item = mountedEquipmentItem('mine');
    return isMineDropper(item) ? item : null;
}

function mineAmmoItemId(item) {
    if (!isMineDropper(item)) return '';
    return String(item?.projectileArchetype || '').toLowerCase();
}

function mineAmmoInventoryEntries() {
    return (game.player?.equipmentInventory || []).filter(entry => {
        const item = getEquipment(entry.id);
        return isMineAmmo(item) && ammoFitsAnyMountedLauncher(item);
    });
}

function totalMineAmmoCount() {
    return mineAmmoInventoryEntries().reduce((sum, entry) => sum + Math.max(0, Number(entry.quantity) || 0), 0);
}

function mineAmmoCount(itemOrAmmoId) {
    const ammoId = typeof itemOrAmmoId === 'string' ? String(itemOrAmmoId || '').toLowerCase() : mineAmmoItemId(itemOrAmmoId);
    if (!ammoId) return 0;
    return Math.max(0, Number(findEquipmentItem(ammoId)?.quantity) || 0);
}

function consumeMineAmmo(item) {
    const ammoId = mineAmmoItemId(item);
    if (!ammoId) return false;
    const inv = findEquipmentItem(ammoId);
    if (!inv || (Number(inv.quantity) || 0) <= 0) return false;
    inv.quantity = Math.max(0, (Number(inv.quantity) || 0) - 1);
    game.player.equipmentInventory = (game.player.equipmentInventory || []).filter(entry => (Number(entry.quantity) || 0) > 0);
    return true;
}

function mineStatsFromEquipment(item) {
    const ammo = getEquipment(mineAmmoItemId(item));
    const damage = Number(ammo?.explosionHullDamage || ammo?.hullDamage || ammo?.price || MINE_DAMAGE);
    const topSpeed = Number(ammo?.topSpeed || item?.muzzleVelocity || MINE_SPEED) || MINE_SPEED;
    const dropSpeed = Number(item?.muzzleVelocity || Math.min(topSpeed, MINE_SPEED)) || MINE_SPEED;
    return {
        name: item?.name || t('mines'),
        cooldown: Math.max(0.1, Number(item?.refireDelay) || MINE_DROP_COOLDOWN),
        speed: Math.max(1, dropSpeed),
        damage: Math.max(1, damage),
        lifetime: Math.max(0.5, Number(ammo?.projectileLifetime) || MINE_LIFETIME),
        seekRange: Math.max(0, Number(ammo?.seekDist || ammo?.seekerRange || MINE_SEEK_RANGE)),
        maxSpeed: Math.max(1, topSpeed),
        acceleration: Math.max(0, Number(ammo?.acceleration) || 0),
        detonationRadius: Math.max(4, Number(ammo?.detonationDist || 0), Number(ammo?.explosionRadius || 0)),
        radius: Math.max(6, Math.min(18, Number(ammo?.explosionRadius || 12) * 0.75)),
        turnRate: Math.max(0.3, Number(ammo?.maxAngularVelocity) || 0.85)
    };
}

function isCountermeasureDropper(item) {
    return String(item?.category || '').toLowerCase() === 'countermeasure' && !item?.combinable && Boolean(item?.projectileArchetype);
}

function isCountermeasureAmmo(item) {
    return String(item?.category || '').toLowerCase() === 'countermeasure' && Boolean(item?.combinable);
}

function equippedCountermeasureDropperItem() {
    const item = mountedEquipmentItem('countermeasure');
    return isCountermeasureDropper(item) ? item : null;
}

function countermeasureAmmoItemId(item) {
    if (!isCountermeasureDropper(item)) return '';
    return String(item?.projectileArchetype || '').toLowerCase();
}

function countermeasureAmmoInventoryEntries() {
    return (game.player?.equipmentInventory || []).filter(entry => {
        const item = getEquipment(entry.id);
        return isCountermeasureAmmo(item) && ammoFitsAnyMountedLauncher(item);
    });
}

function totalCountermeasureAmmoCount() {
    return countermeasureAmmoInventoryEntries().reduce((sum, entry) => sum + Math.max(0, Number(entry.quantity) || 0), 0);
}

function countermeasureAmmoCount(itemOrAmmoId) {
    const ammoId = typeof itemOrAmmoId === 'string' ? String(itemOrAmmoId || '').toLowerCase() : countermeasureAmmoItemId(itemOrAmmoId);
    if (!ammoId) return 0;
    return Math.max(0, Number(findEquipmentItem(ammoId)?.quantity) || 0);
}

function consumeCountermeasureAmmo(item) {
    const ammoId = countermeasureAmmoItemId(item);
    if (!ammoId) return false;
    const inv = findEquipmentItem(ammoId);
    if (!inv || (Number(inv.quantity) || 0) <= 0) return false;
    inv.quantity = Math.max(0, (Number(inv.quantity) || 0) - 1);
    game.player.equipmentInventory = (game.player.equipmentInventory || []).filter(entry => (Number(entry.quantity) || 0) > 0);
    return true;
}

function countermeasureStatsFromEquipment(item) {
    const ammo = getEquipment(countermeasureAmmoItemId(item));
    return {
        name: ammo?.name || item?.name || t('countermeasures'),
        cooldown: Math.max(0.1, Number(item?.refireDelay) || 0.25),
        speed: Math.max(1, Number(item?.muzzleVelocity) || 10),
        lifetime: Math.max(0.5, Number(ammo?.projectileLifetime || ammo?.lifetime) || COUNTERMEASURE_LIFETIME),
        range: Math.max(100, Number(ammo?.countermeasureRange || ammo?.range) || COUNTERMEASURE_RANGE),
        diversionChance: clamp((Number(ammo?.diversionPctg || ammo?.diversionPercent) || (COUNTERMEASURE_DIVERSION * 100)) / 100, 0, 1),
        linearDrag: Math.max(0, Number(ammo?.linearDrag) || 0)
    };
}

function launcherAmmoItemId(item) {
    if (isMissileLauncher(item)) return missileAmmoItemId(item);
    if (isMineDropper(item)) return mineAmmoItemId(item);
    if (isCountermeasureDropper(item)) return countermeasureAmmoItemId(item);
    return '';
}

function ammoFitsLauncher(ammo, launcher) {
    const ammoId = String(ammo?.id || ammo?.equipmentId || '').toLowerCase();
    const launcherAmmoId = launcherAmmoItemId(launcher);
    return Boolean(ammoId && launcherAmmoId && ammoId === launcherAmmoId);
}

function ammoFitsAnyMountedLauncher(ammo) {
    if (!ammo || !ammo.combinable) return false;
    return Object.values(game.player?.mountedEquipment || {}).some(itemId => ammoFitsLauncher(ammo, getEquipment(itemId)));
}

function isAmmoItem(item) {
    return Boolean(item?.combinable && (isMineAmmo(item) || isCountermeasureAmmo(item) || String(item?.category || '').toLowerCase() === 'missile'));
}

function ammoCompatibilityReason(item) {
    if (!isAmmoItem(item) || ammoFitsAnyMountedLauncher(item)) return '';
    if (isMineAmmo(item)) return 'No matching mine dropper mounted.';
    if (isCountermeasureAmmo(item)) return 'No matching countermeasure dropper mounted.';
    return 'No matching missile launcher mounted.';
}

function countermeasureTargetById(id) {
    if (!id) return null;
    return game.projectiles.find(projectile => projectile.type === 'countermeasure' && projectile.id === id && projectile.lifetime > 0) || null;
}

function tryDivertMissileWithCountermeasure(missile, countermeasure) {
    if (!missile || !countermeasure || missile.owner === 'player' || !missile.homing || missile.targetId !== 'player') return false;
    const dx = countermeasure.x - missile.x;
    const dz = countermeasure.z - missile.z;
    if (Math.hypot(dx, dz) > (countermeasure.range || COUNTERMEASURE_RANGE)) return false;
    missile.countermeasureChecks = missile.countermeasureChecks || {};
    if (missile.countermeasureChecks[countermeasure.id]) return false;
    missile.countermeasureChecks[countermeasure.id] = true;
    if (Math.random() > (countermeasure.diversionChance ?? COUNTERMEASURE_DIVERSION)) return false;
    missile.targetId = countermeasure.id;
    missile.trailColor = missile.trailColor || 'rgba(255,180,60,0.55)';
    return true;
}

function divertIncomingMissiles(countermeasure) {
    let diverted = 0;
    for (const projectile of game.projectiles) {
        if (projectile === countermeasure) continue;
        if (tryDivertMissileWithCountermeasure(projectile, countermeasure)) diverted += 1;
    }
    return diverted;
}

function isIncomingPlayerMissile(projectile) {
    return Boolean(projectile
        && projectile.owner !== 'player'
        && projectile.homing
        && projectile.targetId === 'player'
        && projectile.lifetime > 0);
}

function incomingPlayerMissiles() {
    return (game.projectiles || []).filter(isIncomingPlayerMissile);
}

function hasIncomingPlayerMissile() {
    return incomingPlayerMissiles().length > 0;
}

function safeDomId(value) {
    return String(value || '').replace(/[^a-z0-9_-]/gi, '_');
}

const STARTER_MOUNTED_EQUIPMENT = {
    gf1_package: [
        { id: 'shield01_mark01_lf', slot: 'shield' },
        { id: 'li_gun01_mark01', slot: 'weapon1' },
            { id: 'li_gun01_mark01', slot: 'weapon2' },
            { id: 'ge_s_thruster_01', slot: 'thruster' }
    ]
};

function addEquipmentInventoryCopy(itemId) {
    const item = getEquipment(itemId);
    if (!item) return false;
    let inv = findEquipmentItem(item.id);
    if (!inv) {
        inv = { id: item.id, name: item.name, quantity: 0, category: item.category };
        game.player.equipmentInventory.push(inv);
    }
    inv.quantity += 1;
    return true;
}

function isFixedEquipmentInventoryEntry(entry) {
    const item = getEquipment(entry?.id);
    const category = String(item?.category || entry?.category || '').toLowerCase();
    return category === 'engine' || category === 'powerplant' || category === 'tractor' || (!isCrossfireActive() && category === 'scanner');
}

function isFixedEquipmentSlot(slot) {
    return slot === 'powerplant' || slot === 'engine' || slot === 'tractor' || (!isCrossfireActive() && slot === 'scanner');
}

function cleanEquipmentInventory(entries = game.player?.equipmentInventory || []) {
    return (entries || []).filter(entry => !isFixedEquipmentInventoryEntry(entry));
}

function ensureFixedShipEquipment() {
    if (!game.player) return;
    const shipPackage = currentShipPackage();
    const fixed = [
        ['powerplant', shipPackage?.powerplant?.id],
        ['engine', shipPackage?.engine?.id],
        ['scanner', game.player.mountedEquipment?.scanner || 'ge_s_scanner_01'],
        ['tractor', game.player.mountedEquipment?.tractor || 'ge_s_tractor_01']
    ];
    game.player.equipmentInventory = cleanEquipmentInventory(game.player.equipmentInventory || []);
    for (const [slot, itemId] of fixed) {
        if (!itemId) continue;
        game.player.mountedEquipment[slot] = itemId;
    }
}

function mountedEquipmentCount() {
    return Object.values(game.player?.mountedEquipment || {}).filter(Boolean).length;
}

function hasPlayerStarterEquipment() {
    if (!game.player) return false;
    const mounted = game.player.mountedEquipment || {};
    const fixedSlots = new Set(['engine', 'powerplant', 'scanner', 'tractor']);
    if (Object.entries(mounted).some(([slot, itemId]) => itemId && !fixedSlots.has(slot))) return true;
    return (game.player.equipmentInventory || []).some(item => {
        const category = String(getEquipment(item.id)?.category || item.category || '').toLowerCase();
        return !['engine', 'powerplant', 'scanner', 'tractor'].includes(category);
    });
}

function ensureStarterEquipmentForEmptyLoadout() {
    ensureFixedShipEquipment();
    if (!game.player || hasPlayerStarterEquipment()) return;
    const defaults = STARTER_MOUNTED_EQUIPMENT[game.player.shipPackageId] || [];
    for (const entry of defaults) {
        if (!addEquipmentInventoryCopy(entry.id)) continue;
        if (entry.slot && !game.player.mountedEquipment[entry.slot]) game.player.mountedEquipment[entry.slot] = entry.id;
    }
}

function getMissionZonesForSystem(system = systemData) {
    return (system?.missionZones || []).filter(zone => Number.isFinite(zone.x) && Number.isFinite(zone.z));
}

function missionDifficulty(zone, index = 0) {
    const seed = Math.abs(hashString((currentSystemId || '') + ':' + (zone?.id || index)));
    return 1 + (seed % 4);
}

function missionDockingTargets() {
    return (game.entities || []).filter(target =>
        (target instanceof Station || target instanceof PlanetLocation) && getBaseId(target) && canPlayerDockWithTarget(target)
    );
}

function missionDestinationFor(index, originBaseId = getBaseId(game.landedBase)) {
    const destinations = missionDockingTargets().filter(target => getBaseId(target) !== originBaseId);
    if (!destinations.length) return null;
    const seed = Math.abs(hashString(`${currentSystemId}:${originBaseId || 'space'}:${index}`));
    return destinations[seed % destinations.length];
}

function missionTargetRecord(target) {
    if (!target) return null;
    return {
        targetBaseId: getBaseId(target) || String(target.id || target.nickname || '').toLowerCase(),
        targetName: target.name || target.id || 'Destination',
        targetX: Number(target.x) || 0,
        targetZ: Number(target.z) || 0
    };
}

function patrolCheckpoints(zone, difficulty, index) {
    const radius = 1150 + difficulty * 240;
    const phase = (Math.abs(hashString(`${zone.id}:${index}:patrol`)) % 360) * Math.PI / 180;
    return Array.from({ length: 3 }, (_, checkpointIndex) => {
        const angle = phase + checkpointIndex * Math.PI * 2 / 3;
        return {
            x: zone.x + Math.cos(angle) * radius,
            z: zone.z + Math.sin(angle) * radius,
            name: `${t('missionTypePatrol')} ${checkpointIndex + 1}/3`
        };
    });
}

function buildMissionOffer(zone, index) {
    const difficulty = missionDifficulty(zone, index);
    const distance = game.player ? Math.hypot(zone.x - game.player.x, zone.z - game.player.z) : Math.hypot(zone.x, zone.z);
    const requestedType = Freelancer2DLogic.missionTypeForIndex(index);
    const originBaseId = getBaseId(game.landedBase);
    const destination = missionDestinationFor(index, originBaseId);
    const type = destination || !['transport', 'escort'].includes(requestedType) ? requestedType : 'combat';
    const typeMultiplier = { combat: 1, transport: 0.82, patrol: 0.9, escort: 1.25 }[type] || 1;
    const reward = Math.round(((900 + difficulty * 850 + distance * 0.025) * typeMultiplier) / 50) * 50;
    const enemyCount = clamp(MISSION_ENEMY_MIN_COUNT + difficulty - 1, MISSION_ENEMY_MIN_COUNT, MISSION_ENEMY_MAX_COUNT);
    const vignetteType = zone.vignetteType || 'open';
    const offer = {
        id: `${currentSystemId}:${zone.id}:${type}`,
        type,
        zoneId: zone.id,
        systemId: currentSystemId,
        x: zone.x,
        z: zone.z,
        reward,
        difficulty,
        enemyCount,
        vignetteType,
        originBaseId,
        originName: game.landedBase?.name || systemData.name
    };
    if (type === 'transport') {
        Object.assign(offer, missionTargetRecord(destination), {
            title: `${t('missionTypeTransport')}: ${destination.name}`,
            description: tf('missionTransport', { target: destination.name }),
            cargoUnits: 1 + difficulty
        });
    } else if (type === 'patrol') {
        Object.assign(offer, {
            title: `${t('missionTypePatrol')}: ${zone.name || index + 1}`,
            description: tf('missionPatrol', { zone: zone.name || zone.id }),
            checkpoints: patrolCheckpoints(zone, difficulty, index),
            currentCheckpoint: 0
        });
    } else if (type === 'escort') {
        Object.assign(offer, missionTargetRecord(destination), {
            title: `${t('missionTypeEscort')}: ${destination.name}`,
            description: tf('missionEscort', { target: destination.name }),
            enemyCount: clamp(1 + difficulty, 2, 5)
        });
    } else {
        Object.assign(offer, {
            title: `${t('missionTypeCombat')}: ${zone.name || index + 1}`,
            description: tf('missionEliminate', { zone: zone.name || zone.id })
        });
    }
    return offer;
}

function getMissionOffers() {
    const cacheKey = `${currentSystemId}:${getBaseId(game.landedBase) || 'space'}:${game.language}`;
    if (game.missionOffers[cacheKey]) return game.missionOffers[cacheKey];
    const zones = getMissionZonesForSystem();
    const fallbackZone = {
        id: 'local-operations',
        name: systemData.name,
        x: (game.player?.x || 0) + 7200,
        z: (game.player?.z || 0) + 3600,
        vignetteType: 'open'
    };
    const sourceZones = zones.length ? zones : [fallbackZone];
    const offerCount = Math.min(12, Math.max(4, sourceZones.length));
    const offers = Array.from({ length: offerCount }, (_, index) => buildMissionOffer(sourceZones[index % sourceZones.length], index));
    game.missionOffers = { [cacheKey]: offers };
    return offers;
}

function missionCargoId(mission) {
    return `mission-cargo:${mission.id}`;
}

function addMissionCargo(mission) {
    const amount = Math.max(1, Number(mission.cargoUnits) || 1);
    if (game.player.maxCargo - cargoUnits() < amount) return false;
    game.player.cargo.push({
        id: missionCargoId(mission),
        name: game.language === 'de' ? 'Versiegelte Missionsfracht' : 'Sealed mission shipment',
        quantity: amount,
        avgPrice: 0,
        missionCargo: true,
        missionId: mission.id
    });
    return true;
}

function removeMissionCargo(mission) {
    if (!game.player || !mission) return;
    game.player.cargo = (game.player.cargo || []).filter(item => item.missionId !== mission.id);
}

function missionDestinationTarget(mission) {
    const targetId = String(mission?.targetBaseId || '').toLowerCase();
    return missionDockingTargets().find(target => String(getBaseId(target) || target.id || '').toLowerCase() === targetId) || null;
}

function setMissionWaypoint(mission) {
    if (!mission) return;
    const checkpoint = mission.type === 'patrol' ? mission.checkpoints?.[mission.currentCheckpoint || 0] : null;
    const target = checkpoint || (['transport', 'escort'].includes(mission.type) ? {
        x: mission.targetX,
        z: mission.targetZ,
        name: mission.targetName
    } : mission);
    if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.z)) return;
    setWaypointTarget({ x: target.x, z: target.z, name: target.name || mission.title, type: 'Mission', isWaypoint: true, systemId: mission.systemId }, target.name || mission.title);
}

function acceptMission(missionId) {
    if (game.activeMission) {
        addLog(game.language === 'de' ? 'Es ist bereits eine Mission aktiv.' : 'A mission is already active.', 'alert');
        return;
    }
    const mission = getMissionOffers().find(offer => offer.id === missionId);
    if (!mission) return;
    if (mission.type === 'transport' && !addMissionCargo(mission)) {
        addLog(t('missionCargoNoSpace'), 'alert');
        return;
    }
    game.activeMission = { ...mission, status: 'accepted', spawned: false, remaining: mission.enemyCount };
    setMissionWaypoint(game.activeMission);
    addLog(`${t('missionAccepted')}: ${mission.title} (${mission.reward.toLocaleString()} CR)`);
    launchFromBase();
    if (game.activeMission.type === 'escort') spawnEscortMission(game.activeMission);
    saveGame();
}

function missionLootWeaponIds() {
    const equipment = equipmentData();
    const markets = equipmentMarketsData();
    if (!Object.keys(equipment).length || !Object.keys(markets).length) return [];
    const soldIds = new Set();
    Object.values(markets).forEach(market => {
        (market || []).forEach(entry => {
            if (entry?.forSale) soldIds.add(String(entry.id || '').toLowerCase());
        });
    });
    return Object.values(equipment)
        .filter(item => item && soldIds.has(String(item.id || '').toLowerCase()) && (item.category === 'weapon' || item.category === 'turret') && Number(item.price || 0) > 0)
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        .slice(0, 80)
        .map(item => item.id);
}

function addLootDrop(x, z, kind = 'random') {
    const roll = Math.random();
    let loot;
    if (kind === 'weapon' || roll < 0.22) {
        const ids = missionLootWeaponIds();
        if (!ids.length) return;
        const id = ids[Math.floor(Math.random() * ids.length)];
        const item = getEquipment(id);
        loot = { type: 'equipment', id, name: item?.name || id, color: '#55d6ff' };
    } else if (roll < 0.56) {
        loot = { type: 'nanobot', name: 'Nanobot', color: '#55ff88' };
    } else {
        loot = { type: 'shieldBattery', name: 'Shield Battery', color: '#66aaff' };
    }
    game.loot.push({
        id: 'loot-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
        x: x + (Math.random() - 0.5) * 180,
        z: z + (Math.random() - 0.5) * 180,
        radius: 32,
        age: 0,
        ...loot
    });
}

function collectLoot(loot) {
    if (!game.player || !loot) return false;
    if (loot.type === 'equipment') {
        if (addEquipmentInventoryCopy(loot.id)) addLog('Loot: ' + loot.name);
    } else if (loot.type === 'nanobot') {
        game.player.nanobots = Math.min(game.player.maxNanobots, game.player.nanobots + 1);
        addLog('Loot: Nanobot');
    } else if (loot.type === 'shieldBattery') {
        game.player.shieldBatteries = Math.min(game.player.maxShieldBatteries, game.player.shieldBatteries + 1);
        addLog('Loot: Shield Battery');
    } else if (loot.type === 'commodity') {
        if (!addCommodityCargo(loot.commodityId, loot.quantity || 1, 'Loot')) return false;
    }
    playSound('buy', 0.45);
    saveGame();
    return true;
}

function weaponColorPartsForItem(item) {
    const key = String(item?.id || item?.weaponType || item?.projectileArchetype || 'weapon').toLowerCase();
    const hash = Math.abs(hashString('weapon-color:' + key));
    return {
        hue: hash % 360,
        saturation: 72 + (hash % 18),
        lightness: 56 + ((hash >> 4) % 12)
    };
}

function weaponColorForItem(item) {
    const { hue, saturation, lightness } = weaponColorPartsForItem(item);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function weaponTrailColorForItem(item) {
    const { hue, saturation, lightness } = weaponColorPartsForItem(item);
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.55)`;
}

function weaponStatsFromEquipment(item, fallbackDifficulty = 1) {
    const id = String(item?.id || '').toLowerCase();
    const mark = Number((id.match(/mark(\d+)/) || [])[1]) || Number((id.match(/_(\d+)$/) || [])[1]) || fallbackDifficulty || 1;
    const refire = Math.max(0.08, Number(item?.refireDelay) || (0.22 - Math.min(mark, 7) * 0.012));
    const speed = Number(item?.muzzleVelocity) || (id.includes('laser') ? 1120 : id.includes('plasma') ? 760 : id.includes('tachyon') ? 980 : 860 + Math.min(mark, 8) * 24);
    const color = weaponColorForItem(item);
    const hullDamage = Number(item?.hullDamage) || 0;
    const energyDamage = Number(item?.energyDamage) || 0;
    const ammoItem = getEquipment(item?.projectileArchetype || '');
    const missile = isMissileLauncher(item);
    const cruiseDisruptor = missile && (isCruiseDisruptorItem(item) || isCruiseDisruptorItem(ammoItem));
    const ammoLifetime = Number(ammoItem?.projectileLifetime) || 0;
    const ammoDetonation = Number(ammoItem?.detonationDist) || Number(ammoItem?.explosionRadius) || 0;
    const ammoTurnRate = Number(ammoItem?.maxAngularVelocity) || 0;
    const ammoMotorSpeed = Number(item?.muzzleVelocity || 0) + Math.max(0, Number(ammoItem?.motorAccel) || 0) * Math.max(0, Number(ammoItem?.motorLifetime) || 0);
    const missileSpeed = cruiseDisruptor
        ? Math.max(520, ammoMotorSpeed || speed * 2.5)
        : Math.max(160, speed * 8);
    return {
        id: item?.id || '',
        name: item?.name || item?.id || 'Weapon',
        cooldown: refire,
        energyCost: missile ? 0 : Math.max(0, Number(item?.powerUsage) || (5 + mark)),
        damage: missile ? missileDamageForItem(item, ammoItem) : (hullDamage || energyDamage || (7 + mark * 3 + (item?.category === 'turret' ? 3 : 0))),
        radius: missile ? Math.max(8, Math.min(18, 7 + mark * 1.6)) : Math.max(3, Math.min(10, 3 + Math.sqrt(Math.max(hullDamage, energyDamage, mark * 12)) * 0.08)),
        speed: missile ? missileSpeed : speed,
        lifetime: missile ? Math.max(4, ammoLifetime || Number(item?.projectileLifetime) || 8) : (Number(item?.projectileLifetime) || (1.15 + Math.min(mark, 8) * 0.08)),
        color,
        trailColor: cruiseDisruptor ? 'rgba(130,225,255,0.68)' : weaponTrailColorForItem(item),
        category: item?.category || 'weapon',
        ammoItemId: missile ? missileAmmoItemId(item) : '',
        requiresAmmo: missile ? Boolean(item?.requiresAmmo || missileAmmoItemId(item)) : false,
        homing: missile,
        turnRate: missile ? (ammoTurnRate || (id.includes('torpedo') ? 1.35 : 2.8)) : 0,
        detonationRadius: missile ? Math.max(cruiseDisruptor ? 18 : 0, ammoDetonation || (id.includes('torpedo') ? 18 : 11)) : 0,
        seekerRange: missile ? Math.max(900, Number(ammoItem?.seekerRange) || Number(ammoItem?.seekDist) || 1500) : 0,
        cruiseDisruptor,
        disruptDuration: cruiseDisruptor ? CRUISE_DISRUPT_LOCKOUT_MS : 0
    };
}

function enemyShipPrefixesForSystem(systemId = currentSystemId) {
    const prefix = String(systemId || '').slice(0, 2).toLowerCase();
    if (prefix === 'li') return ['pi_', 'fc_lr', 'bh_', 'co_', 'li_'];
    if (prefix === 'br') return ['br_', 'pi_', 'bh_', 'co_'];
    if (prefix === 'ku') return ['ku_', 'pi_', 'bw_', 'co_'];
    if (prefix === 'rh') return ['rh_', 'pi_', 'bw_', 'co_'];
    if (prefix === 'bw' || prefix === 'ew') return ['bw_', 'pi_', 'co_', 'bh_'];
    return ['pi_', 'bw_', 'co_', 'bh_', 'li_', 'br_', 'ku_', 'rh_'];
}

function chooseNpcShipForMission(difficulty = 1) {
    const npcShips = npcShipsData();
    const loadouts = npcLoadoutsData();
    const ships = shipsData();
    if (!npcShips.length || !Object.keys(loadouts).length || !Object.keys(ships).length) return null;
    const prefixes = enemyShipPrefixesForSystem();
    const targetLevel = 1 + difficulty * 3;
    const usable = npcShips.filter(entry => {
        const ship = ships[String(entry.ship || '').toLowerCase()];
        const loadout = loadouts[String(entry.loadout || '').toLowerCase()];
        const classText = String(entry.classes || '').toLowerCase();
        return ship && loadout && loadout.weapons?.length && (classText.includes('fighter') || ship.type === 'FIGHTER');
    });
    const regional = usable.filter(entry => prefixes.some(prefix => String(entry.ship || '').startsWith(prefix)));
    const pool = regional.length ? regional : usable;
    if (!pool.length) return null;
    const scored = pool.map(entry => ({ entry, score: Math.abs((Number(entry.level) || 1) - targetLevel) + Math.random() * 2 }));
    scored.sort((a, b) => a.score - b.score);
    return scored[Math.floor(Math.random() * Math.min(8, scored.length))].entry;
}

function npcShipClassesText(entry) {
    const classes = Array.isArray(entry?.classes) ? entry.classes.join(',') : String(entry?.classes || '');
    return classes.toLowerCase();
}

function chooseNpcShipForRole(role = 'civilian', difficulty = 1, factionId = '') {
    const npcShips = npcShipsData();
    const loadouts = npcLoadoutsData();
    const ships = shipsData();
    if (!npcShips.length || !Object.keys(loadouts).length || !Object.keys(ships).length) return null;
    const targetLevel = 1 + difficulty * 3;
    const factionPrefix = String(factionId || '').split('_').slice(0, 2).join('_');
    const usable = npcShips.filter(entry => {
        const shipId = String(entry.ship || '').toLowerCase();
        const loadout = loadouts[String(entry.loadout || '').toLowerCase()];
        const ship = ships[shipId] || ships[String(loadout?.archetype || '').toLowerCase()];
        const classText = npcShipClassesText(entry);
        if (!loadout || (!ship && !shipId.includes('ge_transport') && !shipId.includes('ge_train'))) return false;
        if (role === 'trader') return shipId.includes('transport') || shipId.includes('train') || shipId.includes('freighter') || shipId.includes('liner') || classText.includes('transport') || classText.includes('freighter') || classText.includes('lifter');
        if (role === 'pirate') return classText.includes('fighter') || classText.includes('assault') || ship?.type === 'FIGHTER';
        if (role === 'police') return classText.includes('fighter') || classText.includes('gunboat') || ship?.type === 'FIGHTER';
        return classText.includes('fighter') || ship?.type === 'FIGHTER';
    });
    const exactFaction = usable.filter(entry => factionPrefix && String(entry.id || '').toLowerCase().startsWith(factionPrefix));
    const lawfulWanted = role !== 'pirate';
    const classFiltered = usable.filter(entry => npcShipClassesText(entry).includes(lawfulWanted ? 'lawful' : 'unlawful'));
    const pool = exactFaction.length ? exactFaction : (classFiltered.length ? classFiltered : usable);
    if (!pool.length) return chooseNpcShipForMission(difficulty);
    const scored = pool.map(entry => {
        const shipText = String(entry.ship || '').toLowerCase();
        const trainBias = role === 'trader' && shipText.includes('ge_train') ? -1.2 : 0;
        const factionBias = factionPrefix && String(entry.id || '').toLowerCase().startsWith(factionPrefix) ? -4 : 0;
        return { entry, score: Math.abs((Number(entry.level) || 1) - targetLevel) + trainBias + factionBias + Math.random() * 2 };
    });
    scored.sort((a, b) => a.score - b.score);
    return scored[Math.floor(Math.random() * Math.min(6, scored.length))].entry;
}

function npcLoadoutDetails(npcShip, difficulty = 1) {
    const loadout = npcLoadoutsData()[String(npcShip?.loadout || '').toLowerCase()] || null;
    const ship = shipsData()[String(npcShip?.ship || loadout?.archetype || '').toLowerCase()] || null;
    const weaponStats = (loadout?.weapons || [])
        .map(entry => getEquipment(entry.id))
        .filter(item => item && (item.category === 'weapon' || item.category === 'turret' || item.category === 'missile'))
        .map(item => weaponStatsFromEquipment(item, difficulty));
    const shieldItem = (loadout?.shields || []).map(entry => getEquipment(entry.id)).find(item => item && item.category === 'shield') || null;
    return { loadout, ship, weaponStats, shieldItem };
}

function defaultNpcShipIcon(type, factionId = '') {
    const faction = String(factionId || '').toLowerCase();
    if (type === 'trader') return 'data/ship_icons/li_freighter.png';
    if (faction.startsWith('li_')) return 'data/ship_icons/li_fighter.png';
    if (faction.startsWith('br_')) return 'data/ship_icons/br_fighter.png';
    if (faction.startsWith('ku_')) return 'data/ship_icons/ku_fighter.png';
    if (faction.startsWith('rh_')) return 'data/ship_icons/rh_fighter.png';
    if (faction.startsWith('co_')) return type === 'trader' ? 'data/ship_icons/co_fighter.png' : 'data/ship_icons/co_elite.png';
    if (faction.startsWith('pi_') || faction.startsWith('fc_') || faction.startsWith('bw_')) return 'data/ship_icons/pi_fighter.png';
    if (faction.startsWith('bh_')) return 'data/ship_icons/bh_fighter.png';
    if (faction.startsWith('or_')) return 'data/ship_icons/or_elite.png';
    return type === 'trader' ? 'data/ship_icons/ge_fighter.png' : 'data/ship_icons/li_fighter.png';
}

function npcShipIconAlias(shipId = '', shipRecord = null) {
    const id = String(shipId || shipRecord?.id || '').toLowerCase();
    const type = String(shipRecord?.type || '').toUpperCase();
    if (id.startsWith('rtcprop_')) {
        const rtc = id.replace(/^rtcprop_/, '');
        if (rtc.includes('armored_transport')) return 'data/ship_icons/cf_armored.png';
        if (rtc.includes('large_transport')) return 'data/ship_icons/cf_large_transport.png';
        if (rtc.includes('transport')) return 'data/ship_icons/cf_transport.png';
        if (rtc.includes('luxury_liner')) return 'data/ship_icons/ge_linercf.png';
        if (rtc.includes('lifter')) return 'data/ship_icons/cf_lifter.png';
        if (rtc.includes('mining')) return 'data/ship_icons/my_miner_ship.png';
        if (rtc.includes('prison')) return 'data/ship_icons/cf_prison.png';
        if (rtc.includes('repair')) return 'data/ship_icons/cf_repair.png';
        if (rtc.includes('csv')) return 'data/ship_icons/ge_csv.png';
        if (rtc.includes('juni_elite')) return 'data/ship_icons/li_elite2.png';
        const prefixMap = {
            b: 'br',
            bw: 'bw',
            civ: 'co',
            k: 'ku',
            l: 'li',
            p: 'pi',
            r: 'rh'
        };
        const parts = rtc.split('_');
        const house = prefixMap[parts[0]] || '';
        const role = parts.slice(1).join('_');
        if (house && role) {
            if (house === 'co' && role === 'freighter') return 'data/ship_icons/cffreighter1.png';
            const roleMap = {
                battleship: house === 'br' ? 'cf_br_destroyer' : house === 'ku' ? 'cf_ku_destroyer' : house === 'rh' ? 'cf_rh_cruiser' : house === 'li' ? 'cf_li_cruiser' : `${house}_battleship`,
                dreadnought: 'li_dreadnought',
                destroyer: house === 'br' ? 'cf_br_destroyer' : house === 'ku' ? 'cf_ku_destroyer' : `${house}_destroyer`,
                cruiser: house === 'li' ? 'cf_li_cruiser' : house === 'rh' ? 'cf_rh_cruiser' : `${house}_cruiser`,
                gunboat: house === 'br' ? 'cf_br_gunboat' : house === 'ku' ? 'cf_ku_gunboat' : house === 'li' ? 'cf_li_gunboat' : house === 'rh' ? 'cf_rh_gunboat' : `${house}_gunboat`,
                dragon: 'ku_dragon',
                elite_akira: 'pi_elite',
                elite: `${house}_elite`,
                fighter: `${house}_fighter`,
                freighter: `${house}_freighter`
            };
            if (roleMap[role]) return `data/ship_icons/${roleMap[role]}.png`;
        }
    }
    if (id.includes('large_train') || id.includes('ge_large_train')) return 'data/ship_icons/ge_large_train.png';
    if (id.includes('large_transport')) return 'data/ship_icons/cf_large_transport.png';
    if (id.includes('armored_transport') || id.includes('ge_armored_nobay')) return 'data/ship_icons/cf_armored.png';
    if (id.includes('ge_train') || id.includes('freight_train')) return 'data/ship_icons/ge_train.png';
    if (id.includes('liner')) return 'data/ship_icons/ge_linercf.png';
    if (id.includes('lifter')) return 'data/ship_icons/cf_lifter.png';
    if (id.includes('miner') || id.includes('mining')) return 'data/ship_icons/my_miner_ship.png';
    if (id.includes('prison')) return 'data/ship_icons/cf_prison.png';
    if (id.includes('repair')) return 'data/ship_icons/cf_repair.png';
    if (id.includes('osiris')) return 'data/ship_icons/or_osiris.png';
    if (id.includes('dreadnought')) return 'data/ship_icons/cf_li_cruiser.png';
    if (id.includes('battleship') && id.startsWith('br_')) return 'data/ship_icons/cf_br_destroyer.png';
    if (id.includes('battleship') && id.startsWith('ku_')) return 'data/ship_icons/cf_ku_destroyer.png';
    if (id.includes('battleship') && id.startsWith('rh_')) return 'data/ship_icons/cf_rh_cruiser.png';
    if (id.includes('cruiser') && id.startsWith('li_')) return 'data/ship_icons/cf_li_cruiser.png';
    if (id.includes('cruiser') && id.startsWith('rh_')) return 'data/ship_icons/cf_rh_cruiser.png';
    if (id.includes('destroyer') && id.startsWith('br_')) return 'data/ship_icons/cf_br_destroyer.png';
    if (id.includes('destroyer') && id.startsWith('ku_')) return 'data/ship_icons/cf_ku_destroyer.png';
    if (id.includes('gunboat') && id.startsWith('br_')) return 'data/ship_icons/cf_br_gunboat.png';
    if (id.includes('gunboat') && id.startsWith('ku_')) return 'data/ship_icons/cf_ku_gunboat.png';
    if (id.includes('gunboat') && id.startsWith('rh_')) return 'data/ship_icons/cf_rh_gunboat.png';
    if (id.includes('gunboat') && id.startsWith('li_')) return 'data/ship_icons/cf_li_gunboat.png';
    if (id.includes('transport') || type === 'TRANSPORT') return 'data/ship_icons/cf_transport.png';
    return '';
}

function resolveNpcShipVisual(npcShip, ship, type, factionId = '') {
    const archetypeId = String(npcShip?.ship || npcShip?.archetype || '').toLowerCase();
    const shipRecord = ship || shipsData()[archetypeId] || null;
    const derivedIcon = shipRecord?.id ? `data/ship_icons/${String(shipRecord.id).toLowerCase()}.png` : (archetypeId ? `data/ship_icons/${archetypeId}.png` : '');
    const aliasIcon = npcShipIconAlias(archetypeId || shipRecord?.id, shipRecord);
    return {
        shipId: shipRecord?.id || archetypeId,
        shipName: shipRecord?.name || npcShip?.ship || '',
        shipIcon: aliasIcon || shipRecord?.icon || derivedIcon || defaultNpcShipIcon(type, factionId),
        shipIconFallback: aliasIcon || defaultNpcShipIcon(type, factionId),
        shipRecord
    };
}

function weightedPick(entries, weightKey = 'weight') {
    const valid = (entries || []).filter(entry => entry && Number(entry[weightKey] ?? 1) > 0);
    if (!valid.length) return null;
    const total = valid.reduce((sum, entry) => sum + Number(entry[weightKey] ?? 1), 0);
    let roll = Math.random() * total;
    for (const entry of valid) {
        roll -= Number(entry[weightKey] ?? 1);
        if (roll <= 0) return entry;
    }
    return valid[valid.length - 1];
}

function npcRoleFromPopulation(zone, encounter = null, faction = null) {
    const text = `${zone?.id || ''} ${zone?.name || ''} ${encounter?.id || ''} ${faction?.id || ''}`.toLowerCase();
    if (text.includes('pirate') || text.includes('criminal') || text.includes('fc_') || text.includes('nomad')) return 'pirate';
    if (text.includes('police') || text.includes('patrol') || text.includes('_p_grp') || text.includes('navy') || text.includes('military')) return 'police';
    if (text.includes('trade') || text.includes('transport') || text.includes('freighter') || text.includes('liner') || text.includes('co_')) return 'trader';
    return 'civilian';
}

function populationDifficulty(encounter = null) {
    return clamp(Math.round(Number(encounter?.difficulty || 1)), 1, 8);
}

function getPopulationZonesForSystem(system = systemData) {
    return (system?.populationZones || []).filter(zone => Number.isFinite(zone.x) && Number.isFinite(zone.z) && Number(zone.density || 0) > 0);
}

function playerViewWorldRect(margin = 0) {
    if (!game.player) return { left: -Infinity, right: Infinity, top: -Infinity, bottom: Infinity };
    const zoom = Math.max(0.05, Number(game.zoom) || 1);
    const halfWidth = (Number(game.width) || window.innerWidth || 1600) / zoom / 2 + margin;
    const halfHeight = (Number(game.height) || window.innerHeight || 900) / zoom / 2 + margin;
    return {
        left: game.player.x - halfWidth,
        right: game.player.x + halfWidth,
        top: game.player.z - halfHeight,
        bottom: game.player.z + halfHeight
    };
}

function isPointInsidePlayerView(x, z, margin = 900) {
    if (!game.player) return false;
    const rect = playerViewWorldRect(margin);
    return x >= rect.left && x <= rect.right && z >= rect.top && z <= rect.bottom;
}

function pushPointOutsidePlayerView(point, margin = 1800) {
    if (!game.player || !point) return point;
    if (!isPointInsidePlayerView(point.x, point.z, margin * 0.25)) return point;
    const dx = point.x - game.player.x;
    const dz = point.z - game.player.z;
    const angle = Math.abs(dx) + Math.abs(dz) > 1 ? Math.atan2(dz, dx) : Math.random() * Math.PI * 2;
    const rect = playerViewWorldRect(0);
    const halfWidth = Math.max(1, rect.right - game.player.x);
    const halfHeight = Math.max(1, rect.bottom - game.player.z);
    const distanceToEdge = Math.min(
        Math.abs(Math.cos(angle)) > 0.001 ? halfWidth / Math.abs(Math.cos(angle)) : Infinity,
        Math.abs(Math.sin(angle)) > 0.001 ? halfHeight / Math.abs(Math.sin(angle)) : Infinity
    );
    const distance = Math.max(distanceToEdge + margin, Math.hypot(dx, dz));
    return {
        x: game.player.x + Math.cos(angle) * distance,
        z: game.player.z + Math.sin(angle) * distance
    };
}

function randomOffscreenPointInZone(zone) {
    for (let attempt = 0; attempt < 28; attempt++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 5200 + Math.random() * 11000;
        const point = {
            x: game.player.x + Math.cos(angle) * distance,
            z: game.player.z + Math.sin(angle) * distance
        };
        if (!isPointInsidePlayerView(point.x, point.z) && isPointInsideZone(zone, point.x, point.z)) return point;
    }
    return pushPointOutsidePlayerView(randomPointNearPlayerInZone(zone), 2200);
}

function offscreenSpawnPointForRoute(origin, destination = null, role = 'traffic') {
    const target = destination || origin || game.player;
    if (!target) return { x: 0, z: 0, rotation: 0 };
    const seed = origin && destination
        ? { x: origin.x + (destination.x - origin.x) * 0.18, z: origin.z + (destination.z - origin.z) * 0.18 }
        : { x: target.x || 0, z: target.z || 0 };
    const point = pushPointOutsidePlayerView(seed, role === 'pirate' ? 2600 : 2200);
    const rotation = target ? Math.atan2((target.z || 0) - point.z, (target.x || 0) - point.x) : Math.random() * Math.PI * 2;
    return { x: point.x, z: point.z, rotation };
}

function desiredNpcCountForZone(zone) {
    const density = Number(zone.density || 0) + Number(zone.populationAdditive || 0);
    return clamp(Math.round(density * 5), 1, 8);
}

function randomPointNearPlayerInZone(zone) {
    if (!game.player) return { x: zone.x, z: zone.z };
    for (let attempt = 0; attempt < 18; attempt++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 4200 + Math.random() * 6200;
        const point = {
            x: game.player.x + Math.cos(angle) * distance,
            z: game.player.z + Math.sin(angle) * distance
        };
        if (isPointInsideZone(zone, point.x, point.z)) return point;
    }
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.min(zone.sizeX || zone.size || 3000, zone.sizeZ || zone.size || 3000) * (0.25 + Math.random() * 0.5);
    const local = rotatePoint(Math.cos(angle) * radius, Math.sin(angle) * radius, flYawToCanvasRotation(zone.rotateY || 0));
    return { x: zone.x + local.x, z: zone.z + local.z };
}

function npcDockingTargets() {
    return (game.entities || []).filter(entity => entity instanceof Station || entity instanceof PlanetLocation);
}

function legalTrafficTargets() {
    return (game.entities || []).filter(entity =>
        entity instanceof Station
        || entity instanceof PlanetLocation
        || (entity instanceof JumpGate && entity.kind === 'gate' && entity.dest)
    );
}

function irregularTrafficTargets() {
    return (game.entities || []).filter(entity =>
        entity instanceof Station
        || entity instanceof PlanetLocation
        || (entity instanceof JumpGate && entity.dest)
    );
}

function formationOffset(index = 0, spacing = 260) {
    const pattern = [
        { x: 0, z: 0, role: 'Lead' },
        { x: -spacing, z: -spacing * 0.65, role: 'Port Escort' },
        { x: -spacing, z: spacing * 0.65, role: 'Starboard Escort' },
        { x: -spacing * 1.85, z: 0, role: 'Rear Guard' }
    ];
    return pattern[index] || { x: -spacing * (1 + Math.floor(index / 2)), z: (index % 2 ? 1 : -1) * spacing * 0.8, role: 'Wing' };
}

function rotateFormationOffset(offset, rotation) {
    const forwardX = Math.cos(rotation);
    const forwardZ = Math.sin(rotation);
    const sideX = Math.cos(rotation + Math.PI / 2);
    const sideZ = Math.sin(rotation + Math.PI / 2);
    return {
        x: forwardX * offset.x + sideX * offset.z,
        z: forwardZ * offset.x + sideZ * offset.z
    };
}

function fleetById(id) {
    return id ? (game.npcFleets || []).find(fleet => fleet.id === id) || null : null;
}

function fleetMembers(fleet) {
    if (!fleet?.id) return [];
    return (game.npcs || []).filter(npc => npc.fleetId === fleet.id && npc.hull > 0);
}

function fleetLeader(fleet) {
    return (game.npcs || []).find(npc => npc.id === fleet?.leaderId && npc.hull > 0) || null;
}

function fleetIsFormed(fleet) {
    const members = fleetMembers(fleet);
    if (!fleet || members.length < Math.min(3, fleet.size || 3)) return false;
    return members.every(npc => {
        const target = formationWorldPoint(fleet, npc);
        return !target || Math.hypot(npc.x - target.x, npc.z - target.z) < 420;
    });
}

function formationWorldPoint(fleet, npc) {
    if (!fleet || !npc) return null;
    const leader = fleetLeader(fleet);
    const rotation = fleet.state === 'forming' ? (fleet.gather?.rotation || 0) : (leader?.rotation ?? fleet.gather?.rotation ?? 0);
    const baseX = fleet.state === 'forming' ? (fleet.gather?.x || npc.x) : (leader?.x ?? npc.x);
    const baseZ = fleet.state === 'forming' ? (fleet.gather?.z || npc.z) : (leader?.z ?? npc.z);
    const offset = formationOffset(npc.formationIndex || 0, fleet.spacing || 260);
    const rotated = rotateFormationOffset(offset, rotation);
    return { x: baseX + rotated.x, z: baseZ + rotated.z, rotation };
}

function launchPointFromTargetObject(target, angle = Math.random() * Math.PI * 2, distance = 360) {
    if (!target) return { x: 0, z: 0, rotation: angle };
    const radius = Math.max(distance, Number(target.radius || target.sourceRadius || 120) + distance);
    return {
        x: Number(target.x || 0) + Math.cos(angle) * radius,
        z: Number(target.z || 0) + Math.sin(angle) * radius,
        rotation: angle
    };
}

function nearestTradeLaneRingToPoint(x, z) {
    let best = null;
    let bestDistance = Infinity;
    for (const entity of game.entities || []) {
        if (!(entity instanceof TradeLaneRing)) continue;
        const distance = Math.hypot(entity.x - x, entity.z - z);
        if (distance < bestDistance) {
            best = entity;
            bestDistance = distance;
        }
    }
    return best ? { ring: best, distance: bestDistance } : null;
}

function tradeLaneExitRingForRoute(entryRing, destination) {
    if (!entryRing?.laneRings?.length || !destination) return null;
    let best = null;
    let bestDistance = Infinity;
    for (const ring of entryRing.laneRings) {
        const distance = Math.hypot((destination.x || 0) - ring.x, (destination.z || 0) - ring.z);
        if (distance < bestDistance) {
            best = ring;
            bestDistance = distance;
        }
    }
    return best ? findTradeLaneRingEntity(best) || entryRing : null;
}

function buildNpcTradeRoute(origin, destination) {
    if (!origin || !destination || origin === destination) return [];
    const route = [];
    const entry = nearestTradeLaneRingToPoint(origin.x, origin.z);
    const exit = entry && entry.distance < 9000 ? tradeLaneExitRingForRoute(entry.ring, destination) : null;
    if (entry?.ring && exit && exit !== entry.ring) {
        route.push({ type: 'tradelane', target: entry.ring, exit });
    }
    route.push({ type: 'dock', target: destination });
    return route;
}

function randomNpcTradeDestination(origin, options = {}) {
    const targetPool = options.irregular ? irregularTrafficTargets() : legalTrafficTargets();
    const targets = targetPool.filter(target => target !== origin);
    if (!targets.length) return null;
    if (!origin) return targets[Math.floor(Math.random() * targets.length)];
    const sorted = targets
        .map(target => ({ target, distance: Math.hypot((target.x || 0) - (origin?.x || 0), (target.z || 0) - (origin?.z || 0)) }))
        .sort((a, b) => a.distance - b.distance);
    const pool = sorted.slice(0, Math.min(5, sorted.length));
    return pool[Math.floor(Math.random() * pool.length)]?.target || null;
}

function assignNpcTradeRoute(npc, origin = null, destination = null) {
    const pool = npc.irregularTraffic ? irregularTrafficTargets() : legalTrafficTargets();
    const source = origin || npc.tradeOrigin || pool.sort((a, b) => Math.hypot(a.x - npc.x, a.z - npc.z) - Math.hypot(b.x - npc.x, b.z - npc.z))[0] || null;
    const target = destination || randomNpcTradeDestination(source, { irregular: npc.irregularTraffic });
    npc.tradeOrigin = source;
    npc.tradeDestination = target;
    npc.tradeRoute = buildNpcTradeRoute(source, target);
    npc.tradeWaypointIndex = 0;
    npc.tradeState = 'enroute';
    npc.tradeDockTimer = 0;
}

function startNpcTradeLane(npc, ring, exitRing = null) {
    if (!npc || !(ring instanceof TradeLaneRing)) return false;
    const route = ring.laneRings || [];
    if (route.length < 2) return false;
    const exitIndex = Number.isInteger(exitRing?.index) ? exitRing.index : (route.length - 1);
    const direction = exitIndex < ring.index ? -1 : 1;
    npc.x = ring.x;
    npc.z = ring.z;
    npc.inTradeLane = true;
    npc.cruiseActive = false;
    npc.tradeLaneRoute = route;
    npc.tradeLaneIndex = ring.index + direction;
    npc.tradeLaneExitIndex = exitIndex;
    npc.tradeLaneDirection = direction;
    npc.speed = Math.max(90, Math.min(Number(npc.speed) || 90, 900));
    npc.throttle = 1;
    maybeNpcRadio(npc, 'tradeLane', ring, 34);
    return true;
}

function updateNpcTradeLane(npc, dt) {
    if (!npc?.inTradeLane || !npc.tradeLaneRoute) return false;
    const target = npc.tradeLaneRoute[npc.tradeLaneIndex];
    if (!target) {
        npc.inTradeLane = false;
        npc.tradeLaneRoute = null;
        npc.cruiseActive = false;
        npc.speed = Math.min(npc.speed || 0, npc.maxSpeed || COMBAT_MAX_SPEED);
        return false;
    }
    const dx = target.x - npc.x;
    const dz = target.z - npc.z;
    const distance = Math.hypot(dx, dz);
    npc.speed += (1700 - npc.speed) * Math.min(1, dt * 1.2);
    if (distance <= Math.max(1, npc.speed * dt)) {
        npc.x = target.x;
        npc.z = target.z;
        if (distance > 0.001) npc.rotation = Math.atan2(dz, dx);
        if (npc.tradeLaneIndex === npc.tradeLaneExitIndex) {
            npc.inTradeLane = false;
            npc.tradeLaneRoute = null;
            npc.cruiseActive = false;
            npc.tradeLaneIndex = 0;
            npc.speed = Math.min(npc.speed || 0, npc.maxSpeed || COMBAT_MAX_SPEED);
            npc.tradeWaypointIndex = (npc.tradeWaypointIndex || 0) + 1;
            return false;
        }
        npc.tradeLaneIndex += npc.tradeLaneDirection || 1;
        return true;
    }
    npc.rotation = Math.atan2(dz, dx);
    npc.x += (dx / distance) * npc.speed * dt;
    npc.z += (dz / distance) * npc.speed * dt;
    return true;
}

function setNpcCruise(npc, active) {
    if (!npc) return;
    const disrupted = (Number(npc.cruiseDisruptedUntil) || 0) > performance.now();
    npc.cruiseActive = Boolean(active) && !disrupted && !npc.hidden && !npc.inTradeLane;
}

function updateNpcCruiseForDistance(npc, distance, options = {}) {
    if (!npc) return;
    if ((Number(npc.cruiseDisruptedUntil) || 0) > performance.now() || npc.hidden || npc.inTradeLane || options.combat || options.disabled) {
        setNpcCruise(npc, false);
        return;
    }
    const enterDistance = Number(options.enterDistance) || NPC_CRUISE_ENTER_DISTANCE;
    const exitDistance = Number(options.exitDistance) || NPC_CRUISE_EXIT_DISTANCE;
    if (npc.cruiseActive) {
        setNpcCruise(npc, distance > exitDistance);
    } else {
        setNpcCruise(npc, distance > enterDistance);
    }
    if (npc.cruiseActive) npc.throttle = Math.max(npc.throttle || 0, 0.95);
}

function npcRadioCallsign(npc) {
    const faction = factionDisplayName(npc?.faction || '').replace(/\s+/g, ' ').trim();
    return `${faction || 'Civilian'} ${npc?.name || 'Contact'}`;
}

function stationRadioName(target) {
    return target?.name || target?.id || 'Traffic Control';
}

function radioText(npc, event, target = null) {
    const call = npcRadioCallsign(npc);
    const station = stationRadioName(target);
    const english = game.language === 'en';
    const lines = {
        dockRequest: english
            ? `${call} to ${station}, requesting permission to dock.`
            : `${call} an ${station}, erbitte Andockerlaubnis.`,
        dockApproved: english
            ? `${station} to ${npc?.name || 'contact'}, docking request granted. Proceed to docking port.`
            : `${station} an ${npc?.name || 'Kontakt'}, Andockerlaubnis erteilt. Fliegen Sie zum Docking-Port.`,
        tradeLane: english
            ? `${call}, entering trade lane and proceeding on route.`
            : `${call}, trete in die Handelsroute ein und setze Kurs fort.`,
        patrolReport: english
            ? `${call}, patrol sweep complete near ${station}. Continuing route.`
            : `${call}, Patrouillensektor bei ${station} geprüft. Route wird fortgesetzt.`,
        departure: english
            ? `${call} departing ${station}, route confirmed.`
            : `${call} startet von ${station}, Route bestätigt.`
    };
    return lines[event] || '';
}

function maybeNpcRadio(npc, event, target = null, cooldown = 24) {
    if (!npc || npc.hidden || !event) return;
    game.radioCooldowns ||= {};
    const key = `${npc.id}:${event}`;
    const now = performance.now();
    if (game.radioCooldowns[key] && now - game.radioCooldowns[key] < cooldown * 1000) return;
    game.radioCooldowns[key] = now;
    const text = radioText(npc, event, target);
    if (text) {
        npc.speechBubble = {
            text,
            createdAt: now,
            expiresAt: now + Math.max(2600, Math.min(6200, 2100 + text.length * 42))
        };
    }
}

function placeEscortNearLeader(escort, leader, index = 0) {
    if (!escort || !leader) return;
    const side = index % 2 === 0 ? -1 : 1;
    const back = 260 + Math.floor(index / 2) * 130;
    const lateral = 180 * side;
    escort.x = leader.x - Math.cos(leader.rotation) * back + Math.cos(leader.rotation + Math.PI / 2) * lateral;
    escort.z = leader.z - Math.sin(leader.rotation) * back + Math.sin(leader.rotation + Math.PI / 2) * lateral;
    escort.rotation = leader.rotation;
    escort.speed = leader.speed;
    escort.throttle = leader.throttle;
    escort.cruiseActive = Boolean(leader.cruiseActive);
}

function convoyMembersForLeader(leader) {
    if (!leader?.convoyId) return [];
    return game.npcs.filter(npc => npc.convoyId === leader.convoyId && npc !== leader);
}

function createNpcFleet(type, origin, destination = null, options = {}) {
    if (!origin || game.npcs.length > 48) return null;
    const size = clamp(Number(options.size) || (3 + Math.floor(Math.random() * 2)), 3, 4);
    const angle = destination ? Math.atan2((destination.z || 0) - origin.z, (destination.x || 0) - origin.x) : Math.random() * Math.PI * 2;
    const launch = options.spawnPoint || offscreenSpawnPointForRoute(origin, destination, type);
    const routeAngle = Number.isFinite(launch.rotation) ? launch.rotation : angle;
    const fleetId = `${type}-fleet-${Math.random().toString(36).slice(2, 9)}`;
    const faction = normalizeFactionId(options.faction || origin.faction || (type === 'security' ? 'li_p_grp' : type === 'pirate' ? 'fc_lr_grp' : 'co_ss_grp'));
    const fleet = {
        id: fleetId,
        type,
        state: options.ambientTrade ? 'enroute' : 'forming',
        origin,
        destination,
        gather: {
            x: launch.x + Math.cos(routeAngle) * 650,
            z: launch.z + Math.sin(routeAngle) * 650,
            rotation: routeAngle
        },
        size,
        spacing: type === 'trade' ? 290 : 240,
        wait: 0,
        maxWait: 7 + Math.random() * 5,
        patrolIndex: 0,
        combatTimer: 0,
        threatTargetId: '',
        threatenedUntil: 0,
        mission: type === 'trade' ? 'trade-route' : type === 'security' ? 'security-patrol' : 'irregular-route'
    };
    game.npcFleets.push(fleet);

    const members = [];
    for (let i = 0; i < size && game.npcs.length < 52; i++) {
        const role = type === 'trade'
            ? (i === 0 || (i === 1 && Math.random() < 0.45) ? 'trader' : 'police')
            : (type === 'pirate' ? 'pirate' : 'police');
        const difficulty = type === 'trade' ? 4 + Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 4);
        const offset = formationOffset(i, fleet.spacing);
        const rotated = rotateFormationOffset(offset, routeAngle);
        const npc = createNPC(role, {
            x: launch.x + rotated.x * 0.45 + (Math.random() - 0.5) * 90,
            z: launch.z + rotated.z * 0.45 + (Math.random() - 0.5) * 90,
            difficulty,
            faction,
            npcShip: role === 'trader' ? chooseNpcShipForRole('trader', difficulty, faction) : null,
            populationZoneId: options.zone?.id || '',
            name: (type === 'security' ? 'SEC' : type === 'pirate' ? 'IRG' : (role === 'trader' ? 'CNV' : 'ESC')) + '-' + (Math.floor(Math.random() * 9000) + 1000)
        });
        npc.rotation = routeAngle;
        npc.fleetId = fleetId;
        npc.convoyId = fleetId;
        npc.formationIndex = i;
        npc.formationRole = offset.role;
        npc.trafficRole = type;
        npc.ambientTrade = Boolean(options.ambientTrade);
        npc.irregularTraffic = type === 'pirate';
        npc.isFleetLeader = i === 0;
        npc.escortFor = i === 0 ? '' : members[0]?.id || '';
        npc.escortIndex = i - 1;
        if ((type === 'trade' || type === 'pirate') && i === 0) {
            npc.isTradeConvoy = true;
            npc.tradeOrigin = origin;
            npc.tradeDestination = destination || randomNpcTradeDestination(origin, { irregular: type === 'pirate' });
            if (type === 'pirate') {
                npc.patrolRoute = nearestAsteroidFieldPatrolRoute(faction) || choosePatrolPathForFaction(faction, 'pirate')?.points || [];
                npc.tradeRoute = npc.patrolRoute.length ? npc.patrolRoute.map(point => ({ type: 'patrol', target: point })) : buildNpcTradeRoute(origin, npc.tradeDestination);
            } else {
                npc.tradeRoute = options.directTransit
                    ? [{ type: 'dock', target: npc.tradeDestination }]
                    : buildNpcTradeRoute(origin, npc.tradeDestination);
            }
            npc.tradeWaypointIndex = 0;
            npc.tradeState = fleet.state === 'forming' ? 'forming' : 'enroute';
            npc.maxSpeed = Math.max(type === 'pirate' ? 120 : 82, Math.min(type === 'pirate' ? 160 : 105, npc.maxSpeed || 90));
            npc.throttle = fleet.state === 'forming' ? 0.35 : 0.75;
        } else if (type === 'security' && i === 0) {
            npc.patrolRoute = buildSecurityPatrolRoute(origin);
            npc.patrolIndex = 0;
        }
        game.npcs.push(npc);
        members.push(npc);
        if (i === 0) fleet.leaderId = npc.id;
    }
    return members[0] || null;
}

function buildSecurityPatrolRoute(origin) {
    const patrolPath = choosePatrolPathForFaction(origin?.faction || 'li_p_grp', 'security');
    if (patrolPath?.points?.length) return patrolPath.points;
    const points = [];
    if (origin) points.push(origin);
    const nearbyGates = (game.entities || [])
        .filter(entity => entity instanceof JumpGate && entity.kind === 'gate')
        .sort((a, b) => Math.hypot(a.x - (origin?.x || 0), a.z - (origin?.z || 0)) - Math.hypot(b.x - (origin?.x || 0), b.z - (origin?.z || 0)))
        .slice(0, 2);
    points.push(...nearbyGates);
    for (const lane of (systemData.tradeLanes || []).slice(0, 2)) {
        const first = lane.rings?.[0];
        const last = lane.rings?.[lane.rings.length - 1];
        if (first) points.push(first);
        if (last) points.push(last);
    }
    if (points.length < 2 && game.player) points.push({ x: game.player.x + 2400, z: game.player.z, name: 'Patrol Point' });
    return points;
}

function normalizePatrolPath(path) {
    return {
        ...path,
        points: (path.points || []).map(point => ({
            id: point.id || point.nickname || '',
            name: point.name || point.id || path.id || 'Patrol Point',
            x: Number(point.x || 0),
            z: Number(point.z || 0),
            size: Number(point.size || 1000),
            sizeX: Number(point.size_x || point.sizeX || point.size || 1000),
            sizeZ: Number(point.size_z || point.sizeZ || point.size || 1000),
            shape: point.shape || 'ELLIPSOID',
            rotateY: Number(point.rotate_y || point.rotateY || 0)
        }))
    };
}

function choosePatrolPathForFaction(factionId = '', role = 'security') {
    const paths = (systemData.patrolPaths || []).filter(path => path.points?.length >= 2);
    if (!paths.length) return null;
    const faction = normalizeFactionId(factionId);
    const wantedPirate = role === 'pirate' || faction.startsWith('fc_');
    const scored = paths.map(path => {
        const text = `${path.id || ''} ${path.usage || ''} ${(path.encounters || []).map(e => e.id).join(' ')} ${(path.factions || []).map(f => f.id).join(' ')}`.toLowerCase();
        const factionHit = (path.factions || []).some(entry => normalizeFactionId(entry.id) === faction) ? -8 : 0;
        const roleHit = wantedPirate
            ? (text.includes('pirate') || text.includes('fc_') || text.includes('unlaw') ? -5 : 4)
            : (text.includes('police') || text.includes('patrolp_gov') || text.includes('_p_grp') || text.includes('lawful') ? -4 : 0);
        const usageHit = String(path.usage || '').toLowerCase().includes('patrol') ? -2 : 1;
        return { path, score: factionHit + roleHit + usageHit + Math.random() * 2 };
    }).sort((a, b) => a.score - b.score);
    return scored[0]?.path || null;
}

function nearestAsteroidFieldPatrolRoute(factionId = '') {
    const field = (systemData.asteroidfields || [])
        .map(item => ({ item, distance: game.player ? Math.hypot(item.x - game.player.x, item.z - game.player.z) : 0 }))
        .sort((a, b) => a.distance - b.distance)[0]?.item;
    if (!field) return null;
    const radiusX = Math.max(1400, Number(field.sizeX || field.size || 6000) * 0.62);
    const radiusZ = Math.max(1400, Number(field.sizeZ || field.size || 6000) * 0.62);
    return Array.from({ length: 5 }, (_, index) => {
        const angle = (index / 5) * Math.PI * 2 + 0.35;
        return {
            id: `${field.id || field.nickname || 'field'}-patrol-${index}`,
            name: field.name || 'Asteroid Patrol',
            x: field.x + Math.cos(angle) * radiusX,
            z: field.z + Math.sin(angle) * radiusZ
        };
    });
}

function updateNpcFleets(dt) {
    for (let i = game.npcFleets.length - 1; i >= 0; i--) {
        const fleet = game.npcFleets[i];
        const leader = fleetLeader(fleet);
        const members = fleetMembers(fleet);
        const threat = npcThreatTarget(fleet.threatTargetId);
        const inCombat = Boolean(threat && (fleet.threatenedUntil || 0) > performance.now());
        fleet.combatTimer = Freelancer2DLogic.advanceFleetCombatTimer(fleet.combatTimer, dt, inCombat);
        if (inCombat && fleet.state !== 'forming') fleet.state = 'combat';
        if (!inCombat && fleet.state === 'combat') {
            fleet.state = 'reforming';
            fleet.reformTimer = 4;
            fleet.threatTargetId = '';
        }
        if (!leader || members.length <= 0) {
            game.npcFleets.splice(i, 1);
            continue;
        }
        if (fleet.state === 'forming') {
            fleet.wait += dt;
            if (fleetIsFormed(fleet) || fleet.wait >= fleet.maxWait) {
                fleet.state = 'enroute';
                for (const member of members) {
                    if (member.isTradeConvoy) member.tradeState = 'enroute';
                    member.throttle = Math.max(member.throttle || 0, 0.65);
                }
            }
        }
    }
}

function positionAmbientConvoyInTradeLane(leader) {
    const waypoint = leader?.tradeRoute?.find(item => item.type === 'tradelane' && item.target?.laneRings?.length && item.exit);
    if (!waypoint) return false;
    const rings = waypoint.target.laneRings || [];
    if (rings.length < 2) return false;
    const entryIndex = Number.isInteger(waypoint.target.index) ? waypoint.target.index : 0;
    const exitIndex = Number.isInteger(waypoint.exit.index) ? waypoint.exit.index : rings.length - 1;
    const direction = exitIndex < entryIndex ? -1 : 1;
    const minIndex = Math.min(entryIndex, exitIndex);
    const maxIndex = Math.max(entryIndex, exitIndex);
    if (maxIndex - minIndex < 1) return false;
    const currentIndex = direction > 0
        ? clamp(Math.floor(minIndex + Math.random() * (maxIndex - minIndex)), minIndex, maxIndex - 1)
        : clamp(Math.floor(minIndex + 1 + Math.random() * (maxIndex - minIndex)), minIndex + 1, maxIndex);
    const nextIndex = currentIndex + direction;
    const current = rings[currentIndex];
    const next = rings[nextIndex];
    if (!current || !next) return false;
    const t = 0.12 + Math.random() * 0.76;
    leader.x = current.x + (next.x - current.x) * t;
    leader.z = current.z + (next.z - current.z) * t;
    if (isPointInsidePlayerView(leader.x, leader.z, 1400)) {
        const spawn = offscreenSpawnPointForRoute(current, next, 'trade');
        leader.x = spawn.x;
        leader.z = spawn.z;
    }
    leader.rotation = Math.atan2(next.z - current.z, next.x - current.x);
    leader.inTradeLane = true;
    leader.tradeLaneRoute = rings;
    leader.tradeLaneIndex = nextIndex;
    leader.tradeLaneExitIndex = exitIndex;
    leader.tradeLaneDirection = direction;
    leader.tradeWaypointIndex = leader.tradeRoute.indexOf(waypoint);
    leader.speed = 1300 + Math.random() * 300;
    leader.throttle = 1;
    convoyMembersForLeader(leader).forEach((escort, index) => placeEscortNearLeader(escort, leader, index));
    return true;
}

function positionAmbientConvoyInTransit(leader) {
    if (!leader?.tradeRoute?.length) return false;
    const waypoint = leader.tradeRoute[0];
    const origin = leader.tradeOrigin;
    const target = waypoint?.target;
    if (!origin || !target) return false;
    const t = 0.18 + Math.random() * 0.64;
    leader.x = (origin.x || 0) + ((target.x || 0) - (origin.x || 0)) * t + (Math.random() - 0.5) * 900;
    leader.z = (origin.z || 0) + ((target.z || 0) - (origin.z || 0)) * t + (Math.random() - 0.5) * 900;
    if (isPointInsidePlayerView(leader.x, leader.z, 1400)) {
        const spawn = offscreenSpawnPointForRoute(origin, target, 'trade');
        leader.x = spawn.x;
        leader.z = spawn.z;
    }
    leader.rotation = Math.atan2((target.z || 0) - leader.z, (target.x || 0) - leader.x);
    leader.speed = 55 + Math.random() * 35;
    leader.throttle = 0.8;
    convoyMembersForLeader(leader).forEach((escort, index) => placeEscortNearLeader(escort, leader, index));
    return true;
}

function distancePointToSegment(px, pz, ax, az, bx, bz) {
    return Freelancer2DLogic.distancePointToSegment(px, pz, ax, az, bx, bz);
}

function routeSpawnPointNearPlayer(origin, destination, role = 'trade') {
    if (!game.player || !origin || !destination) return null;
    const ax = Number(origin.x || 0);
    const az = Number(origin.z || 0);
    const bx = Number(destination.x || 0);
    const bz = Number(destination.z || 0);
    const dx = bx - ax;
    const dz = bz - az;
    const lenSq = dx * dx + dz * dz;
    if (lenSq <= 1) return offscreenSpawnPointForRoute(origin, destination, role);
    const baseT = clamp(((game.player.x - ax) * dx + (game.player.z - az) * dz) / lenSq, 0.08, 0.92);
    const t = clamp(baseT + (Math.random() - 0.5) * 0.34, 0.06, 0.94);
    const lateral = (Math.random() - 0.5) * 1400;
    const length = Math.sqrt(lenSq);
    const nx = -dz / length;
    const nz = dx / length;
    let point = {
        x: ax + dx * t + nx * lateral,
        z: az + dz * t + nz * lateral
    };
    point = pushPointOutsidePlayerView(point, role === 'pirate' ? 2800 : 2300);
    return {
        x: point.x,
        z: point.z,
        rotation: Math.atan2(bz - point.z, bx - point.x)
    };
}

function chooseFreeSpaceTrafficRoute() {
    if (!game.player) return null;
    const targets = legalTrafficTargets();
    if (targets.length < 2) return null;
    const candidates = [];
    for (let i = 0; i < targets.length; i++) {
        for (let j = 0; j < targets.length; j++) {
            if (i === j) continue;
            const origin = targets[i];
            const destination = targets[j];
            const distance = Math.hypot((destination.x || 0) - (origin.x || 0), (destination.z || 0) - (origin.z || 0));
            if (distance < 7000) continue;
            const routeDistance = distancePointToSegment(game.player.x, game.player.z, origin.x || 0, origin.z || 0, destination.x || 0, destination.z || 0);
            if (routeDistance > 26000) continue;
            candidates.push({
                origin,
                destination,
                routeDistance,
                score: routeDistance + Math.random() * 4500
            });
        }
    }
    candidates.sort((a, b) => a.score - b.score);
    return candidates[0] || null;
}

function visibleFreeSpaceNpcCount(range = 22000) {
    if (!game.player) return 0;
    return game.npcs.filter(npc => {
        if (!npc || npc.hidden || npc.hull <= 0 || npc.missionId) return false;
        return Math.hypot(npc.x - game.player.x, npc.z - game.player.z) <= range;
    }).length;
}

function spawnFreeSpaceTrafficNearPlayer() {
    if (!game.player || game.isDocked || game.activeMission?.spawned) return false;
    if (game.npcs.length >= 58 || visibleFreeSpaceNpcCount() >= 10) return false;
    const route = chooseFreeSpaceTrafficRoute();
    if (!route) return false;
    const spawnPoint = routeSpawnPointNearPlayer(route.origin, route.destination, 'trade');
    const leader = spawnTraderConvoy(route.origin, null, route.origin?.faction || '', {
        ambientTrade: true,
        destination: route.destination,
        spawnPoint,
        directTransit: true,
        size: Math.random() < 0.72 ? 3 : 4
    });
    if (!leader) return false;
    leader.ambientFreeSpaceTraffic = true;
    convoyMembersForLeader(leader).forEach(member => { member.ambientFreeSpaceTraffic = true; });
    return true;
}

function seedAmbientTradeTrafficForSystem() {
    if (game.ambientTradeSeededSystemId === currentSystemId) return;
    game.ambientTradeSeededSystemId = currentSystemId;
    const targets = legalTrafficTargets();
    if (targets.length < 2) return;
    const laneCount = (systemData.tradeLanes || []).length;
    const desiredConvoys = clamp(Math.ceil(targets.length * 0.45) + laneCount, 4, 8);
    const existingLeaders = () => game.npcs.filter(npc => npc.isTradeConvoy && npc.isFleetLeader && !npc.missionId).length;
    let attempts = 0;
    while (existingLeaders() < desiredConvoys && game.npcs.length < 44 && attempts < desiredConvoys * 3) {
        attempts++;
        const origin = targets[Math.floor(Math.random() * targets.length)];
        const leader = spawnTraderConvoy(origin, null, origin?.faction || '', { ambientTrade: true });
        if (!leader) continue;
        const placedInLane = Math.random() < 0.68 && positionAmbientConvoyInTradeLane(leader);
        if (!placedInLane) positionAmbientConvoyInTransit(leader);
    }
    const securityOrigins = targets.filter(target => target instanceof Station || target instanceof JumpGate);
    const desiredSecurity = clamp(Math.ceil(securityOrigins.length * 0.35), 2, 5);
    let securityAttempts = 0;
    while ((game.npcFleets || []).filter(fleet => fleet.type === 'security').length < desiredSecurity && game.npcs.length < 54 && securityAttempts < desiredSecurity * 3) {
        securityAttempts++;
        const origin = securityOrigins[Math.floor(Math.random() * securityOrigins.length)];
        createNpcFleet('security', origin, null, { ambientTrade: true, faction: origin?.faction || 'li_p_grp' });
    }
}

function spawnTraderConvoy(origin = null, zone = null, factionId = '', options = {}) {
    const targets = legalTrafficTargets();
    if (targets.length < 2 || game.npcs.length > 46) return null;
    const visibleTargets = game.player ? targets.filter(target => Math.hypot((target.x || 0) - game.player.x, (target.z || 0) - game.player.z) < 19000) : [];
    const sourcePool = visibleTargets.length ? visibleTargets : targets;
    const source = origin || sourcePool[Math.floor(Math.random() * sourcePool.length)];
    const destination = options.destination || randomNpcTradeDestination(source);
    if (!source || !destination) return null;
    return createNpcFleet('trade', source, destination, {
        zone,
        faction: factionId || source.faction || 'co_ss_grp',
        ambientTrade: options.ambientTrade,
        spawnPoint: options.spawnPoint,
        directTransit: options.directTransit,
        size: options.size || (3 + Math.floor(Math.random() * 2))
    });
}

function spawnPopulationNpc(zone) {
    const encounter = weightedPick(zone.encounters) || { id: 'area_scout', difficulty: 1, weight: 1 };
    const faction = weightedPick(zone.factions) || null;
    const role = npcRoleFromPopulation(zone, encounter, faction);
    if (role === 'trader' && Math.random() < 0.7) return spawnTraderConvoy(null, zone, faction?.id || '');
    if (role === 'police' && Math.random() < 0.45) {
        const origin = legalTrafficTargets()
            .filter(target => Math.hypot((target.x || 0) - zone.x, (target.z || 0) - zone.z) < Math.max(zone.sizeX || zone.size || 8000, zone.sizeZ || zone.size || 8000) + 9000)
            .sort((a, b) => Math.hypot(a.x - zone.x, a.z - zone.z) - Math.hypot(b.x - zone.x, b.z - zone.z))[0];
        if (origin) return createNpcFleet('security', origin, null, { zone, faction: faction?.id || origin.faction || 'li_p_grp' });
    }
    if (role === 'pirate' && Math.random() < 0.35) {
        const irregularTargets = irregularTrafficTargets();
        const origin = irregularTargets[Math.floor(Math.random() * irregularTargets.length)];
        if (origin) return createNpcFleet('pirate', origin, null, { zone, faction: faction?.id || 'fc_lr_grp' });
    }
    const difficulty = populationDifficulty(encounter);
    const point = randomOffscreenPointInZone(zone);
    const npc = createNPC(role, {
        x: point.x,
        z: point.z,
        difficulty,
        faction: faction?.id || '',
        populationZoneId: zone.id,
        name: (faction?.id || encounter.id || role).slice(0, 12).toUpperCase() + '-' + (Math.floor(Math.random() * 9000) + 1000)
    });
    npc.populationZoneId = zone.id;
    npc.faction = normalizeFactionId(faction?.id || npc.faction || '');
    npc.encounter = encounter.id || '';
    npc.targetAngle = Math.random() * Math.PI * 2;
    game.npcs.push(npc);
    return npc;
}

function updatePopulationNpcs(dt) {
    if (!game.player || game.activeMission?.spawned) return;
    game.populationSpawnTimer = Math.max(0, (game.populationSpawnTimer || 0) - dt);
    game.stationLaunchTimer = Math.max(0, (game.stationLaunchTimer || 0) - dt);
    game.freeSpaceTrafficTimer = Math.max(0, (game.freeSpaceTrafficTimer || 0) - dt);
    for (let i = game.npcs.length - 1; i >= 0; i--) {
        const npc = game.npcs[i];
        if (!npc.populationZoneId || npc.missionId) continue;
        const distance = Math.hypot(npc.x - game.player.x, npc.z - game.player.z);
        if (distance > 24000 || npc.hull <= 0) game.npcs.splice(i, 1);
    }
    if (game.freeSpaceTrafficTimer <= 0) {
        const nearbyTraffic = visibleFreeSpaceNpcCount(24000);
        game.freeSpaceTrafficTimer = nearbyTraffic < 6 ? 7 + Math.random() * 7 : 12 + Math.random() * 12;
        if (nearbyTraffic < 10) spawnFreeSpaceTrafficNearPlayer();
    }
    if (game.stationLaunchTimer <= 0 && game.npcs.length < 44) {
        game.stationLaunchTimer = 12 + Math.random() * 14;
        const station = npcDockingTargets()
            .filter(target => Math.hypot((target.x || 0) - game.player.x, (target.z || 0) - game.player.z) < 18000)
            .sort((a, b) => Math.hypot(a.x - game.player.x, a.z - game.player.z) - Math.hypot(b.x - game.player.x, b.z - game.player.z))[0];
        if (station && Math.random() < 0.72) spawnTraderConvoy(station, null, station.faction || '');
        else if (station) createNpcFleet('security', station, null, { faction: station.faction || 'li_p_grp' });
    }
    if (game.populationSpawnTimer > 0) return;
    game.populationSpawnTimer = 4;
    const zones = getPopulationZonesForSystem().filter(zone => isPointInsideZone(zone, game.player.x, game.player.z));
    if (!zones.length) return;
    for (const zone of zones.slice(0, 3)) {
        const existing = game.npcs.filter(npc => npc.populationZoneId === zone.id && !npc.missionId).length;
        const desired = desiredNpcCountForZone(zone);
        if (existing < desired && game.npcs.length < 42) {
            const count = Math.min(2, desired - existing);
            for (let i = 0; i < count; i++) spawnPopulationNpc(zone);
        }
    }
}

function applyLanguage() {
    const labels = [
        ['btn-map', 'map'],
        ['btn-inventory', 'inventory'], ['btn-reputation', 'reputation'], ['btn-info', 'info'], ['btn-menu', 'menu'], ['btn-launch', 'launch'], ['btn-clear-selection', 'clearSelection'],
        ['btn-waypoint-selection', 'waypointFromSelection'], ['btn-clear-waypoint', 'clearWaypoint']
    ];
    for (const [id, key] of labels) {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    }
    updateCommandIconLabels();
    const languageButton = document.getElementById('btn-language');
    if (languageButton) languageButton.textContent = game.language.toUpperCase();
    const mainMenuLanguageButton = document.getElementById('btn-language-menu');
    if (mainMenuLanguageButton) mainMenuLanguageButton.textContent = `${t('mainMenuLanguage')}: ${game.language.toUpperCase()}`;
    const startButton = document.getElementById('btn-start');
    if (startButton) startButton.textContent = t('startGame');
    const newButton = document.getElementById('btn-new-game');
    if (newButton) newButton.textContent = t('startNew');
    const deleteButton = document.getElementById('btn-delete-save');
    if (deleteButton) deleteButton.textContent = t('startDelete');
    const saveNameInput = document.getElementById('save-name-input');
    if (saveNameInput) saveNameInput.placeholder = t('saveNamePlaceholder');
    const editSaveNameButton = document.getElementById('btn-edit-save-name');
    if (editSaveNameButton) editSaveNameButton.textContent = t('editSaveName');
    const saveNameButton = document.getElementById('btn-save-name');
    if (saveNameButton) saveNameButton.textContent = t('saveSaveName');
    const hullLabel = document.getElementById('label-hull');
    if (hullLabel) hullLabel.textContent = t('hudHull');
    const shieldLabel = document.getElementById('label-shield');
    if (shieldLabel) shieldLabel.textContent = t('hudShield');
    const energyLabel = document.getElementById('label-energy');
    if (energyLabel) energyLabel.textContent = t('hudEnergy');
    const thrustLabel = document.getElementById('label-thrust');
    if (thrustLabel) thrustLabel.textContent = t('hudThrust');
    const loadoutTitle = document.getElementById('loadout-title');
    if (loadoutTitle) loadoutTitle.textContent = t('loadoutTitle');
    const scannerTitle = document.getElementById('scanner-title');
    if (scannerTitle) scannerTitle.textContent = t('scannerTitle');
    const nanobotLabel = document.getElementById('label-nanobots');
    if (nanobotLabel) nanobotLabel.textContent = t('labelNanobots');
    const batteryLabel = document.getElementById('label-shield-batteries');
    if (batteryLabel) batteryLabel.textContent = t('labelShieldBatteries');
    const mineLabel = document.getElementById('label-mines');
    if (mineLabel) mineLabel.textContent = t('mines');
    const countermeasureLabel = document.getElementById('label-countermeasures');
    if (countermeasureLabel) countermeasureLabel.textContent = t('countermeasures');
    const missileWarning = document.getElementById('missile-warning');
    if (missileWarning) missileWarning.textContent = t('missileIncoming');
    const controlsTitle = document.getElementById('controls-title');
    if (controlsTitle) controlsTitle.textContent = t('startControls');
    const startControls = [
        ['control-rotate', 'controlRotate'], ['control-cursor', 'controlCursor'], ['control-fire', 'controlFire'], ['control-select', 'controlSelect'],
        ['control-throttle-up', 'controlThrottleUp'], ['control-throttle-down', 'controlThrottleDown'], ['control-reverse', 'controlReverse'], ['control-afterburner', 'controlAfterburner'],
        ['control-dock', 'controlDock'], ['control-approach', 'controlApproach'], ['control-map', 'controlMap'], ['control-nanobots', 'controlNanobots'], ['control-mines', 'controlMines'],
        ['control-countermeasures', 'controlCountermeasures'], ['control-batteries', 'controlBatteries'], ['control-zoom', 'controlZoom']
    ];
    for (const [id, key] of startControls) {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    }
    const tabs = document.querySelectorAll('.landing-tab');
    const tabKeys = { launch: 'launchDeck', bar: 'bar', equipment: 'equipmentDealer', trade: 'tradeDealer', ship: 'shipDealer' };
    tabs.forEach(tab => { tab.textContent = t(tabKeys[tab.dataset.deck] || tab.dataset.deck); });
    if (game.player) updateHUD();
    updateSaveHint(readSavedGame());
    if (game.landedBase) showLandingDeck(game.landingDeck || 'launch');
}

function toggleLanguage() {
    game.language = game.language === 'de' ? 'en' : 'de';
    applyLanguage();
    saveGame();
}

function applyHudTheme() {
    const hud = document.getElementById('hud');
    const theme = game.activeModId === 'crossfire' ? 'crossfire' : 'default';
    if (hud) hud.dataset.theme = theme;
    document.body.dataset.theme = theme;
}

// Load real LI01 data from Freelancer INI files
function getSystemRecord(systemId) {
    const baseSource = typeof GAME_SYSTEMS !== 'undefined' ? GAME_SYSTEMS : FALLBACK_GAME_SYSTEMS;
    const activeSource = game.modData?.GAME_SYSTEMS || baseSource;
    const objectValue = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const findRecord = source => {
        if (!source) return null;
        const key = Object.keys(source).find(k => k.toLowerCase() === systemId.toLowerCase());
        return key ? source[key] : null;
    };
    const baseRecord = findRecord(baseSource) || {};
    const activeRecord = findRecord(activeSource);
    if (!activeRecord || activeRecord === baseRecord) return baseRecord;
    return {
        ...baseRecord,
        ...activeRecord,
        background: { ...objectValue(baseRecord.background), ...objectValue(activeRecord.background) },
        music: { ...objectValue(baseRecord.music), ...objectValue(activeRecord.music) }
    };
}

function displayName(value, fallback = 'Unknown') {
    const resolved = getNameFromID(value);
    return resolved || value || fallback;
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

function degToRad(value) {
    return (Number(value) || 0) * Math.PI / 180;
}

const COMBAT_MAX_SPEED = 80;
const CRUISE_SPEED = 300;
const CROSSFIRE_CRUISE_SPEED = 450;
const NPC_CRUISE_ENTER_DISTANCE = 4200;
const NPC_CRUISE_EXIT_DISTANCE = 1350;
const AFTERBURNER_SPEED = 200;
const REVERSE_SPEED = -15;
const MAX_MINE_AMMO = 50;
const MINE_DROP_COOLDOWN = 0.8;
const MINE_SPEED = 34;
const MINE_LIFETIME = 36;
const MINE_SEEK_RANGE = 5200;
const MINE_DAMAGE = 420;
const COUNTERMEASURE_LIFETIME = 3;
const COUNTERMEASURE_RANGE = 1000;
const COUNTERMEASURE_DIVERSION = 0.7;
const CRUISE_CHARGE_SECONDS = 5;
const NORMAL_FLIGHT_EXIT_SPEED = COMBAT_MAX_SPEED;
const TRADE_LANE_ACCELERATION = 1250;
const TRADE_LANE_DECELERATION = 1850;
const TRADE_LANE_BRAKE_DISTANCE = 5200;
const JUMP_TRANSITION_TOTAL_DURATION = 8;
const JUMP_TRANSITION_PHASE_DURATION = JUMP_TRANSITION_TOTAL_DURATION / 2;
const JUMP_HOLE_CAPTURE_DISTANCE = 520;
const JUMP_HOLE_PULL_DURATION = 1.45;
const MISSION_SPAWN_DISTANCE = 1700;
const MISSION_ENEMY_MIN_COUNT = 3;
const MISSION_ENEMY_MAX_COUNT = 7;
const MISSION_PATROL_CHECKPOINT_RADIUS = 650;
const SOLAR_OBJECT_RENDER_SCALE = 0.18;
const SOLAR_OBJECT_VISUAL_RENDER_SCALE = 0.24;
const SOLAR_OBJECT_ICON_RADIUS_BOOST = 1.1;
const SOLAR_OBJECT_ICON_DRAW_SCALE = 2.2;
const SOLAR_OBJECT_FLATLAS_ICON_RADIUS_SCALE = 1 / (SOLAR_OBJECT_ICON_RADIUS_BOOST * (SOLAR_OBJECT_ICON_DRAW_SCALE / 2));
const SOLAR_OBJECT_MIN_SCREEN_RADIUS = 12;
const SOLAR_OBJECT_FALLBACK_RADII = {
    jumpgate: 600,
    jumphole: 600,
    jumphole_red: 600,
    jumphole_green: 600,
    jumphole_orange: 600,
    jumphole_light: 600,
    trade_lane_ring: 300
};

function flYawToCanvasRotation(value) {
    return -degToRad(value);
}

function smoothStep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
}

function solarObjectSourceRadius(value, archetype = '', fallback = 600) {
    const explicit = Number(value);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const key = String(archetype || '').toLowerCase();
    return SOLAR_OBJECT_FALLBACK_RADII[key] || fallback;
}

function solarObjectWorldRadius(value, archetype = '', fallback = 600) {
    return Math.max(1, solarObjectSourceRadius(value, archetype, fallback) * SOLAR_OBJECT_RENDER_SCALE);
}

function solarObjectVisualWorldRadius(value, archetype = '', fallback = 600) {
    const modelRadius = getObjectModelRadius(archetype);
    if (Number.isFinite(modelRadius) && modelRadius > 0) {
        return Math.max(1, modelRadius * SOLAR_OBJECT_FLATLAS_ICON_RADIUS_SCALE);
    }
    return Math.max(1, solarObjectSourceRadius(value, archetype, fallback) * SOLAR_OBJECT_VISUAL_RENDER_SCALE);
}

function solarObjectScreenRadius(worldRadius) {
    return Math.max(SOLAR_OBJECT_MIN_SCREEN_RADIUS, worldRadius * game.zoom * SOLAR_OBJECT_ICON_RADIUS_BOOST);
}

function solarObjectRawRadiusFromData(data, archetype = '', fallback = 600) {
    return solarObjectSourceRadius(data?.solar_radius ?? data?.solarRadius ?? data?.radius, archetype || data?.archetype || data?.type, fallback);
}

function cruiseSpeedForMod(modId = game.activeModId) {
    return normalizeModId(modId) === 'crossfire' ? CROSSFIRE_CRUISE_SPEED : CRUISE_SPEED;
}

function setNormalFlightSpeed(player, speed = NORMAL_FLIGHT_EXIT_SPEED) {
    if (!player) return;
    player.cancelCruise?.();
    player.afterburnerActive = false;
    player.reverseActive = false;
    player.maxSpeed = player.baseMaxSpeed || COMBAT_MAX_SPEED;
    player.throttle = player.maxSpeed > 0 ? clamp(speed / player.maxSpeed, 0, 1) : 0;
    player.speed = Math.min(Math.max(0, speed), player.maxSpeed || speed);
    updateCruiseButton();
}

function rotatePoint(x, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: x * cos - z * sin,
        z: x * sin + z * cos
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function formatDistance(meters) {
    return Freelancer2DLogic.formatDistance(meters);
}

function formatEta(seconds) {
    return Freelancer2DLogic.formatEta(seconds);
}

function tradeLaneRingRotation(rings, index) {
    const current = rings[index];
    const prev = index > 0 ? rings[index - 1] : null;
    const next = index < rings.length - 1 ? rings[index + 1] : null;
    let dx = 0;
    let dz = 0;
    if (prev && next) {
        dx = next.x - prev.x;
        dz = next.z - prev.z;
    } else if (next) {
        dx = next.x - current.x;
        dz = next.z - current.z;
    } else if (prev) {
        dx = current.x - prev.x;
        dz = current.z - prev.z;
    }
    if (Math.abs(dx) + Math.abs(dz) < 0.001) return flYawToCanvasRotation(current.rotate_y || current.rotateY || 0);
    return -Math.atan2(dx, dz);
}

function getTradeLaneStartForRing(ring, player) {
    return Freelancer2DLogic.tradeLaneStart(ring?.laneRings, ring?.index, player?.rotation);
}

function startTradeLaneFromRing(ring) {
    if (!(ring instanceof TradeLaneRing) || !game.player) return false;
    const start = getTradeLaneStartForRing(ring, game.player);
    if (!start) {
        addLog('Trade lane route unavailable', 'alert');
        return false;
    }
    game.player.x = ring.x;
    game.player.z = ring.z;
    game.player.inTradeLane = true;
    game.player.laneRoute = ring.laneRings;
    game.player.laneIndex = start.targetIndex;
    game.player.laneDirection = start.direction;
    game.player.maxSpeed = game.player.laneSpeed;
    game.player.speed = Math.max(NORMAL_FLIGHT_EXIT_SPEED, Math.min(game.player.speed || NORMAL_FLIGHT_EXIT_SPEED, game.player.laneSpeed * 0.22));
    game.player.throttle = 1;
    game.player.tradeLaneCooldownUntil = 0;
    game.approachTarget = null;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    const next = ring.laneRings[start.targetIndex];
    if (next) game.player.rotation = Math.atan2(next.z - ring.z, next.x - ring.x);
    addLog('Entered trade lane at ring ' + (ring.index + 1) + ' of ' + ring.laneRings.length);
    playVoice('tradeRouteInitiated', 1);
    playSound('tradeLane', 1.1);
    updateSpeedControl();
    return true;
}

function findTradeLaneRingEntity(ring, index = null) {
    return game.entities.find(entity => entity instanceof TradeLaneRing
        && ((ring.id && entity.id === ring.id) || (entity.x === ring.x && entity.z === ring.z && (index === null || entity.index === index)))) || null;
}

function setWaypointTarget(target, name = '') {
    if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.z)) return null;
    if (game.activeMission && target.type !== 'Mission' && !target.isWaypoint) {
        addLog(t('missionWaypointLocked'), 'alert');
        return game.waypoint;
    }
    const waypoint = target.isWaypoint ? target : {
        id: 'waypoint_' + Math.round(target.x) + '_' + Math.round(target.z),
        name: name || target.name || 'Waypoint',
        x: target.x,
        z: target.z,
        systemId: currentSystemId,
        type: target.type || 'Waypoint',
        linkedTarget: target,
        isWaypoint: true,
        containsPoint(px, pz) {
            const dx = this.x - px;
            const dz = this.z - pz;
            return Math.sqrt(dx * dx + dz * dz) < 700;
        }
    };
    game.waypoint = waypoint;
    addLog('Waypoint set: ' + waypoint.name);
    playSound('select', 0.8);
    saveGame();
    updateHUD();
    if (game.showMap) drawMapCanvas();
    return waypoint;
}

function setFreeSpaceWaypoint(x, z) {
    if (game.activeMission) {
        addLog(t('missionFreeWaypointsLocked'), 'alert');
        return game.waypoint;
    }
    return setWaypointTarget({ x, z, name: 'Waypoint', type: 'Waypoint' }, 'Waypoint');
}

function createWaypointFromSelection() {
    const target = game.selectedTarget;
    if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.z)) {
        addLog(t('noWaypointSelection'), 'alert');
        return null;
    }
    const waypoint = setWaypointTarget(target, target.name || scannerObjectKind(target));
    if (waypoint === target || waypoint?.linkedTarget === target) game.selectedTarget = waypoint;
    return waypoint;
}

function clearNavigationSelection() {
    game.selectedTarget = null;
    game.approachTarget = null;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    addLog(t('selectionCleared'));
    playSound('select', 0.45);
    updateHUD();
    if (game.showMap) drawMapCanvas();
}

function clearWaypoint() {
    if (!game.waypoint) return;
    if (game.activeMission && game.waypoint.type === 'Mission') {
        addLog(t('missionWaypointLocked'), 'alert');
        return;
    }
    game.waypoint = null;
    addLog('Waypoint cleared.');
    playSound('select', 0.45);
    saveGame();
    updateHUD();
    if (game.showMap) drawMapCanvas();
}

function getShipPackage(packageId) {
    if (!packageId) return null;
    return shipPackagesData()[String(packageId).toLowerCase()] || null;
}

function shipRecordForId(shipId) {
    return shipsData()[String(shipId || '').toLowerCase()] || null;
}

function shipModelBounds(source) {
    if (!source) return null;
    return source.modelBounds || source.stats?.modelBounds || null;
}

function shipVisualWorldRadius(source, options = {}) {
    const bounds = shipModelBounds(source);
    const radius = Number(bounds?.radius || 0);
    const width = Number(bounds?.width || 0);
    const length = Number(bounds?.length || 0);
    if (radius > 0 || width > 0 || length > 0) {
        const topRadius = Math.max(radius, width * 0.5, length * 0.5);
        return clamp(topRadius * 3.05, 14, 130);
    }
    const id = String(source?.id || source?.ship || source?.shipId || options.shipId || '').toLowerCase();
    const type = String(source?.type || options.type || '').toUpperCase();
    const mass = Number(source?.mass || source?.stats?.mass || 0);
    const hitPts = Number(source?.hitPts || source?.stats?.hull || 0);
    if (id.includes('large_train') || id.includes('ge_train')) return 92;
    if (id.includes('transport') || type === 'TRANSPORT') return 64;
    if (type === 'FREIGHTER' || mass >= 250) return 42;
    return clamp(Math.sqrt(Math.max(hitPts, 900)) * 0.34, 18, 34);
}

function getShipImage(iconPath, fallbackPath = 'data/ship_icons/_fallback.png') {
    if (!iconPath) return null;
    if (!game.shipImages[iconPath]) {
        const img = new Image();
        img.onerror = () => { img.dataset.failed = '1'; };
        const separator = iconPath.includes('?') ? '&' : '?';
        img.src = `${iconPath}${separator}v=${encodeURIComponent(DATA_CACHE_VERSION)}`;
        game.shipImages[iconPath] = img;
    }
    const image = game.shipImages[iconPath];
    if (image.dataset.failed === '1') return fallbackPath && fallbackPath !== iconPath ? getShipImage(fallbackPath, '') : null;
    return image.complete && image.naturalWidth > 0 ? image : null;
}

function getObjectIcon(archetype) {
    if (!archetype) return '';
    const entry = objectIconsData()[String(archetype).toLowerCase()];
    if (!entry) return '';
    return typeof entry === 'string' ? entry : (entry.src || entry.path || '');
}

function getObjectModelRadius(archetype) {
    if (!archetype) return 0;
    const entry = objectIconsData()[String(archetype).toLowerCase()];
    if (!entry || typeof entry === 'string') return 0;
    const radius = Number(entry.model_radius ?? entry.modelRadius ?? 0);
    return Number.isFinite(radius) && radius > 0 ? radius : 0;
}

function getObjectImage(archetype) {
    const iconPath = getObjectIcon(archetype);
    if (!iconPath) return null;
    if (!game.objectImages[iconPath]) {
        const img = new Image();
        const separator = iconPath.includes('?') ? '&' : '?';
        img.src = `${iconPath}${separator}v=${encodeURIComponent(DATA_CACHE_VERSION)}`;
        game.objectImages[iconPath] = img;
    }
    const image = game.objectImages[iconPath];
    return image.complete && image.naturalWidth > 0 ? image : null;
}

function normalizeModId(modId) {
    const id = String(modId || '').toLowerCase();
    if (id === 'vanilla') return VANILLA_DE_MOD_ID;
    return MODS.some(mod => mod.id === id) ? id : VANILLA_DE_MOD_ID;
}

function isVanillaDeActive() {
    return normalizeModId(game.activeModId || localStorage.getItem(ACTIVE_MOD_KEY)) === VANILLA_DE_MOD_ID;
}

function isCrossfireActive() {
    return normalizeModId(game.activeModId || localStorage.getItem(ACTIVE_MOD_KEY)) === 'crossfire';
}

function activeModConfig() {
    const id = normalizeModId(game.activeModId || localStorage.getItem(ACTIVE_MOD_KEY));
    return MODS.find(mod => mod.id === id) || MODS[0];
}

function saveIndexStorageKey(modId = game.activeModId) {
    return `freelancer2d.${normalizeModId(modId)}.saveSlots.v1`;
}

function activeSaveStorageKey(modId = game.activeModId) {
    return `freelancer2d.${normalizeModId(modId)}.activeSaveSlot.v1`;
}

function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
        const separator = src.includes('?') ? '&' : '?';
        const versionedSrc = `${src}${separator}v=${encodeURIComponent(DATA_CACHE_VERSION)}`;
        if (document.querySelector(`script[data-mod-src="${versionedSrc}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = versionedSrc;
        script.dataset.modSrc = versionedSrc;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Could not load ' + src));
        document.head.appendChild(script);
    });
}

async function loadActiveModData() {
    game.activeModId = normalizeModId(localStorage.getItem(ACTIVE_MOD_KEY) || game.activeModId);
    const mod = activeModConfig();
    game.modData = null;
    applyHudTheme();
    if (!mod.dataPath) return;
    try {
        await loadScriptOnce(mod.dataPath);
        game.modData = window.FREELANCER2D_MOD_DATA?.[mod.id] || null;
        if (game.player) game.player.cruiseSpeed = cruiseSpeedForMod(mod.id);
    } catch (error) {
        console.warn(error);
        addLog(tf('modDataMissing', { mod: mod.name }), 'alert');
        game.activeModId = VANILLA_DE_MOD_ID;
        localStorage.setItem(ACTIVE_MOD_KEY, VANILLA_DE_MOD_ID);
        game.modData = null;
        applyHudTheme();
    }
}

function renderModSelect() {
    const container = document.getElementById('mod-select');
    if (!container) return;
    container.innerHTML = MODS.map(mod => `<button class="mod-btn${mod.id === game.activeModId ? ' active' : ''}" onclick="setActiveMod('${mod.id}')">${escapeHtml(mod.name)}</button>`).join('');
}

function setActiveMod(modId) {
    const next = normalizeModId(modId);
    if (next === game.activeModId) return;
    localStorage.setItem(ACTIVE_MOD_KEY, next);
    window.location.reload();
}

function readLegacySavedGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const save = JSON.parse(raw);
        return save && save.version === SAVE_VERSION ? save : null;
    } catch (error) {
        console.warn('Could not read save game:', error);
        return null;
    }
}

function readSaveSlots() {
    try {
        const raw = localStorage.getItem(saveIndexStorageKey());
        const slots = raw ? JSON.parse(raw) : [];
        if (Array.isArray(slots) && (raw || !isVanillaDeActive())) return slots.filter(slot => slot && slot.id && slot.save?.version === SAVE_VERSION).slice(0, MAX_SAVE_SLOTS);
    } catch (error) {
        console.warn('Could not read save slots:', error);
    }
    if (!isVanillaDeActive()) return [];
    try {
        const raw = localStorage.getItem(SAVE_INDEX_KEY);
        const slots = raw ? JSON.parse(raw) : [];
        if (Array.isArray(slots) && slots.length) return slots.filter(slot => slot && slot.id && slot.save?.version === SAVE_VERSION).slice(0, MAX_SAVE_SLOTS);
    } catch (error) {
        console.warn('Could not read legacy save slots:', error);
    }
    const legacySave = readLegacySavedGame();
    if (!legacySave) return [];
    return [{
        id: 'legacy',
        name: legacySave.name || 'Pilot',
        savedAt: legacySave.savedAt || new Date().toISOString(),
        currentSystemId: legacySave.currentSystemId || 'Li01',
        save: legacySave
    }];
}

function writeSaveSlots(slots) {
    localStorage.setItem(saveIndexStorageKey(), JSON.stringify(slots.slice(0, MAX_SAVE_SLOTS)));
}

function getActiveSaveSlotId(slots = readSaveSlots()) {
    const stored = localStorage.getItem(activeSaveStorageKey()) || (isVanillaDeActive() ? localStorage.getItem(ACTIVE_SAVE_SLOT_KEY) : '') || '';
    if (stored && slots.some(slot => slot.id === stored)) return stored;
    return slots[0]?.id || '';
}

function setActiveSaveSlot(slotId) {
    const slots = readSaveSlots();
    const slot = slots.find(item => item.id === slotId);
    if (!slot) return;
    if (slot.id === game.activeSaveSlotId) {
        updateSaveHint(slot.save);
        return;
    }
    if (game.hasStarted || game.saveLoaded) saveGame();
    game.activeSaveSlotId = slot.id;
    game.saveSlotName = slot.name || 'Pilot';
    localStorage.setItem(activeSaveStorageKey(), slot.id);
    if (isVanillaDeActive()) localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, slot.id);
    game.suppressAutoSave = true;
    updateSaveHint(slot.save);
    window.location.reload();
}

function selectedSaveName() {
    const input = document.getElementById('save-name-input');
    const raw = input ? input.value.trim() : '';
    return raw || 'Pilot ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function startSaveNameEdit() {
    const slots = readSaveSlots();
    const slot = slots.find(item => item.id === game.activeSaveSlotId);
    if (!slot) return;
    game.saveNameEditing = true;
    const input = document.getElementById('save-name-input');
    if (input) {
        input.disabled = false;
        input.value = slot.name || 'Pilot';
        input.focus();
        input.select();
    }
    updateSaveHint(slot.save);
}

function commitSaveNameEdit() {
    const slots = readSaveSlots();
    const index = slots.findIndex(item => item.id === game.activeSaveSlotId);
    if (index < 0) return;
    const input = document.getElementById('save-name-input');
    const nextName = (input?.value || '').trim() || slots[index].name || 'Pilot';
    slots[index] = {
        ...slots[index],
        name: nextName,
        save: slots[index].save ? { ...slots[index].save, name: nextName } : slots[index].save
    };
    writeSaveSlots(slots);
    game.saveSlotName = nextName;
    game.saveNameEditing = false;
    updateSaveHint(slots[index].save);
}

function createNewSaveSlot() {
    const slots = readSaveSlots();
    if (slots.length >= MAX_SAVE_SLOTS) {
        alert(t('maxSavesReached'));
        return false;
    }
    if (game.hasStarted || game.saveLoaded) saveGame();
    const slotId = 'slot_' + Date.now().toString(36);
    game.activeSaveSlotId = slotId;
    game.saveSlotName = selectedSaveName();
    localStorage.setItem(activeSaveStorageKey(), slotId);
    game.suppressAutoSave = true;
    sessionStorage.setItem('freelancer2d.forceNewGame', '1');
    return true;
}

function readSavedGame(slotId = game.activeSaveSlotId) {
    const slots = readSaveSlots();
    const id = slotId || getActiveSaveSlotId(slots);
    const slot = slots.find(item => item.id === id);
    return slot?.save || null;
}

function createSaveGameState() {
    if (!game.player) return null;
    return {
        version: SAVE_VERSION,
        modId: game.activeModId,
        name: game.saveSlotName || 'Pilot',
        savedAt: new Date().toISOString(),
        currentSystemId,
        gameTime: game.gameTime,
        zoom: game.zoom,
        mapZoom: game.mapZoom,
        mapPanX: game.mapPanX,
        mapPanY: game.mapPanY,
        universeZoom: game.universeZoom,
        universePanX: game.universePanX,
        universePanY: game.universePanY,
        language: game.language,
        lastLanding: game.lastLanding,
        activeMission: game.activeMission,
        waypoint: game.waypoint ? {
            name: game.waypoint.name,
            x: game.waypoint.x,
            z: game.waypoint.z,
            systemId: game.waypoint.systemId || currentSystemId,
            type: game.waypoint.type || 'Waypoint'
        } : null,
        player: {
            x: game.player.x,
            z: game.player.z,
            rotation: game.player.rotation,
            throttle: game.player.throttle,
            speed: game.player.speed,
            hull: game.player.hull,
            shield: game.player.shield,
            energy: game.player.energy,
            thrustEnergy: game.player.thrustEnergy,
            credits: game.player.credits,
            cargo: game.player.cargo,
            equipmentInventory: cleanEquipmentInventory(game.player.equipmentInventory),
            mountedEquipment: game.player.mountedEquipment,
            nanobots: game.player.nanobots,
            shieldBatteries: game.player.shieldBatteries,
            mineAmmo: game.player.mineAmmo,
            countermeasureAutoEnabled: game.player.countermeasureAutoEnabled,
            shipPackageId: game.player.shipPackageId,
            faction: game.player.faction,
            reputations: game.player.reputations
        }
    };
}

function saveGame(showMessage = false) {
    if (game.suppressAutoSave) return;
    if (!game.hasStarted && !game.saveLoaded) return;
    if (game.player?.destroyed || game.playerDeathPending) return;
    const state = createSaveGameState();
    if (!state) return;
    try {
        const slots = readSaveSlots();
        let slotId = game.activeSaveSlotId || getActiveSaveSlotId(slots);
        if (!slotId) slotId = 'slot_' + Date.now().toString(36);
        const slotName = game.saveSlotName || selectedSaveName();
        const slot = { id: slotId, name: slotName, savedAt: state.savedAt, currentSystemId: state.currentSystemId, save: { ...state, name: slotName } };
        const index = slots.findIndex(item => item.id === slotId);
        if (index >= 0) slots[index] = slot;
        else slots.unshift(slot);
        writeSaveSlots(slots);
        game.activeSaveSlotId = slotId;
        game.saveSlotName = slotName;
        localStorage.setItem(activeSaveStorageKey(), slotId);
        game.lastSavedAt = Date.now();
        updateSaveHint(state);
        if (showMessage) addLog(t('saveStored'));
    } catch (error) {
        console.warn('Could not save game:', error);
        if (showMessage) addLog(t('saveStoreFailed'), 'alert');
    }
}

function clearSavedGame(slotId = game.activeSaveSlotId) {
    const slots = readSaveSlots().filter(slot => slot.id !== slotId);
    writeSaveSlots(slots);
    if (!slots.length) {
        localStorage.removeItem(activeSaveStorageKey());
    } else if (game.activeSaveSlotId === slotId) {
        localStorage.setItem(activeSaveStorageKey(), slots[0].id);
        game.activeSaveSlotId = slots[0].id;
        game.saveSlotName = slots[0].name || 'Pilot';
    }
    game.saveLoaded = false;
    game.lastSavedAt = 0;
    updateSaveHint(readSavedGame());
}

function restorePlayerFromSave(save) {
    if (!save?.player || !game.player) return;
    const savedPlayer = save.player;
    applyShipPackage(savedPlayer.shipPackageId || 'gf1_package');
    game.player.x = Number(savedPlayer.x) || game.player.x;
    game.player.z = Number(savedPlayer.z) || game.player.z;
    game.player.rotation = Number.isFinite(savedPlayer.rotation) ? savedPlayer.rotation : game.player.rotation;
    game.player.throttle = Number.isFinite(savedPlayer.throttle) ? savedPlayer.throttle : game.player.throttle;
    game.player.maxSpeed = COMBAT_MAX_SPEED;
    game.player.baseMaxSpeed = COMBAT_MAX_SPEED;
    game.player.cancelCruise?.();
    game.player.afterburnerActive = false;
    game.player.reverseActive = false;
    game.player.cruiseSpeed = cruiseSpeedForMod();
    game.player.speed = Number.isFinite(savedPlayer.speed) ? Math.min(savedPlayer.speed, game.player.cruiseSpeed) : 0;
    game.player.hull = Math.max(1, Math.min(game.player.maxHull, Number(savedPlayer.hull) || game.player.maxHull));
    game.player.energy = Math.max(0, Math.min(game.player.maxEnergy, Number(savedPlayer.energy) || game.player.maxEnergy));
    game.player.thrustEnergy = Math.max(0, Math.min(game.player.thrustCapacity, Number.isFinite(savedPlayer.thrustEnergy) ? savedPlayer.thrustEnergy : game.player.thrustCapacity));
    game.player.credits = Number.isFinite(savedPlayer.credits) ? savedPlayer.credits : game.player.credits;
    game.player.cargo = Array.isArray(savedPlayer.cargo) ? savedPlayer.cargo : [];
    game.player.equipmentInventory = cleanEquipmentInventory(Array.isArray(savedPlayer.equipmentInventory) ? savedPlayer.equipmentInventory : []);
    game.player.mountedEquipment = savedPlayer.mountedEquipment && typeof savedPlayer.mountedEquipment === 'object' ? savedPlayer.mountedEquipment : {};
    ensureStarterEquipmentForEmptyLoadout();
    game.player.nanobots = Number.isFinite(savedPlayer.nanobots) ? savedPlayer.nanobots : game.player.nanobots;
    game.player.shieldBatteries = Number.isFinite(savedPlayer.shieldBatteries) ? savedPlayer.shieldBatteries : game.player.shieldBatteries;
    game.player.mineAmmo = Number.isFinite(savedPlayer.mineAmmo) ? clamp(savedPlayer.mineAmmo, 0, game.player.maxMineAmmo || MAX_MINE_AMMO) : game.player.mineAmmo;
    game.player.countermeasureAutoEnabled = typeof savedPlayer.countermeasureAutoEnabled === 'boolean' ? savedPlayer.countermeasureAutoEnabled : game.player.countermeasureAutoEnabled;
    game.player.faction = normalizeFactionId(savedPlayer.faction || game.player.faction || 'li_n_grp');
    game.player.reputations = savedPlayer.reputations && typeof savedPlayer.reputations === 'object' ? { ...savedPlayer.reputations } : null;
    if (!game.player.reputations) initializePlayerReputations(game.player.faction);
    game.player.destroyed = false;
    game.player.inTradeLane = false;
    game.player.laneRoute = null;
    game.lastLanding = save.lastLanding && typeof save.lastLanding === 'object' ? save.lastLanding : null;
    game.mapZoom = Number.isFinite(save.mapZoom) ? clamp(save.mapZoom, game.minMapZoom, game.maxMapZoom) : game.mapZoom;
    game.mapPanX = Number.isFinite(save.mapPanX) ? save.mapPanX : 0;
    game.mapPanY = Number.isFinite(save.mapPanY) ? save.mapPanY : 0;
    game.universeZoom = Number.isFinite(save.universeZoom) ? clamp(save.universeZoom, game.minUniverseZoom, game.maxUniverseZoom) : game.universeZoom;
    game.universePanX = Number.isFinite(save.universePanX) ? save.universePanX : 0;
    game.universePanY = Number.isFinite(save.universePanY) ? save.universePanY : 0;
    game.activeMission = Freelancer2DLogic.restoreMissionState(save.activeMission);
    if (save.waypoint && Number.isFinite(save.waypoint.x) && Number.isFinite(save.waypoint.z)) {
        game.waypoint = {
            id: 'saved_waypoint',
            name: save.waypoint.name || 'Waypoint',
            x: save.waypoint.x,
            z: save.waypoint.z,
            systemId: save.waypoint.systemId || currentSystemId,
            type: save.waypoint.type || 'Waypoint',
            isWaypoint: true,
            containsPoint(px, pz) {
                const dx = this.x - px;
                const dz = this.z - pz;
                return Math.sqrt(dx * dx + dz * dz) < 700;
            }
        };
    } else {
        game.waypoint = null;
    }
    applyMountedEquipmentEffects();
    game.player.shield = Math.max(0, Math.min(game.player.maxShield, Number.isFinite(savedPlayer.shield) ? savedPlayer.shield : game.player.maxShield));
    updateCruiseButton();
}

function updateSaveHint(save = readSavedGame()) {
    const hint = document.getElementById('save-hint');
    const startButton = document.getElementById('btn-start');
    const newButton = document.getElementById('btn-new-game');
    const deleteButton = document.getElementById('btn-delete-save');
    const slotList = document.getElementById('save-slot-list');
    const nameInput = document.getElementById('save-name-input');
    const editNameButton = document.getElementById('btn-edit-save-name');
    const saveNameButton = document.getElementById('btn-save-name');
    const slots = readSaveSlots();
    if (!game.activeSaveSlotId) game.activeSaveSlotId = getActiveSaveSlotId(slots);
    const activeSlot = slots.find(slot => slot.id === game.activeSaveSlotId);
    renderModSelect();
    if (slotList) {
        slotList.innerHTML = slots.length ? slots.map(slot => {
            const savedAt = slot.savedAt ? new Date(slot.savedAt) : null;
            const savedLabel = savedAt && !Number.isNaN(savedAt.getTime()) ? savedAt.toLocaleString() : t('unknownDate');
            const activeClass = slot.id === game.activeSaveSlotId ? ' active' : '';
            return `<div class="save-slot${activeClass}" onclick="setActiveSaveSlot('${slot.id}')"><div><div class="save-slot-title">${escapeHtml(slot.name || 'Pilot')}</div><div class="save-slot-meta">${escapeHtml(slot.currentSystemId || slot.save?.currentSystemId || 'Li01')} - ${escapeHtml(savedLabel)}</div></div><span>${slot.id === game.activeSaveSlotId ? t('activeLabel') : t('loadLabel')}</span></div>`;
        }).join('') : `<div class="save-slot empty"><div><div class="save-slot-title">${escapeHtml(t('noSaveForMod'))}</div><div class="save-slot-meta">${escapeHtml(t('separateSaves'))}</div></div></div>`;
    }
    if (nameInput) {
        if (activeSlot && document.activeElement !== nameInput) nameInput.value = activeSlot.name || 'Pilot';
        nameInput.disabled = Boolean(activeSlot && !game.saveNameEditing);
    }
    if (editNameButton) editNameButton.classList.toggle('hidden', !activeSlot || game.saveNameEditing);
    if (saveNameButton) saveNameButton.classList.toggle('hidden', !activeSlot || !game.saveNameEditing);
    if (!hint || !startButton || !newButton || !deleteButton) return;
    if (!save) {
        hint.textContent = activeModConfig().name + ': ' + t('noSavedGameFound');
        startButton.textContent = t('startGame');
        newButton.classList.toggle('hidden', slots.length >= MAX_SAVE_SLOTS);
        deleteButton.classList.add('hidden');
        return;
    }
    const savedAt = save.savedAt ? new Date(save.savedAt) : null;
    const savedLabel = savedAt && !Number.isNaN(savedAt.getTime()) ? savedAt.toLocaleString() : t('unknownDate');
    hint.textContent = activeModConfig().name + ' ' + t('savegameLabel') + ': ' + (activeSlot?.name || save.name || 'Pilot') + ' - ' + (save.currentSystemId || 'Li01') + ' - ' + savedLabel;
    startButton.textContent = t('continueGame');
    newButton.classList.toggle('hidden', slots.length >= MAX_SAVE_SLOTS);
    deleteButton.classList.remove('hidden');
}

function returnToFreeflight(message = '', options = {}) {
    game.approachTarget = null;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    game.approachArrivalLogged = false;
    game.dockApproachVoicePlayed = false;
    game.commandMode = 'freeflight';
    if (game.player) {
        const wasInTradeLane = game.player.inTradeLane;
        if (!options.preserveMotion) {
            game.player.throttle = 0;
            game.player.speed = 0;
        }
        game.player.inTradeLane = false;
        game.player.laneRoute = null;
        game.player.laneIndex = 0;
        game.player.laneDirection = 1;
        if (wasInTradeLane) game.player.tradeLaneCooldownUntil = performance.now() + 1800;
        game.player.maxSpeed = game.player.baseMaxSpeed;
    }
    updateCommandModeButtons();
    updateSpeedControl();
    if (message) addLog(message);
}

function updateCommandModeButtons() {
    const mode = game.commandMode || 'freeflight';
    document.querySelectorAll('#command-bar .cmd-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + mode)?.classList.add('active');
}

function updateCommandIconLabels() {
    const labels = {
        'btn-freeflight': t('freeflight'),
        'btn-approach': t('approach'),
        'btn-dock': t('dock'),
        'btn-cruise': t('cruise')
    };
    for (const [id, label] of Object.entries(labels)) {
        const button = document.getElementById(id);
        if (!button) continue;
        button.title = label;
        button.setAttribute('aria-label', label);
    }
}

function isManualSteeringActive() {
    return game.mouseDown || game.joystickActive;
}

function updateTouchJoystickVisibility() {
    const joystick = document.getElementById('touch-joystick');
    const button = document.getElementById('touch-joystick-toggle');
    const actionButtons = document.getElementById('touch-action-buttons');
    if (joystick) joystick.classList.toggle('hidden', !game.touchJoystickEnabled);
    if (button) button.classList.toggle('active', !!game.touchJoystickEnabled);
    if (actionButtons) actionButtons.classList.toggle('hidden', !game.touchJoystickEnabled);
}

function resetTouchJoystick() {
    game.joystickActive = false;
    game.joystickPointerId = null;
    game.joystickPower = 0;
    const knob = document.getElementById('touch-joystick-knob');
    if (knob) knob.style.transform = 'translate(-50%, -50%)';
}

function canUseTouchAfterburner() {
    return canUseAfterburner();
}

function canUseAfterburner() {
    const p = game.player;
    return Boolean(p && !game.isDocked && !p.inTradeLane && !p.cruiseActive && !p.cruiseCharging && !game.jumpTransition && hasMountedThruster() && (Number(p.thrustEnergy) || 0) > 0);
}

function setTouchAfterburner(active) {
    game.touchAfterburnerActive = !!active && game.touchJoystickEnabled && canUseTouchAfterburner();
    const button = document.getElementById('touch-afterburner');
    if (button) button.classList.toggle('active', game.touchAfterburnerActive);
    if (!game.player) return;
    if (game.touchAfterburnerActive) {
        game.player.afterburnerActive = true;
        game.player.reverseActive = false;
        game.player.throttle = 1;
    } else {
        game.player.afterburnerActive = false;
    }
    updateSpeedControl();
}

function syncTouchAfterburnerButton() {
    if (game.player?.afterburnerActive) return;
    game.touchAfterburnerActive = false;
    document.getElementById('touch-afterburner')?.classList.remove('active');
}

function setTouchFire(active) {
    game.touchFireActive = !!active && game.touchJoystickEnabled;
    game.rightMouseDown = game.touchFireActive;
    const button = document.getElementById('touch-fire');
    if (button) button.classList.toggle('active', game.touchFireActive);
    if (game.player && !game.touchFireActive) game.player.fireHeld = false;
}

function resetTouchCombatButtons() {
    setTouchAfterburner(false);
    setTouchFire(false);
}

function toggleTouchJoystick() {
    game.touchJoystickEnabled = !game.touchJoystickEnabled;
    if (!game.touchJoystickEnabled) {
        resetTouchJoystick();
        resetTouchCombatButtons();
    }
    updateTouchJoystickVisibility();
}

function updateTouchJoystickFromPointer(e) {
    const joystick = document.getElementById('touch-joystick');
    const knob = document.getElementById('touch-joystick-knob');
    if (!joystick || !knob) return;
    const rect = joystick.getBoundingClientRect();
    const radius = rect.width * 0.36;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance > radius && distance > 0) {
        dx = dx / distance * radius;
        dy = dy / distance * radius;
    }
    game.joystickAngle = Math.atan2(dy, dx);
    game.joystickPower = Math.min(1, Math.hypot(dx, dy) / radius);
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function updateCruiseButton() {
    const button = document.getElementById('btn-cruise');
    if (!button || !game.player) return;
    const isCruising = game.player.cruiseActive || game.player.cruiseCharging;
    button.classList.toggle('cruise-active', isCruising);
    button.classList.toggle('active', isCruising);
    const label = t('cruise');
    const remaining = Math.ceil(Math.max(0, CRUISE_CHARGE_SECONDS - game.player.cruiseCharge));
    const title = game.player.cruiseCharging ? `${label} ${remaining}s` : label;
    button.title = title;
    button.setAttribute('aria-label', title);
}

function toggleCruiseFlight() {
    if (!game.player || game.isDocked || game.player.inTradeLane || game.jumpTransition) return;
    if (game.player.cruiseActive || game.player.cruiseCharging) {
        game.player.cancelCruise();
        game.player.reverseActive = false;
        game.player.throttle = 1;
        addLog(t('cruiseDisabled'));
    } else {
        game.player.startCruiseCharge();
        addLog(tf('cruiseCharging', { seconds: CRUISE_CHARGE_SECONDS }));
    }
    updateCruiseButton();
    updateSpeedControl();
}

function startAutopilotCruise() {
    if (!game.player || game.isDocked || game.player.inTradeLane || game.jumpTransition) return;
    if (game.player.cruiseActive || game.player.cruiseCharging) return;
    game.player.reverseActive = false;
    game.player.afterburnerActive = false;
    game.player.throttle = 1;
    game.player.startCruiseCharge();
    addLog(tf('cruiseCharging', { seconds: CRUISE_CHARGE_SECONDS }));
    updateCruiseButton();
    updateSpeedControl();
}

function returnToMainMenu() {
    saveGame();
    clearTimeout(game.playerDeathTimer);
    game.playerDeathTimer = null;
    game.playerDeathPending = false;
    game.running = false;
    game.mouseDown = false;
    game.rightMouseDown = false;
    resetTouchCombatButtons();
    if (game.player) {
        game.player.fireHeld = false;
        game.player.afterburnerActive = false;
        game.player.reverseActive = false;
    }
    document.getElementById('landing-overlay')?.classList.add('hidden');
    document.getElementById('map-overlay')?.classList.add('hidden');
    document.getElementById('universe-overlay')?.classList.add('hidden');
    document.getElementById('death-overlay')?.classList.add('hidden');
    document.getElementById('start-screen')?.classList.remove('hidden');
    updateSaveHint(readSavedGame());
}

function applyShipPackage(packageId, logPurchase = false) {
    const shipPackage = getShipPackage(packageId);
    if (!shipPackage || !game.player) return false;
    const stats = shipPackage.stats || {};
    game.player.shipPackageId = shipPackage.id;
    game.player.shipId = shipPackage.ship;
    game.player.shipName = shipPackage.name;
    game.player.shipIcon = shipPackage.icon;
    game.player.maxHull = stats.hull || game.player.maxHull;
    game.player.hull = game.player.maxHull;
    game.player.maxShield = 0;
    game.player.shield = 0;
    game.player.shieldRegen = 0;
    game.player.maxSpeed = COMBAT_MAX_SPEED;
    game.player.baseMaxSpeed = COMBAT_MAX_SPEED;
    game.player.turnRate = stats.turnRate || game.player.turnRate;
    game.player.agility = stats.agility || game.player.agility;
    game.player.acceleration = stats.acceleration || game.player.acceleration;
    game.player.brakeRate = stats.brakeRate || game.player.brakeRate;
    game.player.strafePower = stats.strafePower || game.player.strafePower;
    game.player.linearDrag = stats.linearDrag || game.player.linearDrag;
    game.player.bankFactor = stats.bankFactor || game.player.bankFactor;
    game.player.shipMass = stats.mass || game.player.shipMass;
    game.player.shipClass = Number.isFinite(stats.shipClass) ? stats.shipClass : game.player.shipClass;
    game.player.maxCargo = stats.holdSize || game.player.maxCargo;
    game.player.powerPlantId = shipPackage.powerplant?.id || '';
    game.player.powerPlantName = shipPackage.powerplant?.name || 'Powerplant';
    game.player.engineId = shipPackage.engine?.id || '';
    game.player.engineName = shipPackage.engine?.name || 'Engine';
    game.player.maxEnergy = Number.isFinite(stats.powerCapacity) ? stats.powerCapacity : game.player.maxEnergy;
    game.player.powerGen = Number.isFinite(stats.powerChargeRate) ? stats.powerChargeRate : game.player.powerGen;
    game.player.thrustCapacity = Number.isFinite(stats.thrustCapacity) ? stats.thrustCapacity : game.player.thrustCapacity;
    game.player.thrustChargeRate = Number.isFinite(stats.thrustChargeRate) ? stats.thrustChargeRate : game.player.thrustChargeRate;
    game.player.thrustEnergy = game.player.thrustCapacity;
    game.player.baseMaxEnergy = game.player.maxEnergy;
    game.player.basePowerGen = game.player.powerGen;
    game.player.baseThrustCapacity = game.player.thrustCapacity;
    game.player.baseThrustChargeRate = game.player.thrustChargeRate;
    game.player.baseAcceleration = game.player.acceleration;
    game.player.energy = Math.min(game.player.maxEnergy, Math.max(game.player.energy || game.player.maxEnergy, game.player.maxEnergy));
    game.player.firePower = stats.firePower || game.player.firePower || 1;
    game.player.baseFirePower = game.player.firePower;
    const shipRecord = shipsData()[String(shipPackage.ship || '').toLowerCase()] || null;
    game.player.weaponSlots = parseShipWeaponSlots(shipRecord) || clamp(game.player.firePower, 0, 8);
    game.player.weaponClassMax = parseMaxEquipmentClass(shipPackage, parseMaxEquipmentClass(shipRecord, game.player.firePower || 1));
    game.player.shieldClassMax = game.player.weaponClassMax;
    game.player.shieldFamily = shipShieldFamily();
    game.player.radius = shipVisualWorldRadius(shipRecord || shipPackage, { shipId: shipPackage.ship, type: shipPackage.type });
    ensureFixedShipEquipment();
    ensureStarterEquipmentForEmptyLoadout();
    if (logPurchase) {
        addLog('Purchased ship: ' + shipPackage.name);
        playSound('buy', 1.1);
    }
    applyMountedEquipmentEffects();
    const currentShip = document.getElementById('shop-current-ship');
    if (currentShip) currentShip.textContent = shipPackage.name;
    return true;
}

function jumpTargetSystem(target) {
    return canonicalSystemId(target?.dest || currentSystemId);
}

function findArrivalObjectInSystem(systemId, destObjectId) {
    if (!destObjectId) return null;
    const destinationSystemId = canonicalSystemId(systemId || currentSystemId);
    const destinationData = destinationSystemId.toLowerCase() === currentSystemId.toLowerCase()
        ? systemData
        : buildSystemData(destinationSystemId);
    return [...(destinationData.jumpgates || []), ...(destinationData.stations || [])]
        .find(obj => obj.id && obj.id.toLowerCase() === destObjectId.toLowerCase()) || null;
}

function hasJumpDestination(target) {
    if (!(target instanceof JumpGate)) return false;
    return !!findArrivalObjectInSystem(jumpTargetSystem(target), target.destObject);
}

function isDockableTarget(target) {
    return target instanceof Station
        || target instanceof PlanetLocation
        || target instanceof TradeLaneRing
        || hasJumpDestination(target);
}

function startDocking(target) {
    if (!isDockableTarget(target)) {
        if (target instanceof JumpGate) {
            addLog('Jump target is inactive or has no destination.', 'alert');
        } else {
            addLog('Can only dock at stations, planets, jump gates, jump holes, and trade lane rings!', 'alert');
        }
        return false;
    }
    const docking = resolveDockingTargets(target);
    const flightTarget = docking.flightTarget;
    const landingTarget = docking.landingTarget;
    if (game.player && Math.hypot((flightTarget.x || 0) - game.player.x, (flightTarget.z || 0) - game.player.z) > 10000) {
        playVoice('dockDisallowedTooFar', 1);
        addLog('Docking denied - target is more than 10 km away', 'alert');
        return false;
    }
    if (!canPlayerDockWithTarget(landingTarget) || !canPlayerDockWithTarget(flightTarget)) {
        playVoice('dockDisallowed', 1);
        addLog(tf('dockingDeniedHostile', { faction: factionDisplayName(targetFaction(landingTarget)) }), 'alert');
        return false;
    }
    game.approachTarget = flightTarget;
    game.dockTarget = flightTarget;
    game.dockLandingTarget = landingTarget;
    game.approachArrivalLogged = false;
    game.dockApproachVoicePlayed = false;
    game.commandMode = 'dock';
    updateCommandModeButtons();
    startAutopilotCruise();
    updateSpeedControl();
    const destination = flightTarget.dest ? ' -> ' + flightTarget.dest.toUpperCase() : '';
    const ringHint = flightTarget !== landingTarget ? ' via ' + flightTarget.name : '';
    addLog((flightTarget instanceof TradeLaneRing ? 'Docking with trade lane: ' : 'Docking at: ') + landingTarget.name + ringHint + destination);
    playSound('dock', flightTarget instanceof TradeLaneRing ? 0.8 : 0.65);
    return true;
}

function startJumpTransition(target) {
    if (!hasJumpDestination(target)) {
        addLog('Jump target is inactive or has no destination.', 'alert');
        return false;
    }
    const angle = Math.atan2(target.z - game.player.z, target.x - game.player.x);
    const isHole = target instanceof JumpGate && target.kind === 'hole';
    game.jumpTransition = {
        phase: 'out',
        timer: 0,
        elapsed: 0,
        startedAt: performance.now(),
        duration: JUMP_TRANSITION_PHASE_DURATION,
        totalDuration: JUMP_TRANSITION_TOTAL_DURATION,
        mode: isHole ? 'hole' : 'gate',
        angle,
        originX: target.x,
        originZ: target.z,
        depthScale: 1,
        targetSystem: jumpTargetSystem(target),
        targetObject: target.destObject,
        gateName: target.name
    };
    game.jumpHoleCapture = null;
    game.dockTarget = null;
    game.approachTarget = null;
    game.dockLandingTarget = null;
    game.player.cancelCruise?.();
    game.player.afterburnerActive = false;
    game.player.reverseActive = false;
    game.player.throttle = 0;
    game.player.speed = 0;
    updateCruiseButton();
    updateSpeedControl();
    const sameSystemJump = jumpTargetSystem(target).toLowerCase() === currentSystemId.toLowerCase();
    addLog('Jumping through ' + target.name + (sameSystemJump ? ' to another point in ' : ' to ') + jumpTargetSystem(target));
    playSound('jump', 1.2);
    return true;
}

function startJumpHoleCapture(hole) {
    if (!hole || game.jumpTransition || game.jumpHoleCapture || !hasJumpDestination(hole)) return false;
    game.jumpHoleCapture = {
        target: hole,
        timer: 0,
        duration: JUMP_HOLE_PULL_DURATION,
        startX: game.player.x,
        startZ: game.player.z,
        startRotation: game.player.rotation
    };
    game.selectedTarget = hole;
    game.approachTarget = null;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    game.commandMode = 'dock';
    game.player.cancelCruise?.();
    game.player.afterburnerActive = false;
    game.player.reverseActive = false;
    game.player.throttle = 0;
    game.player.speed = 0;
    updateCommandModeButtons();
    updateCruiseButton();
    updateSpeedControl();
    addLog('Sprungloch-Sog erfasst: ' + hole.name);
    playSound('select', 1.1);
    return true;
}

function updateJumpHoleCapture(dt) {
    const capture = game.jumpHoleCapture;
    if (!capture || !game.player) return false;
    const target = capture.target;
    if (!target || !hasJumpDestination(target)) {
        game.jumpHoleCapture = null;
        return false;
    }
    capture.timer += dt;
    const progress = clamp(capture.timer / capture.duration, 0, 1);
    const pull = smoothStep(progress);
    const wobble = Math.sin(progress * Math.PI * 4) * (1 - pull) * 18;
    const angle = Math.atan2(target.z - capture.startZ, target.x - capture.startX);
    game.player.x = capture.startX + (target.x - capture.startX) * pull + Math.cos(angle + Math.PI / 2) * wobble;
    game.player.z = capture.startZ + (target.z - capture.startZ) * pull + Math.sin(angle + Math.PI / 2) * wobble;
    game.player.rotation = angle;
    game.player.speed = 0;
    game.player.throttle = 0;
    if (progress >= 1) {
        game.player.x = target.x;
        game.player.z = target.z;
        game.jumpHoleCapture = null;
        startJumpTransition(target);
    }
    return true;
}

function updateAutomaticJumpHoleCapture() {
    if (!game.player || game.jumpTransition || game.jumpHoleCapture || game.isDocked || game.player.inTradeLane) return;
    if (performance.now() < (game.jumpHoleCaptureCooldownUntil || 0)) return;
    const holes = game.entities.filter(entity => entity instanceof JumpGate && entity.kind === 'hole' && hasJumpDestination(entity));
    for (const hole of holes) {
        const distance = Math.hypot(hole.x - game.player.x, hole.z - game.player.z);
        const captureDistance = Math.max(JUMP_HOLE_CAPTURE_DISTANCE, (hole.visualRadius || hole.radius || 0) * 1.45);
        if (distance <= captureDistance) {
            startJumpHoleCapture(hole);
            return;
        }
    }
}

let currentSystemId = 'Li01';

// Map archetype to visual size
function getStationSize(archetype) {
    if (!archetype) return 40;
    if (archetype.includes('dreadnought')) return 70;
    if (archetype.includes('largestation')) return 60;
    if (archetype.includes('outpost')) return 30;
    if (archetype.includes('depot')) return 35;
    if (archetype.includes('smallstation')) return 25;
    return 40;
}

// Map archetype to color
function getStationColor(faction) {
    if (!faction) return '#445566';
    if (faction.includes('li_n')) return '#0066aa';
    if (faction.includes('li_p')) return '#00aaff';
    if (faction.includes('co_vr')) return '#aa6600';
    if (faction.includes('fc_lr')) return '#aa4400';
    if (faction.includes('pi_')) return '#aa0000';
    return '#445566';
}

// Planet colors
function getPlanetColor(archetype) {
    if (!archetype) return '#446688';
    if (archetype.includes('earthgrncld')) return '#446688';
    if (archetype.includes('desored')) return '#886644';
    if (archetype.includes('icemoon')) return '#88aacc';
    if (archetype.includes('sun')) return '#ffffaa';
    return '#446688';
}

function inferPlanetBaseId(planet) {
    const nickname = String(planet?.nickname || '').trim();
    if (/^[A-Za-z]{2}\d{2}_\d{2}$/.test(nickname)) return nickname + '_Base';
    return '';
}

function zoneRadius(zone) {
    return Math.max(1, Number(zone?.size_x || zone?.sizeX || zone?.size || 0));
}

function matchingPlanetDeathZone(planet, zones) {
    const px = Number(planet?.x || 0);
    const pz = Number(planet?.z || 0);
    const rawRadius = Number(planet?.solar_radius || planet?.size || 1000);
    const planetId = String(planet?.nickname || planet?.id || '').toLowerCase();
    const candidates = (zones || []).filter(zone => {
        const damage = Number(zone.damage || 0);
        if (damage < 1000 || !Number.isFinite(zone.x) || !Number.isFinite(zone.z)) return false;
        const radius = zoneRadius(zone);
        const distance = Math.hypot(Number(zone.x || 0) - px, Number(zone.z || 0) - pz);
        const id = String(zone.nickname || zone.zone || '').toLowerCase();
        const namedForPlanet = planetId && id.includes(planetId) && id.includes('death');
        return namedForPlanet || distance <= Math.max(1200, radius * 0.12, rawRadius * 0.12);
    });
    return candidates
        .map(zone => ({ zone, distance: Math.hypot(Number(zone.x || 0) - px, Number(zone.z || 0) - pz) }))
        .sort((a, b) => a.distance - b.distance)[0]?.zone || null;
}

function planetRadiusFromDeathZone(planet, zones) {
    const deathZone = matchingPlanetDeathZone(planet, zones);
    if (!deathZone) return Math.max(160, (planet.solar_radius || planet.size || 1000) * 0.38);
    return Math.max(160, zoneRadius(deathZone) - 100);
}

function planetDeathZoneRadius(planet, zones) {
    const deathZone = matchingPlanetDeathZone(planet, zones);
    return deathZone ? zoneRadius(deathZone) : 0;
}

function normalizeAsteroidFieldData(field) {
    const fieldKind = String(field.fieldKind || field.field_kind || 'asteroid').toLowerCase();
    const hazardKind = String(field.hazardKind || field.hazard_kind || '').toLowerCase();
    return {
        ...field,
        id: field.nickname || field.zone || field.id || 'asteroid_field',
        name: field.name || field.nickname || field.zone || 'Asteroid Field',
        x: Number(field.x || 0),
        y: Number(field.y || 0),
        z: Number(field.z || 0),
        size: Number(field.size || 2000),
        sizeX: Number(field.size_x || field.sizeX || field.size || 2000),
        sizeY: Number(field.size_y || field.sizeY || field.size || 2000),
        sizeZ: Number(field.size_z || field.sizeZ || field.size || 2000),
        shape: field.shape || 'ELLIPSOID',
        rotateY: Number(field.rotate_y || field.rotateY || 0),
        fieldKind,
        hazardKind,
        fieldFlags: Array.isArray(field.fieldFlags) ? field.fieldFlags : [],
        texturePanelFiles: Array.isArray(field.texturePanelFiles) ? field.texturePanelFiles : [],
        cubeObjects: Array.isArray(field.cubeObjects) ? field.cubeObjects : [],
        cubeRoles: Array.isArray(field.cubeRoles) ? field.cubeRoles : [],
        billboardShapes: Array.isArray(field.billboardShapes) ? field.billboardShapes : [],
        dynamicAsteroids: Array.isArray(field.dynamicAsteroids) ? field.dynamicAsteroids : [],
        lootCommodities: Array.isArray(field.lootCommodities) ? field.lootCommodities : [],
        exclusionZoneIds: Array.isArray(field.exclusionZoneIds) ? field.exclusionZoneIds : [],
        exclusionZones: (field.exclusionZones || []).map(z => ({
            id: z.nickname || z.zone,
            name: z.name || z.nickname || z.zone,
            x: Number(z.x || 0),
            z: Number(z.z || 0),
            size: Number(z.size || 1000),
            sizeX: Number(z.size_x || z.sizeX || z.size || 1000),
            sizeZ: Number(z.size_z || z.sizeZ || z.size || 1000),
            shape: z.shape || 'ELLIPSOID',
            rotateY: Number(z.rotate_y || z.rotateY || 0)
        })),
        densityHint: field.densityHint || field.density_hint || ''
    };
}

function buildSystemData(systemId) {
    const raw = getSystemRecord(systemId);
    const jumpgates = raw.jumpgates || [];
    const jumpholes = raw.jumpholes || [];
    const rawPlanets = raw.planets || [];
    const rawStations = raw.stations || [];
    const rawSuns = raw.suns || [];
    const suns = (rawSuns.length ? rawSuns : rawPlanets.filter(p => String(p.archetype || '').includes('sun')));
    const rawRuntimeObjects = [...new Set([...suns, ...rawPlanets, ...rawStations, ...jumpgates, ...jumpholes])];
    const runtimeIds = Freelancer2DLogic.uniqueObjectIds(rawRuntimeObjects, systemId + '_object');
    const runtimeIdByObject = new Map(rawRuntimeObjects.map((object, index) => [object, runtimeIds[index]]));
    const rawZones = raw.zones || [];
    const planets = rawPlanets.filter(p => !String(p.archetype || '').includes('sun'));
    return {
    id: systemId,
    name: displayName(raw.name, systemId),
    info: raw.info || '',
    sun: suns.length ? { x: suns[0].x, z: suns[0].z, radius: Math.max(180, (suns[0].solar_radius || suns[0].size || 1000) / 42), atmosphereRange: suns[0].atmosphere_range || suns[0].atmosphereRange || 0, type: suns[0].archetype || 'sun' } : null,
    suns: suns.map(s => ({
        id: runtimeIdByObject.get(s),
        name: displayName(s.name, s.nickname),
        x: s.x,
        z: s.z,
        radius: Math.max(180, (s.solar_radius || s.size || 1000) / 42),
        atmosphereRange: s.atmosphere_range || s.atmosphereRange || 0,
        info: s.info || '',
        type: s.archetype || 'sun'
    })),
    planets: planets.map(p => {
        const deathZoneRadius = planetDeathZoneRadius(p, rawZones);
        return {
            id: runtimeIdByObject.get(p),
            name: displayName(p.name, p.nickname),
            x: p.x,
            z: p.z,
            radius: deathZoneRadius ? Math.max(160, deathZoneRadius - 100) : planetRadiusFromDeathZone(p, rawZones),
            deathZoneRadius,
            atmosphereRange: deathZoneRadius ? deathZoneRadius + 80 : (p.atmosphere_range || p.atmosphereRange || 0),
            hasRing: !!(p.has_ring || p.hasRing),
            info: p.info || '',
            color: getPlanetColor(p.archetype),
            faction: normalizeFactionId(p.faction || p.reputation || ''),
            loadout: p.loadout || '',
            base: p.base || inferPlanetBaseId(p),
            dockWith: p.dock_with || p.dockWith || inferPlanetBaseId(p),
            type: p.archetype || 'Planet'
        };
    }),
    stations: rawStations.map(s => ({
        id: runtimeIdByObject.get(s),
        name: displayName(s.name, s.nickname),
        x: s.x,
        z: s.z,
        faction: normalizeFactionId(s.faction || s.reputation || ''),
        loadout: s.loadout || '',
        type: s.archetype,
        solarType: s.solar_type || s.solarType || '',
        radius: s.solar_radius || s.solarRadius || 600,
        rotateY: s.rotate_y || s.rotateY || 0,
        base: s.base || '',
        dockWith: s.dock_with || s.dockWith || '',
        info: s.info || ''
    })),
    jumpgates: [
        ...jumpgates.map(g => ({
        id: runtimeIdByObject.get(g),
        name: displayName(g.name, g.nickname),
        x: g.x,
        z: g.z,
        dest: g.dest_system,
        destObject: g.dest_gate,
        type: 'Jump Gate',
        kind: 'gate',
        archetype: g.archetype || 'jumpgate',
        faction: normalizeFactionId(g.faction || g.reputation || ''),
        loadout: g.loadout || '',
        radius: g.solar_radius || g.solarRadius || 600,
        rotateY: g.rotate_y || g.rotateY || 0,
        info: g.info || ''
        })),
        ...jumpholes.map(h => ({
        id: runtimeIdByObject.get(h),
        name: displayName(h.name, h.nickname),
        x: h.x,
        z: h.z,
        dest: h.dest_system,
        destObject: h.dest_hole,
        type: 'Jump Hole',
        kind: 'hole',
        archetype: h.archetype || 'jumphole',
        faction: normalizeFactionId(h.faction || h.reputation || ''),
        loadout: h.loadout || '',
        radius: h.solar_radius || h.solarRadius || 600,
        rotateY: h.rotate_y || h.rotateY || 0,
        info: h.info || ''
        }))
    ],
    tradeLanes: raw.tradeLanes || raw.tradelanes || [],
    asteroidfields: (raw.asteroidfields || []).map(normalizeAsteroidFieldData),
    background: raw.background || {},
    music: raw.music || {},
    nebulae: raw.nebulae || [],
    patrolPaths: (raw.patrolPaths || []).map(normalizePatrolPath),
    missionZones: (raw.missionZones || []).map(z => ({
        id: z.nickname || z.zone,
        name: z.name || z.nickname || z.zone,
        x: z.x || 0,
        z: z.z || 0,
        size: z.size || 1000,
        sizeX: z.size_x || z.sizeX || z.size || 1000,
        sizeZ: z.size_z || z.sizeZ || z.size || 1000,
        shape: z.shape || 'ELLIPSOID',
        rotateY: z.rotate_y || z.rotateY || 0,
        vignetteType: z.vignette_type || z.vignetteType || ''
    })),
    populationZones: (raw.populationZones || []).map(z => ({
        id: z.nickname || z.zone,
        name: z.name || z.nickname || z.zone,
        x: z.x || 0,
        z: z.z || 0,
        size: z.size || 1000,
        sizeX: z.size_x || z.sizeX || z.size || 1000,
        sizeZ: z.size_z || z.sizeZ || z.size || 1000,
        shape: z.shape || 'ELLIPSOID',
        rotateY: z.rotate_y || z.rotateY || 0,
        density: Number(z.density || 0),
        populationAdditive: Number(z.population_additive || z.populationAdditive || 0),
        reliefTime: Number(z.relief_time || z.reliefTime || 30),
        encounters: Array.isArray(z.encounters) ? z.encounters : [],
        factions: Array.isArray(z.factions) ? z.factions : []
    })),
    zones: (raw.zones || []).map(z => ({
        id: z.nickname || z.zone,
        name: z.name || z.nickname || z.zone,
        x: z.x || 0,
        z: z.z || 0,
        size: z.size || 1000,
        sizeX: z.size_x || z.sizeX || z.size || 1000,
        sizeZ: z.size_z || z.sizeZ || z.size || 1000,
        shape: z.shape || 'ELLIPSOID',
        rotateY: z.rotate_y || z.rotateY || 0,
        damage: Number(z.damage || 0),
        interference: Number(z.interference || 0),
        dragModifier: Number(z.drag_modifier || z.dragModifier || 1)
    })),
    raw
    };
}

let systemData = buildSystemData(currentSystemId);
