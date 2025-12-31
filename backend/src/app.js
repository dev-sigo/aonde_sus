import express from 'express';
import cors from 'cors';
import healthUnitsRoutes from './routes/healthUnits.routes.js';

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));
app.use(healthUnitsRoutes);
