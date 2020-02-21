'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {});
  users.associate = function(models) {
    // associations can be defined here
    models.users.hasMany(models.friendRequests,{foreignKey: 'requestToId'})
    models.users.hasMany(models.friendRequests,{as:'inverseFriends',foreignKey: 'requestId'})
  };
  return users;
};