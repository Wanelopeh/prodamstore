// YouTube Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    const youtubeWrapper = document.querySelector('.youtube-video-wrapper');
    
    if (youtubeWrapper) {
        youtubeWrapper.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            
            if (videoId) {
                // Criar iframe do YouTube
                const iframe = document.createElement('iframe');
                iframe.className = 'youtube-iframe';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                
                // Substituir o conteúdo atual pelo iframe
                this.innerHTML = '';
                this.appendChild(iframe);
                
                // Remover o cursor pointer após o clique
                this.style.cursor = 'default';
            }
        });
    }
});