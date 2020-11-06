const express = require('express');
const bcrypt = require('bcrypt');
const passport = require("passport");
const db = require('../models');

const router = express.Router();

// API는 다른 서비스가 내 서비스의 기능을 실행 할 수 있게 열어둔 창구
// router.post('/api/user', (req, res) => { => /api/user 부분을 /로 대체

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

    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get('/', (req, res) => { // /api/user
  if (!req.user) { // cookie를 검사하여 deserialize user가 해당 user를 만들어 준다.
    return res.status(401).send('로그인이 필요합니다.');
  }

  // 패스워드를 response로 보내는것을 방지
  const user = Object.assign({}, req.user.toJSON()); // db에서 꺼내온 객체이기 떄문에 toJSON을 붙여줘야함.
  delete user.password;
  return res.json(user);
});

router.post('/logout', (req, res) => { // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send('로그아웃 성공');
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

      console.log(fullUser);

      return res.json(fullUser);
    });
  })(req, res, next);
});

router.get('/:id/follow', (req, res) => { // /api/user/:id/follow

});

router.post('/:id/follow', (req, res) => {

});

router.delete('/:id/follow', (req, res) => {

});

router.delete('/:id/follower', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

module.exports = router;
