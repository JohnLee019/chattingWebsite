const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const [rows] = await db.execute(
    `SELECT * FROM dm_messages 
     WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
     ORDER BY sent_at ASC`,
    [user1, user2, user2, user1]
  );
  res.json(rows);
});

module.exports = router;