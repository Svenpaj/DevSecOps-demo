import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Health endpoint
app.get('/api/health', (req, res) => {
  console.log("Checkhealth was called successfully:", new Date().toISOString())
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
  console.log("Checkhealth responded successfully:", new Date().toISOString())
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
