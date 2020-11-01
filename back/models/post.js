module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT, // 매우 긴 글
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // 한글 + 이모티콘 (이모티콘이 가능한 언어타입)
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // Post들은 User에 속해있다. => 테이블에 UserId 컬럼이 생긴다.
    db.Post.hasMany(db.Comment); // Post는 많은 Comment를 가지고 있다.
    db.Post.hasMany(db.Image); // Post는 많은 Image들을 가지고 있다.
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // Post(rewteet)는 Post에 속해있다. => 테이블에 RetweetId 이름이 생긴다. => PostId로 하면 햇깔리기 때문
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // Post와 Hashtag는 다대다 관계이다.
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // Post와 User는 다대다 관계이다. Post의 입장에서 Likers
  };
  return Post;
};
