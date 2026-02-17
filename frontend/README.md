# TransferX Outreach Automation - Frontend Dashboard

React-based web dashboard for managing the TransferX outreach automation system.

## Features

- **Dashboard**: Real-time KPI metrics, charts, and quick actions
- **Contacts**: Browse and search all discovered contacts
- **Campaigns**: Create and manage email/LinkedIn campaigns
- **Discovery**: Trigger automated contact discovery from college websites
- **Email Test**: Test Gmail SMTP configuration
- **Settings**: Configure rate limits and automation settings

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - API calls
- **Lucide React** - Icons

## Prerequisites

- **Node.js 18+** installed
- **Backend API** running on `http://localhost:8000` (via Docker)

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Dashboard

### Development Mode

Start the Vite dev server with hot reload:

```bash
npm run dev
```

The dashboard will be available at: **http://localhost:3000**

### Production Build

Build optimized production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx      # Main dashboard with KPIs and charts
│   │   ├── Contacts.jsx       # Contact management
│   │   ├── Campaigns.jsx      # Campaign management
│   │   ├── Discovery.jsx      # Automated discovery
│   │   ├── EmailTest.jsx      # Email testing
│   │   └── Settings.jsx       # System settings
│   ├── services/
│   │   └── api.js      # API service layer (axios)
│   ├── App.jsx         # Main app with routing
│   ├── index.css       # Tailwind styles
│   └── main.jsx        # App entry point
├── index.html
├── package.json
├── vite.config.js      # Vite config with API proxy
└── tailwind.config.js  # Tailwind config
```

## API Proxy

The Vite dev server is configured to proxy API requests to the backend:

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Proxy**: All requests to `/api/*` are forwarded to `http://localhost:8000`

Example:
```javascript
// Frontend makes request to:
axios.get('/api/contacts')

// Vite proxies to:
http://localhost:8000/contacts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint (if configured) |

## Environment Variables

The frontend uses the backend API running on `http://localhost:8000`. If you need to change the API URL, update `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Change this if API is elsewhere
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## Usage Guide

### 1. Start Backend First

Before running the frontend, ensure the backend API is running:

```bash
# From project root
docker-compose up -d
```

Verify API is accessible:
```bash
curl http://localhost:8000/health
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Access Dashboard

Open browser to: **http://localhost:3000**

### 4. Test Email Configuration

1. Navigate to **Email Test** page
2. Enter recipient email
3. Click **Send Test Email**
4. Check inbox for test email

### 5. Run Contact Discovery

1. Navigate to **Discovery** page
2. (Optional) Enter specific college name
3. Set limit (number of colleges to process)
4. Click **Start Discovery**
5. View results showing discovered contacts

### 6. Create Campaign

1. Navigate to **Campaigns** page
2. Click **Create Campaign**
3. Fill in campaign details:
   - Name (e.g., "Transfer Center Outreach Wave 1")
   - Type (Email or LinkedIn)
   - Target Audience (Transfer Centers, Professors, etc.)
4. Click **Create Campaign**

### 7. Browse Contacts

1. Navigate to **Contacts** page
2. Use search to filter by name, email, or institution
3. Use dropdown to filter by contact type
4. View contact summary stats

## API Endpoints Used

The frontend interacts with these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/contacts` | GET | Get all contacts with filters |
| `/contacts` | POST | Create new contact |
| `/campaigns` | GET | Get all campaigns |
| `/campaigns` | POST | Create new campaign |
| `/kpis/summary` | GET | Get KPI summary for dashboard |
| `/admin/test-email` | POST | Send test email |
| `/admin/discover-contacts` | POST | Trigger contact discovery |

## Styling

The dashboard uses **Tailwind CSS** with a custom purple theme:

```javascript
// Primary colors (purple gradient)
primary: {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',  // Main brand color
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
}
```

## Troubleshooting

### Frontend won't start

**Error**: `Cannot find module 'vite'`
```bash
# Solution: Install dependencies
npm install
```

### API requests failing

**Error**: `Network Error` or `404 Not Found`

1. Check backend is running:
   ```bash
   docker-compose ps
   ```

2. Verify API is accessible:
   ```bash
   curl http://localhost:8000/health
   ```

3. Check Vite proxy configuration in `vite.config.js`

### Port 3000 already in use

**Error**: `Port 3000 is already in use`

Option 1: Kill process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

Option 2: Change port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Use different port
  // ...
}
```

### Build errors

**Error**: Build fails with TypeScript errors

The project uses JavaScript, not TypeScript. If you see TS errors, ensure you're using `.jsx` files, not `.tsx`.

## Development Tips

### Hot Reload

Vite provides instant hot module replacement (HMR). Changes to `.jsx` files will update immediately without full page reload.

### API Development

When developing new features:

1. Add new API function to `src/services/api.js`:
   ```javascript
   export const newEndpoint = () => api.get('/new-endpoint')
   ```

2. Use in component:
   ```javascript
   import { newEndpoint } from '../services/api'

   const data = await newEndpoint()
   ```

### Adding New Pages

1. Create component in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
   ```javascript
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation link in sidebar

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates optimized bundle in `dist/` directory.

### Serve Static Build

Option 1: Use Vite preview:
```bash
npm run preview
```

Option 2: Use any static file server:
```bash
# Using serve
npx serve dist

# Using Python
cd dist && python -m http.server 3000
```

### Deploy to Hosting

The `dist/` folder can be deployed to:
- **Vercel** (recommended for Vite)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static hosting service**

**Important**: Update API proxy settings for production to point to your production API URL.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Support

For issues or questions:
- Check backend API logs: `docker-compose logs api`
- Check frontend console for errors
- Verify network requests in browser DevTools
