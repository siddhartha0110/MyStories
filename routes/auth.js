const express = require('express')
const router = express.Router();
const passport = require('passport');
//@desc Google Auth
//@route GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

//@desc Google Auth Callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    })

//@desc Logout User
//@route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router;