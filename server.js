import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agentRoutes.js';

// Initialize environment variables configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

// Enable Cross-Origin Resource Sharing for frontend client access
app.use(cors({ origin: '*' }));
// Parse incoming request payloads with JSON parsers
app.use(express.json());

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
// SERVER INITIALIZATION
// ==========================================

app.listen(PORT, () => {
  console.log(`[SUCCESS] QuickSites Engine operational on port ${PORT}`);
});