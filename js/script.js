 const audioPlayer = document.getElementById('audioPlayer');
        const playPauseIcon = document.getElementById('playPauseIcon');
        let isPlaying = false;
        let currentAudioSrc = '';

        // Lista de músicas (simulando um banco de dados)
        const allResults = [
            { title: 'Disrespectful', artist: 'Doja cat', audioSrc: 'musica/disrespectful - doja cat (slowed + reverb).mp3' },
            { title: 'Options', artist: 'Doja cat', audioSrc: 'musica/ytmp3free.cc_doja-cat-options-visualizer-ft-jid-youtubemp3free.org.mp3' },
            { title: 'Demons', artist: 'Doja cat', audioSrc: 'musica/utomp3.com - Doja Cat  Demons Official Video.mp3' },
            { title: 'Consideration', artist: 'Rihanna,SZA', audioSrc: 'musica/utomp3.com - Consideration.mp3' },
            { title: 'Loyalty', artist: 'Rihanna, Kendrick Lamar', audioSrc: 'musica/utomp3.com - Kendrick Lamar  LOYALTY ft Rihanna.mp3' },
            { title: 'Insane', artist: 'Summer Walker', audioSrc: 'musica/utomp3.com - Summer Walker  Insane Lyric Video.mp3' },
            { title: 'Escapism', artist: 'Raye', audioSrc: 'musica/utomp3.com - RAYE 070 Shake  Escapism Official Music Video.mp3' },
            { title: 'Flip A Switch', artist: 'Raye, Coi Leray', audioSrc: 'musica/utomp3.com - RAYE  Flip A Switch ft Coi Leray.mp3' },
            { title: 'Bodyguard', artist: 'Beyonce', audioSrc: 'musica/utomp3.com - Beyoncé  BODYGUARD Official Lyric Video.mp3' },
            { title: 'Escapism REMIX', artist: 'Raye', audioSrc: 'musica/utomp3.com - Escapism 4am Remix.mp3' },
            { title: '10%', artist: 'Kali Uchis', audioSrc: 'musica/utomp3.com - KAYTRANADA  10 Official Video ft Kali Uchis.mp3' },
            { title: 'Shes My Collar', artist: 'Kali Uchis, Gorillaz', audioSrc: 'musica/utomp3.com - Gorillaz  Shes My Collar HQ.mp3' },
            { title: 'Love Girl', artist: 'Andrea Valle', audioSrc: 'musica/utomp3.com - Andrea Vallé  Lovergirl.mp3' },
            { title: 'Downtown', artist: 'Anitta, J balvin', audioSrc: 'musica/utomp3.com - Anitta  J Balvin  Downtown Official Music Video.mp3' },
            { title: 'Maria Elegante', artist: 'Anitta', audioSrc: 'musica/utomp3.com - Anitta  Maria Elegante Feat Afro B Official Audio.mp3' },
            { title: 'Sushi for breakfast', artist: 'BAYLI', audioSrc: 'musica/utomp3.com - BAYLI  sushi for breakfast lyric visualizer.mp3' },
            { title: 'Haunted', artist: 'Beyonce', audioSrc: 'musica/utomp3.com - Beyoncé  Haunted Audio.mp3' },
            { title: 'Virgos groove', artist: 'Beyonce', audioSrc: 'musica/utomp3.com - Beyoncé  VIRGOS GROOVE Official Lyric Video.mp3' },
            { title: 'I didnt change my number', artist: 'Billie Elish', audioSrc: 'musica/utomp3.com - Billie Eilish  I Didnt Change My Number Official Lyric Video.mp3' },
            { title: 'Been like this', artist: 'Doja Cat', audioSrc: 'musica/utomp3.com - Doja Cat  Been Like This Visualizer.mp3' },
            { title: 'Candy', artist: 'Doja Cat', audioSrc: 'musica/utomp3.com - Doja Cat  Candy Audio.mp3' },
            { title: 'Feel like a fool', artist: 'Kali Uchis', audioSrc: 'musica/utomp3.com - Feel Like A Fool.mp3' },
            { title: 'Shut Up My Moms Calling', artist: 'Hotel Ugly', audioSrc: 'musica/utomp3.com - Hotel Ugly  Shut Up My Moms Calling.mp3' },
            { title: 'Nunca Mais', artist: 'IZA', audioSrc: 'musica/utomp3.com - IZA  Nunca Mais Visualizer.mp3' },
            { title: 'Bonzão', artist: 'IZA', audioSrc: 'musica/utomp3.com - IZA Tiwa Savage  Bomzão Visualizer.mp3' },
            { title: 'The Recipe', artist: 'Kendrick Lamar', audioSrc: 'musica/utomp3.com - Kendrick Lamar  The Recipe Lyric Video ft Dr Dre (1).mp3' },
            { title: 'All the stars', artist: 'Kendrick Lamar, SZA', audioSrc: 'musica/utomp3.com - Kendrick Lamar SZA  All The Stars.mp3' },
            { title: 'Wolves', artist: 'Lauren Jauregui', audioSrc: 'musica/utomp3.com - Lauren Jauregui  Wolves feat Ty Dolla ign  Russ Official Lyric Video.mp3' },
            { title: 'Pra ficar comigo', artist: 'Marina Sena', audioSrc: 'musica/utomp3.com - Marina Sena  Pra Ficar Comigo Visualizer.mp3' },
            { title: 'Que tal', artist: 'Marina Sena', audioSrc: 'musica/utomp3.com - Marina Sena  Que Tal feat Fleezus Visualizer.mp3' },
            { title: 'Hard out here', artist: 'Raye', audioSrc: 'musica/utomp3.com - RAYE  Hard Out Here.mp3' },
            { title: 'Borderline', artist: 'Tame Impala', audioSrc: 'musica/utomp3.com - Tame Impala  Borderline Official Audio.mp3' },
            { title: 'Popular', artist: 'The Weeknd, Madonna', audioSrc: 'musica/utomp3.com - The Weeknd Playboi Carti Madonna  Popular Official Audio.mp3' },
            { title: 'Truth or Dare', artist: 'Tyla', audioSrc: 'musica/utomp3.com - Tyla  Truth or Dare Official Lyric Video.mp3' },
            { title: 'WIYLL', artist: 'Andrea Valle', audioSrc: 'musica/utomp3.com - WIYLL.mp3' },
            { title: 'Karma', artist: 'Jojo Siwa', audioSrc: 'musica/utomp3.com - JoJo Siwa  Karma Official Video.mp3' }
        ];

         function playSound(soundId) {
            const sound = document.getElementById(soundId);
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Não foi possível tocar o som:", e));
        }

        // Atualização da barra de progresso
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
    // Atualiza o tempo atual
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

