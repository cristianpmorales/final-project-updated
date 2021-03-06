// server.js

// set up ======================================================================
require( './db' );
// mongoose
// get all the tools we need
const cool = require('cool-ascii-faces')
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var routes = require( './routes/index.js' );
var people = require( './routes/people.js' );
var createCampaign = require( './routes/completedcampaign.js' );
var canvasQuestion = require( './routes/canvasQuestion.js' );
var completeL = require( './routes/completeList.js' );
//var configDB = require('./config/database.js');
var static         = require( 'serve-static' );
var path           = require( 'path' );


var db

// configuration ===============================================================
mongoose.connect('mongodb://demo123:demo123@ds127851.mlab.com:27851/authenticate', { useMongoClient: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2018a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
// require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport
//routes to the canvasser page
app.get(  '/',               routes.indexpeople );
app.get(  '/editpeople/:id', routes.editpeople );
// app.post( '/updatepeople/:id',routes.updatepeople );


//Routes to the admin page
app.get(  '/profile',           people.indexpeople);
app.post( '/createpeople',      people.createpeople);
app.get(  '/destroypeople/:id', people.destroypeople );
app.get(  '/editpeople/:id',    people.editpeople );
app.post( '/updatepeople/:id',  people.updatepeople );
app.get(  '/completedlist',     completeL.indexpeople);

//Routes to create an election
app.get(  '/create_campaign',   createCampaign.indexcampaign);
app.post( '/createcampaign',    createCampaign.createcampaign);
app.get(  '/destroycampaign/:id', createCampaign.destroycampaign );
app.get(  '/editcampaign/:id',    createCampaign.editcampaign );
app.post( '/updatecampaign/:id',  createCampaign.updatecampaign );

//routes to the Canvasser question page
app.get(  '/canvasQuestion',   canvasQuestion.indexcanvas );
app.post( '/edit/:id',         canvasQuestion.editcanvas );
app.post( '/update/:id',       canvasQuestion.updatecanvas );

app.use( static( path.join( __dirname, 'public' )));
// launch ======================================================================
app.listen(port);
console.log('Express server listening on port ' + port);
