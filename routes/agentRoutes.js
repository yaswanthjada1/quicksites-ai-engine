import express from 'express';
import { generateComponentController } from '../controllers/agentController.js';

const router = express.Router();

// POST route to handle incoming chat prompts from your canvas frontend
router.post('/generate', generateComponentController);

export default router;