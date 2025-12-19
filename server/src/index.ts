import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';

import divisionRoutes from './routes/divisionRoutes';
import projectRoutes from './routes/projectRoutes';
import teamRoutes from './routes/teamRoutes';
import contactRoutes from './routes/contactRoutes';
import clientRoutes from './routes/clientRoutes';
import initiativeRoutes from './routes/initiativeRoutes';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = Number(process.env.API_PORT || process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/divisions', divisionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/initiatives', initiativeRoutes);
app.use('/api/data', dataRoutes);
app.use('/api', authRoutes);    // /api/login, /api/logout
app.use('/api', contactRoutes); // /api/contact, /api/contact-submissions
app.use('/api', clientRoutes);  // /api/client-projects, etc.

// Serve frontend static files
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Handle SPA routing - serve index.html for all non-API routes
app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Cindral API running on http://localhost:${PORT}`);
});
