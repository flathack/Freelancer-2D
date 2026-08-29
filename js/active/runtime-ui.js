// Utility Functions
function worldToScreen(x, z) {
    return {
        x: (x - game.player.x) * game.zoom + game.width / 2,
        y: (z - game.player.z) * game.zoom + game.height / 2
    };
}

function screenToWorld(sx, sy) {
    return {
        x: (sx - game.width / 2) / game.zoom + game.player.x,
        y: (sy - game.height / 2) / game.zoom + game.player.z
    };
}

function addLog(message, type = 'system') {
    const logArea = document.getElementById('log-area');
    if (logArea) {
        logArea.style.display = 'block';
        const entry = document.createElement('div');
        entry.style.marginBottom = '3px';
        entry.style.color = type === 'alert' ? '#ff4444' : '#00aa00';
        const h = Math.floor(game.gameTime / 75);
        const m = Math.floor((game.gameTime % 75) / 1.25);
        entry.textContent = `[${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}] ${message}`;
        logArea.appendChild(entry);
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function allMusicTracks() {
    return [...MUSIC_TRACKS.space, ...MUSIC_TRACKS.fight, ...systemMusicTracks()];
}

function musicTrackByPath(path) {
    return allMusicTracks().find(track => track.path === path) || null;
}

function musicModeForTrack(path) {
    const systemTrack = systemMusicTracks().find(track => track.path === path);
    if (systemTrack) return systemTrack.mode;
    return MUSIC_TRACKS.fight.some(track => track.path === path) ? 'fight' : 'space';
}

function systemMusicTrack(slot = 'space') {
    const entry = systemData?.music?.[slot] || null;
    if (!entry?.path) return null;
    return {
        name: entry.name || entry.id || slot,
        path: entry.path,
        mode: slot === 'battle' ? 'fight' : 'space',
        slot,
        systemId: currentSystemId
    };
}

function systemMusicTracks() {
    const tracks = [];
    for (const slot of ['space', 'danger', 'battle']) {
        const track = systemMusicTrack(slot);
        if (track && !tracks.some(existing => existing.path === track.path)) tracks.push(track);
    }
    return tracks;
}

function defaultMusicTrack(mode = 'space') {
    const systemTrack = systemMusicTrack(mode === 'fight' ? 'battle' : 'space');
    if (systemTrack) return systemTrack;
    const tracks = MUSIC_TRACKS[mode] || MUSIC_TRACKS.space;
    return tracks[0] || null;
}

function nextMusicTrack(mode = game.musicMode) {
    const systemTrack = defaultMusicTrack(mode);
    if (systemTrack?.systemId === currentSystemId) return systemTrack;
    const tracks = MUSIC_TRACKS[mode] || MUSIC_TRACKS.space;
    if (!tracks.length) return null;
    const currentIndex = tracks.findIndex(track => track.path === game.currentMusicTrackPath);
    return tracks[(currentIndex + 1 + tracks.length) % tracks.length];
}

function ensureMusicAudio() {
    if (game.musicAudio) return game.musicAudio;
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = MUSIC_VOLUME;
    audio.muted = shouldMuteMusicForFocus();
    audio.addEventListener('ended', () => {
        const track = nextMusicTrack(game.musicMode);
        if (track) playMusicTrack(track, game.musicMode);
    });
    game.musicAudio = audio;
    return audio;
}

function shouldMuteMusicForFocus() {
    return MUSIC_BACKGROUND_MUTED && (document.hidden || !document.hasFocus());
}

function applyMusicFocusMute() {
    const muted = shouldMuteMusicForFocus();
    if (game.musicAudio) game.musicAudio.muted = muted;
    if (game.musicFadeAudio) game.musicFadeAudio.muted = muted;
}

function stopMusicFade() {
    if (game.musicFadeTimer) {
        clearInterval(game.musicFadeTimer);
        game.musicFadeTimer = null;
    }
    if (game.musicFadeAudio) {
        game.musicFadeAudio.pause();
        game.musicFadeAudio = null;
    }
}

function populateMusicPlayer() {
    const select = document.getElementById('music-track-select');
    if (!select) return;
    const signature = `${currentSystemId}:${systemMusicTracks().map(track => track.path).join('|')}`;
    if (select.dataset.musicSignature === signature) return;
    select.dataset.musicSignature = signature;
    select.innerHTML = '';
    const systemTracks = systemMusicTracks();
    if (systemTracks.length) {
        const group = document.createElement('optgroup');
        group.label = 'SYSTEM';
        for (const track of systemTracks) {
            const option = document.createElement('option');
            option.value = track.path;
            option.textContent = `${track.slot.toUpperCase()} - ${track.name}`;
            group.appendChild(option);
        }
        select.appendChild(group);
    }
    for (const mode of ['space', 'fight']) {
        const group = document.createElement('optgroup');
        group.label = mode.toUpperCase();
        for (const track of MUSIC_TRACKS[mode]) {
            const option = document.createElement('option');
            option.value = track.path;
            option.textContent = track.name;
            group.appendChild(option);
        }
        select.appendChild(group);
    }
    const initialTrack = defaultMusicTrack('space');
    if (initialTrack) select.value = initialTrack.path;
}

function updateMusicPlayer() {
    populateMusicPlayer();
    const select = document.getElementById('music-track-select');
    const button = document.getElementById('music-toggle');
    const label = document.getElementById('music-label');
    if (select && game.currentMusicTrackPath) select.value = game.currentMusicTrackPath;
    if (button) button.textContent = game.musicStoppedByUser ? 'PLAY' : 'STOP';
    if (label) label.textContent = game.musicMode === 'fight' ? 'BATTLE' : 'SPACE';
}

function playMusicTrack(track, mode = 'space', manual = false) {
    if (!track) return;
    const audio = ensureMusicAudio();
    const nextSrc = new URL(track.path, window.location.href).href;
    const sameTrack = audio.src === nextSrc;
    game.musicMode = mode;
    game.currentMusicTrackPath = track.path;
    if (manual) game.manualMusicTrackPath = track.path;
    if (sameTrack) {
        audio.volume = MUSIC_VOLUME;
        audio.muted = shouldMuteMusicForFocus();
        audio.loop = (MUSIC_TRACKS[mode] || []).length <= 1;
        if (!game.musicStoppedByUser) audio.play().catch(error => console.warn('Music playback blocked:', error));
        updateMusicPlayer();
        return;
    }
    if (game.musicStoppedByUser) {
        stopMusicFade();
        audio.src = track.path;
        audio.volume = MUSIC_VOLUME;
        audio.muted = shouldMuteMusicForFocus();
        audio.loop = (MUSIC_TRACKS[mode] || []).length <= 1;
        updateMusicPlayer();
        return;
    }
    const previous = audio.src && !audio.paused ? audio : null;
    const next = new Audio(track.path);
    next.preload = 'auto';
    next.loop = (MUSIC_TRACKS[mode] || []).length <= 1;
    next.volume = previous ? 0 : MUSIC_VOLUME;
    next.muted = shouldMuteMusicForFocus();
    next.addEventListener('ended', () => {
        if (game.musicAudio !== next) return;
        const following = nextMusicTrack(game.musicMode);
        if (following) playMusicTrack(following, game.musicMode);
    });
    stopMusicFade();
    game.musicAudio = next;
    next.play().catch(error => console.warn('Music playback blocked:', error));
    if (previous) {
        game.musicFadeAudio = previous;
        previous.muted = shouldMuteMusicForFocus();
        const start = performance.now();
        game.musicFadeTimer = setInterval(() => {
            const t = clamp((performance.now() - start) / MUSIC_CROSSFADE_MS, 0, 1);
            next.volume = MUSIC_VOLUME * t;
            previous.volume = MUSIC_VOLUME * (1 - t);
            if (t >= 1) {
                previous.pause();
                game.musicFadeAudio = null;
                clearInterval(game.musicFadeTimer);
                game.musicFadeTimer = null;
            }
        }, 40);
    }
    updateMusicPlayer();
}

function stopMusic(userInitiated = true) {
    const audio = ensureMusicAudio();
    audio.pause();
    stopMusicFade();
    if (userInitiated) game.musicStoppedByUser = true;
    updateMusicPlayer();
}

function resumeMusic() {
    game.musicStoppedByUser = false;
    const track = musicTrackByPath(game.currentMusicTrackPath) || defaultMusicTrack(game.musicMode);
    playMusicTrack(track, game.musicMode);
}

function setupMusicPlayer() {
    populateMusicPlayer();
    ensureMusicAudio();
    const select = document.getElementById('music-track-select');
    const button = document.getElementById('music-toggle');
    select?.addEventListener('change', event => {
        const track = musicTrackByPath(event.target.value);
        if (!track) return;
        const mode = musicModeForTrack(track.path);
        game.musicStoppedByUser = false;
        playMusicTrack(track, mode, true);
    });
    button?.addEventListener('click', () => {
        if (game.musicStoppedByUser) resumeMusic();
        else stopMusic(true);
    });
    document.addEventListener('visibilitychange', applyMusicFocusMute);
    window.addEventListener('blur', applyMusicFocusMute);
    window.addEventListener('focus', applyMusicFocusMute);
    applyMusicFocusMute();
    updateMusicPlayer();
}

function combatMusicActive() {
    if (!game.running || game.isDocked || !game.player) return false;
    if (hasIncomingPlayerMissile()) return true;
    return game.npcs.some(npc => {
        if (!npc || npc.hull <= 0) return false;
        const distance = Math.hypot(npc.x - game.player.x, npc.z - game.player.z);
        return distance < 2600 && (npc.hostileToPlayer || npc.missionId || playerIsHostileToFaction(npc.faction) || (npc.role === 'pirate' && !npc.faction));
    });
}

function updateMusicMode() {
    if (game.musicStoppedByUser) return;
    const manualTrack = musicTrackByPath(game.manualMusicTrackPath);
    const wantedMode = combatMusicActive() ? 'fight' : (manualTrack ? musicModeForTrack(manualTrack.path) : 'space');
    const track = manualTrack && musicModeForTrack(manualTrack.path) === wantedMode
        ? manualTrack
        : defaultMusicTrack(wantedMode);
    if (game.musicMode === wantedMode && game.currentMusicTrackPath === track?.path) return;
    playMusicTrack(track, wantedMode);
}

function ensureAudio() {
    if (game.audioContext) {
        if (game.audioContext.state === 'suspended') game.audioContext.resume();
        game.audioEnabled = true;
        primeImportedAudio();
        return game.audioContext;
    }
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    game.audioContext = new AudioCtor();
    game.audioEnabled = true;
    primeImportedAudio();
    return game.audioContext;
}

function decodeAudioDataCompat(audio, arrayBuffer) {
    return new Promise((resolve, reject) => {
        const result = audio.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
        if (result && typeof result.then === 'function') result.then(resolve).catch(reject);
    });
}

function loadAudioBuffer(name, path) {
    if (game.audioBuffers[name]) return Promise.resolve(game.audioBuffers[name]);
    if (game.audioBufferLoads[name]) return game.audioBufferLoads[name];
    if (!game.audioContext) return Promise.resolve(null);
    delete game.audioBufferFailures[name];
    game.audioBufferLoads[name] = fetch(path)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load audio asset: ${path}`);
            return response.arrayBuffer();
        })
        .then(arrayBuffer => decodeAudioDataCompat(game.audioContext, arrayBuffer))
        .then(buffer => {
            game.audioBuffers[name] = buffer;
            return buffer;
        })
        .catch(error => {
            console.warn(error);
            game.audioBufferFailures[name] = true;
            return null;
        })
        .finally(() => {
            delete game.audioBufferLoads[name];
        });
    return game.audioBufferLoads[name];
}

function primeImportedAudio() {
    if (!game.audioContext) return;
    loadAudioBuffer('justiceFire', JUSTICE_FIRE_SOUND_PATH);
    loadAudioBuffer('cruiseDisrupt', CRUISE_DISRUPTOR_SOUND_PATH);
    for (const [name, path] of collectVoiceSoundPaths()) loadAudioBuffer(name, path);
}

function playBufferedSound(name, path, volume = 0.08, playbackRate = 1) {
    const audio = game.audioContext;
    if (!audio || !game.audioEnabled) return 'failed';
    const buffer = game.audioBuffers[name];
    if (!buffer) {
        loadAudioBuffer(name, path);
        return game.audioBufferFailures[name] ? 'failed' : 'loading';
    }
    const source = audio.createBufferSource();
    const gain = audio.createGain();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(audio.destination);
    source.start();
    return 'played';
}

function playTone(frequency, duration = 0.12, type = 'sine', volume = 0.08, slideTo = null) {
    const audio = game.audioContext;
    if (!audio || !game.audioEnabled) return;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
}

function playNoise(duration = 0.12, volume = 0.08) {
    const audio = game.audioContext;
    if (!audio || !game.audioEnabled) return;
    const length = Math.max(1, Math.floor(audio.sampleRate * duration));
    const buffer = audio.createBuffer(1, length, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const source = audio.createBufferSource();
    const gain = audio.createGain();
    gain.gain.value = volume;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(audio.destination);
    source.start();
}

function voiceSoundPath(name) {
    const entry = VOICE_SOUND_PATHS[name];
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    const language = game.language === 'de' ? 'de' : 'en';
    return entry[language] || entry.en || entry.de || '';
}

function voiceBufferKey(name) {
    const language = game.language === 'de' ? 'de' : 'en';
    return 'voice_' + language + '_' + name;
}

function collectVoiceSoundPaths() {
    const paths = [];
    for (const [name, entry] of Object.entries(VOICE_SOUND_PATHS)) {
        if (typeof entry === 'string') paths.push(['voice_' + name, entry]);
        else {
            for (const [language, path] of Object.entries(entry)) paths.push(['voice_' + language + '_' + name, path]);
        }
    }
    return paths;
}

function playVoice(name, intensity = 1) {
    ensureAudio();
    const path = voiceSoundPath(name);
    if (!path) return;
    const volume = clamp(0.55 * intensity, 0.18, 0.9);
    const result = playBufferedSound(voiceBufferKey(name), path, volume);
    if (result === 'loading') {
        const voice = new Audio(path);
        voice.volume = volume;
        voice.play().catch(error => console.warn('Voice playback blocked:', error));
    }
}

function playSound(name, intensity = 1) {
    ensureAudio();
    const volume = clamp(0.035 * intensity, 0.02, 0.14);
    switch (name) {
        case 'ui': playTone(620, 0.05, 'square', volume * 0.5, 740); break;
        case 'select': playTone(520, 0.07, 'triangle', volume * 0.7, 680); break;
        case 'dock': playTone(360, 0.14, 'sine', volume, 520); break;
        case 'launch': playTone(140, 0.28, 'sawtooth', volume * 1.2, 260); break;
        case 'tradeLane': playTone(220, 0.28, 'sawtooth', volume, 720); break;
        case 'jump': playTone(90, 0.45, 'sawtooth', volume * 1.2, 520); break;
        case 'fire':
            if (playBufferedSound('justiceFire', JUSTICE_FIRE_SOUND_PATH, clamp(0.18 * intensity, 0.08, 0.42)) === 'failed') {
                playTone(880, 0.055, 'square', volume, 260);
            }
            break;
        case 'hit': playNoise(0.13, volume * 1.3); playTone(110, 0.1, 'sawtooth', volume, 70); break;
        case 'explosion': playNoise(0.38, volume * 2.0); playTone(72, 0.34, 'sawtooth', volume * 1.5, 38); break;
        case 'buy': playTone(660, 0.08, 'triangle', volume, 990); playTone(990, 0.08, 'triangle', volume * 0.8, 1320); break;
        default: playTone(440, 0.08, 'sine', volume); break;
    }
}

function playWeaponFireAt(x, z, intensity = 1) {
    if (!game.player) {
        playSound('fire', intensity);
        return;
    }
    const distance = Math.hypot((x ?? game.player.x) - game.player.x, (z ?? game.player.z) - game.player.z);
    if (distance > 2400) return;
    const falloff = 1 - clamp(distance / 2400, 0, 1);
    if (falloff <= 0.03) return;
    playSound('fire', Math.max(0.22, falloff * intensity));
}

const startMenuBackground = {
    running: false,
    lastFrameAt: 0,
    screen: localStorage.getItem(START_MENU_SCREEN_KEY) || 'classic',
    stars: [],
    dockStars: [],
    lights: [],
    nebulae: [],
    stationImage: null
};

const START_MENU_SCREENS = [
    { id: 'classic', label: '1', title: 'Classic Space' },
    { id: 'dock', label: '2', title: 'Planet Dock' }
];

function resizeStartMenuCanvas(canvas) {
    const dpr = Math.min(1.35, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
    return dpr;
}

function initStartMenuBackground() {
    const rng = seededRandom(81257);
    startMenuBackground.stars = Array.from({ length: 115 }, () => ({
        x: rng(),
        y: rng(),
        size: 0.45 + rng() * 1.8,
        speed: 0.012 + rng() * 0.035,
        phase: rng() * Math.PI * 2
    }));
    startMenuBackground.nebulae = Array.from({ length: 5 }, (_, i) => ({
        x: rng(),
        y: rng(),
        radius: 0.18 + rng() * 0.24,
        hue: [205, 220, 268, 182, 292, 212, 246][i],
        alpha: 0.05 + rng() * 0.12,
        drift: 0.015 + rng() * 0.025
    }));
    startMenuBackground.lights = Array.from({ length: 70 }, () => ({
        a: rng() * Math.PI * 2,
        r: Math.sqrt(rng()) * 0.9,
        size: 0.8 + rng() * 3.4,
        alpha: 0.24 + rng() * 0.68
    }));
    const dockRng = seededRandom(237911);
    startMenuBackground.dockStars = Array.from({ length: 150 }, () => ({
        x: dockRng(),
        y: dockRng(),
        size: 0.35 + dockRng() * 1.45,
        phase: dockRng() * Math.PI * 2,
        drift: 0.006 + dockRng() * 0.018
    }));
}

function applyStartMenuScreen(screenId = startMenuBackground.screen) {
    const screen = START_MENU_SCREENS.some(item => item.id === screenId) ? screenId : 'classic';
    startMenuBackground.screen = screen;
    localStorage.setItem(START_MENU_SCREEN_KEY, screen);
    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.dataset.menuScreen = screen;
    document.querySelectorAll('.start-screen-picker button').forEach(button => {
        button.classList.toggle('active', button.dataset.screen === screen);
    });
    drawStartMenuBackground(performance.now());
}

function renderStartMenuScreenPicker() {
    const picker = document.getElementById('start-screen-picker');
    if (!picker) return;
    picker.innerHTML = '';
    for (const screen of START_MENU_SCREENS) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.screen = screen.id;
        button.textContent = screen.label;
        button.title = screen.title;
        button.setAttribute('aria-label', screen.title);
        button.addEventListener('click', () => applyStartMenuScreen(screen.id));
        picker.appendChild(button);
    }
    applyStartMenuScreen(startMenuBackground.screen);
}

function drawStartMenuPlanet(ctx, w, h, time) {
    const radius = Math.max(w, h) * 0.34;
    const cx = w * 0.86;
    const cy = h * 0.8;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const planet = ctx.createRadialGradient(cx - radius * 0.5, cy - radius * 0.45, radius * 0.08, cx, cy, radius);
    planet.addColorStop(0, '#8c7650');
    planet.addColorStop(0.35, '#3b2f22');
    planet.addColorStop(0.63, '#08090b');
    planet.addColorStop(1, '#000000');
    ctx.fillStyle = planet;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.globalCompositeOperation = 'screen';
    for (const light of startMenuBackground.lights) {
        const angle = light.a + time * 0.000055;
        const lx = cx + Math.cos(angle) * light.r * radius * 0.78;
        const ly = cy + Math.sin(angle * 1.7) * light.r * radius * 0.5;
        const daySide = (lx - cx) / radius;
        if (daySide < -0.72) continue;
        ctx.globalAlpha = light.alpha * clamp((daySide + 0.78) / 1.78, 0, 1);
        ctx.fillStyle = '#ff7a18';
        ctx.beginPath();
        ctx.arc(lx, ly, light.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.globalAlpha = 0.36;
    ctx.strokeStyle = 'rgba(255,145,40,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawStartMenuDockPlanet(ctx, w, h, time) {
    const radius = Math.max(w, h) * 0.46;
    const cx = w * 0.88;
    const cy = h * 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    const planet = ctx.createRadialGradient(cx - radius * 0.45, cy - radius * 0.48, radius * 0.08, cx, cy, radius);
    planet.addColorStop(0, '#dcefe6');
    planet.addColorStop(0.24, '#6f9975');
    planet.addColorStop(0.55, '#1d382e');
    planet.addColorStop(0.8, '#08100f');
    planet.addColorStop(1, '#000000');
    ctx.fillStyle = planet;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.globalAlpha = 0.48;
    for (let i = 0; i < 18; i++) {
        const angle = i * 1.78 + Math.sin(time * 0.00004 + i) * 0.18;
        const band = 0.2 + (i % 6) * 0.11;
        const x = cx + Math.cos(angle) * radius * band;
        const y = cy + Math.sin(angle * 0.9) * radius * (0.18 + (i % 5) * 0.08);
        const r = radius * (0.09 + (i % 4) * 0.035);
        const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
        cloud.addColorStop(0, 'rgba(245,255,250,0.42)');
        cloud.addColorStop(1, 'rgba(245,255,250,0)');
        ctx.fillStyle = cloud;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.8, r * 0.7, angle * 0.25, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = 'rgba(170,240,255,0.38)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawStartMenuShip(ctx, x, y, scale, angle = 0, color = '#c4ced2') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(220,248,255,0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(34, 0);
    ctx.lineTo(-18, -11);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-18, 11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,205,80,0.9)';
    ctx.fillRect(-24, -7, 8, 5);
    ctx.fillRect(-24, 2, 8, 5);
    ctx.restore();
}

function getStartMenuStationImage() {
    if (!startMenuBackground.stationImage) {
        const image = new Image();
        image.src = 'assets/menu/freelancer_station_perspective.png';
        image.onload = () => drawStartMenuBackground(performance.now());
        startMenuBackground.stationImage = image;
    }
    return startMenuBackground.stationImage;
}

function drawStartMenuDockStation(ctx, w, h, time) {
    const stationImage = getStartMenuStationImage();
    if (stationImage.complete && stationImage.naturalWidth > 0) {
        const baseWidth = Math.min(w * 0.66, h * 1.14);
        const baseHeight = baseWidth * (stationImage.naturalHeight / stationImage.naturalWidth);
        const x = w * 0.66;
        const y = h * 0.5;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.05 + Math.sin(time * 0.00012) * 0.01);
        ctx.globalAlpha = 0.55;
        ctx.filter = 'blur(18px)';
        ctx.drawImage(stationImage, -baseWidth * 0.45 + 28, -baseHeight * 0.45 + 52, baseWidth, baseHeight);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;
        ctx.drawImage(stationImage, -baseWidth * 0.45, -baseHeight * 0.45, baseWidth, baseHeight);
        ctx.restore();

        const glow = ctx.createRadialGradient(w * 0.73, h * 0.57, 0, w * 0.73, h * 0.57, Math.max(w, h) * 0.16);
        glow.addColorStop(0, 'rgba(80,215,255,0.32)');
        glow.addColorStop(0.36, 'rgba(80,215,255,0.12)');
        glow.addColorStop(1, 'rgba(80,215,255,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        drawStartMenuShip(ctx, w * 0.58 + Math.sin(time * 0.0007) * 18, h * 0.36, Math.max(0.46, Math.min(w, h) / 1400), -0.25);
        drawStartMenuShip(ctx, w * 0.79, h * 0.32 + Math.cos(time * 0.0006) * 14, Math.max(0.32, Math.min(w, h) / 1800), -0.08);
        drawStartMenuShip(ctx, w * 0.52, h * 0.68, Math.max(0.36, Math.min(w, h) / 1600), -0.34);
        return;
    }

    const cx = w * 0.67;
    const cy = h * 0.57;
    const s = Math.max(0.72, Math.min(w, h) / 900);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.16);
    ctx.scale(s, s);

    const metal = ctx.createLinearGradient(-330, -210, 360, 260);
    metal.addColorStop(0, '#d7d5cc');
    metal.addColorStop(0.42, '#737b80');
    metal.addColorStop(0.75, '#1d242a');
    metal.addColorStop(1, '#090d13');
    ctx.fillStyle = metal;
    ctx.strokeStyle = 'rgba(220,245,255,0.55)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 130, 230, 104, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(2,7,14,0.96)';
    ctx.beginPath();
    ctx.ellipse(0, 130, 145, 61, 0, 0, Math.PI * 2);
    ctx.fill();

    const glow = ctx.createRadialGradient(0, 132, 0, 0, 132, 142);
    glow.addColorStop(0, 'rgba(92,215,255,0.78)');
    glow.addColorStop(0.26, 'rgba(92,215,255,0.26)');
    glow.addColorStop(1, 'rgba(92,215,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(0, 130, 150, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8f9494';
    ctx.strokeStyle = 'rgba(240,250,255,0.45)';
    ctx.lineWidth = 3;
    ctx.fillRect(-138, -64, 276, 118);
    ctx.strokeRect(-138, -64, 276, 118);
    ctx.fillStyle = '#111820';
    ctx.fillRect(-94, -34, 188, 58);

    ctx.fillStyle = '#a4aaa8';
    ctx.beginPath();
    ctx.moveTo(100, -34);
    ctx.lineTo(360, -155);
    ctx.lineTo(402, -122);
    ctx.lineTo(132, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 ? '#d9c470' : '#20252c';
        ctx.fillRect(150 + i * 22, -82 - i * 8, 15, 30);
    }

    ctx.fillStyle = '#090d15';
    ctx.fillRect(340, -144, 52, 330);
    ctx.strokeRect(340, -144, 52, 330);
    ctx.fillStyle = 'rgba(200,235,255,0.85)';
    for (let i = 0; i < 11; i++) ctx.fillRect(351, -118 + i * 26, 28, 4);

    ctx.strokeStyle = 'rgba(50,150,210,0.24)';
    ctx.lineWidth = 2;
    for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-210 + i * 42, 49);
        ctx.lineTo(-260 + i * 36, 224);
        ctx.stroke();
    }

    ctx.globalAlpha = 0.9;
    for (let i = 0; i < 28; i++) {
        const px = -210 + (i % 7) * 68;
        const py = -36 + Math.floor(i / 7) * 46;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(255,210,80,0.6)' : 'rgba(210,235,245,0.28)';
        ctx.fillRect(px, py, 24, 4);
    }
    ctx.restore();

    drawStartMenuShip(ctx, w * 0.58 + Math.sin(time * 0.0007) * 18, h * 0.36, s * 0.62, -0.25);
    drawStartMenuShip(ctx, w * 0.79, h * 0.32 + Math.cos(time * 0.0006) * 14, s * 0.42, -0.08);
    drawStartMenuShip(ctx, w * 0.52, h * 0.68, s * 0.48, -0.34);
}

function drawStartMenuDockBackground(ctx, w, h, dpr, t) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#01050b');
    bg.addColorStop(0.42, '#06102a');
    bg.addColorStop(1, '#14021c');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const nebula = ctx.createRadialGradient(w * 0.48, h * 0.86, 0, w * 0.48, h * 0.86, Math.max(w, h) * 0.45);
    nebula.addColorStop(0, 'rgba(120,42,168,0.22)');
    nebula.addColorStop(0.45, 'rgba(40,70,170,0.12)');
    nebula.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    for (const star of startMenuBackground.dockStars) {
        const x = ((star.x + t * 0.000008 * star.drift) % 1) * w;
        const y = star.y * h;
        const blink = 0.62 + Math.sin(t * 0.0016 + star.phase) * 0.32;
        ctx.globalAlpha = clamp(blink, 0.18, 1);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, star.size * dpr, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    const logoPlanetX = w * 0.31;
    const logoPlanetY = h * 0.105;
    const smallR = Math.max(28 * dpr, Math.min(w, h) * 0.075);
    const lava = ctx.createRadialGradient(logoPlanetX - smallR * 0.3, logoPlanetY - smallR * 0.36, 0, logoPlanetX, logoPlanetY, smallR);
    lava.addColorStop(0, '#ffe0a0');
    lava.addColorStop(0.28, '#9f4f28');
    lava.addColorStop(0.7, '#3b1511');
    lava.addColorStop(1, '#060506');
    ctx.fillStyle = lava;
    ctx.beginPath();
    ctx.arc(logoPlanetX, logoPlanetY, smallR, 0, Math.PI * 2);
    ctx.fill();

    drawStartMenuDockPlanet(ctx, w, h, t);
    drawStartMenuDockStation(ctx, w, h, t);
}

function drawStartMenuBackground(currentTime) {
    const canvas = document.getElementById('start-bg-canvas');
    if (!canvas) return;
    if (document.getElementById('start-screen')?.classList.contains('hidden')) return;
    const ctx = canvas.getContext('2d');
    const dpr = resizeStartMenuCanvas(canvas);
    const w = canvas.width;
    const h = canvas.height;
    const t = currentTime || performance.now();

    if (startMenuBackground.screen === 'dock') {
        drawStartMenuDockBackground(ctx, w, h, dpr, t);
        return;
    }

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#06152b');
    bg.addColorStop(0.45, '#061024');
    bg.addColorStop(1, '#01030a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const n of startMenuBackground.nebulae) {
        const x = (n.x + Math.sin(t * 0.00002 + n.hue) * n.drift) * w;
        const y = (n.y + Math.cos(t * 0.000018 + n.hue) * n.drift) * h;
        const r = n.radius * Math.max(w, h);
        const nebula = ctx.createRadialGradient(x, y, 0, x, y, r);
        nebula.addColorStop(0, `hsla(${n.hue}, 78%, 52%, ${n.alpha})`);
        nebula.addColorStop(0.42, `hsla(${(n.hue + 28) % 360}, 70%, 34%, ${n.alpha * 0.38})`);
        nebula.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = nebula;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    for (const star of startMenuBackground.stars) {
        const x = ((star.x + t * 0.00001 * star.speed) % 1) * w;
        const y = star.y * h;
        const blink = 0.58 + Math.sin(t * 0.002 + star.phase) * 0.36;
        ctx.globalAlpha = clamp(blink, 0.2, 1);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, star.size * dpr, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    const sunX = w * 0.47;
    const sunY = h * 0.23;
    const pulse = 0.85 + Math.sin(t * 0.0016) * 0.15;
    const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.max(w, h) * 0.14 * pulse);
    sun.addColorStop(0, 'rgba(255,255,230,1)');
    sun.addColorStop(0.08, 'rgba(255,206,72,0.92)');
    sun.addColorStop(0.22, 'rgba(255,126,30,0.34)');
    sun.addColorStop(1, 'rgba(255,126,30,0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,225,150,0.18)';
    ctx.lineWidth = 1 * dpr;
    for (let i = 0; i < 10; i++) {
        const angle = i * Math.PI / 5 + t * 0.00006;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 18 * dpr, sunY + Math.sin(angle) * 18 * dpr);
        ctx.lineTo(sunX + Math.cos(angle) * 180 * dpr * pulse, sunY + Math.sin(angle) * 180 * dpr * pulse);
        ctx.stroke();
    }

    ctx.save();
    ctx.translate(sunX, sunY + 22 * dpr);
    ctx.rotate(Math.sin(t * 0.00012) * 0.05);
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = 'rgba(130,200,255,0.36)';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, (180 + i * 28) * dpr, (16 + i * 4) * dpr, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();

    drawStartMenuPlanet(ctx, w, h, t);

}

function startStartMenuBackground() {
    if (startMenuBackground.running) return;
    initStartMenuBackground();
    startMenuBackground.running = true;
    const loop = (time) => {
        if (time - startMenuBackground.lastFrameAt >= 50) {
            startMenuBackground.lastFrameAt = time;
            drawStartMenuBackground(time);
        }
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    window.addEventListener('resize', () => drawStartMenuBackground(performance.now()));
}

function initStars() {
    game.stars = [];
    for (let layer = 0; layer < game.starLayers; layer++) {
        const layerStars = [];
        const count = 50 + layer * 30;
        for (let i = 0; i < count; i++) {
            layerStars.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 1200 - 600,
                size: 0.5 + Math.random() * (1.5 - layer * 0.3),
                brightness: 0.3 + Math.random() * 0.5
            });
        }
        game.stars.push(layerStars);
    }
}

function renderStars() {
    const ctx = game.ctx;
    for (let layer = 0; layer < game.stars.length; layer++) {
        const parallax = 0.1 + layer * 0.15;
        const stars = game.stars[layer];
        for (const star of stars) {
            let sx = (star.x - game.player.x * parallax) % 2000;
            let sy = (star.y - game.player.z * parallax) % 1200;
            if (sx < 0) sx += 2000;
            if (sy < 0) sy += 1200;
            const screenX = sx + (game.width - 2000) / 2;
            const screenY = sy + (game.height - 1200) / 2;
            ctx.fillStyle = `rgba(255,255,255,${star.brightness * (1 - layer * 0.2)})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function makeSystemWallpaper(systemId) {
    const key = String(systemId || 'Li01');
    if (game.systemWallpapers[key]) return game.systemWallpapers[key];
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    const rng = seededRandom(hashString('wallpaper:' + key));
    const hueA = Math.floor(rng() * 360);
    const hueB = (hueA + 75 + Math.floor(rng() * 120)) % 360;
    const hueC = (hueA + 180 + Math.floor(rng() * 70)) % 360;

    const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    base.addColorStop(0, `hsl(${hueA}, 55%, 7%)`);
    base.addColorStop(0.48, `hsl(${hueB}, 48%, 10%)`);
    base.addColorStop(1, `hsl(${hueC}, 52%, 5%)`);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
        const x = rng() * canvas.width;
        const y = rng() * canvas.height;
        const radius = 240 + rng() * 460;
        const hue = [hueA, hueB, hueC][i % 3];
        const nebula = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nebula.addColorStop(0, `hsla(${hue}, 82%, 58%, ${0.16 + rng() * 0.16})`);
        nebula.addColorStop(0.42, `hsla(${(hue + 35) % 360}, 75%, 42%, ${0.05 + rng() * 0.08})`);
        nebula.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = nebula;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 420; i++) {
        const x = rng() * canvas.width;
        const y = rng() * canvas.height;
        const size = rng() < 0.92 ? 0.6 + rng() * 1.4 : 1.8 + rng() * 2.4;
        const alpha = 0.25 + rng() * 0.72;
        const tint = rng() < 0.18 ? `hsl(${(hueB + rng() * 30) % 360}, 90%, 82%)` : '#ffffff';
        ctx.fillStyle = tint === '#ffffff' ? `rgba(255,255,255,${alpha})` : tint;
        ctx.globalAlpha = tint === '#ffffff' ? 1 : alpha;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    game.systemWallpapers[key] = canvas;
    return canvas;
}

function getSystemBackdropPalette(systemId) {
    const id = String(systemId || '').toLowerCase();
    if (id.startsWith('ku')) return { base: [214, 232, 188], accent: [190, 205, 220], star: 205 };
    if (id.startsWith('br')) return { base: [212, 28, 190], accent: [34, 48, 205], star: 42 };
    if (id.startsWith('rh')) return { base: [30, 42, 12], accent: [188, 30, 180], star: 38 };
    if (id.startsWith('li')) return { base: [208, 28, 35], accent: [30, 188, 198], star: 210 };
    if (id.startsWith('bw') || id.startsWith('ew')) return { base: [160, 176, 190], accent: [126, 146, 204], star: 170 };
    return { base: [185, 206, 142], accent: [230, 148, 200], star: 185 };
}

function currentSystemStarsphereKey(systemId = currentSystemId) {
    const raw = getSystemRecord(systemId);
    return String(raw?.background?.nebulae || raw?.background?.complex_stars || raw?.background?.basic_stars || systemId || '').toLowerCase();
}

function getStarsphereBackdropPalette(systemId) {
    const key = currentSystemStarsphereKey(systemId);
    const fallback = getSystemBackdropPalette(systemId);
    const variants = [
        [/li01/, { base: [214, 226, 205], accent: [188, 204, 232], star: 210, dust: 202 }],
        [/li02/, { base: [206, 220, 238], accent: [184, 198, 218], star: 214, dust: 220 }],
        [/li03/, { base: [222, 210, 190], accent: [198, 226, 210], star: 205, dust: 36 }],
        [/li04/, { base: [206, 230, 186], accent: [184, 216, 238], star: 198, dust: 154 }],
        [/li05/, { base: [196, 218, 235], accent: [266, 196, 226], star: 215, dust: 242 }],
        [/br01/, { base: [218, 34, 198], accent: [212, 184, 228], star: 44, dust: 32 }],
        [/br02/, { base: [224, 210, 196], accent: [198, 36, 220], star: 38, dust: 24 }],
        [/br03/, { base: [206, 226, 238], accent: [188, 198, 218], star: 208, dust: 218 }],
        [/br04/, { base: [222, 42, 22], accent: [340, 206, 28], star: 46, dust: 12 }],
        [/br05/, { base: [214, 190, 160], accent: [32, 210, 198], star: 34, dust: 28 }],
        [/br06/, { base: [196, 216, 228], accent: [276, 198, 218], star: 205, dust: 258 }],
        [/ku01/, { base: [210, 222, 190], accent: [326, 190, 238], star: 205, dust: 318 }],
        [/ku02/, { base: [202, 216, 236], accent: [190, 328, 222], star: 208, dust: 196 }],
        [/ku03/, { base: [188, 206, 230], accent: [300, 196, 214], star: 198, dust: 286 }],
        [/ku04/, { base: [218, 196, 176], accent: [332, 204, 226], star: 34, dust: 16 }],
        [/ku05/, { base: [232, 204, 172], accent: [28, 338, 198], star: 42, dust: 26 }],
        [/rh01/, { base: [34, 48, 22], accent: [196, 32, 182], star: 42, dust: 48 }],
        [/rh02/, { base: [44, 36, 26], accent: [22, 190, 210], star: 38, dust: 34 }],
        [/rh03/, { base: [28, 46, 62], accent: [188, 38, 206], star: 52, dust: 184 }],
        [/rh04/, { base: [38, 34, 24], accent: [180, 206, 30], star: 46, dust: 58 }],
        [/rh05/, { base: [32, 28, 20], accent: [16, 190, 206], star: 36, dust: 20 }],
        [/bw06/, { base: [166, 184, 214], accent: [118, 222, 178], star: 178, dust: 132 }],
        [/bw07/, { base: [182, 196, 222], accent: [130, 236, 196], star: 184, dust: 144 }],
        [/bw08/, { base: [168, 198, 228], accent: [258, 186, 214], star: 190, dust: 238 }],
        [/bw09/, { base: [178, 192, 214], accent: [286, 204, 226], star: 184, dust: 270 }],
        [/ew03/, { base: [176, 206, 236], accent: [292, 184, 214], star: 190, dust: 286 }],
        [/ew04/, { base: [196, 214, 232], accent: [132, 228, 188], star: 198, dust: 148 }],
        [/hi01/, { base: [184, 208, 238], accent: [296, 190, 218], star: 200, dust: 288 }],
        [/hi02/, { base: [166, 188, 220], accent: [18, 204, 224], star: 192, dust: 22 }],
        [/st03b/, { base: [246, 216, 178], accent: [286, 204, 232], star: 230, dust: 24 }]
    ];
    const match = variants.find(([pattern]) => pattern.test(key));
    if (match) return match[1];
    if (key.includes('li')) return { base: [214, 225, 202], accent: [192, 206, 230], star: 210, dust: 204 };
    if (key.includes('br')) return { base: [218, 30, 196], accent: [212, 180, 222], star: 44, dust: 28 };
    if (key.includes('ku')) return { base: [210, 222, 190], accent: [328, 190, 238], star: 205, dust: 318 };
    if (key.includes('rh')) return { base: [34, 48, 22], accent: [196, 32, 182], star: 42, dust: 46 };
    if (key.includes('bw') || key.includes('ew')) return { base: [170, 190, 215], accent: [128, 228, 184], star: 178, dust: 150 };
    if (key.includes('hi')) return { base: [176, 206, 236], accent: [292, 184, 214], star: 190, dust: 286 };
    if (key.includes('st')) return { base: [245, 216, 178], accent: [286, 204, 232], star: 230, dust: 24 };
    return fallback;
}

function makeRegionSystemWallpaper(systemId) {
    const starsphereKey = currentSystemStarsphereKey(systemId);
    const key = String(systemId || 'Li01') + ':region:' + starsphereKey;
    if (game.systemWallpapers[key]) return game.systemWallpapers[key];
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    const rng = seededRandom(hashString('starsphere-wallpaper:' + key));
    const palette = getStarsphereBackdropPalette(systemId);
    const character = seededRandom(hashString('starsphere-character:' + starsphereKey));
    const hues = palette.base.map(hue => (hue + Math.floor(rng() * 24 - 12) + 360) % 360);
    const accent = palette.accent.map(hue => (hue + Math.floor(rng() * 30 - 15) + 360) % 360);
    const nebulaCount = 4 + Math.floor(character() * 7);
    const starCount = 300 + Math.floor(character() * 520);
    const dustBands = 1 + Math.floor(character() * 4);
    const nebulaBoost = 0.7 + character() * 0.95;

    const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    base.addColorStop(0, `hsl(${hues[0]}, 58%, 6%)`);
    base.addColorStop(0.45, `hsl(${hues[1]}, 50%, 9%)`);
    base.addColorStop(1, `hsl(${hues[2]}, 56%, 5%)`);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < nebulaCount; i++) {
        const x = rng() * canvas.width;
        const y = rng() * canvas.height;
        const radius = 210 + rng() * 660;
        const hue = (i % 2 === 0 ? hues : accent)[i % 3];
        const nebula = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nebula.addColorStop(0, `hsla(${hue}, 88%, 58%, ${(0.09 + rng() * 0.2) * nebulaBoost})`);
        nebula.addColorStop(0.35, `hsla(${(hue + 24) % 360}, 72%, 42%, ${(0.04 + rng() * 0.1) * nebulaBoost})`);
        nebula.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = nebula;
        ctx.beginPath();
        ctx.ellipse(x, y, radius * (0.75 + rng() * 0.9), radius * (0.32 + rng() * 0.58), rng() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < dustBands; i++) {
        const y = canvas.height * (0.15 + rng() * 0.7);
        const band = ctx.createLinearGradient(0, y - 120, canvas.width, y + 120);
        const hue = (palette.dust || accent[i % accent.length] || hues[0] || 200);
        band.addColorStop(0, 'rgba(0,0,0,0)');
        band.addColorStop(0.5, `hsla(${hue}, 70%, 36%, ${0.035 + rng() * 0.07})`);
        band.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rng() - 0.5) * 0.85);
        ctx.fillStyle = band;
        ctx.fillRect(-canvas.width, y - canvas.height / 2 - 180, canvas.width * 2, 360);
        ctx.restore();
    }

    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < starCount; i++) {
        const x = rng() * canvas.width;
        const y = rng() * canvas.height;
        const size = rng() < 0.94 ? 0.5 + rng() * 1.4 : 1.8 + rng() * 2.8;
        const alpha = 0.22 + rng() * 0.74;
        const hue = rng() < 0.22 ? (palette.star + rng() * 28 - 14 + 360) % 360 : 0;
        ctx.fillStyle = hue ? `hsla(${hue}, 92%, 82%, ${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    game.systemWallpapers[key] = canvas;
    return canvas;
}

function renderSystemWallpaper() {
    const ctx = game.ctx;
    const wallpaper = makeRegionSystemWallpaper(currentSystemId);
    const scale = Math.max(game.width / wallpaper.width, game.height / wallpaper.height);
    const width = wallpaper.width * scale;
    const height = wallpaper.height * scale;
    ctx.drawImage(wallpaper, (game.width - width) / 2, (game.height - height) / 2, width, height);
    ctx.fillStyle = 'rgba(0,0,8,0.36)';
    ctx.fillRect(0, 0, game.width, game.height);
}

function updateJumpTransition(dt) {
    const transition = game.jumpTransition;
    if (!transition) return false;
    if (transition.startedAt && performance.now() - transition.startedAt > (transition.totalDuration + 2.5) * 1000) {
        game.jumpTransition = null;
        game.jumpHoleCapture = null;
        game.jumpHoleCaptureCooldownUntil = performance.now() + 3200;
        setNormalFlightSpeed(game.player);
        return false;
    }
    transition.timer += dt;
    transition.elapsed = (transition.elapsed || 0) + dt;
    game.player.rotation = transition.angle;

    if (transition.phase === 'out') {
        const progress = Math.min(1, transition.timer / transition.duration);
        if (transition.mode === 'hole') {
            const depth = smoothStep(progress);
            game.player.x = transition.originX;
            game.player.z = transition.originZ;
            transition.depthScale = Math.max(0.045, 1 - depth * 0.955);
            transition.depthAlpha = Math.max(0, 1 - depth * 1.08);
        } else {
            const speed = 2600 + smoothStep(progress) * 11000;
            game.player.x += Math.cos(transition.angle) * speed * dt;
            game.player.z += Math.sin(transition.angle) * speed * dt;
        }
        if (progress >= 1) {
            loadSystem(transition.targetSystem, transition.targetObject);
            game.jumpTransition = {
                ...transition,
                phase: 'in',
                timer: 0,
                duration: transition.mode === 'hole' ? 2.2 : JUMP_TRANSITION_PHASE_DURATION,
                depthScale: transition.mode === 'hole' ? 0.045 : 1,
                depthAlpha: 1
            };
        }
        return true;
    }

    const progress = Math.min(1, transition.timer / transition.duration);
    if (transition.mode === 'hole') {
        const depth = smoothStep(progress);
        transition.depthScale = 0.045 + depth * 0.955;
        transition.depthAlpha = depth;
    }
    if (progress >= 1) {
        game.jumpTransition = null;
        game.jumpHoleCapture = null;
        if (transition.mode === 'hole') game.jumpHoleCaptureCooldownUntil = performance.now() + 3200;
        setNormalFlightSpeed(game.player);
    }
    return true;
}

function renderJumpTunnel() {
    const transition = game.jumpTransition;
    if (!transition) return;
    const ctx = game.ctx;
    const cx = game.width / 2;
    const cy = game.height / 2;
    const progress = Math.min(1, transition.timer / transition.duration);
    const totalProgress = Math.min(1, (transition.elapsed || transition.timer) / (transition.totalDuration || transition.duration));
    const phasePulse = transition.phase === 'out' ? smoothStep(progress) : 1 - smoothStep(progress);
    const tunnelPower = Math.sin(totalProgress * Math.PI);
    const pulse = Math.max(0.12, Math.max(phasePulse * 0.72, tunnelPower));
    const now = performance.now();
    const tunnelRadius = Math.max(game.width, game.height) * (0.18 + pulse * 0.42);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(cx, cy);
    if (transition.mode === 'hole') {
        const dir = transition.phase === 'out' ? 1 : -1;
        const depth = transition.phase === 'out' ? smoothStep(progress) : 1 - smoothStep(progress);
        for (let i = 0; i < 52; i++) {
            const lane = i / 52;
            const angle = lane * Math.PI * 2 + (i % 7) * 0.19 + now * 0.45 * dir;
            const phase = ((lane + now * (0.58 + (i % 9) * 0.022) * dir + totalProgress) % 1 + 1) % 1;
            const start = 28 + phase * Math.max(game.width, game.height) * 0.16;
            const end = start + 70 + depth * 760 + (i % 11) * 18;
            const flatten = 0.62 + Math.sin(now + i) * 0.08;
            const alpha = (0.05 + depth * 0.34) * (1 - phase * 0.52);
            ctx.strokeStyle = `rgba(${120 + i % 5 * 18},${210 + i % 4 * 12},255,${alpha})`;
            ctx.lineWidth = 1 + depth * 4 + (i % 3);
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * start, Math.sin(angle) * start * flatten);
            ctx.lineTo(Math.cos(angle) * end, Math.sin(angle) * end * flatten);
            ctx.stroke();
        }
        for (let ring = 0; ring < 10; ring++) {
            const ringT = ((ring / 10 + now * 0.0011 * dir + depth * 0.8) % 1 + 1) % 1;
            const radius = 70 + ringT * Math.max(game.width, game.height) * 0.72;
            const alpha = (1 - ringT) * (0.08 + depth * 0.24);
            ctx.strokeStyle = `rgba(165,245,255,${alpha})`;
            ctx.lineWidth = 1 + (1 - ringT) * 5;
            ctx.beginPath();
            ctx.ellipse(0, 0, radius, radius * (0.34 + ringT * 0.08), now * 0.25, 0, Math.PI * 2);
            ctx.stroke();
        }
        const core = ctx.createRadialGradient(0, 0, 16, 0, 0, Math.max(game.width, game.height) * (0.18 + depth * 0.36));
        core.addColorStop(0, `rgba(245,255,255,${0.32 + depth * 0.48})`);
        core.addColorStop(0.24, `rgba(70,235,255,${0.16 + depth * 0.24})`);
        core.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(game.width, game.height), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
    }
    ctx.rotate(transition.angle);
    for (let ring = 0; ring < 18; ring++) {
        const ringT = (ring / 18 + now * 0.00045 + totalProgress * 0.9) % 1;
        const radiusX = 80 + ringT * tunnelRadius * 1.65;
        const radiusY = radiusX * (0.16 + ringT * 0.1);
        const alpha = (1 - ringT) * (0.08 + pulse * 0.3);
        ctx.strokeStyle = `rgba(140,225,255,${alpha})`;
        ctx.lineWidth = 1 + (1 - ringT) * 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    for (let i = 0; i < 76; i++) {
        const side = (i % 2 === 0 ? 1 : -1);
        const lane = side * (24 + (i % 19) * 18);
        const depth = (i / 76 + now * 0.0012 + totalProgress * 1.8) % 1;
        const focus = 1 - depth;
        const length = 280 + pulse * 1250 + (i % 9) * 60;
        const offset = -game.width * 0.58 + depth * game.width * 1.16;
        const alpha = 0.06 + focus * (0.15 + pulse * 0.28);
        ctx.strokeStyle = `rgba(${90 + i % 5 * 20},${190 + i % 4 * 14},255,${alpha})`;
        ctx.lineWidth = 1 + focus * 4;
        ctx.beginPath();
        ctx.moveTo(offset - length, lane);
        ctx.lineTo(offset + length, lane * (0.06 + depth * 0.18));
        ctx.stroke();
    }
    const gradient = ctx.createRadialGradient(0, 0, 26, 0, 0, Math.max(game.width, game.height) * 0.78);
    gradient.addColorStop(0, `rgba(230,255,255,${0.22 + pulse * 0.4})`);
    gradient.addColorStop(0.32, `rgba(80,170,255,${0.08 + pulse * 0.22})`);
    gradient.addColorStop(0.72, `rgba(30,80,200,${0.04 + pulse * 0.12})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(game.width, game.height), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function renderTradeLaneTunnel() {
    if (!game.player?.inTradeLane) return;
    const ctx = game.ctx;
    const pulse = (Math.sin(performance.now() * 0.018) + 1) * 0.5;
    const speed = clamp(game.player.speed / game.player.laneSpeed, 0.12, 1.25);
    ctx.save();
    ctx.translate(game.width / 2, game.height / 2);
    ctx.rotate(game.player.rotation);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 42; i++) {
        const t = (i / 42 + performance.now() * 0.0016 * speed) % 1;
        const x = -game.width * 0.62 + t * game.width * 1.24;
        const lane = ((i % 7) - 3) * 24;
        const alpha = 0.08 + t * 0.38;
        const length = 70 + t * 190;
        ctx.strokeStyle = `rgba(60,255,170,${alpha})`;
        ctx.lineWidth = 1 + t * 3;
        ctx.beginPath();
        ctx.moveTo(x - length, lane * (0.35 + pulse * 0.1));
        ctx.lineTo(x + length, lane * 0.08);
        ctx.stroke();
    }
    const gradient = ctx.createRadialGradient(0, 0, 18, 0, 0, Math.max(game.width, game.height) * 0.58);
    gradient.addColorStop(0, `rgba(120,255,210,${0.12 + pulse * 0.12})`);
    gradient.addColorStop(0.55, 'rgba(0,120,70,0.07)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(game.width, game.height), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function renderTradeLaneWarpBubble() {
    if (!game.player?.inTradeLane) return;
    const ctx = game.ctx;
    const pulse = (Math.sin(performance.now() * 0.015) + 1) * 0.5;
    const speed = clamp(game.player.speed / game.player.laneSpeed, 0.08, 1.25);
    const visualScale = Math.max(0.2, Math.min(3.2, game.zoom));
    const shipSize = Math.max(42, Math.min(76, game.player.radius * 2.8)) * visualScale;
    const bubbleLength = shipSize * (1.05 + speed * 0.72) + pulse * 5 * visualScale;
    const bubbleWidth = shipSize * (0.48 + speed * 0.24) + pulse * 3 * visualScale;
    const bubbleOffset = shipSize * 0.1;
    ctx.save();
    const pos = worldToScreen(game.player.x, game.player.z);
    ctx.translate(pos.x, pos.y);
    ctx.rotate(game.player.rotation);
    ctx.globalCompositeOperation = 'lighter';

    const shell = ctx.createRadialGradient(bubbleOffset, 0, shipSize * 0.15, bubbleOffset, 0, bubbleLength);
    shell.addColorStop(0, `rgba(210,255,245,${0.08 + speed * 0.08})`);
    shell.addColorStop(0.38, `rgba(80,255,200,${0.08 + speed * 0.1})`);
    shell.addColorStop(0.72, `rgba(50,190,255,${0.06 + speed * 0.08})`);
    shell.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shell;
    ctx.beginPath();
    ctx.ellipse(bubbleOffset, 0, bubbleLength, bubbleWidth, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 3; i++) {
        const ringPulse = (pulse + i * 0.28) % 1;
        const alpha = (0.28 - i * 0.055) * speed;
        ctx.strokeStyle = `rgba(135,255,220,${alpha})`;
        ctx.lineWidth = Math.max(0.7, (1.2 + ringPulse * 2.4) * visualScale);
        ctx.beginPath();
        ctx.ellipse(bubbleOffset + ringPulse * shipSize * 0.12, 0, bubbleLength * (0.78 + ringPulse * 0.18), bubbleWidth * (0.78 + ringPulse * 0.2), 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    for (let i = 0; i < 22; i++) {
        const lane = ((i % 11) - 5) * shipSize * (0.08 + speed * 0.04);
        const t = (i / 22 + performance.now() * 0.0032 * speed) % 1;
        const start = -bubbleLength * (0.9 + t * 0.42);
        const end = -shipSize * (0.34 + t * 0.85);
        const alpha = (0.05 + t * 0.2) * speed;
        ctx.strokeStyle = `rgba(180,255,235,${alpha})`;
        ctx.lineWidth = Math.max(0.6, (1 + t * 2.2) * visualScale);
        ctx.beginPath();
        ctx.moveTo(start, lane * (1.2 + t));
        ctx.lineTo(end, lane * 0.35);
        ctx.stroke();
    }
    ctx.restore();
}

function update(dt) {
    updateMusicMode();
    if (game.interior?.active) {
        game.gameTime += dt;
        updateInterior(dt);
        updateHUD();
        return;
    }
    if (!game.running || game.isDocked) return;
    game.gameTime += dt;
    if (game.gameTime >= 1800) game.gameTime = 0;
    updateEffects(dt);

    if (updateJumpTransition(dt)) {
        updateHUD();
        return;
    }

    if (updateJumpHoleCapture(dt)) {
        updateHUD();
        return;
    }

    if (game.player?.destroyed) {
        updateHUD();
        return;
    }
    
    game.player.update(dt);
    updateAutomaticJumpHoleCapture();

    if (game.dockTarget) {
        const dx = game.dockTarget.x - game.player.x;
        const dz = game.dockTarget.z - game.player.z;
        if (Math.sqrt(dx * dx + dz * dz) < 180) {
            const target = game.dockTarget;
            const landingTarget = game.dockLandingTarget || target;
            game.dockTarget = null;
            game.approachTarget = null;
            game.dockLandingTarget = null;
            game.player.cancelCruise?.();
            game.player.afterburnerActive = false;
            game.player.reverseActive = false;
            game.player.throttle = 0;
            game.player.speed = 0;
            updateCruiseButton();
            if (!canPlayerDockWithTarget(target)) {
                addLog(tf('dockingDeniedHostile', { faction: factionDisplayName(targetFaction(target)) }), 'alert');
                playVoice('dockDisallowed', 1);
                game.dockTarget = null;
                game.approachTarget = null;
                game.dockLandingTarget = null;
                return;
            }
            if (target instanceof TradeLaneRing) {
                startTradeLaneFromRing(target);
            } else if (target instanceof JumpGate) {
                startJumpTransition(target);
            } else {
                openLandingWindow(landingTarget);
            }
        }
    }
    
    for (const entity of game.entities) entity.update(dt);
    updateNpcFleets(dt);
    rebuildNpcSpatialGrid();
    for (const npc of game.npcs) updateNPC(npc, dt);
    updateMissionState();
    updatePopulationNpcs(dt);

    for (let i = game.loot.length - 1; i >= 0; i--) {
        const loot = game.loot[i];
        loot.age += dt;
        if (Math.hypot(loot.x - game.player.x, loot.z - game.player.z) < loot.radius + game.player.radius + 18) {
            if (collectLoot(loot) !== false) game.loot.splice(i, 1);
        } else if (loot.age > 180) {
            game.loot.splice(i, 1);
        }
    }
    
    for (let i = game.projectiles.length - 1; i >= 0; i--) {
        const p = game.projectiles[i];
        p.age = (p.age || 0) + dt;
        if (p.type === 'mine') {
            const currentTarget = p.targetId ? game.npcs.find(npc => npc.id === p.targetId && !npc.hidden && !npc.inTradeLane && npc.hull > 0) : null;
            if (!currentTarget) {
                let best = null;
                for (const npc of game.npcs) {
                    if (npc.hidden || npc.inTradeLane || npc.hull <= 0) continue;
                    if (!factionsAreHostile(game.player?.faction || '', npc.faction)) continue;
                    const distance = Math.hypot(npc.x - p.x, npc.z - p.z);
                    if (distance <= (p.seekRange || MINE_SEEK_RANGE) && (!best || distance < best.distance)) best = { npc, distance };
                }
                p.targetId = best?.npc?.id || '';
            }
        }
        if (p.type === 'countermeasure') {
            divertIncomingMissiles(p);
            const drag = Math.max(0, Number(p.linearDrag) || 0);
            if (drag > 0) {
                const dragFactor = Math.max(0, 1 - drag * dt);
                p.vx *= dragFactor;
                p.vz *= dragFactor;
            }
        }
        if (p.homing && p.targetId) {
            const target = p.targetId === 'player'
                ? game.player
                : countermeasureTargetById(p.targetId) || game.npcs.find(npc => npc.id === p.targetId) || game.entities.find(entity => entity.id === p.targetId) || null;
            if (target && Number.isFinite(target.x) && Number.isFinite(target.z)) {
                const dx = target.x - p.x;
                const dz = target.z - p.z;
                const distance = Math.hypot(dx, dz);
                if (distance > 0.001) {
                    const targetAngle = Math.atan2(dz, dx);
                    const currentAngle = Math.atan2(p.vz, p.vx);
                    let angleDiff = targetAngle - currentAngle;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                    const maxTurn = Math.max(0, Number(p.turnRate) || 0) * dt;
                    const nextAngle = currentAngle + Math.max(-maxTurn, Math.min(maxTurn, angleDiff));
                    let speed = Math.max(1, Math.hypot(p.vx, p.vz));
                    if (p.type === 'mine') speed = Math.min(Number(p.maxSpeed) || 74, speed + (Number(p.acceleration) || 0) * dt);
                    p.vx = Math.cos(nextAngle) * speed;
                    p.vz = Math.sin(nextAngle) * speed;
                    if (distance <= Math.max(Number(p.radius) || 0, Number(p.detonationRadius) || 0) && (p.type !== 'mine' || p.age >= (p.armedAfter || 0))) p.lifetime = 0;
                }
            }
        }
        p.x += p.vx * dt;
        p.z += p.vz * dt;
        p.lifetime -= dt;

        if (p.type !== 'countermeasure') {
            const projectileHitRadius = Math.max(Number(p.radius) || 0, Number(p.detonationRadius) || 0);
            const projectileArmed = p.type !== 'mine' || p.age >= (p.armedAfter || 0);
            if (projectileArmed) {
                for (const obstacle of [...game.obstacles]) {
                    if (!obstacle.destructible) continue;
                    const hitRadius = Math.max(3, projectileHitRadius) + Math.max(6, obstacle.radius);
                    if (Math.hypot(obstacle.x - p.x, obstacle.z - p.z) <= hitRadius) {
                        damageFieldObstacle(obstacle, p.damage || 1, (p.owner || 'player') === 'player' ? game.player : null, p.x, p.z);
                        p.lifetime = 0;
                        break;
                    }
                }
            }
        }
        if (p.lifetime <= 0) {
            game.projectiles.splice(i, 1);
            continue;
        }

        if ((p.owner || 'player') === 'npc') {
            const hitRadius = Math.max(Number(p.radius) || 0, Number(p.detonationRadius) || 0);
            const armed = p.type !== 'mine' || p.age >= (p.armedAfter || 0);
            if (armed && p.targetId === 'player' && Math.hypot(game.player.x - p.x, game.player.z - p.z) < game.player.radius + hitRadius) {
                applyCruiseDisruption(game.player, p, p.x, p.z);
                game.player.takeDamage(p.damage, p.x, p.z);
                p.lifetime = 0;
            } else if (p.targetId && p.targetId !== 'player') {
                const countermeasure = countermeasureTargetById(p.targetId);
                if (countermeasure && Math.hypot(countermeasure.x - p.x, countermeasure.z - p.z) < countermeasure.radius + hitRadius) {
                    countermeasure.lifetime = 0;
                    p.lifetime = 0;
                    continue;
                }
                const targetNpc = game.npcs.find(npc => npc.id === p.targetId);
                if (armed && targetNpc && Math.hypot(targetNpc.x - p.x, targetNpc.z - p.z) < targetNpc.radius + hitRadius) {
                    applyCruiseDisruption(targetNpc, p, p.x, p.z);
                    damageNpc(targetNpc, p.damage, game.npcs.find(npc => npc.id === p.ownerId) || null, p.x, p.z);
                    p.lifetime = 0;
                }
            }
        } else {
            if (p.type === 'countermeasure') {
                if (p.lifetime <= 0) game.projectiles.splice(i, 1);
                continue;
            }
            const hitRadius = Math.max(Number(p.radius) || 0, Number(p.detonationRadius) || 0);
            const armed = p.type !== 'mine' || p.age >= (p.armedAfter || 0);
            for (const npc of game.npcs) {
                if (npc.hidden || npc.inTradeLane) continue;
                if (p.type === 'mine' && !factionsAreHostile(game.player?.faction || '', npc.faction)) continue;
                const dx = npc.x - p.x, dz = npc.z - p.z;
                if (armed && Math.sqrt(dx * dx + dz * dz) < npc.radius + hitRadius) {
                    applyCruiseDisruption(npc, p, p.x, p.z);
                    damageNpc(npc, p.damage, game.player, p.x, p.z);
                    p.lifetime = 0;
                    break;
                }
            }
        }
        
        if (p.lifetime <= 0) game.projectiles.splice(i, 1);
    }
    
    updateHUD();

    const now = Date.now();
    if (now - game.lastAutoSaveAt > game.autoSaveInterval) {
        game.lastAutoSaveAt = now;
        saveGame();
    }
}

const DEFAULT_SCANNER_RANGE = 2500;

function scannerObjectKind(target) {
    if (!target) return t('scannerObject');
    if (target.isWaypoint) return t('scannerWaypoint');
    if (game.npcs.includes(target)) return t('scannerShip');
    if (target instanceof PlanetLocation) return t('scannerPlanet');
    if (target instanceof JumpGate) return target.kind === 'hole' ? t('scannerJumpHole') : t('scannerJumpGate');
    if (target instanceof TradeLaneRing) return t('scannerTradeLane');
    if (target instanceof Station) return t('scannerStation');
    return target.type || t('scannerObject');
}

function scannerObjectIcon(kind) {
    if (kind === t('scannerShip')) return '▲';
    if (kind === t('scannerPlanet')) return '●';
    if (kind === t('scannerJumpGate') || kind === t('scannerJumpHole')) return '◇';
    if (kind === t('scannerTradeLane')) return '◌';
    if (kind === t('scannerWaypoint')) return '◆';
    return '■';
}

function scannerTargetKey(target) {
    if (target?.isWaypoint) return target.id || 'waypoint';
    return target?.id || target?.nickname || target?.name || '';
}

function scannerTargets() {
    if (!game.player) return [];
    const scannerRange = playerScannerRange() || DEFAULT_SCANNER_RANGE;
    const candidates = [];
    if (game.waypoint && game.waypoint.systemId === currentSystemId) candidates.push({ target: game.waypoint, alwaysVisible: true });
    for (const npc of game.npcs || []) {
        if (!npc || npc.hull <= 0 || npc.hidden) continue;
        candidates.push({ target: npc, alwaysVisible: false });
    }
    for (const entity of game.entities || []) {
        if (entity instanceof Station || entity instanceof PlanetLocation || entity instanceof JumpGate || entity instanceof TradeLaneRing) {
            candidates.push({ target: entity, alwaysVisible: false });
        }
    }
    return candidates.map(entry => {
        const target = entry.target;
        const distance = Math.hypot((target.x || 0) - game.player.x, (target.z || 0) - game.player.z);
        return { target, distance, kind: scannerObjectKind(target), alwaysVisible: entry.alwaysVisible };
    }).filter(entry => Number.isFinite(entry.distance) && (entry.alwaysVisible || entry.distance <= scannerRange))
      .sort((a, b) => Number(b.alwaysVisible) - Number(a.alwaysVisible) || a.distance - b.distance)
      .slice(0, 14);
}

function npcScanWeaponLines(npc) {
    const directWeapons = (npc?.weapons || []).filter(Boolean);
    if (directWeapons.length) {
        return directWeapons.map(weapon => {
            const name = weapon.name || weapon.id || 'Weapon';
            const hull = Number(weapon.hullDamage || weapon.damage || 0);
            const energy = Number(weapon.energyDamage || 0);
            const damage = hull || energy ? ` (${Math.round(hull)}/${Math.round(energy)})` : '';
            return `${name}${damage}`;
        });
    }
    const loadout = npcLoadoutsData()[String(npc?.loadoutId || '').toLowerCase()] || null;
    return (loadout?.weapons || []).map(entry => {
        const item = getEquipment(entry.id);
        const stats = item ? weaponStatsFromEquipment(item, npc?.difficulty || 3) : null;
        const name = item?.name || entry.id || 'Weapon';
        const damage = stats ? ` (${Math.round(stats.hullDamage || 0)}/${Math.round(stats.energyDamage || 0)})` : '';
        return `${name}${damage}`;
    }).filter(Boolean);
}

function npcScanEquipmentLines(npc) {
    const loadout = npcLoadoutsData()[String(npc?.loadoutId || '').toLowerCase()] || null;
    const lines = [];
    const loadoutShield = (loadout?.shields || [])[0];
    const shieldName = npc?.shieldName || (loadoutShield ? (getEquipment(loadoutShield.id || loadoutShield)?.name || loadoutShield.id || loadoutShield) : '');
    if (shieldName) lines.push(`Shield: ${shieldName}`);
    for (const group of [loadout?.thrusters, loadout?.scanners, loadout?.tractors, loadout?.equipment]) {
        for (const entry of group || []) {
            const item = getEquipment(entry.id || entry);
            lines.push(item?.name || entry.id || entry);
        }
    }
    return lines;
}

function setScanResult(message, alert = false) {
    const result = document.getElementById('scan-result');
    if (!result) return;
    result.style.color = alert ? '#ff9966' : '#9edfff';
    result.innerHTML = message;
}

function scanSelectedTarget() {
    const target = game.selectedTarget;
    if (!target || !game.npcs?.includes(target)) {
        setScanResult(escapeHtml(t('scanNoTarget')), true);
        playSound('ui', 0.35);
        return;
    }
    const distance = game.player ? Math.hypot((target.x || 0) - game.player.x, (target.z || 0) - game.player.z) : Infinity;
    const scannerRange = playerScannerRange() || DEFAULT_SCANNER_RANGE;
    if (!Number.isFinite(distance) || distance > scannerRange) {
        setScanResult(`${escapeHtml(t('scanOutOfRange'))} (${formatDistance(distance)} / ${formatDistance(scannerRange)})`, true);
        playSound('ui', 0.35);
        return;
    }
    const weapons = npcScanWeaponLines(target);
    const equipment = npcScanEquipmentLines(target);
    const shipId = target.shipId || target.npcShipId || '';
    const shipRecord = shipsData()[String(shipId).toLowerCase()] || null;
    const shipLabel = target.shipName || shipRecord?.name || shipId || 'Unknown';
    const faction = factionDisplayName(target.faction || target.reputation || '');
    const hull = `${Math.round(Number(target.hull) || 0)}/${Math.max(1, Math.round(Number(target.maxHull) || 0))}`;
    const shield = `${Math.round(Number(target.shield) || 0)}/${Math.max(0, Math.round(Number(target.maxShield) || 0))}`;
    const weaponHtml = weapons.length ? weapons.slice(0, 8).map(line => `<div>${escapeHtml(line)}</div>`).join('') : `<div style="color:#667f8f;">${escapeHtml(t('noGunMounted'))}</div>`;
    const equipmentHtml = equipment.length ? equipment.slice(0, 8).map(line => `<div>${escapeHtml(line)}</div>`).join('') : '<div style="color:#667f8f;">-</div>';
    setScanResult(`<div style="border:1px solid #1f5f80;background:rgba(4,14,23,0.74);padding:7px;margin-top:6px;line-height:1.35;"><strong style="color:#00ff99;">${escapeHtml(t('scanResultTitle'))}</strong><br><span style="color:#b9efff;">${escapeHtml(target.name || target.callsign || 'NPC')}</span><br><span style="color:#88a;">Ship:</span> ${escapeHtml(shipLabel)}<br><span style="color:#88a;">Faction:</span> ${escapeHtml(faction)}<br><span style="color:#88a;">Hull:</span> ${escapeHtml(hull)} | <span style="color:#88a;">Shield:</span> ${escapeHtml(shield)}<br><span style="color:#88a;">Weapons:</span>${weaponHtml}<span style="color:#88a;">Equipment:</span>${equipmentHtml}</div>`);
    playSound('select', 0.55);
}

function findScannerTargetByKey(key) {
    if (game.scannerTargetMap?.has(key)) return game.scannerTargetMap.get(key);
    if (game.waypoint && scannerTargetKey(game.waypoint) === key) return game.waypoint;
    return [...(game.npcs || []), ...(game.entities || [])].find(item => scannerTargetKey(item) === key) || null;
}

function startApproachFromScanner(target) {
    if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.z)) return;
    game.selectedTarget = target;
    game.approachTarget = target;
    game.dockTarget = null;
    game.dockLandingTarget = null;
    game.approachArrivalLogged = false;
    game.commandMode = 'approach';
    updateCommandModeButtons();
    startAutopilotCruise();
    updateSpeedControl();
    addLog('Approaching: ' + (target.name || scannerObjectKind(target)));
}

function selectScannerTarget(encodedKey) {
    const key = decodeURIComponent(encodedKey || '');
    const target = findScannerTargetByKey(key);
    if (!target) return;
    game.selectedTarget = target;
    startApproachFromScanner(target);
    playSound('select', 0.7);
    updateHUD();
}

function activateScannerRow(row, event = null) {
    if (!row) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const key = row.dataset.scannerKey || '';
    const now = performance.now();
    if (game.lastScannerActivationKey === key && now - (game.lastScannerActivationAt || 0) < 220) return;
    game.lastScannerActivationKey = key;
    game.lastScannerActivationAt = now;
    selectScannerTarget(key);
}

function bindScannerPanelEvents() {
    const list = document.getElementById('scanner-list');
    if (!list || list.dataset.bound === '1') return;
    list.dataset.bound = '1';
    list.addEventListener('pointerdown', event => {
        const row = event.target.closest('.scanner-row[data-scanner-key]');
        if (!row) return;
        activateScannerRow(row, event);
    });
    list.addEventListener('click', event => {
        const row = event.target.closest('.scanner-row[data-scanner-key]');
        if (!row) return;
        activateScannerRow(row, event);
    });
}

function setTextIfChanged(element, value) {
    if (element && element.textContent !== String(value)) element.textContent = String(value);
}

function updateScannerPanel(force = false) {
    const list = document.getElementById('scanner-list');
    const range = document.getElementById('scanner-range');
    const scanButton = document.getElementById('btn-scan-target');
    if (!list) return;
    if (range) range.textContent = formatDistance(playerScannerRange() || DEFAULT_SCANNER_RANGE);
    if (scanButton) scanButton.disabled = !(game.selectedTarget && game.npcs?.includes(game.selectedTarget));
    const entries = scannerTargets();
    if (!entries.length) {
        if (game.hudScannerSignature !== 'empty') list.innerHTML = `<div class="hud-row-muted">${escapeHtml(t('scannerNone'))}</div>`;
        game.hudScannerSignature = 'empty';
        return;
    }
    game.scannerTargetMap = new Map();
    const signature = `${game.language}|${entries.map(entry => `${scannerTargetKey(entry.target)}:${entry.kind}:${entry.target.name || entry.target.shipName || ''}`).join('|')}`;
    if (force || signature !== game.hudScannerSignature) {
        const scrollTop = list.scrollTop;
        const focusedKey = document.activeElement?.dataset?.scannerKey || '';
        list.innerHTML = entries.map(entry => {
            const key = scannerTargetKey(entry.target);
            const encodedKey = encodeURIComponent(key).replace(/'/g, '%27');
            const name = entry.target.name || entry.target.shipName || key || entry.kind;
            return `<button type="button" class="hud-row scanner-row" data-scanner-key="${encodedKey}"><span class="hud-kind">${scannerObjectIcon(entry.kind)}</span><span>${escapeHtml(name)}<br><span class="hud-defense" style="color:#7299aa;"></span></span><span class="hud-distance"></span></button>`;
        }).join('');
        list.scrollTop = scrollTop;
        if (focusedKey) [...list.querySelectorAll('.scanner-row')].find(row => row.dataset.scannerKey === focusedKey)?.focus({ preventScroll: true });
        game.hudScannerSignature = signature;
    }
    const rows = [...list.querySelectorAll('.scanner-row[data-scanner-key]')];
    for (const [index, entry] of entries.entries()) {
        const key = scannerTargetKey(entry.target);
        game.scannerTargetMap.set(key, entry.target);
        const row = rows[index];
        if (!row) continue;
        const selected = game.selectedTarget === entry.target || game.selectedTarget?.linkedTarget === entry.target || game.selectedTarget === entry.target.linkedTarget;
        row.classList.toggle('selected', selected);
        const hasDefenseStats = Number.isFinite(entry.target?.maxHull) || Number.isFinite(entry.target?.maxShield);
        const defenseLine = hasDefenseStats
            ? `${t('hudShield')}: ${Math.round(Number(entry.target?.shield) || 0)}/${Math.max(0, Math.round(Number(entry.target?.maxShield) || 0))} | ${t('hudHull')}: ${Math.round(Number(entry.target?.hull) || 0)}/${Math.max(1, Math.round(Number(entry.target?.maxHull) || 0))}`
            : entry.kind;
        setTextIfChanged(row.querySelector('.hud-defense'), defenseLine);
        setTextIfChanged(row.querySelector('.hud-distance'), formatDistance(entry.distance));
    }
}

function updateLoadoutPanel(force = false) {
    const list = document.getElementById('weapon-list');
    if (!list || !game.player) return;
    const weaponSlots = getWeaponSlotKeys();
    const mountedWeapons = weaponSlots.map(slot => ({ slot, item: mountedEquipmentItem(slot) }));
    const countermeasureDropper = equippedCountermeasureDropperItem();
    const mountedCount = mountedWeapons.filter(entry => entry.item).length;
    const weaponCount = document.getElementById('weapon-count');
    if (weaponCount) weaponCount.textContent = mountedCount + '/' + weaponSlots.length;
    const rows = mountedWeapons.map(entry => {
        const item = entry.item;
        const damage = item ? Math.round(Number(item.hullDamage || 0) + Number(item.energyDamage || 0)) : 0;
        const label = item ? escapeHtml(item.name || item.id) : escapeHtml(t('emptyWeapon'));
        const meta = item ? `${escapeHtml(item.category || 'weapon')} ${damage ? '| ' + damage + ' dmg' : ''}` : escapeHtml(t('noGunMounted'));
        return `<div class="hud-row"><span class="hud-kind">✦</span><span>${label}<br><span style="color:#7299aa;">${meta}</span></span><span class="hud-distance">${escapeHtml(equipmentSlotLabel(entry.slot))}</span></div>`;
    });
    if (countermeasureDropper) {
        const autoEnabled = game.player.countermeasureAutoEnabled !== false;
        rows.push(`<div class="hud-row"><span class="hud-kind">CM</span><span>${escapeHtml(countermeasureDropper.name || t('countermeasures'))}<br><span style="color:#7299aa;">${escapeHtml(t('countermeasures'))} ${totalCountermeasureAmmoCount()}</span></span><button type="button" class="hud-action-btn hud-toggle-btn${autoEnabled ? ' active' : ''}" onclick="toggleCountermeasureAuto()">${escapeHtml(autoEnabled ? t('countermeasureAutoOn') : t('countermeasureAutoOff'))}</button></div>`);
    }
    const loadoutSignature = `${game.language}|${mountedWeapons.map(entry => `${entry.slot}:${entry.item?.id || ''}`).join('|')}|${game.player.countermeasureAutoEnabled !== false}|${totalCountermeasureAmmoCount()}`;
    if (force || loadoutSignature !== game.hudLoadoutSignature) {
        list.innerHTML = rows.length ? rows.join('') : `<div class="hud-row-muted">${escapeHtml(t('noWeaponSlots'))}</div>`;
        game.hudLoadoutSignature = loadoutSignature;
    }
    const nanobots = document.getElementById('nanobot-count');
    const batteries = document.getElementById('shield-battery-count');
    const missileAmmo = document.getElementById('missile-ammo-count');
    const missileAmmoLabel = document.getElementById('label-missile-ammo');
    const mines = document.getElementById('mine-count');
    const mineLabel = document.getElementById('label-mines');
    const countermeasures = document.getElementById('countermeasure-count');
    const countermeasureLabel = document.getElementById('label-countermeasures');
    setTextIfChanged(nanobots, `${game.player.nanobots}/${game.player.maxNanobots}`);
    setTextIfChanged(batteries, `${game.player.shieldBatteries}/${game.player.maxShieldBatteries}`);
    setTextIfChanged(missileAmmo, `${totalMissileAmmoCount()}/${game.player.maxMissileAmmo}`);
    setTextIfChanged(missileAmmoLabel, t('missileAmmo'));
    setTextIfChanged(mines, `${totalMineAmmoCount()}/${game.player.maxMineAmmo}`);
    setTextIfChanged(mineLabel, t('mines'));
    setTextIfChanged(countermeasures, `${totalCountermeasureAmmoCount()}`);
    setTextIfChanged(countermeasureLabel, t('countermeasures'));
}

function toggleCountermeasureAuto() {
    if (!game.player) return;
    game.player.countermeasureAutoEnabled = game.player.countermeasureAutoEnabled === false;
    saveGame();
    updateLoadoutPanel(true);
}

function isSpeedSliderLocked() {
    const p = game.player;
    return !p || p.destroyed || game.isDocked || p.inTradeLane || p.cruiseActive || p.cruiseCharging || p.afterburnerActive || game.jumpTransition || game.approachTarget || game.dockTarget;
}

function speedSliderTarget() {
    const p = game.player;
    if (!p) return 0;
    return Math.round(clamp((Number(p.throttle) || 0) * COMBAT_MAX_SPEED, 0, COMBAT_MAX_SPEED));
}

function updateSpeedControl() {
    const slider = document.getElementById('speed-slider');
    const value = document.getElementById('speed-control-value');
    if (!slider || !value || !game.player) return;
    const locked = isSpeedSliderLocked();
    const currentSpeed = Math.max(0, Number(game.player.speed) || 0);
    const targetSpeed = speedSliderTarget();
    if (slider.disabled !== locked) slider.disabled = locked;
    const sliderValue = String(locked ? clamp(Math.round(currentSpeed), 0, COMBAT_MAX_SPEED) : targetSpeed);
    if (slider.value !== sliderValue) slider.value = sliderValue;
    setTextIfChanged(value, `${locked ? Math.round(currentSpeed) : targetSpeed} m/s`);
}

function setPlayerSpeedTarget(value) {
    if (isSpeedSliderLocked()) {
        updateSpeedControl();
        return;
    }
    const p = game.player;
    const targetSpeed = clamp(Number(value) || 0, 0, COMBAT_MAX_SPEED);
    p.reverseActive = false;
    p.throttle = targetSpeed / COMBAT_MAX_SPEED;
    updateSpeedControl();
}

function updateZoomControl() {
    const slider = document.getElementById('zoom-slider');
    const value = document.getElementById('zoom-control-value');
    if (!slider || !value) return;
    const min = String(game.minZoom);
    const max = String(game.maxZoom);
    const sliderValue = String(clamp(Number(game.zoom) || 1, game.minZoom, game.maxZoom));
    if (slider.min !== min) slider.min = min;
    if (slider.max !== max) slider.max = max;
    if (slider.value !== sliderValue) slider.value = sliderValue;
    setTextIfChanged(value, `${game.zoom.toFixed(1)}x`);
}

function setZoomLevel(value) {
    game.zoom = clamp(Number(value) || 1, game.minZoom, game.maxZoom);
    updateZoomControl();
}

function updateHUD() {
    const p = game.player;
    const setStatus = (barId, valueId, ratio) => {
        const percent = Math.round(clamp(Number(ratio) || 0, 0, 1) * 100);
        const bar = document.getElementById(barId);
        if (bar && bar.style.width !== percent + '%') bar.style.width = percent + '%';
        const value = document.getElementById(valueId);
        setTextIfChanged(value, percent + '%');
    };
    setStatus('shield-bar', 'shield-value', p.maxShield > 0 ? p.shield / p.maxShield : 0);
    setStatus('hull-bar', 'hull-value', p.hull / Math.max(1, p.maxHull));
    setStatus('energy-bar', 'energy-value', p.energy / Math.max(1, p.maxEnergy));
    setStatus('thrust-bar', 'thrust-value', (p.thrustCapacity || 0) > 0 ? (p.thrustEnergy || 0) / p.thrustCapacity : 0);
    updateSpeedControl();
    updateZoomControl();
    updateCruiseButton();
    updateCommandModeButtons();
    const hudNow = performance.now();
    if (hudNow - (game.hudLastScannerAt || 0) >= 180) {
        game.hudLastScannerAt = hudNow;
        updateScannerPanel();
    }
    if (hudNow - (game.hudLastLoadoutAt || 0) >= 260) {
        game.hudLastLoadoutAt = hudNow;
        updateLoadoutPanel();
    }
    updateMissileWarning();
    if (!document.getElementById('inventory-overlay')?.classList.contains('hidden') && hudNow - (game.hudLastInventoryAt || 0) >= 300) {
        game.hudLastInventoryAt = hudNow;
        renderInventoryPanel();
    }
    setTextIfChanged(document.getElementById('flight-speed'), `${Math.round(Math.abs(Number(p.speed) || 0))} m/s`);
    setTextIfChanged(document.getElementById('flight-throttle'), `${Math.round((Number(p.throttle) || 0) * 100)}%`);
    setTextIfChanged(document.getElementById('credits'), `${Number(p.credits || 0).toLocaleString()} CR`);
    setTextIfChanged(document.getElementById('cargo'), `${cargoUnits()}/${p.maxCargo}`);
    setTextIfChanged(document.getElementById('system-name'), systemData?.name || currentSystemId);
    const waypointLabel = game.waypoint
        ? `${game.activeMission ? missionTypeLabel(game.activeMission.type) + ' · ' : ''}${game.waypoint.name || game.waypoint.type || 'Waypoint'} · ${formatDistance(Math.hypot((game.waypoint.x || 0) - p.x, (game.waypoint.z || 0) - p.z))}`
        : t('freeflight');
    setTextIfChanged(document.getElementById('hud-waypoint'), waypointLabel);
    
    // Mode indicator
    const modeEl = document.getElementById('mode-indicator');
    if (!modeEl) {
        // The compact in-game HUD no longer renders a mode text field.
    } else if ((game.commandMode === 'approach' || game.commandMode === 'dock') && game.approachTarget) {
        modeEl.textContent = game.commandMode === 'dock' ? t('dock') : t('approach');
        modeEl.style.color = '#ffaa00';
    } else if (isManualSteeringActive()) {
        modeEl.textContent = t('modeRotate');
        modeEl.style.color = '#ffaa00';
    } else if (p.cruiseCharging) {
        modeEl.textContent = t('modeCruiseCharge') + ' ' + Math.ceil(Math.max(0, CRUISE_CHARGE_SECONDS - p.cruiseCharge)) + 's';
        modeEl.style.color = '#66ccff';
    } else if (p.cruiseActive) {
        modeEl.textContent = t('modeCruise') + ' ' + Math.round(p.cruiseSpeed || cruiseSpeedForMod()) + ' m/s';
        modeEl.style.color = '#66ccff';
    } else if (p.afterburnerActive) {
        modeEl.textContent = t('modeAfterburner') + ' 200 m/s';
        modeEl.style.color = '#ff8844';
    } else if ((Number(p.cruiseDisruptedUntil) || 0) > performance.now()) {
        modeEl.textContent = tf('cruiseDisruptorLock', { seconds: Math.ceil((p.cruiseDisruptedUntil - performance.now()) / 1000) });
        modeEl.style.color = '#66ddff';
    } else {
        modeEl.textContent = game.approachTarget ? t('approach') : t('freeflight');
        modeEl.style.color = game.approachTarget ? '#ffaa00' : '#00ff00';
    }
    
    // Target info
    const targetInfo = document.getElementById('target-info');
    if (game.selectedTarget) {
        targetInfo.style.display = 'block';
        document.getElementById('target-name').textContent = `${t('selected')}: ${game.selectedTarget.name}`;
        const dx = game.selectedTarget.x - p.x;
        const dz = game.selectedTarget.z - p.z;
        document.getElementById('target-dist').textContent = `${t('distance')}: ${Math.round(Math.sqrt(dx*dx+dz*dz))}m`;
        const targetDefense = document.getElementById('target-defense');
        if (targetDefense) {
            if (Number.isFinite(game.selectedTarget.maxHull) || Number.isFinite(game.selectedTarget.maxShield)) {
                targetDefense.textContent = `${t('hudShield')}: ${Math.round(Number(game.selectedTarget.shield) || 0)}/${Math.max(0, Math.round(Number(game.selectedTarget.maxShield) || 0))} | ${t('hudHull')}: ${Math.round(Number(game.selectedTarget.hull) || 0)}/${Math.max(1, Math.round(Number(game.selectedTarget.maxHull) || 0))}`;
            } else {
                targetDefense.textContent = `${t('hudShield')}: - | ${t('hudHull')}: -`;
            }
        }
    } else {
        targetInfo.style.display = 'none';
    }
}

function renderWaypointLine(ctx) {
    if (!game.player) return;
    const start = worldToScreen(game.player.x, game.player.z);
    const drawLine = (target, color, fillColor, dash, label) => {
        if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.z)) return;
        const end = worldToScreen(target.x, target.z);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(end.x, end.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillStyle = fillColor;
        ctx.fillText(label || target.name || 'Target', end.x, end.y - 13);
        ctx.restore();
    };
    const waypoint = game.waypoint;
    if (waypoint && currentSystemId === (waypoint.systemId || currentSystemId)) {
        drawLine(waypoint, 'rgba(185, 95, 255, 0.88)', '#c77dff', [7, 6], waypoint.name || 'Waypoint');
    }
    const target = game.approachTarget || game.selectedTarget;
    if (target && target !== waypoint && !target.isWaypoint) {
        drawLine(target, 'rgba(255, 170, 0, 0.86)', '#ffaa00', [10, 7], target.name || 'Target');
    }
}

function render() {
    const ctx = game.ctx;
    if (game.interior?.active) {
        renderInterior(ctx);
        return;
    }
    renderSystemWallpaper();
    
    renderStars();
    
    renderDamageZones(ctx);

    renderSuns(ctx);
    
    // Planets
    for (const planet of systemData.planets) {
        drawTexturedPlanet(ctx, planet);
    }
    
    // Trade lane lines
    ctx.strokeStyle = 'rgba(0,200,100,0.3)';
    ctx.lineWidth = 2;
    for (const lane of systemData.tradeLanes) {
        for (let i = 0; i < lane.rings.length - 1; i++) {
            const p1 = worldToScreen(lane.rings[i].x, lane.rings[i].z);
            const p2 = worldToScreen(lane.rings[i+1].x, lane.rings[i+1].z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }
    
    // Environment and stations first; trade lane rings stay readable above them.
    for (const entity of game.entities) {
        if (!(entity instanceof TradeLaneRing)) entity.render(ctx);
    }
    for (const entity of game.entities) {
        if (entity instanceof TradeLaneRing) entity.render(ctx);
    }
    
    // NPCs
    for (const npc of game.npcs) renderNPC(ctx, npc);

    // Loot
    for (const loot of game.loot) {
        const pos = worldToScreen(loot.x, loot.z);
        const pulse = (Math.sin((loot.age || 0) * 8) + 1) * 0.5;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = loot.color || '#66ddff';
        ctx.fillStyle = loot.color || '#66ddff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 7 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Projectiles
    for (const p of game.projectiles) {
        const pos = worldToScreen(p.x, p.z);
        if (p.type === 'mine') {
            const pulse = (Math.sin((p.age || 0) * 8) + 1) * 0.5;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = 'rgba(255,110,35,0.62)';
            ctx.fillStyle = p.color || '#ff8844';
            ctx.lineWidth = Math.max(1, game.zoom * 2);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, Math.max(4, (p.radius + pulse * 4) * game.zoom), 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, Math.max(2, p.radius * 0.45 * game.zoom), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            continue;
        }
        if (p.type === 'countermeasure') {
            const pulse = (Math.sin((p.age || 0) * 16) + 1) * 0.5;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = 'rgba(170,245,255,0.54)';
            ctx.fillStyle = p.color || '#b7f6ff';
            ctx.lineWidth = Math.max(1, game.zoom * 1.6);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, Math.max(3, (p.radius + pulse * 3) * game.zoom), 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.42;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, Math.max(8, Math.min(30, (p.range || COUNTERMEASURE_RANGE) * 0.018 * game.zoom)), 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.95;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, Math.max(2, p.radius * 0.42 * game.zoom), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            continue;
        }
        const tail = worldToScreen(p.x - p.vx * 0.035, p.z - p.vz * 0.035);
        ctx.strokeStyle = p.trailColor || 'rgba(255,255,0,0.55)';
        ctx.lineWidth = Math.max(1, p.radius * game.zoom * 1.4);
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.fillStyle = p.color || '#ffff00';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, Math.max(2, p.radius * game.zoom), 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (game.jumpTransition?.mode === 'hole') renderJumpTunnel();

    // Player
    if (!game.player.destroyed) game.player.render(ctx);
    renderForegroundAsteroids(ctx);
    renderEffects(ctx);

    renderWaypointLine(ctx);

    if (game.jumpTransition?.mode !== 'hole') renderJumpTunnel();
    renderTradeLaneWarpBubble();
    renderApproachEdgeMarker(ctx);
    
    // Compass
    renderCompass();
}

function renderApproachEdgeMarker(ctx) {
    const target = game.approachTarget;
    const player = game.player;
    if (!target || !player || game.jumpTransition) return;
    const dx = target.x - player.x;
    const dz = target.z - player.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (!Number.isFinite(distance) || distance < 1) return;

    const centerX = game.width / 2;
    const centerY = game.height / 2;
    const angle = Math.atan2(dz, dx);
    const margin = 34;
    const halfW = centerX - margin;
    const halfH = centerY - margin;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const edgeScale = Math.min(
        Math.abs(cos) > 0.001 ? halfW / Math.abs(cos) : Infinity,
        Math.abs(sin) > 0.001 ? halfH / Math.abs(sin) : Infinity
    );
    const x = centerX + cos * edgeScale;
    const y = centerY + sin * edgeScale;
    const etaSpeed = Math.max(1, player.speed || 0);
    const eta = player.speed > 1 ? formatEta(distance / etaSpeed) : '--:--';
    const label = `${target.name}  ${formatDistance(distance)}  ETA ${eta}`;

    ctx.save();
    ctx.font = '12px Courier New';
    const textWidth = ctx.measureText(label).width;
    const boxWidth = Math.min(game.width - 24, Math.max(190, textWidth + 40));
    const boxHeight = 38;
    const boxX = clamp(x - boxWidth / 2, 12, game.width - boxWidth - 12);
    const boxY = clamp(y - boxHeight / 2, 12, game.height - boxHeight - 12);
    ctx.fillStyle = 'rgba(0, 18, 30, 0.86)';
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1.5;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(2, -7);
    ctx.lineTo(2, 7);
    ctx.closePath();
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = '#dff7ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, boxX + boxWidth / 2, boxY + boxHeight / 2);
    ctx.restore();
}

function renderCompass() {
    const ctx = game.ctx;
    const compX = game.width / 2;
    const compY = game.height - 60;
    const compR = 35;
    
    ctx.strokeStyle = 'rgba(0,100,0,0.5)';
    ctx.beginPath();
    ctx.arc(compX, compY, compR, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#00aa00';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('N', compX, compY - compR - 3);
    ctx.fillText('S', compX, compY + compR + 12);
    ctx.fillText('W', compX - compR - 12, compY + 3);
    ctx.fillText('E', compX + compR + 12, compY + 3);
    
    ctx.save();
    ctx.translate(compX, compY);
    ctx.rotate(game.player.rotation);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -compR + 5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function gameLoop(currentTime) {
    if (!game.running) return;
    const dt = Math.min((currentTime - game.lastTime) / 1000, 0.1);
    game.lastTime = currentTime;
    game.frameCount = (game.frameCount || 0) + 1;
    try {
        update(dt);
        render();
        updateVisibleMapOverlayFrame();
    } catch (error) {
        game.loopErrorCount = (game.loopErrorCount || 0) + 1;
        console.error('Game loop error:', error);
        if (game.jumpTransition) {
            game.jumpTransition = null;
            game.jumpHoleCapture = null;
            game.jumpHoleCaptureCooldownUntil = performance.now() + 3200;
            if (game.player) setNormalFlightSpeed(game.player);
        }
        if (game.loopErrorCount <= 3) addLog('Runtime error recovered - continuing flight.', 'alert');
    }
    requestAnimationFrame(gameLoop);
}

function setupInput() {
    const canvas = game.canvas;
    const speedSlider = document.getElementById('speed-slider');
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => setPlayerSpeedTarget(e.target.value));
        speedSlider.addEventListener('change', (e) => setPlayerSpeedTarget(e.target.value));
    }
    const zoomSlider = document.getElementById('zoom-slider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => setZoomLevel(e.target.value));
        zoomSlider.addEventListener('change', (e) => setZoomLevel(e.target.value));
    }
    document.getElementById('touch-joystick-toggle')?.addEventListener('click', toggleTouchJoystick);
    const touchJoystick = document.getElementById('touch-joystick');
    if (touchJoystick) {
        touchJoystick.addEventListener('pointerdown', (e) => {
            if (!game.touchJoystickEnabled) return;
            ensureAudio();
            e.preventDefault();
            e.stopPropagation();
            game.joystickActive = true;
            game.joystickPointerId = e.pointerId;
            touchJoystick.setPointerCapture?.(e.pointerId);
            updateTouchJoystickFromPointer(e);
        });
        touchJoystick.addEventListener('pointermove', (e) => {
            if (!game.joystickActive || game.joystickPointerId !== e.pointerId) return;
            e.preventDefault();
            e.stopPropagation();
            updateTouchJoystickFromPointer(e);
        });
        const endJoystickPointer = (e) => {
            if (game.joystickPointerId !== null && game.joystickPointerId !== e.pointerId) return;
            e.preventDefault();
            e.stopPropagation();
            resetTouchJoystick();
        };
        touchJoystick.addEventListener('pointerup', endJoystickPointer);
        touchJoystick.addEventListener('pointercancel', endJoystickPointer);
        touchJoystick.addEventListener('lostpointercapture', resetTouchJoystick);
    }
    const bindHoldButton = (id, setter) => {
        const button = document.getElementById(id);
        if (!button) return;
        const start = (e) => {
            if (!game.touchJoystickEnabled) return;
            ensureAudio();
            e.preventDefault();
            e.stopPropagation();
            button.setPointerCapture?.(e.pointerId);
            setter(true);
        };
        const end = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setter(false);
        };
        button.addEventListener('pointerdown', start);
        button.addEventListener('pointerup', end);
        button.addEventListener('pointercancel', end);
        button.addEventListener('lostpointercapture', () => setter(false));
    };
    bindHoldButton('touch-afterburner', setTouchAfterburner);
    bindHoldButton('touch-fire', setTouchFire);
    
    canvas.addEventListener('mousemove', (e) => {
        game.mouseX = e.clientX;
        game.mouseY = e.clientY;
    });
    
    canvas.addEventListener('mousedown', (e) => {
        ensureAudio();
        if (e.button === 0) game.mouseDown = true;
        if (e.button === 2) game.rightMouseDown = true;
    });
    
    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) game.mouseDown = false;
        if (e.button === 2) game.rightMouseDown = false;
    });
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (game.interior?.active) return;
        setZoomLevel(game.zoom + (e.deltaY < 0 ? 0.1 : -0.1));
    });
    
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    
    const findCanvasTargetAtWorld = (world) => {
        for (const npc of game.npcs) {
            const dx = npc.x - world.x;
            const dz = npc.z - world.y;
            if (Math.hypot(dx, dz) <= Math.max(22, npc.radius + 12)) return npc;
        }
        for (const entity of game.entities) {
            if (entity.containsPoint && entity.containsPoint(world.x, world.y)) return entity;
        }
        return null;
    };

    // Click on canvas to select target
    canvas.addEventListener('click', (e) => {
        ensureAudio();
        if (game.interior?.active) {
            performInteriorAction();
            return;
        }
        if (!game.mouseDown && !game.running) return;
        
        const world = screenToWorld(e.clientX, e.clientY);
        const target = findCanvasTargetAtWorld(world);
        if (!target) return;
        game.selectedTarget = target;
        addLog('Selected: ' + (target.name || target.id || scannerObjectKind(target)));
        playSound('select', 0.7);
        updateHUD();
    });

    canvas.addEventListener('dblclick', (e) => {
        ensureAudio();
        if (game.interior?.active) return;
        if (!game.running) return;
        const world = screenToWorld(e.clientX, e.clientY);
        if (findCanvasTargetAtWorld(world)) return;
        clearNavigationSelection();
    });
    
    window.addEventListener('keydown', (e) => {
        const tagName = e.target?.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || e.target?.isContentEditable) return;
        if (game.interior?.active) {
            if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
                game.interiorKeys[e.code] = true;
                return;
            }
            if (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                performInteriorAction();
                return;
            }
            if (e.code === 'Escape') {
                document.getElementById('landing-overlay')?.classList.add('hidden');
                return;
            }
        }
        if (e.code === 'Escape') {
            toggleInventoryPanel(false);
            if (game.commandMode !== 'freeflight' || game.approachTarget || game.dockTarget) {
                returnToFreeflight('Freeflight mode - autopilot cancelled', { preserveMotion: true });
            }
            return;
        }
        if (!game.player || game.isDocked || !game.running) return;
        
        switch (e.code) {
            case 'KeyW':
                game.player.reverseActive = false;
                game.player.throttle = Math.min(1, game.player.throttle + 0.05);
                updateSpeedControl();
                break;
            case 'KeyS':
                if (game.player.cruiseActive || game.player.cruiseCharging) {
                    game.player.cancelCruise();
                    game.player.afterburnerActive = false;
                    game.player.reverseActive = false;
                    game.player.throttle = 1;
                    updateCruiseButton();
                    updateSpeedControl();
                    addLog(t('cruiseDisabled'));
                    break;
                }
                game.player.reverseActive = false;
                game.player.throttle = Math.max(0, game.player.throttle - 0.05);
                updateSpeedControl();
                break;
            case 'KeyX':
                if (!game.player.inTradeLane && !game.jumpTransition) {
                    game.player.cancelCruise();
                    game.player.afterburnerActive = false;
                    game.player.reverseActive = true;
                    game.player.throttle = 0;
                    updateCruiseButton();
                    updateSpeedControl();
                }
                break;
            case 'KeyA':
                game.player.strafeLeftActive = true;
                break;
            case 'KeyD':
                game.player.strafeRightActive = true;
                break;
            case 'KeyM':
                toggleMap();
                break;
            case 'KeyI':
                toggleInventoryPanel();
                break;
            case 'KeyG':
            case 'KeyN':
                game.player.useNanobot();
                break;
            case 'KeyF':
            case 'KeyB':
                game.player.useShieldBattery();
                break;
            case 'KeyQ':
                game.player.fireMissiles();
                break;
            case 'KeyE':
                game.player.dropMine();
                break;
            case 'KeyC':
                game.player.dropCountermeasure();
                break;
            case 'Tab':
                e.preventDefault();
                if (canUseAfterburner()) {
                    game.player.afterburnerActive = true;
                    game.player.reverseActive = false;
                    game.player.throttle = 1;
                    updateSpeedControl();
                }
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (game.interiorKeys && e.code in game.interiorKeys) {
            game.interiorKeys[e.code] = false;
            return;
        }
        if (e.code === 'Tab') {
            e.preventDefault();
            if (game.player) {
                game.player.afterburnerActive = false;
                updateSpeedControl();
            }
        } else if (e.code === 'KeyX') {
            if (game.player) {
                game.player.reverseActive = false;
                updateSpeedControl();
            }
        } else if (e.code === 'KeyA') {
            if (game.player) game.player.strafeLeftActive = false;
        } else if (e.code === 'KeyD') {
            if (game.player) game.player.strafeRightActive = false;
        }
    });

    window.addEventListener('blur', () => {
        if (!game.player) return;
        game.player.afterburnerActive = false;
        game.player.reverseActive = false;
        game.player.strafeLeftActive = false;
        game.player.strafeRightActive = false;
        resetTouchJoystick();
        resetTouchCombatButtons();
        updateSpeedControl();
    });

    addLog('W/S: throttle | A/D: drift left/right | Q: missiles | E: mine | C: countermeasure | M: map');
    
    // Continuous fire while right mouse held
    setInterval(() => {
        if (game.touchAfterburnerActive && !canUseTouchAfterburner()) setTouchAfterburner(false);
        if (game.rightMouseDown && game.player && !game.isDocked && !game.player.inTradeLane && !game.player.cruiseActive && !game.player.cruiseCharging) {
            game.player.fireHeld = true;
        } else if (game.player) {
            game.player.fireHeld = false;
        }
    }, 50);
}

