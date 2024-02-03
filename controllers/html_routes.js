const router = require('express').Router();



router.get('/', async (req, res) => {
    try{
        if (!req.session.loggedIn){
            res.redirect('/login')
        }

    } catch(err) {
        res.status(500)
        console.log(`Internal server error: ${err}`);
    }
});


router.get('/home', async (req, res) => {
  try {
    const pageTitle = 'Home';
    res.status(200).render('homepage', { pageTitle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
