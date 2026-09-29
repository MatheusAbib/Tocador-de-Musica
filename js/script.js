const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_API_KEY = '';

const audioPlayer = document.getElementById('audioPlayer');
const playPauseIcon = document.getElementById('playPauseIcon');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const restartSongBtn = document.getElementById('restartSong');

let isPlaying = false;
let currentAudioSrc = '';
let cdRotationAngle = 0;
let cdRotationInterval;
let artistPlayHistory = [];
let albumPlayHistory = [];
let lastSearchQuery = '';
let currentPlayMode = 'normal';
let currentPlaylistContext = [];
let currentPlaylistIndex = -1;
let cameFromSearch = false;
let isAnalyzing = false;
let audioContext = null;
let analyser = null;
let dataArray = null;
let audioSourceNode = null;

let globalRandomActive = false;
let globalRandomFilter = 'all';
let currentArtistRandomActive = false;
let currentArtistName = '';
let currentAlbumRandomActive = false;
let currentAlbumName = '';
let currentAlbumArtist = '';

let currentPlayingTitle = '';
let currentPlayingArtist = '';

let artistImageCache = {};

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function normalizeText(text) {
    return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function escapeSingleQuote(str) {
    return String(str).replace(/'/g, "\\'");
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function waitForImages(container) {
    let images = [];
    if (container.querySelectorAll) {
        images = Array.from(container.querySelectorAll('img'));
    } else {
        const temp = document.createElement('div');
        temp.appendChild(container.cloneNode(true));
        images = Array.from(temp.querySelectorAll('img'));
    }
    if (images.length === 0) return Promise.resolve();

    const promises = images.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    });

    return Promise.all(promises);
}

function attachImageLoader(img, wrapper) {
    if (!img) return;

    const MIN_LOADING_TIME = 500;
    const startTime = Date.now();

    let resolved = false;

    const finish = () => {
        if (resolved) return;
        resolved = true;

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

        setTimeout(() => {
            img.classList.add('loaded');
            if (wrapper) wrapper.classList.add('loaded');
        }, remaining);
    };

    if (img.complete && img.naturalWidth > 0) {
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
    img.src = src;
    img.alt = alt || '';
    if (className) img.className = className;

    img.addEventListener('error', () => {
        if (fallbackSrc && img.src !== fallbackSrc) {
            img.src = fallbackSrc;
        }
    }, { once: true });

    wrapper.appendChild(img);
    attachImageLoader(img, wrapper);

    return { wrapper, img };
}

function getHTMLImageWrapper(src, alt, className, fallbackSrc) {
    const fallback = fallbackSrc || '';
    return `
        <div class="img-loading-wrapper">
            <img src="${src}" alt="${alt}" class="${className || ''}"
                 onerror="this.onerror=null; ${fallback ? `this.src='${fallback}';` : ''}">
        </div>
    `;
}

function ensureImageLoadersInContainer(container) {
    if (!container) return;
    const wrappers = container.querySelectorAll('.img-loading-wrapper');
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (img) attachImageLoader(img, wrapper);
    });
}

function findSongInDatabase(title, artist) {
    for (const artistName in musicDatabase) {
        for (const albumName in musicDatabase[artistName]) {
            const album = musicDatabase[artistName][albumName];
            if (!album || !album.songs) continue;
            for (const song of album.songs) {
                const songArtist = song.featuredArtist
                    ? `${artistName} ft. ${song.featuredArtist}`
                    : artistName;
                if (song.title === title && songArtist === artist) {
                    return {
                        audioSrc: song.audioSrc,
                        title: song.title,
                        artist: songArtist
                    };
                }
            }
        }
    }
    return null;
}

function playlistSongsFromFavorites(favorites) {
    return favorites
        .map(music => findSongInDatabase(music.title, music.artist))
        .filter(s => s !== null);
}

function updatePlayPauseState(playing) {
    isPlaying = playing;

    const pauseBtn = document.getElementById('pauseSong');
    const playBtn = document.getElementById('playPauseBtn');

    [pauseBtn, playBtn].forEach(btn => {
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
        }
        if (playing) {
            btn.classList.add('playing-control');
        } else {
            btn.classList.remove('playing-control');
        }
    });

    if (playing) {
        startCdRotation();
    } else {
        stopCdRotation();
    }
}

function togglePlayPause() {
    playSound('click-sound');

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        document.getElementById('pauseSong').innerHTML = '<i class="fas fa-play"></i>';
        stopCdRotation();
    } else {
        if (!currentAudioSrc) {
            const firstResult = document.querySelector('.result');
            if (firstResult) {
                firstResult.click();
                startCdRotation();
            }
        } else {
            ensureAudioContext();
            audioPlayer.play();
            isPlaying = true;
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
            document.getElementById('pauseSong').innerHTML = '<i class="fas fa-pause"></i>';
            startCdRotation();
        }
    }
}

function ensureAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return;
        }
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function setupAudioAnalyzer() {
    if (audioSourceNode || !audioContext || !analyser) return;
    try {
        audioSourceNode = audioContext.createMediaElementSource(audioPlayer);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        audioSourceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        if (!isAnalyzing) {
            isAnalyzing = true;
            visualize();
        }
    } catch (e) {
    }
}

function visualize() {
    if (!analyser) return;
    requestAnimationFrame(visualize);
    analyser.getByteFrequencyData(dataArray);
    const bars = document.querySelectorAll('.visualizer .bar');
    bars.forEach((bar, i) => {
        const value = dataArray[i % dataArray.length] / 255;
        const height = 10 + (value * 50);
        bar.style.height = `${height}px`;
        bar.style.opacity = 0.7 + (value * 0.3);
    });
}

function animateCdRotation() {
    cdRotationAngle = (cdRotationAngle + 1) % 360;
    const cd = document.querySelector('.cdrom');
    if (cd) cd.style.transform = `translateX(-50%) rotate(${cdRotationAngle}deg)`;
}

function startCdRotation() {
    const cd = document.querySelector('.cdrom');
    if (!cd) return;
    if (!cdRotationInterval) {
        cdRotationInterval = setInterval(animateCdRotation, 20);
        cd.classList.add('girar');
    }
}

function stopCdRotation() {
    if (cdRotationInterval) {
        clearInterval(cdRotationInterval);
        cdRotationInterval = null;
    }
    const cd = document.querySelector('.cdrom');
    if (cd) cd.classList.remove('girar');
}