function switchMapTab(tab) {
    const systemCanvas = document.getElementById('map-canvas');
    const universeCanvas = document.getElementById('map-universe-canvas');
    const sectorTabs = document.getElementById('map-universe-sector-tabs');
    const tabs = document.querySelectorAll('.map-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.maptab === tab));
    if (tab === 'universe') {
        systemCanvas.style.display = 'none';
        universeCanvas.style.display = 'block';
        if (sectorTabs) sectorTabs.style.display = 'flex';
        renderMapUniverseSectorTabs();
        drawUniverseMapInMapDialog();
    } else {
        systemCanvas.style.display = 'block';
        universeCanvas.style.display = 'none';
        if (sectorTabs) sectorTabs.style.display = 'none';
        drawMapCanvas();
    }
}

function renderMapUniverseSectorTabs() {
    const container = document.getElementById('map-universe-sector-tabs');
    if (!container) return;
    const sectors = availableUniverseSectors();
    if (sectors.length <= 1) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    const buttons = [`<button type="button" data-sector="all" class="${game.universeSector === 'all' ? 'active' : ''}" style="padding:5px 9px;border:1px solid ${game.universeSector === 'all' ? '#66ffaa' : '#335544'};background:${game.universeSector === 'all' ? '#10351c' : '#08150d'};color:${game.universeSector === 'all' ? '#ccffe0' : '#77aa88'};cursor:pointer;font-size:11px;font-family:'Courier New',monospace;">OVERVIEW</button>`];
    buttons.push(...sectors.map(sector => `<button type="button" data-sector="${escapeHtml(sector.key)}" class="${game.universeSector === sector.key ? 'active' : ''}" style="padding:5px 9px;border:1px solid ${game.universeSector === sector.key ? '#66ffaa' : '#335544'};background:${game.universeSector === sector.key ? '#10351c' : '#08150d'};color:${game.universeSector === sector.key ? '#ccffe0' : '#77aa88'};cursor:pointer;font-size:11px;font-family:'Courier New',monospace;">${escapeHtml(sector.name || sector.key.toUpperCase())}</button>`));
    container.innerHTML = buttons.join('');
    container.style.display = 'flex';
    container.querySelectorAll('button[data-sector]').forEach(button => {
        button.addEventListener('click', () => setMapUniverseSector(button.dataset.sector || 'all'));
    });
}

function setMapUniverseSector(sectorKey) {
    game.universeSector = sectorKey || 'all';
    resetUniverseViewport();
    renderMapUniverseSectorTabs();
    drawUniverseMapInMapDialog();
}

function toggleMap() {
    game.showMap = !game.showMap;
    const overlay = document.getElementById('map-overlay');
    if (overlay) {
        if (game.showMap) {
            overlay.classList.remove('hidden');
            switchMapTab('system');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

function getSystemMapTransform(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    const scale = (Math.min(w, h) / 200000) * game.mapZoom;
    return {
        scaleX: scale,
        scaleY: scale,
        scale,
        offsetX: w / 2 + game.mapPanX,
        offsetY: h / 2 + game.mapPanY
    };
}

function systemMapToScreen(x, z, transform) {
    return { x: transform.offsetX + x * transform.scaleX, y: transform.offsetY + z * transform.scaleY };
}

function screenToSystemMap(x, y, transform) {
    return { x: (x - transform.offsetX) / transform.scaleX, z: (y - transform.offsetY) / transform.scaleY };
}

function clampSystemMapPan(canvas) {
    if (!canvas) return;
    const halfExtent = 100000;
    const transform = getSystemMapTransform(canvas);
    const gridHalfX = halfExtent * transform.scaleX;
    const gridHalfY = halfExtent * transform.scaleY;
    const maxPanX = Math.max(0, Math.abs(gridHalfX - canvas.width / 2));
    const maxPanY = Math.max(0, Math.abs(gridHalfY - canvas.height / 2));
    game.mapPanX = clamp(Number(game.mapPanX) || 0, -maxPanX, maxPanX);
    game.mapPanY = clamp(Number(game.mapPanY) || 0, -maxPanY, maxPanY);
}

function drawSystemMapGrid(ctx, canvas, transform) {
    const halfExtent = 100000;
    const divisions = 8;
    const cell = (halfExtent * 2) / divisions;
    const topLeft = systemMapToScreen(-halfExtent, -halfExtent, transform);
    const bottomRight = systemMapToScreen(halfExtent, halfExtent, transform);
    ctx.save();
    ctx.strokeStyle = 'rgba(0,70,110,0.42)';
    ctx.lineWidth = 1;
    ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    ctx.strokeStyle = 'rgba(0,70,110,0.28)';
    for (let i = 1; i < divisions; i++) {
        const coord = -halfExtent + cell * i;
        const v1 = systemMapToScreen(coord, -halfExtent, transform);
        const v2 = systemMapToScreen(coord, halfExtent, transform);
        const h1 = systemMapToScreen(-halfExtent, coord, transform);
        const h2 = systemMapToScreen(halfExtent, coord, transform);
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.moveTo(h1.x, h1.y);
        ctx.lineTo(h2.x, h2.y);
        ctx.stroke();
    }
    ctx.fillStyle = 'rgba(130,190,225,0.64)';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < divisions; i++) {
        const center = -halfExtent + cell * (i + 0.5);
        const xLabel = systemMapToScreen(center, halfExtent, transform);
        const yLabel = systemMapToScreen(-halfExtent, center, transform);
        ctx.fillText('ABCDEFGH'[i], xLabel.x, xLabel.y + 14);
        ctx.fillText(String(i + 1), yLabel.x - 14, yLabel.y);
    }
    ctx.restore();
}

function mapZoneScreenGeometry(zone, transform) {
    const shape = String(zone?.shape || 'ELLIPSOID').toUpperCase();
    const sx = Number(zone?.sizeX ?? zone?.size_x ?? zone?.size ?? 0);
    const sy = Number(zone?.sizeY ?? zone?.size_y ?? sx);
    const sz = Number(zone?.sizeZ ?? zone?.size_z ?? sx);
    if (shape === 'BOX') {
        return { shape, rx: Math.max(1, sx * transform.scale * 0.5), rz: Math.max(1, sz * transform.scale * 0.5) };
    }
    if (shape === 'SPHERE') {
        const radius = Math.max(1, sx);
        return { shape, rx: radius * transform.scale, rz: radius * transform.scale };
    }
    if (shape === 'CYLINDER') {
        const radius = Math.max(1, sx);
        const projectedLength = Math.max(0, sy || sz || radius);
        const flat = projectedLength > radius * 2.5 && sz > radius * 1.2;
        return {
            shape,
            rx: (flat ? Math.max(radius, projectedLength * 0.5) : radius) * transform.scale,
            rz: (flat ? radius : Math.max(radius, sz || radius)) * transform.scale
        };
    }
    return { shape, rx: Math.max(1, sx * transform.scale), rz: Math.max(1, sz * transform.scale) };
}

function drawMapZoneShape(ctx, zone, transform, options = {}) {
    const pos = systemMapToScreen(zone.x, zone.z, transform);
    const geometry = mapZoneScreenGeometry(zone, transform);
    const rx = Math.max(options.minRadius || 0, geometry.rx);
    const rz = Math.max(options.minRadius || 0, geometry.rz);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(flYawToCanvasRotation(zone.rotate_y || zone.rotateY || 0));
    ctx.beginPath();
    if (geometry.shape === 'BOX') ctx.rect(-rx, -rz, rx * 2, rz * 2);
    else ctx.ellipse(0, 0, rx, rz, 0, 0, Math.PI * 2);
    if (options.fill !== false) ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function systemMapExclusionZones() {
    const zones = [];
    const seen = new Set();
    for (const field of [...(systemData.asteroidfields || []), ...(systemData.nebulae || [])]) {
        for (const exclusion of field.exclusionZones || []) {
            const key = [
                exclusion.id || exclusion.nickname || exclusion.name || '',
                Math.round(Number(exclusion.x || 0)),
                Math.round(Number(exclusion.z || 0)),
                String(exclusion.shape || '').toUpperCase()
            ].join(':');
            if (seen.has(key)) continue;
            seen.add(key);
            zones.push(exclusion);
        }
    }
    return zones;
}

function isSelectedMapObject(object, entity = null) {
    const selected = game.selectedTarget;
    if (!selected) return false;
    if (selected === object || selected === entity) return true;
    const selectedId = String(selected.id || selected.nickname || '');
    const objectId = String(object?.id || object?.nickname || '');
    const entityId = String(entity?.id || entity?.nickname || '');
    return Boolean(selectedId && (selectedId === objectId || selectedId === entityId));
}

function drawDeclutteredMapLabels(ctx, candidates, width, height) {
    const occupied = [];
    const overlaps = rect => occupied.some(other => !(
        rect.x + rect.w + 4 < other.x || other.x + other.w + 4 < rect.x ||
        rect.y + rect.h + 3 < other.y || other.y + other.h + 3 < rect.y
    ));
    const sorted = [...candidates].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (const label of sorted) {
        if (!label?.text) continue;
        ctx.font = label.font || '9px Courier New';
        const textWidth = Math.ceil(ctx.measureText(label.text).width);
        const boxWidth = textWidth + 8;
        const boxHeight = 15;
        const offsets = label.offsets || [[0, 0], [0, -18], [0, 18], [textWidth * 0.55 + 8, 0], [-textWidth * 0.55 - 8, 0]];
        let placement = null;
        for (const [dx, dy] of offsets) {
            const rect = {
                x: clamp(label.x + dx - boxWidth / 2, 5, Math.max(5, width - boxWidth - 5)),
                y: clamp(label.y + dy - boxHeight / 2, 28, Math.max(28, height - boxHeight - 24)),
                w: boxWidth,
                h: boxHeight
            };
            if (!overlaps(rect)) {
                placement = rect;
                break;
            }
        }
        if (!placement) continue;
        occupied.push(placement);
        ctx.fillStyle = label.background || 'rgba(0,8,16,0.78)';
        ctx.fillRect(placement.x, placement.y, placement.w, placement.h);
        ctx.strokeStyle = label.border || 'rgba(62,137,174,0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(placement.x + 0.5, placement.y + 0.5, placement.w - 1, placement.h - 1);
        ctx.fillStyle = label.color || '#8fcce8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label.text, placement.x + placement.w / 2, placement.y + placement.h / 2 + 0.5);
    }
}

function readableMapFieldName(field) {
    const name = String(field?.name || '').trim();
    if (!name || /^zone[_\s-]/i.test(name) || /^[a-z]{2}\d{2}[_-]/i.test(name)) return '';
    return name;
}

function drawSystemMapTradeLanes(ctx, mapTransform) {
    for (const lane of systemData.tradeLanes || []) {
        const rings = lane.rings || [];
        if (!rings.length) continue;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < rings.length; i++) {
            const pos = systemMapToScreen(rings[i].x, rings[i].z, mapTransform);
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
        }
        ctx.strokeStyle = 'rgba(0, 110, 72, 0.72)';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(31, 255, 160, 0.86)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        for (let i = 0; i < rings.length; i++) {
            const ring = rings[i];
            const pos = systemMapToScreen(ring.x, ring.z, mapTransform);
            const ringEntity = findTradeLaneRingEntity(ring, i);
            const selected = isSelectedMapObject(ring, ringEntity);
            const endpoint = i === 0 || i === rings.length - 1;
            const radius = selected ? 6.5 : (endpoint ? 5 : 3.5);
            ctx.fillStyle = 'rgba(0, 16, 18, 0.9)';
            ctx.strokeStyle = selected ? '#ffaa00' : (endpoint ? '#8affcf' : '#1fffa0');
            ctx.lineWidth = selected ? 2.5 : 1.5;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }
}

function drawMapCanvas() {
    const canvas = document.getElementById('map-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    clampSystemMapPan(canvas);
    const mapTransform = getSystemMapTransform(canvas);
    
    ctx.fillStyle = '#000810';
    ctx.fillRect(0, 0, w, h);
    const mapLabels = [];
    
    drawSystemMapGrid(ctx, canvas, mapTransform);
    
    // Suns
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    for (const sun of systemData.suns || []) {
        if (!Number.isFinite(Number(sun.x)) || !Number.isFinite(Number(sun.z))) continue;
        const sunPos = systemMapToScreen(Number(sun.x), Number(sun.z), mapTransform);
        const mapRadius = Math.max(7, Math.min(24, (Number(sun.radius) || 240) * mapTransform.scale * 2.2));
        const glow = ctx.createRadialGradient(sunPos.x, sunPos.y, 0, sunPos.x, sunPos.y, mapRadius * 2.4);
        glow.addColorStop(0, 'rgba(255,255,210,0.95)');
        glow.addColorStop(0.38, 'rgba(255,205,70,0.56)');
        glow.addColorStop(1, 'rgba(255,120,20,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sunPos.x, sunPos.y, mapRadius * 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffff66';
        ctx.beginPath();
        ctx.arc(sunPos.x, sunPos.y, mapRadius, 0, Math.PI * 2);
        ctx.fill();
        mapLabels.push({ text: sun.name || 'Sun', x: sunPos.x, y: sunPos.y + mapRadius + 13, color: '#e6d57b', priority: 75 });
    }
    
    // Planets
    for (const planet of systemData.planets) {
        const pos = systemMapToScreen(planet.x, planet.z, mapTransform);
        const ex = pos.x;
        const ey = pos.y;
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(ex, ey, 12, 0, Math.PI * 2);
        ctx.fill();
        mapLabels.push({ text: planet.name, x: ex, y: ey + 25, color: '#9dc6e8', priority: 80 });
        const selectedPlanet = game.entities.find(e => e instanceof PlanetLocation && e.id === planet.id);
        if (isSelectedMapObject(planet, selectedPlanet)) {
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ex, ey, 18, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Nebulae and asteroid fields with hazard obstacles
    for (const nebula of systemData.nebulae) {
        ctx.fillStyle = 'rgba(80,120,220,0.12)';
        ctx.strokeStyle = 'rgba(120,180,255,0.25)';
        drawMapZoneShape(ctx, nebula, mapTransform, { minRadius: 8 });
        const pos = systemMapToScreen(nebula.x, nebula.z, mapTransform);
        mapLabels.push({ text: readableMapFieldName(nebula), x: pos.x, y: pos.y, color: '#779acb', priority: 18 });
    }
    for (const field of systemData.asteroidfields) {
        const isMinefield = field.hazardKind === 'explosive_mines';
        const isDebris = field.fieldKind === 'debris';
        ctx.fillStyle = isMinefield ? 'rgba(255,45,20,0.12)' : (isDebris ? 'rgba(150,165,165,0.10)' : 'rgba(130,110,70,0.12)');
        ctx.strokeStyle = isMinefield ? 'rgba(255,70,45,0.42)' : (isDebris ? 'rgba(175,195,195,0.25)' : 'rgba(180,150,90,0.25)');
        drawMapZoneShape(ctx, field, mapTransform, { minRadius: 8 });
        const pos = systemMapToScreen(field.x, field.z, mapTransform);
        mapLabels.push({ text: readableMapFieldName(field), x: pos.x, y: pos.y, color: isMinefield ? '#ff7965' : '#a89065', priority: 20 });
    }
    for (const exclusion of systemMapExclusionZones()) {
        const isBox = String(exclusion.shape || '').toUpperCase() === 'BOX';
        ctx.fillStyle = isBox ? 'rgba(0,18,22,0.18)' : 'rgba(0,18,22,0.08)';
        ctx.strokeStyle = isBox ? 'rgba(125,255,220,0.78)' : 'rgba(150,230,255,0.34)';
        ctx.lineWidth = isBox ? 1.5 : 1;
        ctx.setLineDash(isBox ? [8, 4] : [6, 4]);
        drawMapZoneShape(ctx, exclusion, mapTransform, { minRadius: 3, fill: isBox });
        ctx.setLineDash([]);
    }
    if (game.mapZoom >= 2.4) {
        const obstacleStride = Math.max(1, Math.ceil(game.obstacles.length / 180));
        for (let obstacleIndex = 0; obstacleIndex < game.obstacles.length; obstacleIndex += obstacleStride) {
            const obstacle = game.obstacles[obstacleIndex];
            const pos = systemMapToScreen(obstacle.x, obstacle.z, mapTransform);
            const ex = pos.x;
            const ey = pos.y;
            ctx.fillStyle = obstacle.collidable === false ? '#7f8b90' : (obstacle.kind === 'mine' ? '#ff5038' : (obstacle.kind === 'debris' ? '#aab8b8' : (obstacle.kind === 'asteroid' ? '#aa8855' : '#66ddee')));
            ctx.beginPath();
            ctx.arc(ex, ey, Math.max(obstacle.small ? 1 : 2, (obstacle.visualRadius || obstacle.radius) * mapTransform.scale), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Navigation infrastructure must remain visible above fields and debris.
    drawSystemMapTradeLanes(ctx, mapTransform);
    
    // Stations
    for (const station of systemData.stations) {
        const pos = systemMapToScreen(station.x, station.z, mapTransform);
        const ex = pos.x;
        const ey = pos.y;
        const archetype = station.archetype || station.type || '';
        const mapRadius = Math.max(2, solarObjectVisualWorldRadius(solarObjectRawRadiusFromData(station, archetype, 600), archetype, 600) * mapTransform.scale);
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        ctx.arc(ex, ey, mapRadius, 0, Math.PI * 2);
        ctx.fill();
        
        const selectedStation = game.entities.find(e => e.id === station.id);
        if (isSelectedMapObject(station, selectedStation)) {
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ex, ey, mapRadius + 4, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        if (game.mapZoom >= 0.82 || isSelectedMapObject(station, selectedStation)) {
            mapLabels.push({
                text: station.name,
                x: ex,
                y: ey + mapRadius + 12,
                color: isSelectedMapObject(station, selectedStation) ? '#ffd27a' : '#47bfff',
                border: isSelectedMapObject(station, selectedStation) ? 'rgba(255,170,0,0.72)' : undefined,
                priority: isSelectedMapObject(station, selectedStation) ? 100 : 45
            });
        }
    }
    
    // Jump Gates and Holes
    for (const gate of systemData.jumpgates) {
        const pos = systemMapToScreen(gate.x, gate.z, mapTransform);
        const ex = pos.x;
        const ey = pos.y;
        const archetype = gate.archetype || (gate.kind === 'hole' ? 'jumphole' : 'jumpgate');
        const mapRadius = Math.max(3, solarObjectVisualWorldRadius(solarObjectRawRadiusFromData(gate, archetype, 600), archetype, 600) * mapTransform.scale);
        ctx.strokeStyle = gate.kind === 'hole' ? '#33ddff' : '#8844ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex, ey, mapRadius, 0, Math.PI * 2);
        ctx.stroke();

        const selectedEntity = game.entities.find(e => e.id === gate.id);
        if (isSelectedMapObject(gate, selectedEntity)) {
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ex, ey, mapRadius + 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        mapLabels.push({ text: gate.name, x: ex, y: ey + mapRadius + 12, color: gate.kind === 'hole' ? '#66eaff' : '#bd8cff', priority: 88 });
    }

    const mapPlayerPos = game.player ? systemMapToScreen(game.player.x, game.player.z, mapTransform) : null;
    const selectedMapTarget = game.approachTarget || game.selectedTarget;
    if (mapPlayerPos && selectedMapTarget && Number.isFinite(selectedMapTarget.x) && Number.isFinite(selectedMapTarget.z) && !selectedMapTarget.isWaypoint) {
        const selectedPos = systemMapToScreen(selectedMapTarget.x, selectedMapTarget.z, mapTransform);
        ctx.strokeStyle = 'rgba(255,170,0,0.78)';
        ctx.lineWidth = 2;
        ctx.setLineDash([9, 6]);
        ctx.beginPath();
        ctx.moveTo(mapPlayerPos.x, mapPlayerPos.y);
        ctx.lineTo(selectedPos.x, selectedPos.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (game.waypoint && game.waypoint.systemId === currentSystemId) {
        const waypointPos = systemMapToScreen(game.waypoint.x, game.waypoint.z, mapTransform);
        if (mapPlayerPos) {
            ctx.strokeStyle = 'rgba(185,95,255,0.82)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 5]);
            ctx.beginPath();
            ctx.moveTo(mapPlayerPos.x, mapPlayerPos.y);
            ctx.lineTo(waypointPos.x, waypointPos.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        ctx.strokeStyle = '#c77dff';
        ctx.fillStyle = '#c77dff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(waypointPos.x, waypointPos.y - 9);
        ctx.lineTo(waypointPos.x + 9, waypointPos.y);
        ctx.lineTo(waypointPos.x, waypointPos.y + 9);
        ctx.lineTo(waypointPos.x - 9, waypointPos.y);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(waypointPos.x, waypointPos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        mapLabels.push({ text: game.waypoint.name || 'Waypoint', x: waypointPos.x, y: waypointPos.y - 14, color: '#d7a3ff', border: 'rgba(199,125,255,0.76)', priority: 120 });
    }
    
    // Player
    const playerPos = systemMapToScreen(game.player.x, game.player.z, mapTransform);
    const ppx = playerPos.x;
    const ppy = playerPos.y;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(ppx, ppy - 8);
    ctx.lineTo(ppx - 6, ppy + 6);
    ctx.lineTo(ppx + 6, ppy + 6);
    ctx.closePath();
    ctx.fill();
    mapLabels.push({ text: 'YOU', x: ppx, y: ppy + 20, color: '#ffffff', border: 'rgba(255,255,255,0.55)', priority: 130 });

    drawDeclutteredMapLabels(ctx, mapLabels, w, h);

    ctx.fillStyle = '#668899';
    ctx.textAlign = 'right';
    ctx.fillText('Wheel zoom / drag pan: ' + game.mapZoom.toFixed(1) + 'x', w - 10, 18);
    game.mapLastRenderedAt = performance.now();
}

function updateVisibleMapOverlayFrame() {
    if (!game.showMap) return;
    const overlay = document.getElementById('map-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    const systemCanvas = document.getElementById('map-canvas');
    if (!systemCanvas || systemCanvas.style.display === 'none') return;
    const now = performance.now();
    if (now - (game.mapLastRenderedAt || 0) >= (game.mapRenderInterval || 180)) drawMapCanvas();
}
