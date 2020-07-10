module.exports = {
    checkAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/');
        }
    },
    checkGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        }
        else {
            return next();
        }
    }
}