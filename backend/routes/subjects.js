const express = require('express');
const { auth } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const subjects = await prisma.subject.findMany({
    where: { userId: req.user.id },
    include: { _count: { select: { lessons: true } } }
  });
  res.json(subjects);
});

router.post('/', auth, async (req, res) => {
  const subject = await prisma.subject.create({
    data: { ...req.body, userId: req.user.id }
  });
  res.json(subject);
});

router.get('/:id', auth, async (req, res) => {
  const subject = await prisma.subject.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { lessons: true }
  });
  res.json(subject);
});

router.put('/:id', auth, async (req, res) => {
  const subject = await prisma.subject.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data: req.body
  });
  res.json(subject);
});

router.delete('/:id', auth, async (req, res) => {
  await prisma.subject.deleteMany({
    where: { id: req.params.id, userId: req.user.id }
  });
  res.json({ success: true });
});

module.exports = router;
