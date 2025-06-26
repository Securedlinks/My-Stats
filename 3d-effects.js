document.addEventListener('DOMContentLoaded', function() {
    // Get all UI cards
    const cards = document.querySelectorAll('.profile-card, .status-card, .server-card, .social-card, .music-player');
    
    // Add event listeners to each card
    cards.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mouseenter', handleMouseEnter);
    });
    
    // Handle mouse movement over card
    function handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate rotation based on mouse position
        // Limit rotation to a maximum of 10 degrees
        const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10;
        const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 10;
        
        // Apply 3D transform
        card.style.transform = `
            translateY(-8px) 
            scale(1.02) 
            translateZ(20px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
        
        // Add dynamic shadow based on rotation
        const shadowX = rotateY / 2;
        const shadowY = -rotateX / 2;
        card.style.boxShadow = `
            ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            0 0 50px rgba(135, 206, 250, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `;
        
        // Add highlight effect based on mouse position
        const highlightX = ((mouseX - rect.left) / rect.width) * 100;
        const highlightY = ((mouseY - rect.top) / rect.height) * 100;
        card.style.background = `
            radial-gradient(
                circle at ${highlightX}% ${highlightY}%, 
                rgba(173, 216, 230, 0.25) 0%, 
                rgba(135, 206, 250, 0.18) 50%
            )
        `;
    }
    
    // Reset card when mouse leaves
    function handleMouseLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
        card.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `;
        card.style.background = 'rgba(135, 206, 250, 0.12)';
    }
    
    // Smooth transition when mouse enters
    function handleMouseEnter(e) {
        const card = e.currentTarget;
        card.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out, background 0.2s ease-out';
        
        // Remove transition after initial animation
        setTimeout(() => {
            card.style.transition = 'none';
        }, 200);
    }
});
