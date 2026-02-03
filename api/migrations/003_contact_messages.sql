-- Contact messages (send message to page admin)
-- Run with: wrangler d1 execute DB --local --file=migrations/003_contact_messages.sql

CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    isRead INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_createdAt ON contact_messages (createdAt);
CREATE INDEX IF NOT EXISTS idx_contact_messages_isRead ON contact_messages (isRead);
