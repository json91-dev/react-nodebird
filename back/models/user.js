module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    charset: 'utf-8',
    collate: 'utf-_general_ci',
  });
  
  User.associate = (db) => {
  
  };
  
  return User;
};
