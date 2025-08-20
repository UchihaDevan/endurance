// Funcionalidade do timer de contagem regressiva
class CountdownTimer {
    constructor() {
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.totalSeconds = 10 * 60; // 10 minutos em segundos
        this.init();
    }

    init() {
        this.updateDisplay();
        this.startTimer();
    }

    startTimer() {
        this.interval = setInterval(() => {
            this.totalSeconds--;
            this.updateDisplay();

            if (this.totalSeconds <= 0) {
                this.handleTimerExpired();
            }
        }, 1000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;
        
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    handleTimerExpired() {
        clearInterval(this.interval);
        this.showExpiredMessage();
        this.disableUpgradeButtons();
    }

    showExpiredMessage() {
        const timerElement = document.querySelector('.timer');
        timerElement.innerHTML = '<span style="color: #ff6b35; font-weight: bold;">TIME EXPIRED!</span>';
    }

    disableUpgradeButtons() {
        const upgradeButtons = document.querySelectorAll('.upgrade-btn, .final-upgrade-btn');
        upgradeButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
            button.textContent = 'Offer Expired';
        });
    }
}

// Funcionalidade de animações e efeitos visuais
class PageAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupButtonEffects();
        this.setupCardHoverEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos que devem ser animados
        const animatedElements = document.querySelectorAll(
            '.benefit-card, .pricing-card, .guarantee-item, .highlight-box, .bonus-content'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.upgrade-btn, .final-upgrade-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createRippleEffect(button);
            });

            button.addEventListener('click', (e) => {
                this.handleUpgradeClick(e);
            });
        });

        // Botão de declinar
        const declineBtn = document.querySelector('.decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                this.handleDeclineClick();
            });
        }
    }

    createRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleUpgradeClick(e) {
        const button = e.target;
        const option = button.textContent.includes('€97') ? '2-bottles' : '6-bottles';
        
        // Animação de sucesso
        this.showSuccessAnimation(button);
        
        // Simular redirecionamento após animação
        setTimeout(() => {
            this.redirectToCheckout(option);
        }, 1500);
    }

    showSuccessAnimation(button) {
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            button.textContent = '✓ Added to Order!';
        }, 1000);
    }

    handleDeclineClick() {
        // Mostrar modal de confirmação
        this.showDeclineModal();
    }

    showDeclineModal() {
        const modal = this.createModal(
            'Are you sure?',
            'You are about to lose this exclusive offer. This opportunity will not be available again.',
            [
                { text: 'Continue without Upgrade', action: () => this.redirectToCheckout('decline') },
                { text: 'Back to Offer', action: () => this.closeModal() }
            ]
        );
        document.body.appendChild(modal);
    }

    createModal(title, message, buttons) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    ${buttons.map((btn, index) => 
                        `<button class="modal-btn ${index === 0 ? 'secondary' : 'primary'}" data-action="${index}">${btn.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;

        // Adicionar event listeners
        buttons.forEach((btn, index) => {
            const buttonEl = modal.querySelector(`[data-action="${index}"]`);
            buttonEl.addEventListener('click', btn.action);
        });

        return modal;
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    redirectToCheckout(option) {
        window.location.href = `https://syzee.mycartpanda.com/ex-ocu/next-offer/9PYDaNXjNM?accepted=yes`;
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.benefit-card, .pricing-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Funcionalidade de tracking e analytics
class Analytics {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventTracking();
    }

    trackPageView() {
        this.trackEvent('page_view', {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }

    setupEventTracking() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', { percent: maxScroll });
                }
            }
        });

        // Track time on page
        this.startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('time_on_page', { seconds: timeOnPage });
        });

        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.upgrade-btn, .final-upgrade-btn')) {
                this.trackEvent('upgrade_button_click', {
                    buttonText: e.target.textContent,
                    position: this.getElementPosition(e.target)
                });
            }
            
            if (e.target.matches('.decline-btn')) {
                this.trackEvent('decline_button_click', {
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    trackEvent(eventName, data) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        this.events.push(event);
        console.log('Analytics Event:', event);
        
        // Em um ambiente real, você enviaria isso para um serviço de analytics
        // this.sendToAnalytics(event);
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
    }
}

// Funcionalidade de otimização de performance
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrolling();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    new CountdownTimer();
    new PageAnimations();
    new Analytics();
    new PerformanceOptimizer();

    // Adicionar estilos CSS dinâmicos para animações
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .modal-content {
            background: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }

        .modal-content h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }

        .modal-content p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .modal-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-btn.primary {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
        }

        .modal-btn.secondary {
            background: #f8f9fa;
            color: #666;
            border: 2px solid #ddd;
        }

        .modal-btn:hover {
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Melhorias de acessibilidade */
        @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll,
            .ripple,
            .modal-overlay,
            .modal-content {
                animation: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// Funcionalidade adicional para melhorar a experiência do usuário
window.addEventListener('load', () => {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