function playMusic(audioSrc, title, artist, contextSongs = null, contextIndex = 0) {
    document.querySelectorAll('.result').forEach(el => el.classList.remove('playing'));

    const cards = document.querySelectorAll('.result');
    cards.forEach(card => {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3 && p && h3.textContent === title && p.textContent === artist) {
            card.classList.add('playing');
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = 'pulseHighlight 0.8s ease';
        }
    });

    currentAudioSrc = audioSrc;

    currentPlayingTitle = title;
    currentPlayingArtist = artist;

    atualizarPlaylist();

    if (contextSongs && contextSongs.length > 0) {
        currentPlaylistContext = contextSongs;
        currentPlaylistIndex = contextIndex;
        currentPlayMode = 'playlist';
    } else {
        currentPlayMode = 'normal';
        currentPlaylistContext = [];
    }

    if (audioPlayer.src !== audioSrc) {
        audioPlayer.src = audioSrc;
        currentTimeDisplay.textContent = '0:00';
        progressBar.style.width = '0%';

        audioPlayer.addEventListener('loadedmetadata', function () {
            durationDisplay.textContent = formatTime(audioPlayer.duration);
        }, { once: true });
    }

    startCdRotation();

    audioPlayer.play().then(() => {
        updatePlayPauseState(true);
        document.getElementById('restartSong').style.display = 'flex';
        document.getElementById('pauseSong').style.display = 'flex';
        document.getElementById('prevSong').style.display = 'flex';
        document.getElementById('nextSong').style.display = 'flex';
        showVolumeControls();

        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');

        const nowPlaying = document.getElementById('nowPlaying');
        if (nowPlaying) {
            nowPlaying.textContent = `${title} - ${artist}`;
        }

        sincronizarEstrelasNaTela();
        atualizarPlayerFavoriteIcon();
    }).catch(() => {
        updatePlayPauseState(false);
    });
}

function showVolumeControls() {
    const volumeControls = document.querySelector('.volume-controls');
    if (volumeControls) volumeControls.classList.add('visible');
}

function hideVolumeControls() {
    const volumeControls = document.querySelector('.volume-controls');
    if (volumeControls) volumeControls.classList.remove('visible');
}

function isMusicaFavorita(title, artist) {
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    return favoriteMusics.some(music => music.title === title && music.artist === artist);
}

function addMusicaFavorita(title, artist) {
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    if (!favoriteMusics.some(music => music.title === title && music.artist === artist)) {
        favoriteMusics.push({ title, artist });
        localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
    }
}

function removeMusicaFavorita(title, artist) {
    let favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    favoriteMusics = favoriteMusics.filter(music => !(music.title === title && music.artist === artist));
    localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
    atualizarPlaylist();
}

function removeFromPlaylist(event, title, artist) {
    if (event) event.stopPropagation();
    playSound('star-off-sound');

    if (currentPlayingTitle === title && currentPlayingArtist === artist) {
        currentPlayingTitle = '';
        currentPlayingArtist = '';
    }

    removeMusicaFavorita(title, artist);
    sincronizarEstrelasNaTela();
    atualizarPlayerFavoriteIcon();
}

function toggleCurrentFavorite() {
    const nowPlaying = document.getElementById('nowPlaying');
    if (!nowPlaying) return;

    const text = nowPlaying.textContent;
    if (!text || text === 'Selecione uma música') return;

    const separatorIndex = text.indexOf(' - ');
    if (separatorIndex === -1) return;

    const title = text.substring(0, separatorIndex).trim();
    const artist = text.substring(separatorIndex + 3).trim();

    const isFav = isMusicaFavorita(title, artist);
    const icon = document.getElementById('playerFavoriteIcon');

    if (isFav) {
        removeMusicaFavorita(title, artist);
        playSound('star-off-sound');
        if (icon) {
            icon.classList.replace('fas', 'far');
        }
    } else {
        addMusicaFavorita(title, artist);
        playSound('star-on-sound');
        if (icon) {
            icon.classList.replace('far', 'fas');
            icon.style.transform = 'rotate(360deg) scale(1.5)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0) scale(1)';
            }, 300);
        }
    }

    sincronizarEstrelasNaTela();
    atualizarPlayerFavoriteIcon();
    atualizarPlaylist();
}

function atualizarPlayerFavoriteIcon() {
    const nowPlaying = document.getElementById('nowPlaying');
    const icon = document.getElementById('playerFavoriteIcon');
    if (!nowPlaying || !icon) return;

    const text = nowPlaying.textContent;
    if (!text || text === 'Selecione uma música') {
        icon.className = 'far fa-star';
        return;
    }

    const separatorIndex = text.indexOf(' - ');
    if (separatorIndex === -1) {
        icon.className = 'far fa-star';
        return;
    }

    const title = text.substring(0, separatorIndex).trim();
    const artist = text.substring(separatorIndex + 3).trim();

    if (isMusicaFavorita(title, artist)) {
        icon.className = 'fas fa-star';
    } else {
        icon.className = 'far fa-star';
    }
}

function sincronizarEstrelasNaTela() {
    const cards = document.querySelectorAll('.result, .single-card');

    cards.forEach(card => {
        const star = card.querySelector('.favorite-star');
        if (!star) return;

        const titleEl = card.querySelector('h3, h4');
        const artistEl = card.querySelector('p');
        if (!titleEl || !artistEl) return;

        const title = titleEl.textContent.trim();
        const artist = artistEl.textContent.trim();

        const icon = star.querySelector('i');
        if (!icon) return;

        if (isMusicaFavorita(title, artist)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'gold';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#ccc';
        }
    });
}

