const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


// 🔥 REGISTER
router.post('/register', async (req, res) => {

  try {

    // 🔥 CHECK EMAIL
    const exist = await User.findOne({ email: req.body.email });

    if (exist) {
      return res.status(400).send('Email already exists');
    }

    // 🔥 HASH PASSWORD
    const hashed = await bcrypt.hash(req.body.password, 10);

    // 🔥 CREATE USER
    const user = new User({
      ...req.body,
      password: hashed
    });

    await user.save();

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).send('Registration failed');
  }

});


// 🔥 LOGIN
router.post('/login', async (req, res) => {

  try {

    const user = await User.findOne({
      email: req.body.email
    });

    // 🔥 USER NOT FOUND
    if (!user) {
      return res.status(400).send('User not found');
    }

    // 🔥 PASSWORD CHECK
    const valid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!valid) {
      return res.status(400).send('Wrong password');
    }

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).send('Login failed');
  }

});


// 🔥 GET USERS
router.get('/users', async (req, res) => {

  try {

    const users = await User.find({}, '-password');

    res.json(users);

  } catch (err) {

    console.log(err);

    res.status(500).send('Failed to load users');
  }

});


module.exports = router;