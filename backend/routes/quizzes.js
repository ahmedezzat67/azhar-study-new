const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const results = await prisma.quizResult.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(results);
});

router.post('/', auth, async (req, res) => {
  const { score, total } = req.body;
  const result = await prisma.quizResult.create({
    data: { score, total, userId: req.user.id }
  });
  res.json(result);
});

module.exports = router;
