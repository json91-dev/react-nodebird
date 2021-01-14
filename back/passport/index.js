const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
  // 이때 서버쪽에 [{id: 3, cookie: 'asdfgh'}]라고 저장을 해둠
  // 이후 프론트로 쿠키는 프론트로 보내줌
  // 프론트에서 cookie를 다시 서버로 보내면 해당 쿠키에 대한 User테이블의 id를 알수 있기 때문에 어떤 User인지 알 수 있음
  // 이것을 Serialize라고 표현함.
  passport.serializeUser((user, done) => {
    return done(null, user.id); // 아이디만 서버에 저장한다.
  });

  // 아이디로 유저정보를 다시 찾아온다.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
      });

      return done(null, user); // req.user에 불러온 유저 정보를 저장함.
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};
