const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/statistics', require('./routes/statistics'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Azhar Study API is running!' }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
