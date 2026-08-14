const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { subjectId } = req.query;
  const lessons = await prisma.lesson.findMany({
    where: { subjectId, subject: { userId: req.user.id } },
    include: { flashcards: true }
  });
  res.json(lessons);
});

router.post('/', auth, async (req, res) => {
  const { subjectId } = req.body;
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId: req.user.id }
  });
  if (!subject) return res.status(403).json({ error: 'Not your subject' });

  const lesson = await prisma.lesson.create({ data: req.body });
  res.json(lesson);
});

router.get('/:id', auth, async (req, res) => {
  const lesson = await prisma.lesson.findFirst({
    where: { id: req.params.id, subject: { userId: req.user.id } },
    include: { flashcards: true }
  });
  res.json(lesson);
});

router.put('/:id', auth, async (req, res) => {
  const lesson = await prisma.lesson.updateMany({
    where: { id: req.params.id, subject: { userId: req.user.id } },
    data: req.body
  });
  res.json(lesson);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.lesson.deleteMany({
    where: { id: req.params.id, subject: { userId: req.user.id } }
  });
  res.json({ success: true });
});

module.exports = router;
