import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Cliente = sequelize.define("Cliente", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING, allowNull: false, unique: true },
  empresa: { type: DataTypes.STRING },
  celular: { type: DataTypes.STRING },
});

export default Cliente;
