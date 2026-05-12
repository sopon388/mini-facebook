const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({ ...req.body, password: hashed });
  await user.save();
  res.json(user);
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.send('Wrong');
  res.json(user);
});

// 🔥 NEW ROUTE (only added, nothing changed above)
router.get('/users', async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

module.exports = router;