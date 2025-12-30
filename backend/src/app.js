import express from 'express';
import cors from 'cors';
import healthUnitsRoutes from './routes/healthUnits.routes.js';

export const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN.split(',') }));
app.use(healthUnitsRoutes);
