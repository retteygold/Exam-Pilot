-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  year_group TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT,
  marks INTEGER DEFAULT 1,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer INTEGER,
  explanation TEXT,
  exam_style BOOLEAN DEFAULT true,
  time_limit INTEGER DEFAULT 60,
  source JSONB,
  table_data JSONB,
  verified BOOLEAN DEFAULT false,
  image_required BOOLEAN DEFAULT false,
  image_page INTEGER,
  image_path TEXT,
  image_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);

-- Enable RLS (Row Level Security)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access" ON questions
  FOR SELECT TO anon USING (true);

-- Allow insert/update for authenticated users (admin only in practice)
CREATE POLICY "Allow admin access" ON questions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