function favoritarMusica(starElement, event, title = null, artist = null) {
    if (event) event.stopPropagation();

    if (!title || !artist) {
        const resultDiv = starElement.closest('.result, .single-card');
        if (resultDiv) {
            title = resultDiv.querySelector('h3, h4').textContent;
            artist = resultDiv.querySelector('p').textContent;
        }
    }

    const starIcon = starElement.querySelector('i');
    playSound('click-sound');

    if (starIcon.classList.contains('fas')) {
        removeMusicaFavorita(title, artist);
        starIcon.classList.replace('fas', 'far');
        starIcon.style.color = '#ccc';
        playSound('star-off-sound');
    } else {
        addMusicaFavorita(title, artist);
        starIcon.classList.replace('far', 'fas');
        starIcon.style.color = 'gold';
        playSound('star-on-sound');
        starIcon.style.transform = 'rotate(360deg) scale(1.5)';
        setTimeout(() => {
            starIcon.style.transform = 'rotate(0) scale(1)';
        }, 300);
    }

    sincronizarEstrelasNaTela();
    atualizarPlayerFavoriteIcon();
    atualizarPlaylist();
}

function atualizarPlaylist() {
    const playlistContainer = document.getElementById('playlist');
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];

    playlistContainer.innerHTML = '';

    if (favoriteMusics.length === 0) {
        playlistContainer.innerHTML = `
            <li style="text-align:center;cursor:default;padding:20px;color:#666;font-style:italic;background:transparent;box-shadow:none;">
                Sua playlist está vazia
            </li>
        `;
        playlistContainer.classList.remove('has-scroll');
        return;
    }

    favoriteMusics.forEach((music, index) => {
        const listItem = document.createElement('li');

        const isCurrentSong = currentPlayingTitle === music.title &&
                              currentPlayingArtist === music.artist;

        listItem.innerHTML = `
            <span class="playlist-track">${index + 1}. ${music.title} - ${music.artist}</span>
            <div class="playlist-controls">
                ${isCurrentSong ? '<div class="now-playing-indicator"><i class="fas fa-volume-up"></i></div>' : ''}
                <button class="delete-button" onclick="removeFromPlaylist(event, '${escapeSingleQuote(music.title)}', '${escapeSingleQuote(music.artist)}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        if (isCurrentSong) listItem.classList.add('current-playing');

        listItem.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-button') && !e.target.closest('.now-playing-indicator')) {
                playFromPlaylist(music.title, music.artist);
            }
        });

        playlistContainer.appendChild(listItem);
    });

    if (favoriteMusics.length >= 9) {
        playlistContainer.classList.add('has-scroll');
    } else {
        playlistContainer.classList.remove('has-scroll');
    }
}

function playFromPlaylist(title, artist) {
    playSound('click-sound');

    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    const foundSong = findSongInDatabase(title, artist);

    if (!foundSong) return;

    const songIndex = favoriteMusics.findIndex(m => m.title === title && m.artist === artist);
    const playlistSongs = playlistSongsFromFavorites(favoriteMusics);

    playMusic(foundSong.audioSrc, foundSong.title, foundSong.artist, playlistSongs, songIndex);
    atualizarPlaylist();
}

function playRandomFromPlaylist() {
    stopAllRandom();

    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    if (favoriteMusics.length === 0) return;

    const randomIndex = Math.floor(Math.random() * favoriteMusics.length);
    const randomMusic = favoriteMusics[randomIndex];
    const foundSong = findSongInDatabase(randomMusic.title, randomMusic.artist);

    if (foundSong) {
        playMusic(foundSong.audioSrc, foundSong.title, foundSong.artist);
    }
}

function getAllSongsFromDatabase() {
    const allSongs = [];
    for (const artist in musicDatabase) {
        if (typeof musicDatabase[artist] !== 'object' || Array.isArray(musicDatabase[artist])) continue;
        for (const album in musicDatabase[artist]) {
            const albumData = musicDatabase[artist][album];
            if (!albumData || !albumData.songs) continue;
            albumData.songs.forEach(song => {
                allSongs.push({
                    title: song.title,
                    artist: song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist,
                    audioSrc: song.audioSrc,
                    isSingle: album === '_singles',
                    cover: song.cover || albumData.cover || ''
                });
            });
        }
    }
    return allSongs;
}

function getSongsByArtist(artist) {
    const songs = [];
    const data = musicDatabase[artist];
    if (!data) return songs;

    for (const album in data) {
        if (!data[album] || !data[album].songs) continue;
        data[album].songs.forEach(song => {
            songs.push({
                title: song.title,
                artist: song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist,
                audioSrc: song.audioSrc,
                uniqueKey: `${song.title}|${artist}`
            });
        });
    }
    return songs;
}

function getSongsByAlbum(artist, albumName) {
    const data = musicDatabase[artist] && musicDatabase[artist][albumName];
    if (!data || !data.songs) return [];
    return data.songs.map(song => ({
        title: song.title,
        artist: song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist,
        audioSrc: song.audioSrc,
        uniqueKey: `${song.title}|${albumName}`
    }));
}

function playRandomFromArtist(artist) {
    stopAllRandom();

    const songs = getSongsByArtist(artist);
    if (songs.length === 0) return;

    artistPlayHistory = [];
    currentArtistRandomActive = true;
    currentArtistName = artist;

    let availableSongs = songs.filter(song => !artistPlayHistory.includes(song.uniqueKey));
    if (availableSongs.length === 0) {
        artistPlayHistory = [];
        availableSongs = songs;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    artistPlayHistory.push(selectedSong.uniqueKey);

    playMusic(selectedSong.audioSrc, selectedSong.title, selectedSong.artist);

    audioPlayer.removeEventListener('ended', playNextArtistRandom);
    audioPlayer.addEventListener('ended', playNextArtistRandom);
}

function playNextArtistRandom() {
    if (!currentArtistRandomActive) return;

    const songs = getSongsByArtist(currentArtistName);
    if (songs.length === 0) return;

    let availableSongs = songs.filter(song => !artistPlayHistory.includes(song.uniqueKey));
    if (availableSongs.length === 0) {
        artistPlayHistory = [];
        availableSongs = songs;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    artistPlayHistory.push(selectedSong.uniqueKey);

    playMusic(selectedSong.audioSrc, selectedSong.title, selectedSong.artist);
}

function playRandomFromAlbum(artist, albumName) {
    stopAllRandom();

    const songs = getSongsByAlbum(artist, albumName);
    if (songs.length === 0) return;

    albumPlayHistory = [];
    currentAlbumRandomActive = true;
    currentAlbumName = albumName;
    currentAlbumArtist = artist;

    let availableSongs = songs.filter(song => !albumPlayHistory.includes(song.uniqueKey));
    if (availableSongs.length === 0) {
        albumPlayHistory = [];
        availableSongs = songs;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    albumPlayHistory.push(selectedSong.uniqueKey);

    playMusic(selectedSong.audioSrc, selectedSong.title, selectedSong.artist);

    audioPlayer.removeEventListener('ended', playNextAlbumRandom);
    audioPlayer.addEventListener('ended', playNextAlbumRandom);
}

function playNextAlbumRandom() {
    if (!currentAlbumRandomActive) return;

    const songs = getSongsByAlbum(currentAlbumArtist, currentAlbumName);
    if (songs.length === 0) return;

    let availableSongs = songs.filter(song => !albumPlayHistory.includes(song.uniqueKey));
    if (availableSongs.length === 0) {
        albumPlayHistory = [];
        availableSongs = songs;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];
    albumPlayHistory.push(selectedSong.uniqueKey);

    playMusic(selectedSong.audioSrc, selectedSong.title, selectedSong.artist);
}

function stopAllRandom() {
    globalRandomActive = false;
    currentArtistRandomActive = false;
    currentAlbumRandomActive = false;
    audioPlayer.removeEventListener('ended', playNextGlobalRandom);
    audioPlayer.removeEventListener('ended', playNextArtistRandom);
    audioPlayer.removeEventListener('ended', playNextAlbumRandom);
}

function toggleRandomMode() {
    globalRandomActive = !globalRandomActive;
    const btn = document.getElementById('randomModeBtn');

    if (globalRandomActive) {
        btn.classList.add('active');
        startGlobalRandom();
    } else {
        btn.classList.remove('active');
        stopAllRandom();
    }
}

function startGlobalRandom() {
    stopAllRandom();
    globalRandomActive = true;
    playNextGlobalRandom();
    audioPlayer.addEventListener('ended', playNextGlobalRandom);
}

function playNextGlobalRandom() {
    if (!globalRandomActive) return;

    let availableSongs = [];

    if (globalRandomFilter === 'all') {
        availableSongs = getAllSongsFromDatabase();
    } else if (musicDatabase[globalRandomFilter]) {
        availableSongs = getSongsByArtist(globalRandomFilter);
    }

    if (availableSongs.length > 0) {
        const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
        playMusic(randomSong.audioSrc, randomSong.title, randomSong.artist);
    }
}

function setRandomFilter(filter) {
    globalRandomFilter = filter;
    const filterBtns = document.querySelectorAll('.random-filter-btn');
    const select = document.getElementById('artistFilterSelect');

    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (filter === 'all' && select) select.value = 'all';
}

function populateArtistFilter() {
    const select = document.getElementById('artistFilterSelect');
    if (!select) return;
    select.innerHTML = '<option value="all">Todos os artistas</option>';
    const artists = Object.keys(musicDatabase);
    artists.sort().forEach(artist => {
        const option = document.createElement('option');
        option.value = artist;
        option.textContent = artist;
        select.appendChild(option);
    });
}

function nextMusic() {
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
    if (currentPlayMode === 'playlist' && currentPlaylistContext.length > 0) {
        let nextIndex = currentPlaylistIndex + 1;
        if (nextIndex >= currentPlaylistContext.length) nextIndex = 0;
        const nextSong = currentPlaylistContext[nextIndex];
        playMusic(nextSong.audioSrc, nextSong.title, nextSong.artist, currentPlaylistContext, nextIndex);
        return;
    }

    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    if (favoriteMusics.length === 0) return;

    let currentIndex = -1;
    const nowPlaying = document.getElementById('nowPlaying')?.textContent;

    if (nowPlaying) {
        for (let i = 0; i < favoriteMusics.length; i++) {
            const music = favoriteMusics[i];
            if (nowPlaying.includes(music.title) && nowPlaying.includes(music.artist)) {
                currentIndex = i;
                break;
            }
        }
    }

    const nextIndex = (currentIndex + 1) % favoriteMusics.length;
    const nextMusicItem = favoriteMusics[nextIndex];
    const foundSong = findSongInDatabase(nextMusicItem.title, nextMusicItem.artist);

    if (foundSong) {
        const playlistSongs = playlistSongsFromFavorites(favoriteMusics);
        playMusic(foundSong.audioSrc, foundSong.title, foundSong.artist, playlistSongs, nextIndex);
    }
}

function prevMusic() {
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
    if (currentPlayMode === 'playlist' && currentPlaylistContext.length > 0) {
        let prevIndex = currentPlaylistIndex - 1;
        if (prevIndex < 0) prevIndex = currentPlaylistContext.length - 1;
        const prevSong = currentPlaylistContext[prevIndex];
        playMusic(prevSong.audioSrc, prevSong.title, prevSong.artist, currentPlaylistContext, prevIndex);
        return;
    }

    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    if (favoriteMusics.length === 0) return;

    let currentIndex = -1;
    const nowPlaying = document.getElementById('nowPlaying')?.textContent;

    if (nowPlaying) {
        for (let i = 0; i < favoriteMusics.length; i++) {
            const music = favoriteMusics[i];
            if (nowPlaying.includes(music.title) && nowPlaying.includes(music.artist)) {
                currentIndex = i;
                break;
            }
        }
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = favoriteMusics.length - 1;
    const prevMusicItem = favoriteMusics[prevIndex];
    const foundSong = findSongInDatabase(prevMusicItem.title, prevMusicItem.artist);

    if (foundSong) {
        const playlistSongs = playlistSongsFromFavorites(favoriteMusics);
        playMusic(foundSong.audioSrc, foundSong.title, foundSong.artist, playlistSongs, prevIndex);
    }
}

function artistIsInFeat(artistName, song) {
    return song.featuredArtist &&
        (song.featuredArtist.toLowerCase().includes(artistName.toLowerCase()) ||
         artistName.toLowerCase().includes(song.featuredArtist.toLowerCase()));
}

function checkArtistFeatures(artist) {
    for (const otherArtist in musicDatabase) {
        if (otherArtist === artist) continue;
        for (const albumName in musicDatabase[otherArtist]) {
            const album = musicDatabase[otherArtist][albumName];
            if (!album || !album.songs) continue;
            if (album.songs.some(song => artistIsInFeat(artist, song))) return true;
        }
    }
    return false;
}

function getArtistFeatures(artist) {
    const featuredSongs = [];
    for (const otherArtist in musicDatabase) {
        if (otherArtist === artist) continue;
        for (const albumName in musicDatabase[otherArtist]) {
            const album = musicDatabase[otherArtist][albumName];
            if (!album || !album.songs) continue;
            album.songs.forEach(song => {
                if (artistIsInFeat(artist, song)) {
                    featuredSongs.push({
                        title: song.title,
                        artist: `${otherArtist} ft. ${song.featuredArtist}`,
                        audioSrc: song.audioSrc,
                        cover: song.cover || album.cover
                    });
                }
            });
        }
    }
    return featuredSongs;
}

function createSingleCard(song, mainArtist = null) {
    const songDiv = document.createElement('div');
    songDiv.classList.add('single-card');

    const artistName = mainArtist
        ? `${mainArtist}${song.featuredArtist ? ' ft. ' + song.featuredArtist : ''}`
        : song.artist;

    const isFavorited = isMusicaFavorita(song.title, artistName);
    const coverSrc = song.cover || 'default-single.jpg';

    songDiv.innerHTML = `
        <div class="single-cover-container">
            ${getHTMLImageWrapper(coverSrc, song.title, 'single-cover', 'default-single.jpg')}
            <div class="single-overlay">
                <i class="fas fa-music"></i>
            </div>
        </div>
        <div class="single-info-container">
            <div class="single-info">
                <h4>${song.title}</h4>
                <p>${artistName}</p>
            </div>
            <button class="favorite-star" onclick="event.stopPropagation(); favoritarMusica(this, event, '${escapeSingleQuote(song.title)}', '${escapeSingleQuote(artistName)}')">
                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
            </button>
        </div>
    `;

    ensureImageLoadersInContainer(songDiv);

    songDiv.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-star')) return;

        const singleSongs = [];
        if (mainArtist) {
            const artistData = musicDatabase[mainArtist];
            if (artistData && artistData._singles && artistData._singles.songs) {
                artistData._singles.songs.forEach(s => {
                    singleSongs.push({
                        title: s.title,
                        artist: s.featuredArtist ? `${mainArtist} ft. ${s.featuredArtist}` : mainArtist,
                        audioSrc: s.audioSrc
                    });
                });
            }
        } else {
            singleSongs.push({
                title: song.title,
                artist: artistName,
                audioSrc: song.audioSrc
            });
        }

        const songIndex = singleSongs.findIndex(s => s.title === song.title);
        playMusic(song.audioSrc, song.title, artistName, singleSongs, songIndex);
    });

    return songDiv;
}

function showAlbums(artist) {
    const resultsContainer = document.getElementById('results');

    let backButtonHtml = '';
    if (cameFromSearch && lastSearchQuery) {
        backButtonHtml = `
            <div class="discografia-header">
                <div class="search-back-button" onclick="goBackToSearch()">
                    <i class="fas fa-arrow-left"></i> Voltar
                </div>
                <h3 class="section-title">Discografia de ${artist}</h3>
            </div>
        `;
    } else {
        backButtonHtml = `<h3 class="section-title">Discografia de ${artist}</h3>`;
    }

    resultsContainer.innerHTML = `
        <div class="artist-section">
            ${backButtonHtml}
            <button class="random-mode-btn artist-random-btn" onclick="playRandomFromArtist('${escapeSingleQuote(artist)}')">
                <i class="fas fa-random"></i> Tocar aleatório - ${artist}
            </button>
            <h4 class="section-subtitle">Álbuns & EP's</h4>
            <div class="discography-container" id="discographyContainer">
                <div class="album-grid" id="albumGrid"></div>
                <div class="singles-section" id="singlesSection">
                    <h4 class="section-subtitle">Singles</h4>
                    <div class="singles-grid" id="singlesGrid"></div>
                </div>
            </div>
            <div class="features-section" id="featuresSection">
                <h4 class="section-subtitle">Participações</h4>
                <div class="features-grid" id="featuresGrid"></div>
            </div>
        </div>
    `;

    const artistData = musicDatabase[artist];
    if (!artistData) {
        resultsContainer.innerHTML = '<p>Artista não encontrado</p>';
        return;
    }

    const discographyContainer = document.getElementById('discographyContainer');
    const albumGrid = document.getElementById('albumGrid');
    const singlesSection = document.getElementById('singlesSection');
    const singlesGrid = document.getElementById('singlesGrid');
    const featuresSection = document.getElementById('featuresSection');
    const featuresGrid = document.getElementById('featuresGrid');

    const albumNames = [];
    for (const albumName in artistData) {
        if (!albumName.startsWith('_')) albumNames.push(albumName);
    }

    const hasSingles = artistData._singles &&
                       artistData._singles.songs &&
                       artistData._singles.songs.length > 0;
    const hasFeatures = checkArtistFeatures(artist);

    if (hasSingles) {
        discographyContainer.classList.add('with-singles-layout');
        albumGrid.classList.add('with-singles');
        albumGrid.classList.remove('no-singles');
        singlesSection.style.display = 'block';

        artistData._singles.songs.forEach(song => {
            const songDiv = createSingleCard(song, artist);
            songDiv.addEventListener('click', (e) => {
                if (e.target.closest('.favorite-star')) return;
                const singlesPlaylist = artistData._singles.songs.map(s => ({
                    title: s.title,
                    artist: s.featuredArtist ? `${artist} ft. ${s.featuredArtist}` : artist,
                    audioSrc: s.audioSrc
                }));
                const songIndex = singlesPlaylist.findIndex(s => s.title === song.title);
                const artistName = song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist;
                playMusic(song.audioSrc, song.title, artistName, singlesPlaylist, songIndex);
            });
            singlesGrid.appendChild(songDiv);
        });
    } else {
        discographyContainer.classList.remove('with-singles-layout');
        albumGrid.classList.add('no-singles');
        albumGrid.classList.remove('with-singles');
        singlesSection.style.display = 'none';
    }

    albumNames.forEach(albumName => {
        const album = artistData[albumName];
        const albumDiv = document.createElement('div');
        albumDiv.classList.add('album-card');

        albumDiv.innerHTML = `
            <div class="album-cover-container">
                ${getHTMLImageWrapper(album.cover, albumName, 'album-cover', 'default-album.jpg')}
                <div class="album-overlay">
                    <span class="song-count">${album.songs.length} ${album.songs.length === 1 ? 'música' : 'músicas'}</span>
                </div>
            </div>
            <div class="album-info">
                <h3>${albumName}</h3>
                <p>${artist}</p>
            </div>
        `;

        ensureImageLoadersInContainer(albumDiv);

        albumDiv.addEventListener('click', () => {
            playSound('click-sound');
            showSongs(artist, albumName);
        });

        albumGrid.appendChild(albumDiv);
    });

    if (hasFeatures) {
        featuresSection.style.display = 'block';
        const featuredSongs = getArtistFeatures(artist);

        featuredSongs.forEach(song => {
            const songDiv = createSingleCard(song);
            songDiv.addEventListener('click', (e) => {
                if (e.target.closest('.favorite-star')) return;
                const featuresPlaylist = featuredSongs.map(s => ({
                    title: s.title,
                    artist: s.artist,
                    audioSrc: s.audioSrc
                }));
                const songIndex = featuresPlaylist.findIndex(s => s.title === song.title);
                playMusic(song.audioSrc, song.title, song.artist, featuresPlaylist, songIndex);
            });
            featuresGrid.appendChild(songDiv);
        });
    } else {
        featuresSection.style.display = 'none';
    }
}

function showSongs(artist, albumName) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.className = 'album-detail-grid';
    resultsContainer.appendChild(mainContainer);

    const headerContainer = document.createElement('div');
    headerContainer.className = 'album-header-container';

    const albumData = musicDatabase[artist][albumName];

    headerContainer.innerHTML = `
        <div class="album-header">
            <div class="album-header-background" style="background-image: url('${albumData.cover}')"></div>
            <div class="album-header-overlay"></div>
            <div class="album-header-content">
                <img class="album-cover-large" src="${albumData.cover}" alt="${albumName}" onerror="this.src='default-album.jpg'">
                <div class="album-header-info">
                    <span class="album-type">ÁLBUM</span>
                    <h1 class="album-title">${albumName}</h1>
                    <div class="album-meta">
                        <span class="album-artist">${artist}</span>
                        <span class="album-tracks">• ${albumData.songs.length} ${albumData.songs.length === 1 ? 'música' : 'músicas'}</span>
                    </div>
                    <button class="album-random-btn" onclick="playRandomFromAlbum('${escapeSingleQuote(artist)}', '${escapeSingleQuote(albumName)}')">
                        <i class="fas fa-random"></i> Aleatório deste álbum
                    </button>
                </div>
            </div>
            <button class="album-back-button" onclick="showAlbums('${escapeSingleQuote(artist)}')">
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>
    `;
    mainContainer.appendChild(headerContainer);

    const songsContainer = document.createElement('div');
    songsContainer.className = 'songs-grid-container';

    albumData.songs.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'result';

        const artistName = song.featuredArtist ? `${artist} ft. ${song.featuredArtist}` : artist;
        const isFavorited = isMusicaFavorita(song.title, artistName);

        songDiv.innerHTML = `
            <button class="favorite-star" onclick="favoritarMusica(this, event)">
                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
            </button>
            <div class="result-content">
                <h3>${song.title}</h3>
                <p>${artistName}</p>
            </div>
        `;

        songDiv.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-star')) return;
            const albumSongs = albumData.songs.map(s => ({
                title: s.title,
                artist: s.featuredArtist ? `${artist} ft. ${s.featuredArtist}` : artist,
                audioSrc: s.audioSrc
            }));
            const songIndex = albumSongs.findIndex(s => s.title === song.title);
            playMusic(song.audioSrc, song.title, artistName, albumSongs, songIndex);
        });

        songsContainer.appendChild(songDiv);
    });

    mainContainer.appendChild(songsContainer);
}

function goBackToSearch() {
    cameFromSearch = true;
    if (lastSearchQuery) {
        document.getElementById('searchInput').value = lastSearchQuery;
        search();
    } else {
        cameFromSearch = false;
        document.getElementById('results').innerHTML = '';
    }
}

async function buildResultsFragment(results) {
    const fragment = document.createDocumentFragment();

    const singles = results.filter(song => song.isSingle);
    const albumSongs = results.filter(song => !song.isSingle);

    albumSongs.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        const isFavorited = isMusicaFavorita(result.title, result.artist);

        resultDiv.innerHTML = `
            <button class="favorite-star" onclick="favoritarMusica(this, event)">
                <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
            </button>
            <div class="result-content">
                <h3>${result.title}</h3>
                <p>${result.artist}</p>
            </div>
        `;

        resultDiv.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-star')) return;
            const playlist = albumSongs.map(s => ({
                title: s.title,
                artist: s.artist,
                audioSrc: s.audioSrc
            }));
            const songIndex = playlist.findIndex(s => s.title === result.title);
            playMusic(result.audioSrc, result.title, result.artist, playlist, songIndex);
        });

        fragment.appendChild(resultDiv);
    });

    if (singles.length > 0) {
        const singlesSection = document.createElement('div');
        singlesSection.classList.add('artist-section');
        singlesSection.innerHTML = `
            <h3 class="section-title">Singles</h3>
            <div class="singles-grid"></div>
        `;

        const singlesGrid = singlesSection.querySelector('.singles-grid');

        singles.forEach(single => {
            const singleDiv = document.createElement('div');
            singleDiv.classList.add('single-card');
            const isFavorited = isMusicaFavorita(single.title, single.artist);
            const coverSrc = single.cover || 'default-cover.jpg';

            singleDiv.innerHTML = `
                <div class="single-cover-container">
                    ${getHTMLImageWrapper(coverSrc, single.title, 'single-cover', 'default-cover.jpg')}
                    <div class="single-overlay">
                        <i class="fas fa-music"></i>
                    </div>
                </div>
                <div class="single-info-container">
                    <div class="single-info">
                        <h4>${single.title}</h4>
                        <p>${single.artist}</p>
                    </div>
                    <button class="favorite-star" onclick="event.stopPropagation(); favoritarMusica(this, event, '${escapeSingleQuote(single.title)}', '${escapeSingleQuote(single.artist)}')">
                        <i class="${isFavorited ? 'fas' : 'far'} fa-star"></i>
                    </button>
                </div>
            `;

            singleDiv.addEventListener('click', () => {
                playMusic(single.audioSrc, single.title, single.artist);
            });

            singlesGrid.appendChild(singleDiv);
        });

        fragment.appendChild(singlesSection);
    }

    await waitForImages(fragment);
    return fragment;
}

async function search() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('results');
    const searchButton = document.querySelector('button.pesquisa');

    if (searchInput === '') {
        resultsContainer.innerHTML = '';
        return;
    }

    if (searchButton) {
        searchButton.classList.add('loading');
        searchButton.innerHTML = '<span class="spinner"></span> Pesquisando...';
    }

    resultsContainer.innerHTML = '';
    resultsContainer.style.pointerEvents = 'none';

    const startTime = Date.now();
    const MIN_LOADING_TIME = 500;

    lastSearchQuery = searchInput;
    cameFromSearch = true;

    const searchLower = normalizeText(searchInput);
    const artistasEncontrados = Object.keys(musicDatabase).filter(artist =>
        normalizeText(artist).includes(searchLower)
    );

    let finalContent = null;

    try {
        if (artistasEncontrados.length > 0) {
            const searchResults = artistasEncontrados.map((artist, index) => ({
                name: artist,
                similarity: index === 0 ? 1 : 0.5,
                exactMatch: index === 0
            }));
            finalContent = await buildArtistResultsFragment(searchResults);
        } else {
            const allSongs = getAllSongsFromDatabase();
            const songResults = allSongs.filter(song =>
                normalizeText(song.artist).includes(searchLower)
            );

            if (songResults.length > 0) {
                finalContent = await buildResultsFragment(songResults);
            } else {
                const p = document.createElement('p');
                p.style.textAlign = 'center';
                p.style.width = '100%';
                p.textContent = `Nenhum resultado encontrado para "${searchInput}"`;
                finalContent = p;
            }
        }
    } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

        setTimeout(() => {
            if (finalContent) {
                resultsContainer.innerHTML = '';
                resultsContainer.appendChild(finalContent);
                ensureImageLoadersInContainer(resultsContainer);
            }
            resultsContainer.style.pointerEvents = '';
            if (searchButton) {
                searchButton.classList.remove('loading');
                searchButton.innerHTML = '<i class="fas fa-search" style="font-size: 18px; margin-right: 8px;"></i> Pesquisar';
            }
        }, remaining);
    }
}

function searchArtist(artistName) {
    cameFromSearch = false;
    lastSearchQuery = '';

    const artist = Object.keys(musicDatabase).find(a => a.toLowerCase() === artistName.toLowerCase());

    fecharPainel();

    if (artist) {
        document.getElementById('searchInput').value = artist;
        showAlbums(artist);
    } else {
        document.getElementById('searchInput').value = artistName;
        search();
    }

    const clearBtn = document.getElementById('clearSearch');
    if (document.getElementById('searchInput').value.length > 0) {
        clearBtn.style.display = 'flex';
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    document.getElementById('results').innerHTML = '';
    cameFromSearch = false;
    lastSearchQuery = '';
}

function abrirPainel() {
    playSound('panel-open-sound');
    document.getElementById('painelInformacoes').classList.add('active');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('painelToggle').classList.add('hidden');
}

function fecharPainel() {
    const painel = document.getElementById('painelInformacoes');
    painel.classList.remove('active');
    void painel.offsetWidth;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('painelToggle').classList.remove('hidden');
}

function mostrarOcultarPlaylist() {
    const playlistContainer = document.getElementById('playlistContainer');
    const overlay = document.getElementById('playlistOverlay');
    const cd = document.querySelector('.cdrom');

    if (playlistContainer.classList.contains('active')) {
        playlistContainer.classList.remove('active');
        overlay.style.display = 'none';
        if (cd) cd.style.zIndex = '10';
    } else {
        playlistContainer.classList.add('active');
        overlay.style.display = 'block';
        if (cd) cd.style.zIndex = '-1';
        atualizarPlaylist();
    }
    playSound('click-sound');
}

function toggleMute() {
    const slider = document.getElementById('volumeSlider');
    const icon = document.getElementById('muteIcon');

    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0;
        slider.value = 0;
        icon.className = 'fas fa-volume-mute';
    } else {
        audioPlayer.volume = 0.7;
        slider.value = 0.7;
        icon.className = 'fas fa-volume-up';
    }
}

async function searchArtistImageLastFm(artistName) {
    if (!LASTFM_API_KEY) return null;
    try {
        const url = `${LASTFM_API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.artist && data.artist.image) {
            const imageSizes = ['mega', 'extralarge', 'large', 'medium', 'small'];
            for (const size of imageSizes) {
                const img = data.artist.image.find(i => i.size === size);
                if (img && img['#text'] && img['#text'].trim() !== '' && !img['#text'].includes('avatar')) {
                    return img['#text'];
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function getArtistImage(artistName) {
    if (artistImageCache[artistName]) return artistImageCache[artistName];

    const cached = localStorage.getItem(`artist_img_${artistName}`);
    if (cached && cached !== 'null' && cached !== 'undefined') {
        artistImageCache[artistName] = cached;
        return cached;
    }

    const imageUrl = await searchArtistImageLastFm(artistName);
    if (imageUrl) {
        localStorage.setItem(`artist_img_${artistName}`, imageUrl);
        artistImageCache[artistName] = imageUrl;
        return imageUrl;
    }

    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName.split(' ')[0])}&background=4a9f8f&color=fff&size=80&bold=true&length=1`;
    localStorage.setItem(`artist_img_${artistName}`, fallbackUrl);
    artistImageCache[artistName] = fallbackUrl;
    return fallbackUrl;
}

async function buildArtistResultsFragment(artists) {
    const fragment = document.createDocumentFragment();

    if (artists.length === 0) {
        const p = document.createElement('p');
        p.style.textAlign = 'center';
        p.style.width = '100%';
        p.textContent = 'Nenhum artista encontrado';
        fragment.appendChild(p);
        return fragment;
    }

    const mainArtist = artists[0];
    const artistImage = await getArtistImage(mainArtist.name);

    const mainArtistSection = document.createElement('div');
    mainArtistSection.className = 'artist-result-card main-result';
    mainArtistSection.innerHTML = `
        <div class="artist-result-header">
            <div class="artist-avatar">
                ${getHTMLImageWrapper(artistImage, mainArtist.name, 'artist-avatar-img', `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mainArtist.name)}&backgroundColor=4a9f8f`)}
            </div>
            <div class="artist-info">
                <h2>${mainArtist.name}</h2>
                <p>Artista</p>
            </div>
            <button class="view-profile-btn" onclick="showAlbums('${escapeSingleQuote(mainArtist.name)}')">
                Ver perfil <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    fragment.appendChild(mainArtistSection);

    if (artists.length > 1) {
        const similarSection = document.createElement('div');
        similarSection.className = 'similar-artists-section';
        similarSection.innerHTML = '<h3>Artistas similares</h3><div class="similar-artists-grid"></div>';

        const similarGrid = similarSection.querySelector('.similar-artists-grid');

        const imagePromises = [];
        for (let i = 1; i < Math.min(artists.length, 6); i++) {
            imagePromises.push(getArtistImage(artists[i].name));
        }
        const images = await Promise.all(imagePromises);

        for (let i = 1; i < Math.min(artists.length, 6); i++) {
            const artist = artists[i];
            const similarImage = images[i - 1];

            const artistCard = document.createElement('div');
            artistCard.className = 'similar-artist-card';
            artistCard.innerHTML = `
                <div class="similar-artist-avatar">
                    ${getHTMLImageWrapper(similarImage, artist.name, 'similar-artist-img', `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(artist.name)}&backgroundColor=4a9f8f`)}
                </div>
                <div class="similar-artist-info">
                    <h4>${artist.name}</h4>
                    <button class="small-profile-btn" onclick="showAlbums('${escapeSingleQuote(artist.name)}')">
                        Acessar
                    </button>
                </div>
            `;
            similarGrid.appendChild(artistCard);
        }

        fragment.appendChild(similarSection);
    }

    await waitForImages(fragment);
    return fragment;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

audioPlayer.addEventListener('timeupdate', function () {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
    currentTimeDisplay.textContent = formatTime(currentTime);
});

audioPlayer.addEventListener('loadedmetadata', function () {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('play', function () {
    isPlaying = true;
    document.getElementById('restartSong').style.display = 'flex';
    document.getElementById('pauseSong').style.display = 'flex';
    document.getElementById('prevSong').style.display = 'flex';
    document.getElementById('nextSong').style.display = 'flex';
    showVolumeControls();
    document.getElementById('pauseSong').innerHTML = '<i class="fas fa-pause"></i>';
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
    const player = document.querySelector('.music-player');
    if (player) player.classList.add('expanded');
});

audioPlayer.addEventListener('pause', function () {
    isPlaying = false;
    document.getElementById('pauseSong').innerHTML = '<i class="fas fa-play"></i>';
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    stopCdRotation();
    hideVolumeControls();
});

audioPlayer.addEventListener('ended', function () {
    isPlaying = false;
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';

    const playingItems = document.querySelectorAll('.playlist-container li.playing');
    playingItems.forEach(item => item.classList.remove('playing'));

    const player = document.querySelector('.music-player');
    if (player) player.classList.remove('expanded');

    if (currentPlayMode === 'playlist' && currentPlaylistContext.length > 0) {
        let nextIndex = currentPlaylistIndex + 1;
        if (nextIndex >= currentPlaylistContext.length) nextIndex = 0;
        const nextSong = currentPlaylistContext[nextIndex];
        playMusic(nextSong.audioSrc, nextSong.title, nextSong.artist, currentPlaylistContext, nextIndex);
    } else if (globalRandomActive) {
        playNextGlobalRandom();
    } else if (currentArtistRandomActive) {
        playNextArtistRandom();
    } else if (currentAlbumRandomActive) {
        playNextAlbumRandom();
    } else {
        document.getElementById('restartSong').style.display = 'none';
        document.getElementById('pauseSong').style.display = 'none';
        document.getElementById('prevSong').style.display = 'none';
        document.getElementById('nextSong').style.display = 'none';
        hideVolumeControls();

        const nowPlaying = document.getElementById('nowPlaying');
        if (nowPlaying) nowPlaying.textContent = 'Selecione uma música';

        currentPlayingTitle = '';
        currentPlayingArtist = '';

        atualizarPlaylist();
        atualizarPlayerFavoriteIcon();
    }
});

document.getElementById('nextSong').addEventListener('click', function () {
    playSound('click-sound');
    nextMusic();
});

document.getElementById('prevSong').addEventListener('click', function () {
    playSound('click-sound');
    prevMusic();
});

document.getElementById('pauseSong').addEventListener('click', function (e) {
    e.stopPropagation();
    playSound('click-sound');
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
});

restartSongBtn.addEventListener('click', () => {
    const icon = restartSongBtn.querySelector('i');
    icon.classList.remove('rotate-on-click');
    void icon.offsetWidth;
    icon.classList.add('rotate-on-click');
    audioPlayer.currentTime = 0;
});

document.getElementById('progressContainer').addEventListener('click', setProgress);

document.getElementById('playlistOverlay').addEventListener('click', mostrarOcultarPlaylist);

document.getElementById('volumeSlider').addEventListener('input', function (e) {
    const volume = parseFloat(e.target.value);
    audioPlayer.volume = volume;
    const icon = document.getElementById('muteIcon');
    if (volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
});

document.getElementById('artistFilterSelect').addEventListener('change', function () {
    const value = this.value;
    if (value === 'all') {
        const allBtn = document.querySelector('.random-filter-btn[data-filter="all"]');
        if (allBtn) allBtn.click();
    } else {
        setRandomFilter(value);
    }
});

document.getElementById('searchInput').addEventListener('input', function () {
    const clearBtn = document.getElementById('clearSearch');
    if (this.value.length > 0) {
        clearBtn.style.display = 'flex';
    } else {
        clearBtn.style.display = 'none';
    }
});

audioPlayer.volume = 0.7;
populateArtistFilter();
atualizarPlaylist();

const playerToggleBtn = document.getElementById('playerToggle');

if (playerToggleBtn) {
    playerToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click-sound');
        const player = document.querySelector('.music-player');
        if (!player) return;
        player.classList.toggle('collapsed');
    });
}

const playerFavoriteBtn = document.getElementById('playerFavoriteBtn');
if (playerFavoriteBtn) {
    playerFavoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click-sound');
        toggleCurrentFavorite();
    });
}