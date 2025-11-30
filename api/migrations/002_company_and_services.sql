-- Company Information table (single record)
CREATE TABLE IF NOT EXISTS company_info (
    id TEXT PRIMARY KEY DEFAULT 'company',
    name TEXT NOT NULL,
    nameEn TEXT NOT NULL,
    address TEXT NOT NULL,
    address2 TEXT,
    established TEXT NOT NULL,
    representative TEXT NOT NULL,
    license TEXT NOT NULL,
    organization TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    hours TEXT NOT NULL,
    closed TEXT,
    logoUrl TEXT,
    greeting TEXT,
    description TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    titleJp TEXT NOT NULL,
    titleVi TEXT NOT NULL,
    descriptionJp TEXT NOT NULL,
    descriptionVi TEXT NOT NULL,
    contentJp TEXT,
    contentVi TEXT,
    images TEXT DEFAULT '[]', -- JSON array of image URLs
    icon TEXT,
    orderIndex INTEGER NOT NULL DEFAULT 0,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_order ON services (orderIndex);

CREATE INDEX IF NOT EXISTS idx_services_active ON services (isActive);