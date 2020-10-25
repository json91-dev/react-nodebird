const passport = require('passport');
const db = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => { // 서버쪽에 [{id: 3, cookie: 'asdfh}]
    return done(null, user.id);
  });

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
};
