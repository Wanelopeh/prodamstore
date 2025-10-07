// YouTube Player específico para a seção "Sobre Nós"
// Este arquivo evita conflitos com o player da hero section

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona apenas o wrapper da seção sobre nós
    const videoWrapper = document.querySelector('.youtube-video-wrapper-sobre-nos');
    
    if (!videoWrapper) {
        console.log('YouTube video wrapper da seção sobre nós não encontrado');
        return;
    }

    let currentIframe = null;
    let player = null;

    // Função para carregar o vídeo do YouTube
    function loadYouTubeVideo() {
        const videoId = videoWrapper.getAttribute('data-video-id');
        
        if (!videoId) {
            console.error('ID do vídeo não encontrado no data-video-id');
            return;
        }

        // Remove elementos existentes
        const thumbnail = videoWrapper.querySelector('.video-thumbnail');
        const playButton = videoWrapper.querySelector('.play-button-overlay');
        const replayOverlay = videoWrapper.querySelector('.replay-overlay-sobre-nos');
        
        if (thumbnail) thumbnail.remove();
        if (playButton) playButton.remove();
        if (replayOverlay) replayOverlay.style.display = 'none';

        // Cria o iframe do YouTube
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
        iframe.className = 'youtube-iframe-sobre-nos';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = 'Vídeo do YouTube - Sobre Nós';
        iframe.id = 'youtube-player-sobre-nos';

        // Adiciona o iframe
        videoWrapper.appendChild(iframe);
        currentIframe = iframe;

        // Configura o player do YouTube API
        setupYouTubePlayer(videoId);

        // Log para debug
        console.log('Vídeo do YouTube carregado na seção sobre nós:', videoId);
    }

    // Função para configurar o player do YouTube com API
    function setupYouTubePlayer(videoId) {
        // Carrega a API do YouTube se não estiver carregada
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function() {
                createPlayer(videoId);
            };
        } else {
            createPlayer(videoId);
        }
    }

    // Função para criar o player
    function createPlayer(videoId) {
        player = new YT.Player('youtube-player-sobre-nos', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }

    // Função chamada quando o estado do player muda
    function onPlayerStateChange(event) {
        // YT.PlayerState.ENDED = 0
        if (event.data === YT.PlayerState.ENDED) {
            showReplayOverlay();
        }
    }

    // Função para mostrar o overlay de replay
    function showReplayOverlay() {
        const replayOverlay = videoWrapper.querySelector('.replay-overlay-sobre-nos');
        if (replayOverlay) {
            // Força estilos inline para garantir cobertura total
            replayOverlay.style.display = 'flex';
            replayOverlay.style.position = 'absolute';
            replayOverlay.style.top = '0';
            replayOverlay.style.left = '0';
            replayOverlay.style.width = '100%';
            replayOverlay.style.height = '100%';
            replayOverlay.style.zIndex = '9999';
            replayOverlay.style.background = '#1a1a1a';
            replayOverlay.style.borderRadius = '15px';
            replayOverlay.style.justifyContent = 'center';
            replayOverlay.style.alignItems = 'center';
            console.log('Overlay "Assistir novamente" exibido com cor sólida');
        }
    }

    // Função para reiniciar o vídeo
    function restartVideo() {
        if (player && player.seekTo) {
            player.seekTo(0);
            player.playVideo();
            
            const replayOverlay = videoWrapper.querySelector('.replay-overlay-sobre-nos');
            if (replayOverlay) {
                replayOverlay.style.display = 'none';
            }
        }
    }

    // Event listener para o clique inicial
    videoWrapper.addEventListener('click', function(e) {
        const replayOverlay = videoWrapper.querySelector('.replay-overlay-sobre-nos');
        const replayButton = videoWrapper.querySelector('.replay-button-sobre-nos');
        
        if (replayOverlay && replayOverlay.style.display === 'flex' && 
            (e.target === replayOverlay || e.target === replayButton || replayButton.contains(e.target))) {
            restartVideo();
        } else if (!currentIframe) {
            loadYouTubeVideo();
        }
    });

    // Event listener separado para o overlay de replay
    const replayOverlay = videoWrapper.querySelector('.replay-overlay-sobre-nos');
    if (replayOverlay) {
        replayOverlay.addEventListener('click', function(e) {
            const replayButton = videoWrapper.querySelector('.replay-button-sobre-nos');
            if (e.target === replayOverlay || e.target === replayButton || replayButton.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                restartVideo();
            }
        });
    }

    // Event listener para teclado (Enter e Espaço)
    videoWrapper.addEventListener('keydown', function(e) {
        const replayOverlay = videoWrapper.querySelector('.replay-overlay-sobre-nos');
        const replayButton = videoWrapper.querySelector('.replay-button-sobre-nos');
        
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            
            if (replayOverlay && replayOverlay.style.display === 'flex') {
                restartVideo();
            } else if (!currentIframe) {
                loadYouTubeVideo();
            }
        }
    });

    // Torna o elemento focável para acessibilidade
    videoWrapper.setAttribute('tabindex', '0');
    videoWrapper.setAttribute('role', 'button');
    videoWrapper.setAttribute('aria-label', 'Reproduzir vídeo sobre a Prodam');

    console.log('YouTube Player da seção sobre nós inicializado com sucesso');
});