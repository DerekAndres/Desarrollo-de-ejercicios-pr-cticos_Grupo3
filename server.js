require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./src/infrastructure/database');
const personaRoutes = require('./src/app/routes/personaRoutes');
const usuarioRoutes = require('./src/app/routes/usuarioRoutes');

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/personas', personaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Simple health endpoint to observe DB status without crashing the app
app.get('/health', (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting", "unauthorized", "unknown"];
    const dbStateIndex = mongoose.connection.readyState;
    res.json({
        status: 'ok',
        dbState: states[dbStateIndex] || dbStateIndex
    });
});

// Root - serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
