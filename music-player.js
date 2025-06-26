// Music Player with Real Audio Support
class MusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.currentSongEl = document.getElementById('current-song');
        this.timeCurrentEl = document.getElementById('time-current');
        this.timeTotalEl = document.getElementById('time-total');
        this.progressBar = document.getElementById('progress-bar');
        this.progressFill = document.getElementById('progress-fill');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isDragging = false;
        
        // Playlist - GitHub hosted music files
        this.playlist = [
            {
                title: "Threat",
                src: "https://raw.githubusercontent.com/Securedlinks/coldbind-music/main/Music/threat.mp3",
                duration: "3:45"
            },
            {
                title: "Acapella", 
                src: "https://raw.githubusercontent.com/Securedlinks/coldbind-music/main/Music/acapella.mp3",
                duration: "4:12"
            },
            {
                title: "187",
                src: "https://raw.githubusercontent.com/Securedlinks/coldbind-music/main/Music/187.mp3",
                duration: "3:58"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadTrack(this.currentTrack);
        this.setupEventListeners();
        this.setupProgressBar();
    }
    
    setupEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // Previous track
        this.prevBtn.addEventListener('click', () => {
            this.previousTrack();
        });
        
        // Next track
        this.nextBtn.addEventListener('click', () => {
            this.nextTrack();
        });
        
        // Audio events
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            if (!this.isDragging) {
                this.updateProgress();
            }
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audioPlayer.addEventListener('loadstart', () => {
            console.log('Loading track:', this.playlist[this.currentTrack].title);
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            this.handleAudioError();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlayPause();
            } else if (e.code === 'ArrowRight') {
                this.nextTrack();
            } else if (e.code === 'ArrowLeft') {
                this.previousTrack();
            }
        });
    }
    
    setupProgressBar() {
        this.progressBar.addEventListener('click', (e) => {
            this.seekTo(e);
        });
        
        this.progressBar.addEventListener('mousedown', () => {
            this.isDragging = true;
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        this.progressBar.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.seekTo(e);
            }
        });
    }
    
    loadTrack(trackIndex) {
        if (trackIndex >= 0 && trackIndex < this.playlist.length) {
            const track = this.playlist[trackIndex];
            this.currentSongEl.textContent = track.title;
            this.timeTotalEl.textContent = track.duration;
            
            // Debug logging
            console.log('Loading track:', track.title, 'from:', track.src);
            
            // Try to load the audio file
            this.audioPlayer.src = track.src;
            this.audioPlayer.load();
            
            this.currentTrack = trackIndex;
            this.updatePlayButton(false);
            
            // Test if file exists
            this.audioPlayer.addEventListener('canplaythrough', () => {
                console.log('Audio file loaded successfully');
            }, { once: true });
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            // Check if we're in demo mode
            if (this.demoInterval) {
                // Resume demo mode
                this.isPlaying = true;
                this.updatePlayButton(true);
                this.addGlowEffect();
                this.startDemoBeats();
            } else {
                // Try real audio first now that we have GitHub URLs
                this.play();
            }
        }
    }
    
    play() {
        console.log('Play button clicked, attempting to play audio...');
        console.log('Current track src:', this.audioPlayer.src);
        
        // Check if audio source is set
        if (!this.audioPlayer.src) {
            console.log('No audio source set, loading track first');
            this.loadTrack(this.currentTrack);
            return;
        }
        
        const playPromise = this.audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio playing successfully');
                this.isPlaying = true;
                this.updatePlayButton(true);
                this.addGlowEffect();
            }).catch((error) => {
                console.log('Play failed:', error.message);
                console.log('Error type:', error.name);
                console.log('Audio readyState:', this.audioPlayer.readyState);
                console.log('Audio networkState:', this.audioPlayer.networkState);
                
                // Try to force demo mode for now since Google Drive has CORS issues
                console.log('Forcing demo mode due to Google Drive CORS restrictions');
                this.handleAudioError();
            });
        } else {
            console.log('Play promise undefined, trying fallback');
            this.handleAudioError();
        }
    }
    
    pause() {
        console.log('Pause button clicked');
        
        if (this.demoInterval) {
            // Demo mode pause
            this.isPlaying = false;
            this.updatePlayButton(false);
            this.removeGlowEffect();
            this.stopDemoBeats();
        } else {
            // Real audio pause
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.updatePlayButton(false);
            this.removeGlowEffect();
        }
    }
    
    previousTrack() {
        let newTrack = this.currentTrack - 1;
        if (newTrack < 0) {
            newTrack = this.playlist.length - 1;
        }
        
        // Stop current demo mode if active
        if (this.demoInterval) {
            this.stopDemoBeats();
            clearInterval(this.demoInterval);
            this.demoInterval = null;
        }
        
        this.loadTrack(newTrack);
        if (this.isPlaying) {
            setTimeout(() => this.play(), 100);
        }
    }
    
    nextTrack() {
        let newTrack = this.currentTrack + 1;
        if (newTrack >= this.playlist.length) {
            newTrack = 0;
        }
        
        // Stop current demo mode if active
        if (this.demoInterval) {
            this.stopDemoBeats();
            clearInterval(this.demoInterval);
            this.demoInterval = null;
        }
        
        this.loadTrack(newTrack);
        if (this.isPlaying) {
            setTimeout(() => this.play(), 100);
        }
    }
    
    seekTo(event) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.audioPlayer.duration;
        
        if (!isNaN(newTime)) {
            this.audioPlayer.currentTime = newTime;
            this.updateProgress();
        }
    }
    
    updateProgress() {
        if (this.audioPlayer.duration) {
            const percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progressFill.style.width = percentage + '%';
            this.timeCurrentEl.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }
    
    updateDuration() {
        if (this.audioPlayer.duration) {
            this.timeTotalEl.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }
    
    updatePlayButton(isPlaying) {
        const icon = this.playPauseBtn.querySelector('i');
        if (isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    addGlowEffect() {
        this.playPauseBtn.style.boxShadow = '0 0 15px rgba(135, 206, 250, 0.7)';
        this.progressFill.style.boxShadow = '0 0 10px rgba(135, 206, 250, 0.5)';
    }
    
    removeGlowEffect() {
        this.playPauseBtn.style.boxShadow = '';
        this.progressFill.style.boxShadow = '';
    }
    
    handleAudioError() {
        console.log('Audio file not found or cannot play, using demo mode');
        console.log('Current audio src:', this.audioPlayer.src);
        console.log('Audio error state:', this.audioPlayer.error);
        console.log('Starting demo mode with generated audio');
        
        // Show a notification with audio test button
        this.showAudioTestNotification();
        
        this.useDemoMode();
    }
    
    // Show notification with audio test
    showAudioTestNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(135, 206, 250, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            🎵 Demo Mode Active
            <br>
            <button id="audioTestBtn" style="
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 8px;
                font-size: 12px;
            ">🔊 Test Audio</button>
        `;
        
        document.body.appendChild(notification);
        
        // Add test button functionality
        const testBtn = notification.querySelector('#audioTestBtn');
        testBtn.addEventListener('click', () => {
            this.testAudio();
        });
        
        // Remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }
    
    // Test audio function
    testAudio() {
        console.log('Testing audio manually...');
        try {
            if (!this.audioContext) {
                this.createDemoAudio();
            }
            
            // Force resume audio context
            this.audioContext.resume().then(() => {
                console.log('Audio context manually resumed');
                
                // Play a test beep
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);
                
                console.log('Test beep played');
                
                // Show success message
                this.showNotification('🔊 Audio working! Play button should now make sound.');
                
            }).catch(error => {
                console.log('Failed to resume audio context:', error);
                this.showNotification('❌ Audio not available in this browser');
            });
            
        } catch (error) {
            console.log('Audio test failed:', error);
            this.showNotification('❌ Web Audio API not supported');
        }
    }
    
    // Show notification to user
    showNotification(message) {
        const notification = document.createElement('div');
        
        // Different styles for different types of messages
        const isError = message.includes('❌');
        const bgColor = isError ? 'rgba(220, 53, 69, 0.9)' : 'rgba(135, 206, 250, 0.9)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
            text-align: center;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 5 seconds for error messages, 4 for others
        const timeout = isError ? 5000 : 4000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, timeout);
    }
    
    // Demo mode for when audio files are not available
    useDemoMode() {
        console.log('Starting demo mode - simulated music playback with audio');
        let demoTime = 0;
        const currentTrack = this.playlist[this.currentTrack];
        const demoDuration = this.parseDuration(currentTrack.duration);
        
        this.timeCurrentEl.textContent = '0:00';
        this.timeTotalEl.textContent = currentTrack.duration;
        
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
        }
        
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
        }
        
        // Create audio context for demo sounds
        this.createDemoAudio();
        
        // Enable play/pause functionality in demo mode
        this.isPlaying = true;
        this.updatePlayButton(true);
        this.addGlowEffect();
        
        // Start playing demo beats
        this.startDemoBeats();
        
        this.demoInterval = setInterval(() => {
            if (this.isPlaying) {
                demoTime++;
                const percentage = (demoTime / demoDuration) * 100;
                this.progressFill.style.width = percentage + '%';
                this.timeCurrentEl.textContent = this.formatTime(demoTime);
                
                if (demoTime >= demoDuration) {
                    demoTime = 0;
                    this.nextTrack();
                }
            }
        }, 1000);
    }
    
    // Create demo audio using Web Audio API
    createDemoAudio() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.connect(this.audioContext.destination);
                this.masterGain.gain.value = 0.5; // Increase volume to 50%
                
                // Resume audio context if it's suspended (Chrome requirement)
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('Audio context resumed');
                    }).catch(error => {
                        console.log('Failed to resume audio context:', error);
                    });
                }
            }
        } catch (error) {
            console.log('Web Audio API not supported:', error);
        }
    }
    
    // Start demo beats with proper interval management
    startDemoBeats() {
        if (!this.audioContext || this.beatInterval) return;
        
        // Ensure audio context is running
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        console.log('Starting demo beats - audio context state:', this.audioContext.state);
        
        this.beatInterval = setInterval(() => {
            if (this.isPlaying) {
                this.playDemoBeat();
            }
        }, 800); // Slower beats - every 800ms
    }
    
    // Play a single demo beat
    playDemoBeat() {
        if (!this.audioContext || !this.isPlaying) return;
        
        try {
            // Ensure audio context is running
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            // Different frequencies for different tracks to simulate different songs
            const frequencies = [220, 330, 440]; // A3, E4, A4
            const frequency = frequencies[this.currentTrack % frequencies.length];
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'square'; // Change to square wave for more noticeable sound
            
            // Create a more noticeable sound
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.8, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
            
            console.log('Playing demo beat at frequency:', frequency, 'Hz');
            
        } catch (error) {
            console.log('Error playing demo beat:', error);
        }
    }
    
    // Stop demo beats
    stopDemoBeats() {
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
    }
    
    // Parse duration string to seconds
    parseDuration(durationStr) {
        const parts = durationStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    
    // Volume control (bonus feature)
    setVolume(volume) {
        this.audioPlayer.volume = Math.max(0, Math.min(1, volume));
    }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
    
    // Add some visual feedback for music interaction
    const musicCard = document.querySelector('.music-player');
    
    musicCard.addEventListener('mouseenter', () => {
        if (window.musicPlayer.isPlaying) {
            musicCard.style.background = 'rgba(135, 206, 250, 0.2)';
        }
    });
    
    musicCard.addEventListener('mouseleave', () => {
        musicCard.style.background = 'rgba(135, 206, 250, 0.1)';
    });
    
    // Handle Spotify link click
    const spotifyLink = document.getElementById('spotify-link');
    if (spotifyLink) {
        spotifyLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.musicPlayer.showNotification('❌ Spotify integration not available yet - Use our built-in player instead!');
        });
    }
});
