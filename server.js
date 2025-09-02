const express = require('express');
const path = require('path');
const http = require('http');            // ⬅ add
const { Server } = require('socket.io'); // ⬅ add

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Serve static files (HTML, CSS, JS) from /public
app.use(express.static(path.join(__dirname, 'public')));

// ---------- REST API ----------
app.get('/add', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (isNaN(num1) || isNaN(num2)) return res.status(400).json({ error: 'Invalid numbers' });
  res.json({ result: num1 + num2 });
});

app.get('/subtract', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (isNaN(num1) || isNaN(num2)) return res.status(400).json({ error: 'Invalid numbers' });
  res.json({ result: num1 - num2 });
});

app.get('/multiply', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (isNaN(num1) || isNaN(num2)) return res.status(400).json({ error: 'Invalid numbers' });
  res.json({ result: num1 * num2 });
});

app.get('/divide', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (isNaN(num1) || isNaN(num2) || num2 === 0) {
    return res.status(400).json({ error: 'Invalid numbers or division by zero' });
  }
  res.json({ result: num1 / num2 });
});

app.post('/add', (req, res) => {
  const { num1, num2 } = req.body;
  if (isNaN(num1) || isNaN(num2)) return res.status(400).json({ error: 'Invalid numbers' });
  res.json({ result: Number(num1) + Number(num2) });
});

// ---------- Socket.IO ----------
const server = http.createServer(app);     // create HTTP server from express app
const io = new Server(server);             // attach socket.io

io.on('connection', (socket) => {
  console.log('a user connected');

  // emit a random number every second
  const timer = setInterval(() => {
    socket.emit('number', Math.floor(Math.random() * 10)); // 0..9
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(timer);
    console.log('user disconnected');
  });
});

// Only listen when run directly (tests import without opening a port)
if (require.main === module) {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export both for tests
module.exports = { app, server, io };
