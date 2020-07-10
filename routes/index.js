const express = require('express')
const router = express.Router();
const { checkAuth, checkGuest } = require('../middleware/auth')
const Story = require('../models/Story');

//@desc LOGIN/LANDING
//@route GET /
router.get('/', checkGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

//@desc DASHBOARD
//@route GET /dashboard
router.get('/dashboard', checkAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        });
    } catch (error) {
        res.render('error/500')
    }

})


module.exports = router;