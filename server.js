const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 3000;
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// Discord Bot Configuration - Using environment variables for security
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const SERVER_ID = process.env.DISCORD_SERVER_ID || '1378505276470202428';
const USER_ID = process.env.DISCORD_USER_ID || '978118519097028628';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg'
};

// Helper function to make HTTPS requests
function makeRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    resolve(data);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

// Serve static files and handle API routes
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Enable CORS for API requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API Routes
    if (pathname.startsWith('/api/')) {
        try {
            if (pathname === '/api/discord/server-stats' && req.method === 'GET') {
                // Handle Discord server stats request
                try {
                    console.log('🤖 Fetching Discord server stats via server...');
                    
                    const options = {
                        hostname: 'discord.com',
                        path: `/api/v10/guilds/${SERVER_ID}?with_counts=true`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                            'User-Agent': 'DiscordBot (COLDBIND, 1.0)'
                        }
                    };
                    
                    const serverData = await makeRequest(options);
                    console.log('✅ Server stats received:', serverData);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        member_count: serverData.approximate_member_count || serverData.member_count,
                        presence_count: serverData.approximate_presence_count || serverData.presence_count,
                        name: serverData.name,
                        icon: serverData.icon
                    }));
                } catch (error) {
                    console.error('❌ Discord server stats error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to fetch server stats' }));
                }
                return;
            }
            
            if (pathname === '/api/discord/user-info' && req.method === 'GET') {
                // Handle Discord user info request - fetch owner's info
                try {
                    console.log('👤 Fetching Discord user info via bot...');
                    const OWNER_USER_ID = '978118519097028628'; // Your Discord user ID
                    
                    const options = {
                        hostname: 'discord.com',
                        path: `/api/v10/users/${OWNER_USER_ID}`,
                        method: 'GET',
                        headers: {
                            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                            'User-Agent': 'DiscordBot (COLDBIND, 1.0)'
                        }
                    };
                    
                    const userData = await makeRequest(options);
                    console.log('✅ User info received:', userData);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        id: userData.id,
                        username: userData.username,
                        global_name: userData.global_name,
                        avatar: userData.avatar,
                        discriminator: userData.discriminator
                    }));
                } catch (error) {
                    console.error('❌ Discord user info error:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to fetch user info' }));
                }
                return;
            }
            
            // Handle unknown API routes
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API endpoint not found' }));
            return;
            
        } catch (error) {
            console.error('API error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
            return;
        }
    }
    
    // Serve static files
    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
                            .error { color: #f04747; }
                        </style>
                    </head>
                    <body>
                        <h1 class="error">404 - File Not Found</h1>
                        <p>The requested file could not be found.</p>
                        <a href="/">Return to COLDBIND</a>
                    </body>
                    </html>
                `, 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log('Press Ctrl+C to stop the server');
});
