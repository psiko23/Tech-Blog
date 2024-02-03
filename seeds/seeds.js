const { User, BlogPost } = require('../models');
const sequelize = require('../config/connection');

const userSeeds = [
    {
        username: 'Jimothy James',
        email: 'jimothyjames@email.com',
        password: 'Password1234',
    },
    {
        username: 'Sara Steets',
        email: 'sarasteets@email.com',
        password: 'Password1234',
    },
    {
        username: 'Morgan Braswell',
        email: 'morganbraswell@email.com',
        password: 'Password1234',
    },
];

const blogData = [
    {
        title: 'First Blog Post',
        body: 'This is my first blog post! My name is Jimothy James and I love tech!',
        user_id: 1,
    },
    {
        title: 'Introduction',
        body: 'Hello! This is my first blog post! My name is Sara Steets and I am bloggin it up!',
        user_id: 2,
    },
    {
        title: 'Introduction',
        body: 'Hello! This is my first blog post! My name is Morgan Braswell and I am always trying to keep up to date with new tech!',
        user_id: 3,
    },
];

const seedBlogs = async () => await BlogPost.bulkCreate(blogData);

const seedUsers = async () => await User.bulkCreate(userSeeds);

const seedAll = async () => {
    await sequelize.sync({ force: true });
    await seedUsers();
    await seedBlogs();
    process.exit(0);
};

seedAll();

