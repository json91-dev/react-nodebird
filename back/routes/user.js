const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const router = express.Router();

// API는 다른 서비스가 내 서비스의 기능을 실행 할 수 있게 열어둔 창구
// router.post('/api/user', (req, res) => { => /api/user 부분을 /로 대체

router.get('/', isLoggedIn, async (req, res, next) => { // /api/user
  // 패스워드를 response로 보내는것을 방지
  // const user = Object.assign({}, req.user.toJSON()); // db에서 꺼내온 객체이기 떄문에 toJSON을 붙여줘야함.
  // delete user.password;
  const user = await db.User.findOne({
    where: { id: parseInt(req.user.id, 10) },
    attributes: ['id', 'nickname'],
    include: [{
      model: db.Post,
      as: 'Posts',
      attributes: ['id'],
    }, {
      model: db.User,
      as: 'Followers',
      attributes: ['id'],
    }, {
      model: db.User,
      as: 'Followings',
      attributes: ['id'],
    }],
  });

  return res.json(user);
});

router.post('/', async (req, res, next) => { // POST /api/user => 회원가
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });

    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }

    // salt는 10~13 사이로 하는 것이 좋다. (시간이 오래걸림)
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });

    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      attributes: ['id', 'nickname'],
      include: [{
        model: db.Post,
        as: 'Posts',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followers',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followings',
        attributes: ['id'],
      }],
    });

    // 사생활 정보 방지
    // Posts와 Follower, Following들의 id 배열을 내려주는 대신 각각의 갯수만을 Front쪽으로 넘겨주도록 처리
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;

    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/login', (req, res, next) => { // /api/user/login
  // err: 서버에러
  // user : 사용자 정보
  // info : 로직상의 에러
  passport.authenticate('local', (err, user, info) => { // err, user, info => local.js의 done의 첫번째~ 세번쨰 인자
    if (err) {
      console.log(err);
      return next(err);
    }

    if (info) {
      return res.status(401).send(info.reason);
    }

    // 세션에 유저의 id만 저장.
    return req.login(user, async (loginErr) => { // req.user 를 세션에 저장한다.
      if (loginErr) {
        return next(loginErr);
      }

      // 사용자 정보를 json으로 보내준다.
      // const filteredUser = Object.assign({}, user.toJSON());
      // delete filteredUser.password;
      // return res.json(filteredUser);

      const fullUser = await db.User.findOne({
        where: { id: user.id },
        include: [{
          model: db.Post,
          as: 'Posts',
        }, {
          model: db.User,
          as: 'Followings',
        }, {
          model: db.User,
          as: 'Followers',
        }],
        attributes: ['id', 'nickname', 'userId'], // 특정 필드만 얻어온다. (비밀번호 등 제거)
      });

      return res.json(fullUser);
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => { // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send('로그아웃 성공');
});

router.get('/:id/followings', isLoggedIn, async (req, res, next) => { // /api/user/:id/followings
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followers = await user.getFollowings({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => { // /api/user/:id/followers
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    const followers = await user.getFollowers({
      attributes: ['id', 'nickname'],
      limit: parseInt(req.query.limit, 10),
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/follower', isLoggedIn, async (req, res) => { // /api/user/:id/followers
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollower(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/posts', async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) { // lastId가 있는 경우
      where = { // id가 해당 아이디보다 작은 아이들을 가져옴
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // sequalize operator 중 lt(less than)
        },
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0, // 0이 들어왔을때 자기자신으로 판단한다.
        RetweetId: null, // 리트윗한게 아닌 내가쓴 게시글만 불러오기
      };
    } else {
      where = {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0, // 0이 들어왔을때 자기자신으로 판단한다.
        RetweetId: null, // 리트윗한게 아닌 내가쓴 게시글만 불러오기
      };
    }

    const posts = await db.Post.findAll({
      where,
      include: [{
        model: db.User, // 게시글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }, {
        model: db.User, // 게시글을 좋아효 해준사람 목록을 include
        through: 'Like',
        as: 'Likers',
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },
    });
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
