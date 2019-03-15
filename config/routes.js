const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

const { authenticate } = require('../auth/authenticate');
const db = require('../database/dbConfig');
const jwtKey =
  process.env.JWT_SECRET ||
  'add a .env file to root of project with the JWT_SECRET variable';

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  // implement user registration
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'Error registering user. Username and password required.' });
    return;
  } else {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    try {
      const [id] = await db('users').insert(user);
      const registeredUser = await db('users').where({ id }).first();
      res.status(201).json(registeredUser);
    } catch (error) {
      res.status(500).json({ message: 'Error registering user. Username may already be taken.', error });
    }
  }
}

async function login(req, res) {
  // implement user login
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'Error logging in. Username and password required.' });
    return;
  } else {
    let { username, password } = req.body;
    try {
      const user = await db('users').where({ username }).first();
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = loginToken(user); 
        res.status(200).json({
          token,
          message: `Welcome ${user.username}.`
        });
      } else {
        res.status(401).json({ message: 'Error logging in. Invalid Credentials.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in.', error });
    }
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function loginToken(user) {
  const payload = {
    subject: user.id, 
    username: user.username,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, jwtKey, options);
}