// Formata o tempo (segundos para MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Configura o tempo total quando a música pode ser tocada
function setTotalTime() {
    const duration = audioPlayer.duration;
    document.getElementById('duration').textContent = formatTime(duration);
}

// Pula para o ponto clicado na barra de progresso
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Adicione estes event listeners no seu código existente:
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('canplay', setTotalTime);
audioPlayer.addEventListener('ended', () => {
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
});

document.querySelector('.progress-container').addEventListener('click', setProgress);

        // Função para verificar se uma música está favoritada
        function isMusicaFavorita(title, artist) {
            const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
            return favoriteMusics.some(music => music.title === title && music.artist === artist);
        }

        // Função para adicionar música aos favoritos
        function addMusicaFavorita(title, artist) {
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    
    // Verifica se já não está na playlist
    if (!favoriteMusics.some(music => music.title === title && music.artist === artist)) {
        favoriteMusics.push({ title, artist });
        localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
    }
}

function removeFromPlaylist(event, title, artist) {
    event.stopPropagation();
    removeMusicaFavorita(title, artist);
    playSound('star-off-sound');
    atualizarPlaylist();
}

        // Função para remover música dos favoritos
        function removeMusicaFavorita(title, artist) {
            let favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
            favoriteMusics = favoriteMusics.filter(music => !(music.title === title && music.artist === artist));
            localStorage.setItem('favoriteMusics', JSON.stringify(favoriteMusics));
            atualizarPlaylist();
        }

        // Função para tocar música diretamente da playlist
