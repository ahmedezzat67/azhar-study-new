const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reviews);
});

router.post('/', auth, async (req, res) => {
  const review = await prisma.review.create({
    data: { ...req.body, userId: req.user.id }
  });
  res.json(review);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.review.deleteMany({
    where: { id: req.params.id, userId: req.user.id }
  });
  res.json({ success: true });
});

module.exports = router;
