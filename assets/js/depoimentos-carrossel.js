// Funcionalidade do Carrossel de Depoimentos
let depoimentoSlideAtualIndex = 1;
let depoimentoAutoPlayInterval;
let depoimentoIsDragging = false;
let depoimentoStartX = 0;
let depoimentoCurrentX = 0;
let depoimentoInitialTranslate = 0;
let depoimentoAnimationId = 0;
let depoimentoDragThreshold = 80; // Distância mínima para trocar slide
let depoimentoIsTransitioning = false; // Previne múltiplas transições

// Função para detectar se está em mobile
function isMobile() {
    return window.innerWidth <= 480;
}

// Função para obter o número total de slides baseado na tela
function getTotalSlides() {
    return isMobile() ? 6 : 3;
}

// Função para mostrar slide específico de depoimentos
function depoimentoSlideAtual(n) {
    if (depoimentoIsTransitioning) return; // Previne mudanças durante transição
    mostrarDepoimentoSlide(depoimentoSlideAtualIndex = n);
}

// Função para mudar slide de depoimentos (anterior/próximo)
function mudarDepoimentoSlide(n) {
    if (depoimentoIsTransitioning) return; // Previne mudanças durante transição
    mostrarDepoimentoSlide(depoimentoSlideAtualIndex += n);
}

// Função principal para mostrar slide de depoimentos
function mostrarDepoimentoSlide(n) {
    if (depoimentoIsTransitioning) return;
    
    depoimentoIsTransitioning = true;
    const totalSlides = getTotalSlides();
    
    if (n > totalSlides) {
        depoimentoSlideAtualIndex = 1;
    }
    if (n < 1) {
        depoimentoSlideAtualIndex = totalSlides;
    }
    
    if (isMobile()) {
        // Lógica para mobile - 6 slides individuais
        const slides = document.querySelectorAll('.depoimentos-slide');
        const mobileSlides = document.querySelectorAll('.depoimentos-slide-mobile');
        const indicadores = document.querySelectorAll('.depoimento-indicador');
        
        // Esconder todos os slides desktop
        slides.forEach(slide => {
            if (!slide.classList.contains('depoimentos-slide-mobile')) {
                slide.classList.remove('depoimentos-slide-ativo');
            }
        });
        
        // Esconder todos os slides mobile
        mobileSlides.forEach(slide => {
            slide.classList.remove('depoimentos-slide-ativo');
        });
        
        // Mostrar slide mobile correspondente
        if (depoimentoSlideAtualIndex <= 3) {
            // Slides 1-3: usar slides desktop mas mostrar apenas primeiro card
            const slideDesktop = slides[depoimentoSlideAtualIndex - 1];
            if (slideDesktop && !slideDesktop.classList.contains('depoimentos-slide-mobile')) {
                slideDesktop.classList.add('depoimentos-slide-ativo');
            }
        } else {
            // Slides 4-6: usar slides mobile individuais
            const slideMobile = mobileSlides[depoimentoSlideAtualIndex - 4];
            if (slideMobile) {
                slideMobile.classList.add('depoimentos-slide-ativo');
            }
        }
        
        // Atualizar indicadores
        indicadores.forEach((indicador, index) => {
            indicador.classList.remove('ativo');
            if (index === depoimentoSlideAtualIndex - 1) {
                indicador.classList.add('ativo');
            }
        });
        
    } else {
        // Lógica para desktop - 3 slides com 2 cards cada
        const slides = document.querySelectorAll('.depoimentos-slide:not(.depoimentos-slide-mobile)');
        const indicadores = document.querySelectorAll('.depoimento-indicador:not(.depoimento-indicador-mobile)');
        
        // Esconder todos os slides
        document.querySelectorAll('.depoimentos-slide').forEach(slide => {
            slide.classList.remove('depoimentos-slide-ativo');
        });
        
        // Mostrar slide atual
        if (slides[depoimentoSlideAtualIndex - 1]) {
            slides[depoimentoSlideAtualIndex - 1].classList.add('depoimentos-slide-ativo');
        }
        
        // Atualizar indicadores
        indicadores.forEach((indicador, index) => {
            indicador.classList.remove('ativo');
            if (index === depoimentoSlideAtualIndex - 1) {
                indicador.classList.add('ativo');
            }
        });
    }
    
    // Liberar transição após um tempo
    setTimeout(() => {
        depoimentoIsTransitioning = false;
    }, 500);
}

// Auto-play do carrossel de depoimentos
function depoimentoAutoPlay() {
    if (!depoimentoIsDragging && !depoimentoIsTransitioning) { // Só executar se não estiver arrastando ou em transição
        mudarDepoimentoSlide(1);
    }
}

