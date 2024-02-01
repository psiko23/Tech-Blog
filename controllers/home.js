const router = require('express').Router();

router.get('/', (req, res) => {
    try{
        res.json(`Successful get request`)
    } catch(err) {
        res.status(500).json(`Error going home`);
    }
});

module.exports = router;