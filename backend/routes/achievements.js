const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const achievements = await prisma.achievement.findMany({
    where: { userId: req.user.id }
  });
  res.json(achievements);
});

router.post('/', auth, async (req, res) => {
  const achievement = await prisma.achievement.create({
    data: { ...req.body, userId: req.user.id }
  });
  res.json(achievement);
});

module.exports = router;
