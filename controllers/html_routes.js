const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

const router = require('express').Router();

router.get('/signin', (req, res) => {
  try{
    const pageTitle = 'Login'
    res.status(200).render('login' , {  pageTitle, logged_in: req.session.logged_in })
  }catch(err) {
    res.status(500).json({ message: `Internal server error: ${err}`});
  }
});


router.get('/', async (req, res) => {
    try {
        if (!req.session.logged_in){
            return res.redirect('/login')
        }
        const blogData = await BlogPost.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        const blogs = blogData.map((blog) => blog.get({ plain: true }));
        console.log(blogs);
        const pageTitle = 'Home';
        res.status(200).render('homepage', { pageTitle, blogs, logged_in: req.session.logged_in });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
      const pageTitle = 'Dashboard';
      res.status(200).render('dashboard', { pageTitle, logged_in: req.session.logged_in})
    }catch(err) {
      console.log(err)
      res.status(500).json({ message: `Internal server error: ${err}`})
    }
});



module.exports = router;
