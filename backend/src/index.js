import express from 'express';
import { PORT } from '../config/env.js';
import boostrap from './controllers/app.controller.js';
import { app, server } from './utils/socket.js';
import path from 'path';

const __dirname = path.resolve();

boostrap(app, express);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
