/**
 * Spider Scroll Effect
 * Script para añadir una araña que cae con el scroll a cualquier página web
 * Uso: Incluir este script en cualquier página HTML
 */

(function() {
    'use strict';
    
    // Evitar cargar múltiples veces
    if (window.spiderScrollLoaded) return;
    window.spiderScrollLoaded = true;
    
    // Crear estilos CSS
    const css = `
        .spider-scroll-container {
            position: fixed;
            left: 96%;
            transform: translateX(-50%);
            z-index: 9999;
            transition: top 0.3s ease-out;
            pointer-events: none;
        }
        
        .spider-scroll-svg {
            width: 120px;
            height: 120px;
            cursor: pointer;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
            pointer-events: auto;
        }
        
        .spider-scroll-line {
            position: fixed;
            left: 96%;
            top: 0;
            width: 2px;
            height: 0px;
            transform: translateX(-50%);
            background-image: repeating-linear-gradient(
                to bottom,
                #666 0px,
                #666 8px,
                transparent 8px,
                transparent 16px
            );
            opacity: 0;
            z-index: 9998;
            transition: opacity 0.3s ease;
        }
        
        .spider-scroll-back-btn {
            position: fixed;
            bottom: 30px;
            right: 5%;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #00D9F8;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            color: #00D9F8;
            transition: all 0.3s ease;
            z-index: 9997;
            opacity: 0;
            pointer-events: none;
            font-family: Arial, sans-serif;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .spider-scroll-back-btn:hover {
            background: #00D9F8;
            color: white;
            transform: scale(1.1);
        }
        
        .spider-scroll-back-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }
    `;
    
    // Añadir estilos al documento
    const styleSheet = document.createElement('style');
    styleSheet.textContent = css;
    document.head.appendChild(styleSheet);
    
     // Crear HTML de la araña
    const spiderHTML = `
        <div class="spider-scroll-line" id="spiderScrollLine"></div>
        
        <div class="spider-scroll-container" id="spiderScrollContainer">
        <a href=""><img src="img/icono-chatbot-has-studio.png"></a>

        </div>
        
        <div class="spider-scroll-back-btn" id="spiderScrollBackBtn" title="Volver arriba">
            ↑
        </div>
    `;
    
    // Esperar a que el DOM esté listo
    function initSpider() {
        // Añadir HTML al body
        document.body.insertAdjacentHTML('beforeend', spiderHTML);
        
        // Obtener elementos
        const spider = document.getElementById('spiderScrollContainer');
        const dashedLine = document.getElementById('spiderScrollLine');
        const backToTop = document.getElementById('spiderScrollBackBtn');
        
        // Posición inicial de la araña
        let spiderTop = 50;
        spider.style.top = spiderTop + 'px';
        
        // Evento de scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5; // Velocidad de caída
            
            // spiderTop = 50 + rate;
            // spider.style.top = spiderTop + 'px';
            spiderTop = Math.min(-17 + rate, window.innerHeight - 100); // ← Límite máximo
            spider.style.top = spiderTop + 'px';
            
            // Controlar el hilo (línea punteada)
            if (scrolled > 0) {
                // Mostrar hilo y ajustar su longitud hasta la araña
                dashedLine.style.opacity = '0.6'; //lo hago invisble del momento de 0.6 lo paso a 0
                dashedLine.style.height = (spiderTop + 30) + 'px'; // +30 para llegar al centro de la araña
            } else {
                // Ocultar hilo cuando está en la posición inicial
                dashedLine.style.opacity = '0';
                dashedLine.style.height = '0px';
            }
            
            // Mostrar/ocultar botón volver arriba
            if (scrolled > 100) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Función para volver arriba suavemente
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Actualizar hilo durante el scroll suave hacia arriba
        function updateThreadDuringScroll() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            spiderTop = 50 + rate;
            spider.style.top = spiderTop + 'px';
            
            if (scrolled > 0) {
                dashedLine.style.height = (spiderTop + 30) + 'px';
                dashedLine.style.opacity = '0.6';
            } else {
                dashedLine.style.height = '0px';
                dashedLine.style.opacity = '0';
            }
            
            if (scrolled > 0) {
                requestAnimationFrame(updateThreadDuringScroll);
            }
        }
        
        // Event listeners
        spider.addEventListener('click', () => {
            updateThreadDuringScroll();
            scrollToTop();
        });
        
        backToTop.addEventListener('click', () => {
            updateThreadDuringScroll();
            scrollToTop();
        });
        
        // Animación adicional cuando la araña está cayendo rápido
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollSpeed = Math.abs(window.pageYOffset - lastScrollTop);
            lastScrollTop = window.pageYOffset;
            
            if (scrollSpeed > 5) {
                spider.style.transform = 'translateX(-50%) rotate(' + (scrollSpeed * 2) + 'deg)';
                setTimeout(() => {
                    spider.style.transform = 'translateX(-50%) rotate(0deg)';
                }, 200);
            }
        });
        
        console.log('🕷️ Spider Scroll Effect loaded successfully!');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpider);
    } else {
        initSpider();
    }
    
})();

// Función pública para desactivar el efecto si es necesario
window.removeSpiderScroll = function() {
    const elements = [
        'spiderScrollContainer',
        'spiderScrollLine', 
        'spiderScrollBackBtn'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    
    window.spiderScrollLoaded = false;
    console.log('🕷️ Spider Scroll Effect removed');
};