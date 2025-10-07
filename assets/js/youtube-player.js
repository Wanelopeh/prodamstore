// YouTube Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    const youtubeWrappers = document.querySelectorAll('.youtube-video-wrapper');
    
    youtubeWrappers.forEach(function(youtubeWrapper) {
        const videoId = youtubeWrapper.getAttribute('data-video-id');
        
        if (videoId) {
            // Aguardar um pequeno delay antes de carregar o vídeo para mostrar a thumbnail
            setTimeout(function() {
                // Criar iframe do YouTube automaticamente ao carregar a página
                const iframe = document.createElement('iframe');
                iframe.className = 'youtube-iframe';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '15px';
                
                // Substituir o conteúdo atual pelo iframe
                youtubeWrapper.innerHTML = '';
                youtubeWrapper.appendChild(iframe);
                
                // Remover o cursor pointer
                youtubeWrapper.style.cursor = 'default';
            }, 1500); // Delay de 1.5 segundos para mostrar a thumbnail
        }
    });
});