const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/api/users', async (req, res) => {
  const exclude = req.query.exclude?.trim()?.toLowerCase(); // ✅ 정규화
  console.log('🔥 exclude:', exclude); // 디버깅 로그

  try {
    const [rows] = await db.execute(`
      SELECT username AS id,
             DATE_FORMAT(created_at, '%Y-%m-%d') AS joined
      FROM users
      WHERE LOWER(TRIM(username)) != ?
    `, [exclude]); // ✅ 서버 측 정규화된 비교

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '사용자 목록 불러오기 실패' });
  }
});

module.exports = router;