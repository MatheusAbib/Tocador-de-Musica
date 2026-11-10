
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_API_KEY = '';

const audioPlayer = document.getElementById('audioPlayer');
const playPauseIcon = document.getElementById('playPauseIcon');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const restartSongBtn = document.getElementById('restartSong');
const resultsContainer = document.getElementById('results');
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-submit');
const nowPlaying = document.getElementById('nowPlaying');
const player = document.getElementById('musicPlayer');

let isPlaying = false;
let currentAudioSrc = '';
let currentPlayingTitle = '';
let currentPlayingArtist = '';
let currentPlaylistContext = [];
let currentPlaylistIndex = -1;
let currentPlayMode = 'normal';
let lastSearchQuery = '';
let cameFromSearch = false;
let searchRequestId = 0;

let cdRotationAngle = 0;
let cdRotationInterval = null;

let globalRandomActive = false;
let globalRandomFilter = 'all';
let currentArtistRandomActive = false;
let currentArtistName = '';
let currentAlbumRandomActive = false;
let currentAlbumName = '';
let currentAlbumArtist = '';
let artistPlayHistory = [];
let albumPlayHistory = [];
let globalPlayHistory = [];

let audioContext = null;
let analyser = null;
let dataArray = null;
let audioSourceNode = null;
let isAnalyzing = false;

const artistImageCache = {};

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function normalizeText(text) {
    return String(text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeSingleQuote(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function getFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem('favoriteMusics'));
        return Array.isArray(favorites) ? favorites : [];
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem('favoriteMusics', JSON.stringify(favorites));
}

function isMusicaFavorita(title, artist) {
    return getFavorites().some(music =>
        music.title === title && music.artist === artist
    );
}

function addMusicaFavorita(title, artist) {
    const favorites = getFavorites();

    if (!favorites.some(music => music.title === title && music.artist === artist)) {
        favorites.push({ title, artist });
        saveFavorites(favorites);
    }
}

function removeMusicaFavorita(title, artist) {
    saveFavorites(getFavorites().filter(music =>
        !(music.title === title && music.artist === artist)
    ));

    atualizarPlaylist();
}

function getSongArtist(artist, song) {
    return song.featuredArtist
        ? `${artist} ft. ${song.featuredArtist}`
        : artist;
}

function getAllSongsFromDatabase() {
    const songs = [];

    for (const artist in musicDatabase) {
        const albums = musicDatabase[artist];

        if (!albums || typeof albums !== 'object' || Array.isArray(albums)) continue;

        for (const albumName in albums) {
            const album = albums[albumName];
            if (!album || !Array.isArray(album.songs)) continue;

            album.songs.forEach(song => {
                songs.push({
                    title: song.title,
                    artist: getSongArtist(artist, song),
                    audioSrc: song.audioSrc,
                    cover: song.cover || album.cover || '',
                    isSingle: albumName === '_singles',
                    album: albumName,
                    mainArtist: artist,
                    uniqueKey: `${artist}|${albumName}|${song.title}`
                });
            });
        }
    }

    return songs;
}

function getSongsByArtist(artist) {
    return getAllSongsFromDatabase().filter(song => song.mainArtist === artist);
}

function getSongsByAlbum(artist, albumName) {
    return getAllSongsFromDatabase().filter(song =>
        song.mainArtist === artist && song.album === albumName
    );
}

function findSongInDatabase(title, artist) {
    return getAllSongsFromDatabase().find(song =>
        song.title === title && song.artist === artist
    ) || null;
}

function playlistSongsFromFavorites(favorites) {
    return favorites
        .map(music => findSongInDatabase(music.title, music.artist))
        .filter(Boolean);
}

function getSongKey(song) {
    return song.uniqueKey || `${song.title}|${song.artist}|${song.audioSrc}`;
}

function attachImageLoader(img, wrapper) {
    if (!img || img.dataset.loaderAttached === 'true') return;

    img.dataset.loaderAttached = 'true';

    const startTime = Date.now();
    let finished = false;

    const finish = () => {
        if (finished) return;
        finished = true;

        const remaining = Math.max(0, 400 - (Date.now() - startTime));

        setTimeout(() => {
            img.classList.add('loaded');
            if (wrapper) wrapper.classList.add('loaded');
        }, remaining);
    };

    if (img.complete) {
        finish();
    } else {
        img.addEventListener('load', finish, { once: true });
        img.addEventListener('error', finish, { once: true });
    }
}

function createImageWrapper(src, alt, className, fallbackSrc) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-loading-wrapper';

    const img = document.createElement('img');
    img.src = src || fallbackSrc || '';
    img.alt = alt || '';
    img.className = className || '';
    img.loading = 'lazy';

    if (fallbackSrc) {
        img.addEventListener('error', () => {
            if (img.dataset.fallbackApplied) return;
            img.dataset.fallbackApplied = 'true';
            img.src = fallbackSrc;
        });
    }

    wrapper.appendChild(img);
    attachImageLoader(img, wrapper);

    return { wrapper, img };
}

function getHTMLImageWrapper(src, alt, className, fallbackSrc) {
    const source = escapeHTML(src || fallbackSrc || '');
    const fallback = escapeHTML(fallbackSrc || '');

    return `
        <div class="img-loading-wrapper">
            <img
                src="${source}"
                alt="${escapeHTML(alt)}"
                class="${escapeHTML(className || '')}"
                loading="lazy"
                data-fallback="${fallback}"
            >
        </div>
    `;
}

function ensureImageLoadersInContainer(container) {
    if (!container) return;

    container.querySelectorAll('.img-loading-wrapper').forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return;

        if (img.dataset.fallback && img.dataset.fallback !== img.getAttribute('src')) {
            img.addEventListener('error', () => {
                if (img.dataset.fallbackApplied) return;
                img.dataset.fallbackApplied = 'true';
                img.src = img.dataset.fallback;
            });
        }

        attachImageLoader(img, wrapper);
    });
}

function waitForImages(container) {
    const images = Array.from(container.querySelectorAll('img'));

    return Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();

        return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    }));
}

function animateCdRotation() {
    cdRotationAngle = (cdRotationAngle + 1) % 360;

    const cd = document.querySelector('.cdrom');

    if (cd) {
        cd.style.transform = `translateX(-50%) rotate(${cdRotationAngle}deg)`;
    }
}

function startCdRotation() {
    const cd = document.querySelector('.cdrom');
    if (!cd || cdRotationInterval) return;

    cdRotationInterval = setInterval(animateCdRotation, 20);
    cd.classList.add('girar');
}

