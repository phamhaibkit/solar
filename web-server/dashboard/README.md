# ATESS Solar Monitoring Dashboard

Vue 3 + TypeScript + Vite dashboard for ATESS solar monitoring system.

## Development

```bash
npm run dev
```

Opens development server at http://localhost:5173

## Build

```bash
npm run build
```

Builds the project to `dist/` folder which is served by the backend server.

## Project Structure

```
src/
├── api/           # API service calls
├── components/    # Reusable Vue components
├── stores/        # Pinia state management
├── views/         # Page components
├── router/        # Vue Router configuration
├── App.vue        # Root component
└── main.ts        # Entry point
```

## Features

- Real-time data updates via WebSocket
- API integration with backend server
- Responsive design
- TypeScript support
- Pinia for state management
- Vue Router for navigation
