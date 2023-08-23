const { db, table } = require('../db.config.js')
const jwt = require('jsonwebtoken')
const passport = require('passport');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const client = require('./Redis.js')


// Function to retrieve a user by ID (assuming the ID is unique)
const getUserById = async (id) => {
  const params = {
    TableName: table,
    Key: {
      id,
    },
  };
  const result = await db.get(params).promise();
  return result.Item;
};
// Function to retrieve a user by eamil (assuming the email is unique)
const getUserByEmail = async (email) => {
  const params = {
    TableName: table,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };
  const result = await db.scan(params).promise();
  return result.Items[0];
};


// Create users
const SignupUser = async (req, res) => {
  const { firstname, lastname, email, password, id } = req.body;
  try {
    const scanParams = {
      TableName: table,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };
    const existingUser = await db.scan(scanParams).promise();
    if (existingUser.Items.length > 0) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      const params = {
        TableName: table,
        Item: {
          id,
          firstname,
          lastname,
          email,
          password,
        },
      };
      await db.put(params).promise();
      res.json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

//loginuser
const LoginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ error: info.message });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7h' });
    client.SET('token', token);

    return res.json({ message: 'Login successful', token, userdetails: req.body });
  })(req, res, next);
};


// getAllusers
const ReadAllUsers = async (req, res) => {
  const params = {
    TableName: table
  }
  try {
    const result = await db.scan(params).promise();
    res.json(result.Items);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}


//SessionDistroy
const SessionDestroy = async (req, res) => {
  req.session.destroy(function (e) {
    res.redirect('/');
  });
}


module.exports = {
  SignupUser, LoginUser, ReadAllUsers, getUserByEmail, getUserById, SessionDestroy
}