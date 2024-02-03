const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
};

User.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [4, 30],  
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8,255],
        }
    }
  },
  {
    hooks: {
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 10);
          return user;
        },
        beforeUpdate: async (user) => {
          user.password = await bcrypt.hash(user.password, 10);
          return user;
        }
      },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
    timestamps: false,
  }
);

module.exports = User;