function playFromPlaylist(title, artist) {
    playSound('click-sound');
    
    // Encontra a música na lista completa
    const music = allResults.find(result => 
        result.title === title && result.artist === artist
    );
    
    if (music) {
        playMusic(music.audioSrc, music.title, music.artist);
        atualizarPlaylist(); // Atualiza para destacar a música atual
    }
}

// Função para remover música da playlist
function removeFromPlaylist(event, title, artist) {
    event.stopPropagation(); // Impede que o clique no botão dispare o play
    playSound('star-off-sound');
    removeMusicaFavorita(title, artist);
}

// Atualize a função playMusic para destacar na playlist
function playMusic(audioSrc, title, artist) {
    currentAudioSrc = audioSrc;
    
    if (audioPlayer.src !== audioSrc) {
        audioPlayer.src = audioSrc;
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('progressBar').style.width = '0%';
    }
    
    audioPlayer.play();
    isPlaying = true;
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
    
    // Atualiza o player inferior
    const nowPlayingElement = document.querySelector('.now-playing');
    if (nowPlayingElement) {
        nowPlayingElement.textContent = `${title} - ${artist}`;
    } else {
        document.querySelector('.music-player').insertAdjacentHTML('afterbegin', 
            `<div class="now-playing">${title} - ${artist}</div>`);
    }
    
    // Atualiza a playlist para destacar a música atual
    atualizarPlaylist();
}

        // Função para favoritar/desfavoritar música
        function favoritarMusica(starElement, event) {
    event.stopPropagation(); // Impede que o clique ative o play da música
    
    const resultDiv = starElement.closest('.result');
    const title = resultDiv.querySelector('h3').textContent;
    const artist = resultDiv.querySelector('p').textContent;
    const starIcon = starElement.querySelector('i');
    
    playSound('click-sound');
    
    if (starIcon.classList.contains('fas')) { // Se já estiver favoritado
        removeMusicaFavorita(title, artist);
        starIcon.classList.replace('fas', 'far');
        starIcon.style.color = '#ccc'; // Volta para cinza
        playSound('star-off-sound');
    } else { // Se não estiver favoritado
        addMusicaFavorita(title, artist);
        starIcon.classList.replace('far', 'fas');
        starIcon.style.color = 'gold'; // Muda para dourado
        playSound('star-on-sound');
        
        // Efeito visual
        starIcon.style.transform = 'rotate(360deg) scale(1.5)';
        setTimeout(() => {
            starIcon.style.transform = 'rotate(0) scale(1)';
        }, 300);
    }
    
    // Atualiza a playlist imediatamente
    atualizarPlaylist();
}
        // Função para atualizar a playlist
        
