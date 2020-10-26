const passport = require('passport');
const { Strategy : LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'userId', // req.body의 'userId' 필드
    passwordField: 'password', // req.body의 'password' 필드
  }, async (userId, password, done) => {
    // 로그인 전략 수행
    try {
      const user = await db.User.findOne({ where: { userId }});

      if (!user) {
        return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
      }

      // 사용자가 있을때 비밀번호 비교.
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }

      return done(null, false, { reason: '비밀번호가 틀립니다.' });
    } catch (e) {
      // 서버 에러가 난경우 첫번째 인자로 담아서 보내준다.
      console.error(e);
      return done(e);
    }
  }));
};
