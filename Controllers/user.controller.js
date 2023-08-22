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

//GoogleAuthFail
const AuthFail = (req, res) => {
  res.send("something went wrong")
}


//GoogleAuthSuccess
const AuthSuccess = async (req, res) => {
  res.send(req.user.displayName)
}

//SessionDistroy
const SessionDestroy = async (req, res) => {
  req.session.destroy(function (e) {
    res.redirect('/');
  });
}


//GithubAuth
const GithubAuth = async (req, res) => {
  const { code } = req.query
  console.log(code)
  try {
    let accessToken = await fetch('https://github.com/login/oauth/access_token', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        "content-type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.Gihub_Clinet_ID,
        client_secret: process.env.Gihub_Client_Secret,
        code: code
      })
    })
     .then((res) => res.json())
    const userdetails = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`
      }
    }).then((res) => res.json())
    
    res.send(userdetails)
    
  } catch (error) {
    res.send(error)
  }

}
module.exports = {
  GithubAuth, SignupUser, LoginUser, ReadAllUsers, getUserByEmail, getUserById, AuthFail, AuthSuccess, SessionDestroy
}