function stopCdRotation() {
    if (cdRotationInterval) {
        clearInterval(cdRotationInterval);
        cdRotationInterval = null;
    }

    const cd = document.querySelector('.cdrom');
    if (cd) cd.classList.remove('girar');
}

function ensureAudioContext() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
        }

        setupAudioAnalyzer();
    } catch {
        audioContext = null;
    }
}

function setupAudioAnalyzer() {
    if (!audioContext || audioSourceNode) return;

    try {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;

        audioSourceNode = audioContext.createMediaElementSource(audioPlayer);
        audioSourceNode.connect(analyser);
        analyser.connect(audioContext.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        if (!isAnalyzing) {
            isAnalyzing = true;
            visualize();
        }
    } catch {
        analyser = null;
    }
}

function visualize() {
    if (!analyser || !dataArray) {
        isAnalyzing = false;
        return;
    }

    requestAnimationFrame(visualize);
    analyser.getByteFrequencyData(dataArray);

    document.querySelectorAll('.visualizer .bar').forEach((bar, index) => {
        const value = dataArray[index % dataArray.length] / 255;

        bar.style.height = `${10 + value * 50}px`;
        bar.style.opacity = String(0.7 + value * 0.3);
    });
}

function updatePlayPauseState(playing) {
    isPlaying = playing;

    const iconClass = playing ? 'fas fa-pause' : 'fas fa-play';

    if (playPauseIcon) playPauseIcon.className = iconClass;

    const pauseButton = document.getElementById('pauseSong');
    const pauseIcon = pauseButton?.querySelector('i');

    if (pauseIcon) pauseIcon.className = iconClass;

    document.querySelectorAll('#controls button, #pauseSong').forEach(button => {
        button.classList.toggle('playing-control', playing);
    });

    if (playing) {
        startCdRotation();
        player?.classList.add('expanded');
    } else {
        stopCdRotation();
        player?.classList.remove('expanded');
    }
}


function updateNowPlaying() {
    if (!nowPlaying) return;

    const title = currentPlayingTitle
        ? `${currentPlayingTitle} - ${currentPlayingArtist}`
        : 'Selecione uma música';

    const marquee = document.createElement('div');
    marquee.className = 'now-playing__marquee';

    const track = document.createElement('div');
    track.className = 'now-playing__track';

    const firstText = document.createElement('span');
    firstText.className = 'now-playing__text';
    firstText.textContent = title;

    track.appendChild(firstText);
    marquee.appendChild(track);
    nowPlaying.replaceChildren(marquee);

    const updateScrolling = () => {
        marquee.classList.remove('is-scrolling');
        track.style.removeProperty('--scroll-duration');

        const shouldScroll = firstText.scrollWidth - 22 > marquee.clientWidth;

        if (!shouldScroll || !currentPlayingTitle) return;

        const secondText = firstText.cloneNode(true);
        secondText.setAttribute('aria-hidden', 'true');

        track.appendChild(secondText);

        const distance = firstText.getBoundingClientRect().width;
        const duration = Math.max(8, distance / 35);

        track.style.setProperty('--scroll-duration', `${duration}s`);
        marquee.classList.add('is-scrolling');
    };

    requestAnimationFrame(updateScrolling);
}


function updatePlayingCards() {
    document.querySelectorAll('.result, .single-card').forEach(card => {
        const title = card.dataset.title;
        const artist = card.dataset.artist;

        const active = title === currentPlayingTitle &&
            artist === currentPlayingArtist &&
            !!currentPlayingTitle;

        card.classList.toggle('playing', active);
    });
}

function updatePlayerFavoriteIcon() {
    const icon = document.getElementById('playerFavoriteIcon');
    if (!icon) return;

    const favorite = currentPlayingTitle &&
        isMusicaFavorita(currentPlayingTitle, currentPlayingArtist);

    icon.className = `${favorite ? 'fas' : 'far'} fa-star`;
}

function atualizarPlayerFavoriteIcon() {
    updatePlayerFavoriteIcon();
}

function sincronizarEstrelasNaTela() {
    document.querySelectorAll('.favorite-star').forEach(button => {
        const card = button.closest('[data-title][data-artist]');
        if (!card) return;

        const icon = button.querySelector('i');
        if (!icon) return;

        const favorite = isMusicaFavorita(card.dataset.title, card.dataset.artist);

        icon.className = `${favorite ? 'fas' : 'far'} fa-star`;
        icon.style.color = '';
        button.classList.toggle('active', favorite);
        button.setAttribute('aria-label', favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    });

    updatePlayerFavoriteIcon();
}

function refreshFavoriteUI() {
    sincronizarEstrelasNaTela();
    atualizarPlaylist();
}

function toggleFavorite(title, artist) {
    if (!title || !artist) return;

    if (isMusicaFavorita(title, artist)) {
        removeMusicaFavorita(title, artist);
        playSound('star-off-sound');
    } else {
        addMusicaFavorita(title, artist);
        playSound('star-on-sound');
    }

    refreshFavoriteUI();
}

function favoritarMusica(starElement, event, title = null, artist = null) {
    event?.stopPropagation();

    const card = starElement.closest('[data-title][data-artist]');

    title = title || card?.dataset.title;
    artist = artist || card?.dataset.artist;

    toggleFavorite(title, artist);
}

function toggleCurrentFavorite() {
    if (!currentPlayingTitle) return;

    toggleFavorite(currentPlayingTitle, currentPlayingArtist);
}

function updateAudioControls() {
    const hasSong = !!currentAudioSrc;

    ['restartSong', 'pauseSong', 'prevSong', 'nextSong'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = !hasSong;
    });

    const favoriteButton = document.getElementById('playerFavoriteBtn');
    if (favoriteButton) favoriteButton.disabled = !hasSong;
}

function playMusic(audioSrc, title, artist, contextSongs = null, contextIndex = 0) {
    if (!audioSrc) return;

    const previousSrc = currentAudioSrc;

    currentAudioSrc = audioSrc;
    currentPlayingTitle = title;
    currentPlayingArtist = artist;

    if (Array.isArray(contextSongs) && contextSongs.length > 0) {
        currentPlaylistContext = contextSongs;
        currentPlaylistIndex = contextIndex;
        currentPlayMode = 'playlist';
    } else {
        currentPlaylistContext = [];
        currentPlaylistIndex = -1;
        currentPlayMode = 'normal';
    }

    if (previousSrc !== audioSrc) {
        audioPlayer.src = audioSrc;
        currentTimeDisplay.textContent = '0:00';
        durationDisplay.textContent = '0:00';
        progressBar.style.width = '0%';
    } else {
        audioPlayer.currentTime = 0;
    }

    updateNowPlaying();
    updatePlayingCards();
    updateAudioControls();
    refreshFavoriteUI();

    ensureAudioContext();

    audioPlayer.play().catch(() => {
        updatePlayPauseState(false);
    });
}

function togglePlayPause() {
    playSound('click-sound');

    if (!audioPlayer.paused) {
        audioPlayer.pause();
        return;
    }

    if (!currentAudioSrc) {
        const firstResult = document.querySelector('.result, .single-card');

        if (firstResult) {
            firstResult.click();
        }

        return;
    }

    ensureAudioContext();
    audioPlayer.play().catch(() => updatePlayPauseState(false));
}

function showVolumeControls() {
    document.querySelector('.volume-controls')?.classList.add('visible');
}

function hideVolumeControls() {
    document.querySelector('.volume-controls')?.classList.remove('visible');
}

function updateVolumeIcon() {
    const icon = document.getElementById('muteIcon');
    const slider = document.getElementById('volumeSlider');

    if (!icon || !slider) return;

    slider.value = String(audioPlayer.volume);

    if (audioPlayer.muted || audioPlayer.volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (audioPlayer.volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

function toggleMute() {
    if (audioPlayer.muted || audioPlayer.volume === 0) {
        audioPlayer.muted = false;
        audioPlayer.volume = 0.7;
    } else {
        audioPlayer.muted = true;
    }

    updateVolumeIcon();
}

function atualizarPlaylist() {
    const playlist = document.getElementById('playlist');
    if (!playlist) return;

    const favorites = getFavorites();
    playlist.replaceChildren();

    if (!favorites.length) {
        const empty = document.createElement('li');
        empty.className = 'playlist-empty';
        empty.textContent = 'Sua coleção ainda está vazia. Favorite suas músicas para começar ♡';
        playlist.appendChild(empty);
        playlist.classList.remove('has-scroll');
        return;
    }

    favorites.forEach((music, index) => {
        const item = document.createElement('li');
        const isCurrent = music.title === currentPlayingTitle &&
            music.artist === currentPlayingArtist;

        item.className = 'playlist-item';
        item.classList.toggle('current-playing', isCurrent);
        item.classList.toggle('playing', isCurrent && isPlaying);

        const track = document.createElement('span');
        track.className = 'playlist-track';
        track.textContent = `${String(index + 1).padStart(2, '0')} / ${music.title} — ${music.artist}`;

        const controls = document.createElement('div');
        controls.className = 'playlist-controls';

        if (isCurrent) {
            const indicator = document.createElement('span');
            indicator.className = 'now-playing-indicator';
            indicator.innerHTML = '<i class="fas fa-volume-up"></i>';
            controls.appendChild(indicator);
        }

        const removeButton = document.createElement('button');
        removeButton.className = 'delete-button';
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.setAttribute('aria-label', `Remover ${music.title} da playlist`);

        removeButton.addEventListener('click', event => {
            event.stopPropagation();
            removeFromPlaylist(event, music.title, music.artist);
        });

        controls.appendChild(removeButton);
        item.append(track, controls);

        item.addEventListener('click', () => {
            playFromPlaylist(music.title, music.artist);
        });

        playlist.appendChild(item);
    });

    playlist.classList.toggle('has-scroll', favorites.length >= 9);
}

function removeFromPlaylist(event, title, artist) {
    event?.stopPropagation();

    removeMusicaFavorita(title, artist);
    playSound('star-off-sound');

    refreshFavoriteUI();
}

function playFromPlaylist(title, artist) {
    const favorites = getFavorites();
    const songs = playlistSongsFromFavorites(favorites);

    const index = songs.findIndex(song =>
        song.title === title && song.artist === artist
    );

    if (index === -1) return;

    stopAllRandom();
    playSound('click-sound');

    const song = songs[index];

    playMusic(song.audioSrc, song.title, song.artist, songs, index);
}

function playRandomFromPlaylist() {
    const songs = playlistSongsFromFavorites(getFavorites());
    if (!songs.length) return;

    stopAllRandom();

    const index = Math.floor(Math.random() * songs.length);
    const song = songs[index];

    playMusic(song.audioSrc, song.title, song.artist, songs, index);
}

function updateRandomButtons() {
    const button = document.getElementById('randomModeBtn');

    if (button) {
        button.classList.toggle('active', globalRandomActive);
        button.setAttribute('aria-pressed', String(globalRandomActive));
    }
}

function stopAllRandom() {
    globalRandomActive = false;
    currentArtistRandomActive = false;
    currentAlbumRandomActive = false;

    updateRandomButtons();
}

function selectRandomSong(songs, history) {
    if (!songs.length) return null;

    let available = songs.filter(song =>
        !history.includes(getSongKey(song))
    );

    if (!available.length) {
        history.length = 0;
        available = [...songs];
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    history.push(getSongKey(selected));

    return selected;
}

function playNextGlobalRandom() {
    if (!globalRandomActive) return;

    const songs = globalRandomFilter === 'all'
        ? getAllSongsFromDatabase()
        : getSongsByArtist(globalRandomFilter);

    const song = selectRandomSong(songs, globalPlayHistory);

    if (song) {
        playMusic(song.audioSrc, song.title, song.artist);
    }
}

function startGlobalRandom() {
    stopAllRandom();

    globalRandomActive = true;
    globalPlayHistory = [];

    updateRandomButtons();
    playNextGlobalRandom();
}

function toggleRandomMode() {
    playSound('click-sound');

    if (globalRandomActive) {
        stopAllRandom();
    } else {
        startGlobalRandom();
    }
}

function playRandomFromArtist(artist) {
    const songs = getSongsByArtist(artist);
    if (!songs.length) return;

    stopAllRandom();

    currentArtistRandomActive = true;
    currentArtistName = artist;
    artistPlayHistory = [];

    playNextArtistRandom();
}

function playNextArtistRandom() {
    if (!currentArtistRandomActive) return;

    const songs = getSongsByArtist(currentArtistName);
    const song = selectRandomSong(songs, artistPlayHistory);

    if (song) {
        playMusic(song.audioSrc, song.title, song.artist);
    }
}

function playRandomFromAlbum(artist, albumName) {
    const songs = getSongsByAlbum(artist, albumName);
    if (!songs.length) return;

    stopAllRandom();

    currentAlbumRandomActive = true;
    currentAlbumArtist = artist;
    currentAlbumName = albumName;
    albumPlayHistory = [];

    playNextAlbumRandom();
}

function playNextAlbumRandom() {
    if (!currentAlbumRandomActive) return;

    const songs = getSongsByAlbum(currentAlbumArtist, currentAlbumName);
    const song = selectRandomSong(songs, albumPlayHistory);

    if (song) {
        playMusic(song.audioSrc, song.title, song.artist);
    }
}

function setRandomFilter(filter) {
    globalRandomFilter = filter;

    document.querySelectorAll('.random-filter-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.filter === filter);
    });

    const select = document.getElementById('artistFilterSelect');

    if (select) {
        select.value = filter;
    }

    globalPlayHistory = [];
}

function populateArtistFilter() {
    const select = document.getElementById('artistFilterSelect');
    if (!select) return;

    select.innerHTML = '<option value="all">Todos os artistas</option>';

    Object.keys(musicDatabase).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
    ).forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        option.textContent = artist;
        select.appendChild(option);
    });
}

function nextMusic() {
    if (globalRandomActive) return playNextGlobalRandom();
    if (currentArtistRandomActive) return playNextArtistRandom();
    if (currentAlbumRandomActive) return playNextAlbumRandom();

    if (currentPlaylistContext.length) {
        const nextIndex = (currentPlaylistIndex + 1) % currentPlaylistContext.length;
        const song = currentPlaylistContext[nextIndex];

        playMusic(song.audioSrc, song.title, song.artist, currentPlaylistContext, nextIndex);
        return;
    }

    const songs = playlistSongsFromFavorites(getFavorites());
    if (!songs.length) return;

    const currentIndex = songs.findIndex(song =>
        song.title === currentPlayingTitle &&
        song.artist === currentPlayingArtist
    );

    const nextIndex = (currentIndex + 1) % songs.length;
    const song = songs[nextIndex];

    playMusic(song.audioSrc, song.title, song.artist, songs, nextIndex);
}

function prevMusic() {
    if (globalRandomActive) return playNextGlobalRandom();
    if (currentArtistRandomActive) return playNextArtistRandom();
    if (currentAlbumRandomActive) return playNextAlbumRandom();

    if (currentPlaylistContext.length) {
        const prevIndex = (currentPlaylistIndex - 1 + currentPlaylistContext.length) % currentPlaylistContext.length;
        const song = currentPlaylistContext[prevIndex];

        playMusic(song.audioSrc, song.title, song.artist, currentPlaylistContext, prevIndex);
        return;
    }

    const songs = playlistSongsFromFavorites(getFavorites());
    if (!songs.length) return;

    const currentIndex = songs.findIndex(song =>
        song.title === currentPlayingTitle &&
        song.artist === currentPlayingArtist
    );

    const prevIndex = currentIndex < 0
        ? songs.length - 1
        : (currentIndex - 1 + songs.length) % songs.length;

    const song = songs[prevIndex];

    playMusic(song.audioSrc, song.title, song.artist, songs, prevIndex);
}

function artistIsInFeat(artistName, song) {
    if (!song.featuredArtist) return false;

    return normalizeText(song.featuredArtist).includes(normalizeText(artistName));
}

function getArtistFeatures(artist) {
    const features = [];

    for (const otherArtist in musicDatabase) {
        if (otherArtist === artist) continue;

        for (const albumName in musicDatabase[otherArtist]) {
            const album = musicDatabase[otherArtist][albumName];
            if (!album || !Array.isArray(album.songs)) continue;

            album.songs.forEach(song => {
                if (!artistIsInFeat(artist, song)) return;

                features.push({
                    title: song.title,
                    artist: getSongArtist(otherArtist, song),
                    audioSrc: song.audioSrc,
                    cover: song.cover || album.cover || ''
                });
            });
        }
    }

    return features;
}

function checkArtistFeatures(artist) {
    return getArtistFeatures(artist).length > 0;
}

function createFavoriteButton(song) {
    const button = document.createElement('button');
    button.className = 'favorite-star';

    const favorite = isMusicaFavorita(song.title, song.artist);

    button.innerHTML = `<i class="${favorite ? 'fas' : 'far'} fa-star"></i>`;
    button.classList.toggle('active', favorite);
    button.setAttribute('aria-label', favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');

    button.addEventListener('click', event => {
        event.stopPropagation();
        toggleFavorite(song.title, song.artist);
    });

    return button;
}

function createTrackCard(song, playlist, index) {
    const card = document.createElement('div');
    card.className = 'result';
    card.dataset.title = song.title;
    card.dataset.artist = song.artist;

    const content = document.createElement('div');
    content.className = 'result-content';

    const title = document.createElement('h3');
    title.textContent = song.title;

    const artist = document.createElement('p');
    artist.textContent = song.artist;

    content.append(title, artist);
    card.append(createFavoriteButton(song), content);

    card.addEventListener('click', event => {
        if (event.target.closest('.favorite-star')) return;

        stopAllRandom();
        playMusic(song.audioSrc, song.title, song.artist, playlist, index);
    });

    return card;
}

function createSingleCard(song, mainArtist = null, playlist = null, index = 0) {
    const artist = mainArtist
        ? getSongArtist(mainArtist, song)
        : song.artist;

    const normalizedSong = {
        title: song.title,
        artist,
        audioSrc: song.audioSrc,
        cover: song.cover || ''
    };

    const card = document.createElement('div');
    card.className = 'single-card';
    card.dataset.title = normalizedSong.title;
    card.dataset.artist = normalizedSong.artist;

    const cover = document.createElement('div');
    cover.className = 'single-cover-container';

    const image = createImageWrapper(
        normalizedSong.cover,
        normalizedSong.title,
        'single-cover',
        'default-single.jpg'
    );

    const overlay = document.createElement('div');
    overlay.className = 'single-overlay';
    overlay.innerHTML = '<i class="fas fa-play"></i>';

    cover.append(image.wrapper, overlay);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'single-info-container';

    const info = document.createElement('div');
    info.className = 'single-info';

    const title = document.createElement('h4');
    title.textContent = normalizedSong.title;

    const artistName = document.createElement('p');
    artistName.textContent = normalizedSong.artist;

    info.append(title, artistName);
    infoContainer.append(info, createFavoriteButton(normalizedSong));

    card.append(cover, infoContainer);

    card.addEventListener('click', event => {
        if (event.target.closest('.favorite-star')) return;

        stopAllRandom();

        const context = playlist && playlist.length
            ? playlist
            : [normalizedSong];

        playMusic(
            normalizedSong.audioSrc,
            normalizedSong.title,
            normalizedSong.artist,
            context,
            index
        );
    });

    return card;
}

function createAlbumCard(artist, albumName, album) {
    const card = document.createElement('div');
    card.className = 'album-card';

    const coverContainer = document.createElement('div');
    coverContainer.className = 'album-cover-container';

    const image = createImageWrapper(
        album.cover,
        albumName,
        'album-cover',
        'default-album.jpg'
    );

    const overlay = document.createElement('div');
    overlay.className = 'album-overlay';

    const count = document.createElement('span');
    count.className = 'song-count';
    count.textContent = `${album.songs.length} ${album.songs.length === 1 ? 'música' : 'músicas'}`;

    overlay.appendChild(count);
    coverContainer.append(image.wrapper, overlay);

    const info = document.createElement('div');
    info.className = 'album-info';

    const title = document.createElement('h3');
    title.textContent = albumName;

    const artistName = document.createElement('p');
    artistName.textContent = artist;

    info.append(title, artistName);
    card.append(coverContainer, info);

    card.addEventListener('click', () => {
        playSound('click-sound');
        showSongs(artist, albumName);
    });

    return card;
}

function showAlbums(artist) {
    const artistData = musicDatabase[artist];

    if (!artistData) {
        resultsContainer.innerHTML = '<p class="empty-results">Artista não encontrado.</p>';
        return;
    }

    searchRequestId++;

    const section = document.createElement('section');
    section.className = 'artist-section';

    const header = document.createElement('div');
    header.className = 'discografia-header';

    if (cameFromSearch && lastSearchQuery) {
        const backButton = document.createElement('button');
        backButton.className = 'search-back-button';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backButton.addEventListener('click', goBackToSearch);
        header.appendChild(backButton);
    }

    const eyebrow = document.createElement('span');
    eyebrow.className = 'discography-eyebrow';
    eyebrow.textContent = 'ARTIST DATABASE / DIGITAL ARCHIVE';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = `Discografia de ${artist}`;

    const randomButton = document.createElement('button');
    randomButton.className = 'random-mode-btn artist-random-btn';
    randomButton.innerHTML = '<i class="fas fa-random"></i> TOCAR ARTISTA ALEATORIAMENTE';
    randomButton.addEventListener('click', () => playRandomFromArtist(artist));

    header.append(eyebrow, title, randomButton);
    section.appendChild(header);

    const discography = document.createElement('div');
    discography.className = 'discography-container';
    discography.id = 'discographyContainer';

    const albumsHeading = document.createElement('h3');
    albumsHeading.className = 'section-subtitle';
    albumsHeading.textContent = 'ÁLBUNS & EPs';

    const albumGrid = document.createElement('div');
    albumGrid.className = 'album-grid';
    albumGrid.id = 'albumGrid';

    const albumNames = Object.keys(artistData).filter(name =>
        !name.startsWith('_') &&
        artistData[name] &&
        Array.isArray(artistData[name].songs)
    );

    albumNames.forEach(albumName => {
        albumGrid.appendChild(createAlbumCard(artist, albumName, artistData[albumName]));
    });

    discography.append(albumsHeading, albumGrid);

    const singles = artistData._singles?.songs || [];

    if (singles.length) {
        discography.classList.add('with-singles-layout');

        const singlesSection = document.createElement('div');
        singlesSection.className = 'singles-section';
        singlesSection.id = 'singlesSection';

        const singlesHeading = document.createElement('h3');
        singlesHeading.className = 'section-subtitle';
        singlesHeading.textContent = 'SINGLES';

        const singlesGrid = document.createElement('div');
        singlesGrid.className = 'singles-grid';
        singlesGrid.id = 'singlesGrid';

        const playlist = singles.map(song => ({
            title: song.title,
            artist: getSongArtist(artist, song),
            audioSrc: song.audioSrc
        }));

        singles.forEach((song, index) => {
            singlesGrid.appendChild(createSingleCard(song, artist, playlist, index));
        });

        singlesSection.append(singlesHeading, singlesGrid);
        discography.appendChild(singlesSection);
    }

    section.appendChild(discography);

    const features = getArtistFeatures(artist);

    if (features.length) {
        const featuresSection = document.createElement('div');
        featuresSection.className = 'features-section';
        featuresSection.id = 'featuresSection';

        const featuresHeading = document.createElement('h3');
        featuresHeading.className = 'section-subtitle';
        featuresHeading.textContent = 'PARTICIPAÇÕES';

        const featuresGrid = document.createElement('div');
        featuresGrid.className = 'features-grid';
        featuresGrid.id = 'featuresGrid';

        features.forEach((song, index) => {
            featuresGrid.appendChild(createSingleCard(song, null, features, index));
        });

        featuresSection.append(featuresHeading, featuresGrid);
        section.appendChild(featuresSection);
    }

    resultsContainer.replaceChildren(section);

    ensureImageLoadersInContainer(resultsContainer);
    updatePlayingCards();
    sincronizarEstrelasNaTela();
}

function showSongs(artist, albumName) {
    const album = musicDatabase[artist]?.[albumName];
    if (!album || !Array.isArray(album.songs)) return;

    searchRequestId++;

    const section = document.createElement('section');
    section.className = 'album-detail-grid';

    const headerContainer = document.createElement('div');
    headerContainer.className = 'album-header-container';

    const header = document.createElement('div');
    header.className = 'album-header';

    const background = document.createElement('div');
    background.className = 'album-header-background';
    background.style.backgroundImage = `url("${String(album.cover || '').replace(/"/g, '%22')}")`;

    const overlay = document.createElement('div');
    overlay.className = 'album-header-overlay';

    const content = document.createElement('div');
    content.className = 'album-header-content';

    const coverContainer = document.createElement('div');
    coverContainer.className = 'album-cover-large-container';

    const cover = createImageWrapper(
        album.cover,
        albumName,
        'album-cover-large',
        'default-album.jpg'
    );

    coverContainer.appendChild(cover.wrapper);

    const info = document.createElement('div');
    info.className = 'album-header-info';

    const type = document.createElement('span');
    type.className = 'album-type';
    type.textContent = 'DIGITAL ALBUM / VMP ARCHIVE';

    const title = document.createElement('h2');
    title.className = 'album-title';
    title.textContent = albumName;

    const meta = document.createElement('div');
    meta.className = 'album-meta';

    const artistName = document.createElement('span');
    artistName.className = 'album-artist';
    artistName.textContent = artist;

    const count = document.createElement('span');
    count.className = 'album-tracks';
    count.textContent = ` • ${album.songs.length} ${album.songs.length === 1 ? 'música' : 'músicas'}`;

    meta.append(artistName, count);

    const randomButton = document.createElement('button');
    randomButton.className = 'album-random-btn';
    randomButton.innerHTML = '<i class="fas fa-random"></i> SHUFFLE ALBUM';
    randomButton.addEventListener('click', () => playRandomFromAlbum(artist, albumName));

    info.append(type, title, meta, randomButton);
    content.append(coverContainer, info);

    const backButton = document.createElement('button');
    backButton.className = 'album-back-button';
    backButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    backButton.addEventListener('click', () => showAlbums(artist));

    header.append(background, overlay, content, backButton);
    headerContainer.appendChild(header);

    const trackSection = document.createElement('div');
    trackSection.className = 'album-track-section';

    const trackHeading = document.createElement('div');
    trackHeading.className = 'album-track-heading';
    trackHeading.innerHTML = `
        <span>TRACKLIST / ${String(album.songs.length).padStart(2, '0')} TRACKS</span>
        <span>STEREO ♫</span>
    `;

    const songsContainer = document.createElement('div');
    songsContainer.className = 'songs-grid-container';

    const playlist = album.songs.map(song => ({
        title: song.title,
        artist: getSongArtist(artist, song),
        audioSrc: song.audioSrc
    }));

    playlist.forEach((song, index) => {
        const card = createTrackCard(song, playlist, index);

        const number = document.createElement('span');
        number.className = 'track-number';
        number.textContent = String(index + 1).padStart(2, '0');

        card.prepend(number);
        songsContainer.appendChild(card);
    });

    trackSection.append(trackHeading, songsContainer);
    section.append(headerContainer, trackSection);

    resultsContainer.replaceChildren(section);

    ensureImageLoadersInContainer(resultsContainer);
    updatePlayingCards();
    sincronizarEstrelasNaTela();
}

function goBackToSearch() {
    if (!lastSearchQuery) {
        resultsContainer.replaceChildren();
        return;
    }

    cameFromSearch = true;
    searchInput.value = lastSearchQuery;
    search();
}

function buildResultsFragment(results) {
    const fragment = document.createDocumentFragment();

    const albumSongs = results.filter(song => !song.isSingle);
    const singles = results.filter(song => song.isSingle);

    if (albumSongs.length) {
        const section = document.createElement('section');
        section.className = 'search-tracks-section';

        const heading = document.createElement('h3');
        heading.className = 'section-subtitle';
        heading.textContent = 'MÚSICAS ENCONTRADAS';

        const grid = document.createElement('div');
        grid.className = 'songs-grid-container';

        albumSongs.forEach((song, index) => {
            grid.appendChild(createTrackCard(song, albumSongs, index));
        });

        section.append(heading, grid);
        fragment.appendChild(section);
    }

    if (singles.length) {
        const section = document.createElement('section');
        section.className = 'singles-section';

        const heading = document.createElement('h3');
        heading.className = 'section-subtitle';
        heading.textContent = 'SINGLES';

        const grid = document.createElement('div');
        grid.className = 'singles-grid';

        singles.forEach((song, index) => {
            grid.appendChild(createSingleCard(song, null, singles, index));
        });

        section.append(heading, grid);
        fragment.appendChild(section);
    }

    return fragment;
}

async function searchArtistImageLastFm(artistName) {
    if (!LASTFM_API_KEY) return null;

    try {
        const url = `${LASTFM_API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;
        const response = await fetch(url);

        if (!response.ok) return null;

        const data = await response.json();
        const images = data.artist?.image || [];

        for (const size of ['mega', 'extralarge', 'large', 'medium', 'small']) {
            const image = images.find(item => item.size === size);
            const url = image?.['#text'];

            if (url && !url.includes('avatar')) return url;
        }
    } catch {
        return null;
    }

    return null;
}

async function getArtistImage(artistName) {
    if (artistImageCache[artistName]) return artistImageCache[artistName];

    const cacheKey = `artist_img_${artistName}`;

    try {
        const cached = localStorage.getItem(cacheKey);

        if (cached && cached !== 'null' && cached !== 'undefined') {
            artistImageCache[artistName] = cached;
            return cached;
        }
    } catch {}

    const image = await searchArtistImageLastFm(artistName);

    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName.split(' ')[0])}&background=83b9f5&color=263c65&size=160&bold=true&length=1`;

    const imageUrl = image || fallback;

    artistImageCache[artistName] = imageUrl;

    try {
        localStorage.setItem(cacheKey, imageUrl);
    } catch {}

    return imageUrl;
}

async function buildArtistResultsFragment(artists) {
    const fragment = document.createDocumentFragment();

    if (!artists.length) return fragment;

    const mainArtist = artists[0];
    const image = await getArtistImage(mainArtist.name);

    const section = document.createElement('section');
    section.className = 'artist-result-card main-result';

    const header = document.createElement('div');
    header.className = 'artist-result-header';

    const avatar = document.createElement('div');
    avatar.className = 'artist-avatar';

    avatar.appendChild(createImageWrapper(
        image,
        mainArtist.name,
        'artist-avatar-img',
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mainArtist.name)}`
    ).wrapper);

    const info = document.createElement('div');
    info.className = 'artist-info';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'artist-result-eyebrow';
    eyebrow.textContent = 'ARTIST FOUND / MUSIC ARCHIVE';

    const title = document.createElement('h2');
    title.textContent = mainArtist.name;

    const subtitle = document.createElement('p');
    subtitle.textContent = 'ARTISTA DISPONÍVEL NO SISTEMA';

    info.append(eyebrow, title, subtitle);

    const button = document.createElement('button');
    button.className = 'view-profile-btn';
    button.innerHTML = 'EXPLORAR DISCOGRAFIA <i class="fas fa-arrow-right"></i>';
    button.addEventListener('click', () => showAlbums(mainArtist.name));

    header.append(avatar, info, button);
    section.appendChild(header);
    fragment.appendChild(section);

    if (artists.length > 1) {
        const similarSection = document.createElement('section');
        similarSection.className = 'similar-artists-section';

        const heading = document.createElement('h3');
        heading.className = 'section-subtitle';
        heading.textContent = 'OUTROS ARTISTAS ENCONTRADOS';

        const grid = document.createElement('div');
        grid.className = 'similar-artists-grid';

        const remaining = artists.slice(1, 6);

        const images = await Promise.all(
            remaining.map(artist => getArtistImage(artist.name))
        );

        remaining.forEach((artist, index) => {
            const card = document.createElement('div');
            card.className = 'similar-artist-card';

            const avatar = document.createElement('div');
            avatar.className = 'similar-artist-avatar';

            avatar.appendChild(createImageWrapper(
                images[index],
                artist.name,
                'similar-artist-img'
            ).wrapper);

            const info = document.createElement('div');
            info.className = 'similar-artist-info';

            const name = document.createElement('h4');
            name.textContent = artist.name;

            const button = document.createElement('button');
            button.className = 'small-profile-btn';
            button.textContent = 'ACESSAR ↗';
            button.addEventListener('click', () => showAlbums(artist.name));

            info.append(name, button);
            card.append(avatar, info);

            grid.appendChild(card);
        });

        similarSection.append(heading, grid);
        fragment.appendChild(similarSection);
    }

    return fragment;
}

async function search() {
    const query = searchInput.value.trim();
    const requestId = ++searchRequestId;

    if (!query) {
        resultsContainer.replaceChildren();
        return;
    }

    lastSearchQuery = query;
    cameFromSearch = true;

    if (searchButton) {
        searchButton.classList.add('loading');
        searchButton.disabled = true;
        searchButton.innerHTML = '<span class="spinner"></span><span>SEARCHING...</span>';
    }

    resultsContainer.innerHTML = `
        <div class="search-loading">
            <span class="spinner"></span>
            <span>SCANNING THE DIGITAL ARCHIVE...</span>
        </div>
    `;

    const startTime = Date.now();

    try {
        const normalized = normalizeText(query);

        const artists = Object.keys(musicDatabase)
            .filter(artist => normalizeText(artist).includes(normalized))
            .sort((a, b) => {
                const aExact = normalizeText(a) === normalized ? 1 : 0;
                const bExact = normalizeText(b) === normalized ? 1 : 0;
                return bExact - aExact || a.localeCompare(b, 'pt-BR');
            })
            .map(name => ({ name }));

        let fragment;

        if (artists.length) {
            fragment = await buildArtistResultsFragment(artists);
        } else {
            const songs = getAllSongsFromDatabase().filter(song =>
                normalizeText(song.title).includes(normalized) ||
                normalizeText(song.artist).includes(normalized) ||
                normalizeText(song.album).includes(normalized)
            );

            if (songs.length) {
                fragment = buildResultsFragment(songs);
            } else {
                const empty = document.createElement('div');
                empty.className = 'empty-results';
                empty.innerHTML = `
                    <span class="empty-results__icon">✳</span>
                    <h3>NO SIGNAL FOUND</h3>
                    <p>Nenhum resultado encontrado para "${escapeHTML(query)}".</p>
                `;

                fragment = empty;
            }
        }

        const elapsed = Date.now() - startTime;
        await new Promise(resolve => setTimeout(resolve, Math.max(0, 400 - elapsed)));

        if (requestId !== searchRequestId) return;

        resultsContainer.replaceChildren(fragment);
        ensureImageLoadersInContainer(resultsContainer);
        updatePlayingCards();
        sincronizarEstrelasNaTela();
    } catch {
        if (requestId === searchRequestId) {
            resultsContainer.innerHTML = '<p class="empty-results">Não foi possível concluir a pesquisa.</p>';
        }
    } finally {
        if (requestId === searchRequestId && searchButton) {
            searchButton.classList.remove('loading');
            searchButton.disabled = false;
            searchButton.innerHTML = '<span>SEARCH</span><i class="fas fa-arrow-right"></i>';
        }
    }
}

function searchArtist(artistName) {
    const artist = Object.keys(musicDatabase).find(name =>
        normalizeText(name) === normalizeText(artistName)
    );

    fecharPainel();

    if (artist) {
        cameFromSearch = false;
        lastSearchQuery = '';
        searchInput.value = artist;
        showAlbums(artist);
    } else {
        searchInput.value = artistName;
        search();
    }

    updateClearSearchButton();
}

function updateClearSearchButton() {
    const button = document.getElementById('clearSearch');
    if (!button) return;

    button.style.display = searchInput.value ? 'flex' : 'none';
}

function clearSearch() {
    searchRequestId++;

    searchInput.value = '';
    resultsContainer.replaceChildren();

    cameFromSearch = false;
    lastSearchQuery = '';

    if (searchButton) {
        searchButton.disabled = false;
        searchButton.classList.remove('loading');
        searchButton.innerHTML = '<span>SEARCH</span><i class="fas fa-arrow-right"></i>';
    }

    updateClearSearchButton();
    searchInput.focus();
}

function abrirPainel() {
    playSound('panel-open-sound');

    fecharPlaylist(false);

    document.getElementById('painelInformacoes')?.classList.add('active');

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'block';

    document.body.classList.add('catalog-open');
}

function fecharPainel() {
    document.getElementById('painelInformacoes')?.classList.remove('active');

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';

    document.body.classList.remove('catalog-open');
}

function abrirPlaylist() {
    fecharPainel();

    document.getElementById('playlistContainer')?.classList.add('active');

    const overlay = document.getElementById('playlistOverlay');
    if (overlay) overlay.style.display = 'block';

    document.body.classList.add('playlist-open');

    atualizarPlaylist();
}

function fecharPlaylist(withSound = false) {
    document.getElementById('playlistContainer')?.classList.remove('active');

    const overlay = document.getElementById('playlistOverlay');
    if (overlay) overlay.style.display = 'none';

    document.body.classList.remove('playlist-open');

    if (withSound) playSound('click-sound');
}

function mostrarOcultarPlaylist() {
    const playlist = document.getElementById('playlistContainer');

    if (playlist?.classList.contains('active')) {
        fecharPlaylist();
    } else {
        abrirPlaylist();
    }

    playSound('click-sound');
}

function setProgress(event) {
    if (!Number.isFinite(audioPlayer.duration) || !audioPlayer.duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));

    audioPlayer.currentTime = position * audioPlayer.duration;
}

function updateProgress() {
    const duration = audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;

    currentTimeDisplay.textContent = formatTime(currentTime);

    if (Number.isFinite(duration) && duration > 0) {
        progressBar.style.width = `${Math.min(100, (currentTime / duration) * 100)}%`;
        durationDisplay.textContent = formatTime(duration);
    } else {
        progressBar.style.width = '0%';
    }
}

function handleSongEnded() {
    updatePlayPauseState(false);

    if (globalRandomActive) {
        playNextGlobalRandom();
        return;
    }

    if (currentArtistRandomActive) {
        playNextArtistRandom();
        return;
    }

    if (currentAlbumRandomActive) {
        playNextAlbumRandom();
        return;
    }

    if (currentPlaylistContext.length) {
        nextMusic();
        return;
    }

    currentPlayingTitle = '';
    currentPlayingArtist = '';
    currentAudioSrc = '';

    updateNowPlaying();
    updatePlayingCards();
    updateAudioControls();
    refreshFavoriteUI();

    progressBar.style.width = '0%';
    currentTimeDisplay.textContent = '0:00';
}

const headerCdrom = document.querySelector('.header-cdrom');
const headerAudioPlayer = document.getElementById('audioPlayer');

if (headerCdrom && headerAudioPlayer) {
    const atualizarCdCabecalho = () => {
        const tocando = !headerAudioPlayer.paused && !headerAudioPlayer.ended;
        headerCdrom.classList.toggle('girar', tocando);
    };

    headerAudioPlayer.addEventListener('play', atualizarCdCabecalho);
    headerAudioPlayer.addEventListener('pause', atualizarCdCabecalho);
    headerAudioPlayer.addEventListener('ended', atualizarCdCabecalho);

    atualizarCdCabecalho();
}

function initializePlayer() {
    audioPlayer.volume = 0.7;

    updateVolumeIcon();
    updatePlayPauseState(false);
    updateAudioControls();

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateProgress);
    audioPlayer.addEventListener('durationchange', updateProgress);

    audioPlayer.addEventListener('play', () => {
        updatePlayPauseState(true);
        showVolumeControls();
        atualizarPlaylist();
    });

    audioPlayer.addEventListener('pause', () => {
        updatePlayPauseState(false);
        hideVolumeControls();
        atualizarPlaylist();
    });

    audioPlayer.addEventListener('ended', handleSongEnded);

    audioPlayer.addEventListener('volumechange', updateVolumeIcon);

    document.getElementById('nextSong')?.addEventListener('click', () => {
        playSound('click-sound');
        nextMusic();
    });

    document.getElementById('prevSong')?.addEventListener('click', () => {
        playSound('click-sound');
        prevMusic();
    });

    document.getElementById('pauseSong')?.addEventListener('click', event => {
        event.stopPropagation();
        togglePlayPause();
    });

    restartSongBtn?.addEventListener('click', () => {
        if (!currentAudioSrc) return;

        playSound('click-sound');

        audioPlayer.currentTime = 0;

        const icon = restartSongBtn.querySelector('i');

        if (icon) {
            icon.classList.remove('rotate-on-click');
            void icon.offsetWidth;
            icon.classList.add('rotate-on-click');
        }
    });

    document.getElementById('progressContainer')?.addEventListener('click', setProgress);

    document.getElementById('playlistOverlay')?.addEventListener('click', () => {
        fecharPlaylist(true);
    });

    document.getElementById('volumeSlider')?.addEventListener('input', event => {
        audioPlayer.muted = false;
        audioPlayer.volume = Number(event.target.value);
    });

    document.getElementById('artistFilterSelect')?.addEventListener('change', event => {
        setRandomFilter(event.target.value);
    });

    searchInput?.addEventListener('input', updateClearSearchButton);

    document.getElementById('playerToggle')?.addEventListener('click', event => {
        event.stopPropagation();
        playSound('click-sound');

        player?.classList.toggle('collapsed');
    });

    document.getElementById('playerFavoriteBtn')?.addEventListener('click', event => {
        event.stopPropagation();
        toggleCurrentFavorite();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            fecharPainel();
            fecharPlaylist();
        }
    });

    populateArtistFilter();
    atualizarPlaylist();
    updateClearSearchButton();
}


function resetVintageWindow() {
    searchRequestId++;

    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.load();
    document.querySelector('.header-cdrom')?.classList.remove('girar');
    stopCdRotation();

    currentAudioSrc = '';
    currentPlayingTitle = '';
    currentPlayingArtist = '';
    currentPlaylistContext = [];
    currentPlaylistIndex = -1;
    currentPlayMode = 'normal';

    stopAllRandom();

    currentArtistName = '';
    currentAlbumName = '';
    currentAlbumArtist = '';

    artistPlayHistory = [];
    albumPlayHistory = [];
    globalPlayHistory = [];

    cameFromSearch = false;
    lastSearchQuery = '';

    searchInput.value = '';
    resultsContainer.replaceChildren();

    if (searchButton) {
        searchButton.disabled = false;
        searchButton.classList.remove('loading');
        searchButton.innerHTML = '<span>SEARCH</span><i class="fas fa-arrow-right"></i>';
    }

    if (currentTimeDisplay) {
        currentTimeDisplay.textContent = '0:00';
    }

    if (durationDisplay) {
        durationDisplay.textContent = '0:00';
    }

    if (progressBar) {
        progressBar.style.width = '0%';
    }

    updatePlayPauseState(false);
    updateNowPlaying();
    updatePlayingCards();
    updateAudioControls();
    updatePlayerFavoriteIcon();
    updateClearSearchButton();
    atualizarPlaylist();

    fecharPainel();
    fecharPlaylist();

    setVintageWindowMaximized(false);
}

function setVintageWindowMaximized(maximized) {
    const centeredPair = document.querySelector('.vmp-centered-pair');
    const maximizeButton = document.getElementById('window-maximize');

    if (!centeredPair) return;

    centeredPair.classList.toggle('window-maximized', maximized);

    if (maximizeButton) {
        maximizeButton.setAttribute('aria-pressed', String(maximized));
    }
}

document.getElementById('window-reset')?.addEventListener('click', () => {
    playSound('click-sound');
    resetVintageWindow();
});

document.getElementById('window-maximize')?.addEventListener('click', () => {
    playSound('click-sound');
    setVintageWindowMaximized(true);
});

document.getElementById('window-restore')?.addEventListener('click', () => {
    playSound('click-sound');
    setVintageWindowMaximized(false);
});


initializePlayer();
