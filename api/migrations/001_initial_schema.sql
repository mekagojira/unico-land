-- Initial schema for D1 Database
-- Run with: wrangler d1 execute DB --local --file=migrations/001_initial_schema.sql
-- Or: bun run init-d1
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Contents table
CREATE TABLE IF NOT EXISTS contents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    type TEXT NOT NULL DEFAULT 'post' CHECK (type IN ('page', 'post', 'news', 'announcement')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featuredImage TEXT,
    authorId TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'jp' CHECK (locale IN ('jp', 'vi')),
    metadata TEXT DEFAULT '{}',
    publishedAt TEXT,
    tags TEXT DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users (id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contents_slug_locale ON contents (slug, locale);

CREATE INDEX IF NOT EXISTS idx_contents_status_type ON contents (status, type);

CREATE INDEX IF NOT EXISTS idx_contents_publishedAt ON contents (publishedAt);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);