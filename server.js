import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agentRoutes.js';

// 1. INITIALIZE CONFIGURATIONS & APP MATRIX
dotenv.config();
const app = express();
const PREFERRED_PORT = process.env.PORT || 5001; // Default to 5001 to prevent port 5000 collisions

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

// Enable Cross-Origin Resource Sharing for frontend client access
app.use(cors({ origin: '*' }));

// Parse incoming request payloads with an optimized 5mb safety limit
app.use(express.json({ limit: '5mb' }));

// 🕒 REAL-TIME TERMINAL REQUEST LOGGER
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n[${timestamp}] 📡 Incoming ${req.method} request to: ${req.url}`);
  next();
});

// ==========================================
// ROUTE DEFINITIONS
// ==========================================

// Mount decoupled autonomous agent endpoints
app.use('/api', agentRoutes);

// Base application health check for cloud uptime monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'active', service: 'quicksites-ai-engine' });
});

// ==========================================
// SMART INITIALIZATION FLOW (CRASH-PROOF)
// ==========================================

function startServer(port) {
  // Now 'app' is fully created and available to use!
  const server = app.listen(port, () => {
    const assignedPort = server.address().port;
    console.log(`[SUCCESS] QuickSites Engine operational on port ${assignedPort}`);
  });

  // Dynamic port handler if the targeted port is busy
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n[WARN] Port ${port} is occupied. Scanning for next available dynamic port...`);
      // Pass 0 to instantly grab any free port available from the system
      startServer(0);
    } else {
      console.error('[CRITICAL] Server failed to start:', err);
    }
  });
}

// Kickstart the execution engine
startServer(PREFERRED_PORT);