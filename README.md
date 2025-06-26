# COLDBIND Discord Status Page

A beautiful, real-time Discord status page with live server statistics and user information.

## Features

- **Live Discord Statistics**: Real-time member count and online status
- **Beautiful UI**: Enhanced with glow effects, snow animation, and smooth transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Background Effects**: Animated snow and blur effects
- **Real-time Updates**: Server stats update every 30 seconds

## Deploy to Render

### Quick Deploy

1. **Fork this repository** to your GitHub account
2. **Go to [Render](https://render.com)** and sign up/login
3. **Create New Web Service**
4. **Connect your GitHub repository**
5. **Configure the service:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Node Version**: 18.x or higher

### Environment Variables

Set these in your Render dashboard:

```bash
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_SERVER_ID=1378505276470202428
DISCORD_USER_ID=978118519097028628
DISCORD_CLIENT_ID=your_discord_client_id_here
PORT=10000
NODE_ENV=production
```

### ⚠️ Security Note

**NEVER commit sensitive tokens to GitHub!** All Discord tokens and IDs are now stored as environment variables for security.

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token and add it to your environment variables
5. Invite the bot to your server with "View Server Insights" permission

## Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
# or
node server.js
```

The site will be available at `http://localhost:3000`

## File Structure

```
├── server.js              # Express server with Discord API endpoints
├── index.html             # Main HTML page
├── styles.css             # Enhanced CSS with glow effects
├── discord-api.js         # Discord API integration
├── snow.js               # Snow animation effects
├── music-player.js       # Music player functionality
└── package.json          # Dependencies and scripts
```

## API Endpoints

- `GET /api/discord/server-stats` - Get live Discord server statistics
- `GET /api/discord/user-info` - Get Discord user information

## Features Added

- ✅ Live Discord server statistics
- ✅ Enhanced background with specified image
- ✅ Improved snow effects with glow
- ✅ Card hover animations with smooth transitions
- ✅ Glow effects on avatars and UI elements
- ✅ Responsive horizontal layout
- ✅ Real-time data updates

## License

MIT License - feel free to customize and use!
