const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { lessonId } = req.query;
  const cards = await prisma.flashcard.findMany({
    where: { lessonId, lesson: { subject: { userId: req.user.id } } }
  });
  res.json(cards);
});

router.post('/', auth, async (req, res) => {
  const card = await prisma.flashcard.create({ data: req.body });
  res.json(card);
});

router.put('/:id', auth, async (req, res) => {
  const card = await prisma.flashcard.updateMany({
    where: { id: req.params.id, lesson: { subject: { userId: req.user.id } } },
    data: req.body
  });
  res.json(card);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.flashcard.deleteMany({
    where: { id: req.params.id, lesson: { subject: { userId: req.user.id } } }
  });
  res.json({ success: true });
});

module.exports = router;
