const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// ✅ Define paths
const UI_PATH = path.join(__dirname, 'UI');              // sdk/UI
const UI_LIBS_PATH = path.join(UI_PATH, 'libs');         // sdk/UI/libs
const SDK_LIBS_PATH = path.join(__dirname, 'libs');      // sdk/libs

// ✅ Serve sdk root (for kore-bot-sdk-client.js)
app.use('/', express.static(__dirname));

// ✅ Serve UI root (index.html, kore-config.js)
app.use('/', express.static(UI_PATH));

// ✅ Serve /libs from sdk/libs (emoji.js, kore-pickers.js, etc.)
app.use('/libs', express.static(SDK_LIBS_PATH));

// ✅ Serve /ui-libs from sdk/UI/libs (jquery.js, moment.js, etc.)
app.use('/ui-libs', express.static(UI_LIBS_PATH));

// ✅ Explicitly serve kore-bot-sdk-client.js if needed
app.get('/kore-bot-sdk-client.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'kore-bot-sdk-client.js'));
});

// ✅ Explicitly serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(UI_PATH, 'index.html'));
});

// ✅ JWT endpoint
app.post('/api/users/getJWT', (req, res) => {
  const email = req.body.email || 'anonymous@example.com';
  const payload = {
    sub: email,
    iss: 'cs-b01b8ac1-adc6-5797-b0eb-a767df441782',
    aud: 'https://idproxy.kore.ai/authorize',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    customData: { name: "Test User", loginStatus: "success" }
  };
  const token = jwt.sign(payload, 'suFOuPt7byEVAIGXnFrnpXFkJ1j5XXAUwieI7HSB1W0=', { algorithm: 'HS256' });
  res.json({ jwt: token });
});

// ✅ Fallback for missing assets
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.originalUrl}`);
  res.status(404).send(`404 Not Found: ${req.originalUrl}`);
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`✅ JWT endpoint available at /api/users/getJWT`);
});