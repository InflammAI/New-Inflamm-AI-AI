-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(44) UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_tap_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);

-- Tap history table
CREATE TABLE IF NOT EXISTS tap_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  tapped_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tap_history_user_date ON tap_history(user_id, tapped_at DESC);

-- Daily streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_tap_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Function to get user's rank
CREATE OR REPLACE FUNCTION get_user_rank(user_wallet VARCHAR(44))
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO user_rank
  FROM users u1
  WHERE u1.total_points > (
    SELECT total_points FROM users WHERE wallet_address = user_wallet
  );
  RETURN user_rank;
END;
$$ LANGUAGE plpgsql;

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON user_streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Telegram wallet bindings table (permanent wallet connections for Telegram users)
CREATE TABLE IF NOT EXISTS telegram_wallet_bindings (
  telegram_user_id VARCHAR(255) PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL UNIQUE,
  wallet_type VARCHAR(20) NOT NULL CHECK (wallet_type IN ('solana', 'ton')),
  bound_at TIMESTAMP DEFAULT NOW(),
  bound_via VARCHAR(50) DEFAULT 'telegram_mini_app',
  UNIQUE(telegram_user_id),
  UNIQUE(wallet_address)
);

CREATE INDEX IF NOT EXISTS idx_telegram_bindings_wallet ON telegram_wallet_bindings(wallet_address);
CREATE INDEX IF NOT EXISTS idx_telegram_bindings_type ON telegram_wallet_bindings(wallet_type);

-- TON proof nonces table (for replay protection)
CREATE TABLE IF NOT EXISTS ton_proof_nonces (
  nonce VARCHAR(255) PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ton_nonces_wallet ON ton_proof_nonces(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ton_nonces_created ON ton_proof_nonces(created_at);
