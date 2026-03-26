# Environment Variables Setup

## Frontend Environment Configuration

The frontend requires environment variables to be configured before running.

### Setup Steps

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `frontend/.env` and add your actual values:
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key from Google Cloud Console

### Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (if needed)
4. Go to "Credentials" and create an API key
5. **Important**: Restrict your API key:
   - Set HTTP referrer restrictions (e.g., `localhost:3000/*`, `yourdomain.com/*`)
   - Restrict to only the APIs you need

### Security Notes

- **NEVER** commit the `.env` file to Git
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template for other developers
- Rotate your API key immediately if it's ever exposed
