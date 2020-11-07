const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { //GET /api/posts
  try {
    // post를 가져올때 작성자도 함께 가져오도록 (패스워드 제외)
    const posts = await db.Post.findAll({
      model: db.User,
      attribute: ['id', 'nickname'],
      order: [['createdAt', 'DESC']], //DESC는 내림차순, ASC는 오름차순
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