function atualizarPlaylist() {
    const playlistContainer = document.getElementById('playlist');
    const favoriteMusics = JSON.parse(localStorage.getItem('favoriteMusics')) || [];
    
    playlistContainer.innerHTML = '';
    
    if (favoriteMusics.length === 0) {
        playlistContainer.innerHTML = '<li style="text-align:center;cursor:default">Sua playlist está vazia</li>';
        playlistContainer.classList.remove('has-scroll');
        return;
    }
    
    favoriteMusics.forEach((music, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${index + 1}. ${music.title} - ${music.artist}</span>
            <button class="delete-button" onclick="removeFromPlaylist(event, '${music.title.replace("'", "\\'")}', '${music.artist.replace("'", "\\'")}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        listItem.addEventListener('click', () => {
            playFromPlaylist(music.title, music.artist);
        });
        playlistContainer.appendChild(listItem);
    });

    // Ativa a rolagem apenas se tiver 9 ou mais músicas
    if (favoriteMusics.length >= 9) {
        playlistContainer.classList.add('has-scroll');
    } else {
        playlistContainer.classList.remove('has-scroll');
    }
}
        // Função para carregar músicas favoritas
        function loadFavoriteMusics() {
            atualizarPlaylist();
        }

        // Função para buscar músicas
       function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    
    // Limpa resultados anteriores
    resultsContainer.innerHTML = '';
    
    if (searchInput.trim() === '') {
        return; // Não faz nada se a pesquisa estiver vazia
    }
    
    const filteredResults = allResults.filter(result => {
        return result.title.toLowerCase().includes(searchInput) || 
               result.artist.toLowerCase().includes(searchInput);
    });
    
    if (filteredResults.length > 0) {
        filteredResults.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result');
            
            const isFavorited = isMusicaFavorita(result.title, result.artist);
            
           // Dentro da função search(), atualize o resultDiv.innerHTML para:
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
    // Só reproduz se não clicou na estrela
    if (!e.target.closest('.favorite-star')) {
        playMusic(result.audioSrc, result.title, result.artist);
    }
});
            
            resultsContainer.appendChild(resultDiv);
        });
    } else {
        resultsContainer.innerHTML = '<p style="text-align:center;width:100%">Nenhuma música encontrada</p>';
    }
    
    // Rolagem suave para os resultados
    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}
        // Função para tocar música
        function playMusic(audioSrc, title, artist) {
    currentAudioSrc = audioSrc;
    
    if (audioPlayer.src !== audioSrc) {
        audioPlayer.src = audioSrc;
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('progressBar').style.width = '0%';
    }
    
    audioPlayer.play();
    isPlaying = true;
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
    
    // Mostra a música atual no player
    document.querySelector('.music-player').insertAdjacentHTML('afterbegin', 
        `<div class="now-playing">${title} - ${artist}</div>`);
    
    // Remove o título anterior se existir
    const previousTitle = document.querySelector('.now-playing');
    if (previousTitle) previousTitle.remove();
}

        // Função para alternar play/pause
       function togglePlayPause() {
    playSound('click-sound');

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    } else {
        if (!currentAudioSrc) {
            const firstResult = document.querySelector('.result');
            if (firstResult) {
                firstResult.click();
            }
        } else {
            audioPlayer.play();
            isPlaying = true;
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        }
    }
}

        // Funções para o painel lateral
     function abrirPainel() {
    playSound('panel-open-sound');
    
    // Abre o catálogo diretamente sem pausar a música
    document.getElementById('painelInformacoes').classList.add('active');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('painelToggle').classList.add('hidden');
}

function fecharPainel() {
    const painel = document.getElementById('painelInformacoes');
    painel.classList.remove('active');
    void painel.offsetWidth; // Força repaint (opcional)
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('painelToggle').classList.remove('hidden');
}
    function mostrarOcultarPlaylist() {
    const playlistContainer = document.getElementById('playlistContainer');
    const overlay = document.getElementById('playlistOverlay');
    
    if (playlistContainer.classList.contains('active')) {
        playlistContainer.classList.remove('active');
        overlay.style.display = 'none';
    } else {
        playlistContainer.classList.add('active');
        overlay.style.display = 'block';
        atualizarPlaylist();
    }
    playSound('click-sound');
}

document.getElementById('playlistOverlay').addEventListener('click', mostrarOcultarPlaylist);

        function fecharMensagem() {
            document.getElementById('custom-alert').style.display = 'none';
        }

        // Evento para quando a música terminar
        audioPlayer.addEventListener('ended', function() {
    isPlaying = false;
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
    
    // Remove o destaque da playlist
    const playingItems = document.querySelectorAll('.playlist-container li.playing');
    playingItems.forEach(item => item.classList.remove('playing'));
});

// Configura o analisador de áudio