// Iniciar auto-play de depoimentos
function iniciarDepoimentoAutoPlay() {
    pararDepoimentoAutoPlay(); // Limpar qualquer intervalo existente
    depoimentoAutoPlayInterval = setInterval(depoimentoAutoPlay, 10000); // 10 segundos
}

// Parar auto-play de depoimentos
function pararDepoimentoAutoPlay() {
    if (depoimentoAutoPlayInterval) {
        clearInterval(depoimentoAutoPlayInterval);
        depoimentoAutoPlayInterval = null;
    }
}

// Inicializar carrossel de depoimentos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o DOM esteja completamente carregado
    setTimeout(() => {
        const depoimentosContainer = document.querySelector('.depoimentos-carrossel-container');
        
        if (depoimentosContainer) {
            // Resetar para slide 1 ao carregar
            depoimentoSlideAtualIndex = 1;
            mostrarDepoimentoSlide(depoimentoSlideAtualIndex);
            iniciarDepoimentoAutoPlay(); // Iniciar auto-play
            
            // Mouse events para arrastar
            depoimentosContainer.addEventListener('mousedown', depoimentoDragStart);
            depoimentosContainer.addEventListener('mousemove', depoimentoDragMove);
            depoimentosContainer.addEventListener('mouseup', depoimentoDragEnd);
            depoimentosContainer.addEventListener('mouseleave', depoimentoDragEnd);
            
            // Touch events para dispositivos móveis
            depoimentosContainer.addEventListener('touchstart', depoimentoDragStart);
            depoimentosContainer.addEventListener('touchmove', depoimentoDragMove);
            depoimentosContainer.addEventListener('touchend', depoimentoDragEnd);
            
            // Parar auto-play quando hover
            depoimentosContainer.addEventListener('mouseenter', pararDepoimentoAutoPlay);
            depoimentosContainer.addEventListener('mouseleave', iniciarDepoimentoAutoPlay);
        }
    }, 100);
});

// Listener para mudanças de tamanho da tela
window.addEventListener('resize', function() {
    // Resetar para slide 1 quando mudar o tamanho da tela
    depoimentoSlideAtualIndex = 1;
    mostrarDepoimentoSlide(depoimentoSlideAtualIndex);
});

// Navegação por teclado para depoimentos
document.addEventListener('keydown', function(event) {
    // Verificar se o foco está na seção de depoimentos
    const depoimentosSection = document.querySelector('.secao-depoimentos');
    if (depoimentosSection && event.target.closest('.secao-depoimentos')) {
        if (event.key === 'ArrowLeft') {
            mudarDepoimentoSlide(-1);
            pararDepoimentoAutoPlay();
            setTimeout(iniciarDepoimentoAutoPlay, 1000);
        } else if (event.key === 'ArrowRight') {
            mudarDepoimentoSlide(1);
            pararDepoimentoAutoPlay();
            setTimeout(iniciarDepoimentoAutoPlay, 1000);
        }
    }
});

// Funções de arrastar para depoimentos
function depoimentoDragStart(event) {
    if (depoimentoIsTransitioning) return; // Não permitir drag durante transição
    
    depoimentoIsDragging = true;
    pararDepoimentoAutoPlay(); // Parar auto-play durante o arraste
    
    if (event.type === 'touchstart') {
        depoimentoStartX = event.touches[0].clientX;
    } else {
        depoimentoStartX = event.clientX;
        event.preventDefault(); // Prevenir seleção de texto
    }
    
    depoimentoCurrentX = depoimentoStartX; // Inicializar currentX
    depoimentoAnimationId = requestAnimationFrame(depoimentoAnimation);
}

function depoimentoDragMove(event) {
    if (!depoimentoIsDragging || depoimentoIsTransitioning) return;
    
    if (event.type === 'touchmove') {
        depoimentoCurrentX = event.touches[0].clientX;
        event.preventDefault(); // Prevenir scroll durante drag
    } else {
        depoimentoCurrentX = event.clientX;
    }
}

function depoimentoDragEnd(event) {
    if (!depoimentoIsDragging || depoimentoIsTransitioning) return;
    
    depoimentoIsDragging = false;
    cancelAnimationFrame(depoimentoAnimationId);
    
    const diff = depoimentoStartX - depoimentoCurrentX;
    const absDiff = Math.abs(diff);
    
    // Usar o threshold definido no topo do arquivo
    if (absDiff > depoimentoDragThreshold) {
        if (diff > 0) {
            // Arrastar para a esquerda - próximo slide
            mudarDepoimentoSlide(1);
        } else {
            // Arrastar para a direita - slide anterior
            mudarDepoimentoSlide(-1);
        }
    }
    
    // Reiniciar auto-play após 3 segundos
    setTimeout(iniciarDepoimentoAutoPlay, 3000);
}

function depoimentoAnimation() {
    if (depoimentoIsDragging) {
        requestAnimationFrame(depoimentoAnimation);
    }
}