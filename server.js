const express = require('express');

const routes = require('./controllers');
const sequelize = require('./config/connection');
//access the style.css sheet
const path = require('path');
//require handlebar
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

//set up express session and connect session to our sequelize database
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

//set up handlebar as this app's tamplte engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//access stylesheet
//The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. 
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
//The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening on Port' ,{PORT}));
});