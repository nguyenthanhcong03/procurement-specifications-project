import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { registerServices } from './container/register-services.js';
import { setupRoutes } from './routes/routes.js';

const app = express();

/**
 * App Configuration
 */
dotenv.config();
registerServices(); // Register all services in the DI container
app.use(cors());
app.use(express.json());
app.use(setupRoutes());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express app running on http://localhost:${port}`);
});