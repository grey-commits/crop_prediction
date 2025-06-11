const express = require('express');
const router = express.Router();
const { signup, login } = require('./authController');

router.post('/signup', signup);
router.post('/login', login);

// Fallback for unknown routes
router.use((req, res) => {
  res.status(404).json({ message: "Auth route not found" });
});

module.exports = router;