class SnowEffect {
    constructor() {
        this.snowContainer = document.querySelector('.snow-container');
        this.snowflakes = [];
        this.maxSnowflakes = 150;
        this.snowflakeSymbols = ['❄', '❅', '❆', '✦', '✧', '•', '*', '⋅'];
        
        this.init();
    }
    
    init() {
        this.createSnowflakes();
        this.animateSnowflakes();
    }
    
    createSnowflakes() {
        for (let i = 0; i < this.maxSnowflakes; i++) {
            this.createSnowflake();
        }
    }
    
    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = this.getRandomSymbol();
        
        // Random properties
        const size = Math.random() * 18 + 8; // 8px to 26px
        const startPositionX = Math.random() * window.innerWidth;
        const duration = Math.random() * 5 + 3; // 3s to 8s (slower)
        const delay = Math.random() * 3; // 0s to 3s delay
        const opacity = Math.random() * 0.7 + 0.3; // 0.3 to 1.0
        
        snowflake.style.left = startPositionX + 'px';
        snowflake.style.fontSize = size + 'px';
        snowflake.style.animationDuration = duration + 's';
        snowflake.style.animationDelay = delay + 's';
        snowflake.style.opacity = opacity;
        
        // Add horizontal drift
        const drift = (Math.random() - 0.5) * 120; // -60px to 60px drift
        snowflake.style.setProperty('--drift', drift + 'px');
        
        // Add glow effect to some snowflakes
        if (Math.random() > 0.7) {
            snowflake.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))';
        }
        
        this.snowContainer.appendChild(snowflake);
        this.snowflakes.push(snowflake);
        
        // Remove snowflake after animation completes
        setTimeout(() => {
            this.removeSnowflake(snowflake);
        }, (duration + delay) * 1000);
    }
    
    removeSnowflake(snowflake) {
        if (snowflake && snowflake.parentNode) {
            snowflake.parentNode.removeChild(snowflake);
            const index = this.snowflakes.indexOf(snowflake);
            if (index > -1) {
                this.snowflakes.splice(index, 1);
            }
        }
    }
    
    getRandomSymbol() {
        return this.snowflakeSymbols[Math.floor(Math.random() * this.snowflakeSymbols.length)];
    }
    
    animateSnowflakes() {
        // Continuously create new snowflakes
        setInterval(() => {
            if (this.snowflakes.length < this.maxSnowflakes) {
                this.createSnowflake();
            }
        }, 200); // Create a new snowflake every 200ms
    }
    
    // Method to handle window resize
    handleResize() {
        // Update snowflake positions on resize
        this.snowflakes.forEach(snowflake => {
            if (parseFloat(snowflake.style.left) > window.innerWidth) {
                snowflake.style.left = Math.random() * window.innerWidth + 'px';
            }
        });
    }
}

// Enhanced snowflake animation with drift
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        from {
            transform: translateY(-100vh) translateX(0) rotate(0deg);
        }
        to {
            transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize snow effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const snowEffect = new SnowEffect();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        snowEffect.handleResize();
    });
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const snowflakes = document.querySelectorAll('.snowflake');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    snowflakes.forEach((snowflake, index) => {
        if (index % 5 === 0) { // Only affect every 5th snowflake for performance
            const rect = snowflake.getBoundingClientRect();
            const snowflakeX = rect.left + rect.width / 2;
            const snowflakeY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - snowflakeX, 2) + Math.pow(mouseY - snowflakeY, 2)
            );
            
            if (distance < 100) {
                const angle = Math.atan2(snowflakeY - mouseY, snowflakeX - mouseX);
                const force = (100 - distance) / 100;
                const moveX = Math.cos(angle) * force * 20;
                const moveY = Math.sin(angle) * force * 20;
                
                snowflake.style.transform += ` translate(${moveX}px, ${moveY}px)`;
                
                // Reset transform after a short delay
                setTimeout(() => {
                    snowflake.style.transform = snowflake.style.transform.replace(
                        /translate\([^)]*\)/g, ''
                    );
                }, 500);
            }
        }
    });
});
