const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

const apiRouter = require('./server-src/routes/api');

const allowedOrigins = process.env.PRODUCTION === 'true' ?
  ['http://work-delay.herokuapp.com'] : ['http://localhost:3333', 'http://localhost:8080'];

const undefinedSession = require('./server-src/middlewares/undefined-session');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  store: new pgSession({
    pool: pgPool,
  }),
  secret: process.env.COOKIE_SECRET || 'workdelayapp',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 30 * 24 * 60 * 60 * 1000, // 30 days
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use(undefinedSession);

// middleware function to check for logged-in users


// initialize static client
app.use(express.static(__dirname + '/dist/work-delay'));

// routes
app.use('/api', apiRouter);

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/work-delay/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
  if (error) {
    return console.log('Something bad happened', error)
  }
  console.log(`Server is listening on port: ${port}`);
});
