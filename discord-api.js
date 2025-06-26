// Discord API Integration - Always Display Owner's Info and Server Stats
class DiscordAPI {
    constructor() {
        // Configuration - Always show ERONULL's Discord info and COLDBIND server
        this.serverId = '1378505276470202428';
        this.userId = '978118519097028628';
        this.ownerUsername = 'ERONULL';
        this.serverName = 'COLDBIND';
        this.inviteLink = 'https://discord.gg/SSJG3nmv6f';
        
        // Bot token will be provided by server environment variables
        // No sensitive data stored in client-side code
        
        // State management - using real server stats as fallback
        this.serverStats = {
            memberCount: 119, // Real server member count
            onlineCount: 27,  // Real server online count
            name: 'COLDBIND'  // Real server name for the project
        };
        
        this.ownerInfo = {
            username: 'ERONULL',
            displayName: 'ERONULL',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            status: 'online'
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Discord API integration (discord-api.js)...');
        console.log('📊 Initial fallback stats:', this.serverStats);
        
        // Update data immediately
        this.updateAllData();
        
        // Set up periodic updates every 30 seconds
        setInterval(() => {
            this.updateAllData();
        }, 30000);
        
        // Initialize UI with current data
        this.updateUI();
    }
    
    // Update all Discord data
    async updateAllData() {
        console.log('🔄 Updating Discord data...');
        
        try {
            // Fetch server stats and user info from our server endpoint
            await this.fetchServerStats();
            await this.fetchUserInfo();
            
            // Update UI with new data
            this.updateUI();
            
            console.log('✅ Discord data updated successfully');
        } catch (error) {
            console.error('❌ Error updating Discord data:', error);
            this.showNotification('Failed to fetch Discord data, using cached info', 'warning');
        }
    }
    
    // Fetch server statistics
    async fetchServerStats() {
        try {
            console.log('📊 Fetching server stats...');
            
            const response = await fetch('/api/discord/server-stats');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📈 Server stats received:', data);
            console.log('📈 Raw API data - member_count:', data.member_count, 'presence_count:', data.presence_count, 'name:', data.name);
            
            // Update server stats - using the correct field names from the API
            this.serverStats = {
                memberCount: data.member_count || this.serverStats.memberCount,
                onlineCount: data.presence_count || this.serverStats.onlineCount,
                name: 'COLDBIND' // Always use COLDBIND as the display name
            };
            
            console.log('📈 Updated serverStats object:', this.serverStats);
            
            return data;
        } catch (error) {
            console.error('❌ Server stats fetch error:', error);
            // Keep using fallback values
            return this.serverStats;
        }
    }
    
    // Fetch user information
    async fetchUserInfo() {
        try {
            console.log('👤 Fetching user info...');
            
            const response = await fetch('/api/discord/user-info');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('👤 User info received:', data);
            
            // Update owner info with real data
            this.ownerInfo = {
                username: data.username || 'ERONULL',
                displayName: data.global_name || data.username || 'ERONULL',
                avatar: data.avatar 
                    ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=256`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png',
                status: 'online'
            };
            
            return data;
        } catch (error) {
            console.error('❌ User info fetch error:', error);
            // Keep using fallback values
            return this.ownerInfo;
        }
    }
    
    // Update the main UI with Discord data
    updateUI() {
        // Update server stats
        this.updateServerCard();
        
        // Update status card (always show owner as online)
        this.updateStatusCard();
        
        // Update profile info
        this.updateProfileCard();
    }
    
    // Update server card with live stats
    updateServerCard() {
        const serverNameEl = document.querySelector('.server-name');
        const onlineCountEl = document.querySelector('.online-count');
        const memberCountEl = document.querySelector('.member-count');
        
        console.log('🔄 Updating server card with stats:', this.serverStats);
        
        if (serverNameEl) {
            serverNameEl.textContent = this.serverStats.name;
            console.log('✅ Updated server name to:', this.serverStats.name);
        }
        
        if (onlineCountEl) {
            onlineCountEl.innerHTML = `<i class="fas fa-circle online"></i> ${this.formatNumber(this.serverStats.onlineCount)} Online`;
            console.log('✅ Updated online count to:', this.serverStats.onlineCount);
        }
        
        if (memberCountEl) {
            memberCountEl.innerHTML = `<i class="fas fa-circle"></i> ${this.formatNumber(this.serverStats.memberCount)} Members`;
            console.log('✅ Updated member count to:', this.serverStats.memberCount);
        }
    }
    
    // Update status card (always show owner info)
    updateStatusCard() {
        const statusNameEl = document.querySelector('.status-name');
        const statusTimeEl = document.querySelector('.status-time');
        const statusIndicator = document.querySelector('.status-indicator');
        const statusAvatarImg = document.querySelector('.status-avatar img');
        
        if (statusNameEl) {
            statusNameEl.textContent = this.ownerInfo.username;
        }
        
        if (statusTimeEl) {
            statusTimeEl.textContent = 'online now';
        }
        
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator online';
        }
        
        if (statusAvatarImg) {
            statusAvatarImg.src = this.ownerInfo.avatar;
        }
    }
    
    // Update profile card
    updateProfileCard() {
        const avatarEl = document.querySelector('#avatar');
        const usernameEl = document.querySelector('.username');
        const displayNameEl = document.querySelector('.display-name');
        
        if (avatarEl) {
            avatarEl.src = this.ownerInfo.avatar;
            avatarEl.alt = `${this.ownerInfo.username} Avatar`;
        }
        
        // Show real username in profile while keeping COLDBIND branding
        if (usernameEl) {
            usernameEl.innerHTML = `${this.ownerInfo.displayName} <i class="fas fa-snowflake"></i> <i class="fas fa-gem"></i>`;
        }
        
        if (displayNameEl) {
            displayNameEl.textContent = 'COLDBIND';
        }
    }
    
    // Format numbers for display (e.g., 1337 -> 1,337)
    formatNumber(num) {
        return num.toLocaleString();
    }
    
    // Show notification to user
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        console.log(`📢 Notification (${type}): ${message}`);
    }
    
    // Get current server stats for external use
    getServerStats() {
        return this.serverStats;
    }
    
    // Get owner info for external use
    getOwnerInfo() {
        return this.ownerInfo;
    }
}

// Initialize Discord API integration when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.discordAPI = new DiscordAPI();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.discordAPI) {
            window.discordAPI = new DiscordAPI();
        }
    });
} else {
    window.discordAPI = new DiscordAPI();
}