const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const stats = await prisma.statistics.findUnique({
    where: { userId: req.user.id }
  });
  res.json(stats || { totalStudyHours: 0, streakDays: 0, lessonsCompleted: 0 });
});

router.put('/', auth, async (req, res) => {
  const stats = await prisma.statistics.upsert({
    where: { userId: req.user.id },
    update: req.body,
    create: { ...req.body, userId: req.user.id }
  });
  res.json(stats);
});

module.exports = router;
