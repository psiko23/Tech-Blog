const User = require('./user');
const BlogPost = require('./blog_post');
const Comment = require('./comment');

BlogPost.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(BlogPost, { foreignKey: 'user_id' });

Comment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });

Comment.belongsTo(BlogPost, { foreignKey: 'blogpost_id' });
BlogPost.hasMany(Comment, { foreignKey: 'blogpost_id' });

module.exports = { User, BlogPost, Comment };