const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /api/posts
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) { // lastId가 있는 경우
      where = { // id가 해당 아이디보다 작은 아이들을 가져옴
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // sequalize operator 중 lt(less than)
        },
      };
    }

    // post를 가져올때 작성자도 함께 가져오도록 (패스워드 제외)
    const posts = await db.Post.findAll({
      where,
      include: [{
        model: db.User, // 게시글의 작성자를 include
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }, {
        model: db.User, // 게시글을 좋아효 해준사람 목록을 include
        through: 'Like',
        as: 'Likers',
      }, {
        model: db.Post,
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          model: db.Image,
        }],
      }],
      order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
