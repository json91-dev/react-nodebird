module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickname: {
      type: DataTypes.STRING(20), // 20글자 이하
      allowNull: false, // 필수 : false이면 필수 값.
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // 고유한 값
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // utf-8 설정 : 한글이 저장됨.
    // tableName: 'users', => 햇깔리면 달아두기
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post, { as: 'Posts' }); // User는 많은 Post를 가지고 있다. : 게시글
    db.User.hasMany(db.Comment); // User는 많은 Comment를 가지고 있다. : 댓글
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' }); // User는 많은 Follower(User)를 가지고 있다. : 유저가 팔로워 하는 사람들
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' }); // User는 많은 Following(User)를 가지고 있다. : 유저를 팔로잉하는 사람들
  };

  return User;
};

