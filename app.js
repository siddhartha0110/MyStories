const express = require('express')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphand = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')
const methodOverride = require('method-override');
// Load config
dotenv.config({ path: './config/config.env' })

//passport
require('./config/passport')(passport)

connectDB();
const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//Morgan logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// handlebars
app.engine('.hbs', exphand({ helpers: { formatDate, truncate, stripTags, editIcon, select }, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs');

//session
app.use(session({
    secret: 'story cat dof',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Global variables User
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});
//static
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
