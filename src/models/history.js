'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // History.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'infor'})
      // History.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctor'})
      // History.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeHistory'})
    }
  };
  History.init({
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    timeType: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};