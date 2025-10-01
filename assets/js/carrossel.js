// Funcionalidade do Carrossel
let slideAtualIndex = 1;
let autoPlayInterval;
let isDragging = false;
let startX = 0;
let currentX = 0;
let initialTranslate = 0;
let animationId = 0;
let dragThreshold = 80; // Distância mínima para trocar slide
let isTransitioning = false; // Previne múltiplas transições

// Função para mostrar slide específico
function slideAtual(n) {
    if (isTransitioning) return; // Previne mudanças durante transição
    mostrarSlide(slideAtualIndex = n);
}

// Função para mudar slide (anterior/próximo)
function mudarSlide(n) {
    if (isTransitioning) return; // Previne mudanças durante transição
    mostrarSlide(slideAtualIndex += n);
}

// Função principal para mostrar slide
function mostrarSlide(n) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    if (n > slides.length) {
        slideAtualIndex = 1;
    }
    if (n < 1) {
        slideAtualIndex = slides.length;
    }
    
    // Esconder todos os slides
    slides.forEach(slide => {
        slide.classList.remove('slide-ativo');
    });
    
    // Remover classe ativo de todos os indicadores
    indicadores.forEach(indicador => {
        indicador.classList.remove('ativo');
    });
    
    // Mostrar slide atual
    if (slides[slideAtualIndex - 1]) {
        slides[slideAtualIndex - 1].classList.add('slide-ativo');
    }
    
    // Ativar indicador atual
    if (indicadores[slideAtualIndex - 1]) {
        indicadores[slideAtualIndex - 1].classList.add('ativo');
    }
    
    // Liberar transição após um tempo
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// Auto-play do carrossel
function autoPlay() {
    if (!isDragging && !isTransitioning) { // Só executar se não estiver arrastando ou em transição
        mudarSlide(1);
    }
}

// Iniciar auto-play
function iniciarAutoPlay() {
    pararAutoPlay(); // Limpar qualquer intervalo existente
    autoPlayInterval = setInterval(autoPlay, 8000); // 8 segundos (aumentado)
}

// Parar auto-play
function pararAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Inicializar carrossel quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    mostrarSlide(slideAtualIndex);
    iniciarAutoPlay(); // Iniciar auto-play
    
    const carrosselContainer = document.querySelector('.carrossel-container');
    
    // Mouse events para arrastar
    carrosselContainer.addEventListener('mousedown', dragStart);
    carrosselContainer.addEventListener('mousemove', dragMove);
    carrosselContainer.addEventListener('mouseup', dragEnd);
    carrosselContainer.addEventListener('mouseleave', dragEnd);
    
    // Touch events para dispositivos móveis
    carrosselContainer.addEventListener('touchstart', dragStart);
    carrosselContainer.addEventListener('touchmove', dragMove);
    carrosselContainer.addEventListener('touchend', dragEnd);
    
    // Parar auto-play quando hover
    carrosselContainer.addEventListener('mouseenter', pararAutoPlay);
    carrosselContainer.addEventListener('mouseleave', iniciarAutoPlay);
});

// Navegação por teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        mudarSlide(-1);
        pararAutoPlay();
        setTimeout(iniciarAutoPlay, 1000); // Reiniciar auto-play após 1 segundo
    } else if (event.key === 'ArrowRight') {
        mudarSlide(1);
        pararAutoPlay();
        setTimeout(iniciarAutoPlay, 1000);
    }
});

// Funções de arrastar
function dragStart(event) {
    if (isTransitioning) return; // Não permitir drag durante transição
    
    isDragging = true;
    pararAutoPlay(); // Parar auto-play durante o arraste
    
    if (event.type === 'touchstart') {
        startX = event.touches[0].clientX;
    } else {
        startX = event.clientX;
        event.preventDefault(); // Prevenir seleção de texto
    }
    
    currentX = startX; // Inicializar currentX
    animationId = requestAnimationFrame(animation);
}

function dragMove(event) {
    if (!isDragging || isTransitioning) return;
    
    if (event.type === 'touchmove') {
        currentX = event.touches[0].clientX;
        event.preventDefault(); // Prevenir scroll durante drag
    } else {
        currentX = event.clientX;
    }
}

function dragEnd(event) {
    if (!isDragging || isTransitioning) return;
    
    isDragging = false;
    cancelAnimationFrame(animationId);
    
    const diff = startX - currentX;
    const absDiff = Math.abs(diff);
    
    // Usar o threshold definido no topo do arquivo
    if (absDiff > dragThreshold) {
        if (diff > 0) {
            // Arrastar para a esquerda - próximo slide
            mudarSlide(1);
        } else {
            // Arrastar para a direita - slide anterior
            mudarSlide(-1);
        }
    }
    
    // Reiniciar auto-play após 3 segundos (mais tempo para evitar conflitos)
    setTimeout(iniciarAutoPlay, 3000);
}

function animation() {
    if (isDragging) {
        requestAnimationFrame(animation);
    }
}