const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class BlogPost extends Model {};

BlogPost.init(
    {
        user: {

        },
        title: {

        },
        body: {

        },
        dateCreated: {

        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'blogpost',
    }
);

module.exports = BlogPost;