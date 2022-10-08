const express = require('express');
const path = require('path');
const session = require('express-session');
const handlebars = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const sequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Setup handlesbars engine with helpers
const hbs = handlebars.create({ helpers });

const sess = {
  secret: 'secret session',
  cookie: {},
  resave: false,
  saveUnitialized: true,
  store: new sequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// express which template to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now Listening'));
});