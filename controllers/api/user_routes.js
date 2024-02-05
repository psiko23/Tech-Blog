const router = require('express').Router();
const {User} = require('../../models');

router.get('/', async (req, res) => {
    try{
        const users = await User.findAll();
        res.json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}`});
    }
});

router.post('/signup', async (req, res) => {
    try{
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
});

router.post('/login', async (req, res) => {
    try{
        const userData = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        console.log(userData)

        if (!userData) {
            res.status(400).json({ message: `Incorrect email or password` });
            return
        }

        const validatePw = await userData.checkPassword(req.body.password);
        if (!validatePw) {
            res.status(400).json({ message: `Incorrect email or password` });
            return
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
        });

        res.status(200).redirect('/dashboard')

    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
});

router.post('/logout', async (req, res) => {
    try{
        if (req.session.logged_in) {
            req.session.destroy(() => {
                res.status(200).json(`logged out successfully`).end();
            })
        } else {
            res.status(204).end();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
});

module.exports = router;