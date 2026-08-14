-- Drop old tables
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;

-- Subjects
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  color TEXT DEFAULT '#4F46E5',
  image TEXT,
  "order" INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lessons
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  summary TEXT,
  understanding TEXT,
  key_ideas JSONB DEFAULT '[]',
  important_points JSONB DEFAULT '[]',
  keywords JSONB DEFAULT '[]',
  definitions JSONB DEFAULT '[]',
  formulas JSONB DEFAULT '[]',
  notes TEXT,
  exam_notes TEXT,
  common_mistakes JSONB DEFAULT '[]',
  difficulty TEXT DEFAULT 'MEDIUM',
  status TEXT DEFAULT 'NOT_STARTED',
  is_favorite BOOLEAN DEFAULT false,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Flashcards
CREATE TABLE flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty TEXT DEFAULT 'EASY',
  review_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB DEFAULT '[]',
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  score INTEGER,
  difficulty TEXT
);

-- Achievements
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Statistics
CREATE TABLE statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_subjects INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  overall_progress INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  quiz_average INTEGER DEFAULT 0,
  study_streak INTEGER DEFAULT 0,
  weekly_study_time JSONB DEFAULT '[]',
  monthly_progress JSONB DEFAULT '[]',
  quiz_scores JSONB DEFAULT '[]',
  daily_study_time JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Settings
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'SYSTEM',
  accent_color TEXT DEFAULT '#ec4899',
  font_size INTEGER DEFAULT 16,
  notifications BOOLEAN DEFAULT true,
  auto_save BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'ar'
);

-- Calendar Events
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own subjects" ON subjects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own lessons" ON lessons FOR ALL USING (auth.uid() IN (SELECT user_id FROM subjects WHERE id = lessons.subject_id));
CREATE POLICY "Users own flashcards" ON flashcards FOR ALL USING (auth.uid() IN (SELECT s.user_id FROM subjects s JOIN lessons l ON l.subject_id = s.id WHERE l.id = flashcards.lesson_id));
CREATE POLICY "Users own quizzes" ON quizzes FOR ALL USING (auth.uid() IN (SELECT s.user_id FROM subjects s JOIN lessons l ON l.subject_id = s.id WHERE l.id = quizzes.lesson_id));
CREATE POLICY "Users own reviews" ON reviews FOR ALL USING (auth.uid() IN (SELECT s.user_id FROM subjects s JOIN lessons l ON l.subject_id = s.id WHERE l.id = reviews.lesson_id));
CREATE POLICY "Users own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own statistics" ON statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own settings" ON settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own calendar_events" ON calendar_events FOR ALL USING (auth.uid() = user_id);
