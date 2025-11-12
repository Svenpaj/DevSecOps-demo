import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadUsers } from './src/userService.js';

const app = express();
const PORT = process.env.PORT || 3000;
const startupTime = new Date();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  console.log("/api/health was called successfully:", new Date().toISOString())
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: (() => {
      const uptimeSeconds = Math.floor((new Date() - startupTime) / 1000);
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = uptimeSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    })()
  });
  console.log("/api/health responded successfully with status 200:", new Date().toISOString())
});

app.get('/api/users', async (req, res) => {
  try {
    console.log("/api/users was called successfully:", new Date().toISOString())
    const users = await loadUsers();
    res.status(200).json(users);
    console.log("/api/users responded successfully with status 200:", new Date().toISOString())
  } catch (error) {
    console.error('Error reading users:', error);
    res.status(500).json({ 
      error: 'Failed to load users',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
