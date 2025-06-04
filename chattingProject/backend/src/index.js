const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dmRouter = require('./routes/dm');
const usersRouter = require('./routes/users'); 
const pool = require('./db');
const { initSocket } = require('./socket');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use(cors());
app.use(express.json());

app.use('/api/dm', dmRouter);
app.use(usersRouter); 

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [existing] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.json({ success: false, message: '이미 존재하는 사용자입니다.' });
    }
    await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: '아이디 또는 비밀번호가 틀렸습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

initSocket(io);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/login.html'));
});

const open = require('open').default;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  open(`http://localhost:${PORT}/login.html`);
});
