'use strict';
module.exports = (sequelize, DataTypes) => {
  const friendRequests = sequelize.define('friendRequests', {
    requestId: DataTypes.INTEGER,
    requestToId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  friendRequests.associate = function(models) {
    // associations can be defined here
    models.friendRequests.belongsTo(models.users,{as:'inverseUser', foreignKey: 'requestId'})
    models.friendRequests.belongsTo(models.users,{foreignKey: 'requestToId'})
  };
  return friendRequests;
};