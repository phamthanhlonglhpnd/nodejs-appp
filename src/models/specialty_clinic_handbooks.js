'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty_Clinic_Handbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialty_Clinic_Handbook.belongsTo(models.Specialty, { foreignKey: 'specialtyId', targetKey: 'id', as: 'specialtyHandbook'})
    }
  };
  Specialty_Clinic_Handbook.init({
    title: DataTypes.TEXT,
    image: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Specialty_Clinic_Handbook',
  });
  return Specialty_Clinic_Handbook;
};