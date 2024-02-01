const router = require('express').Router();

const homeRoutes = require('./home');
const dashRoutes = require('./dashboard');

router.use('/home', homeRoutes);
// router.use('/dashboard', dashRoutes);

module.exports = router;