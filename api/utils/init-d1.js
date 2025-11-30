/**
 * Initialize D1 Database schema and create default admin user
 * Run with: bun utils/init-d1.js
 *
 * This script will:
 * 1. Create all database tables and indexes
 * 2. Create a default admin user (if one doesn't exist)
 *
 * Admin credentials can be customized via .env:
 * - ADMIN_USERNAME (default: "admin")
 * - ADMIN_EMAIL (default: "admin@unicoland.com")
 * - ADMIN_PASSWORD (default: "admin123")
 */

import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
config({ path: resolve(__dirname, "../.env") });
import { readFileSync } from "fs";
import { getD1Client } from "../src/config/database.js";
import { User } from "../src/models/User.js";
import { hash } from "../src/utils/password.js";

// Helper to execute SQL statements
const executeSQL = async (db, sql) => {
  // Remove comments and split by semicolons
  const lines = sql.split("\n");
  let currentStatement = "";
  const statements = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("--")) {
      continue;
    }

    currentStatement += line + "\n";

    // If line ends with semicolon, it's a complete statement
    if (trimmed.endsWith(";")) {
      const stmt = currentStatement.trim();
      if (stmt && stmt !== ";") {
        statements.push(stmt);
      }
      currentStatement = "";
    }
  }

  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  console.log(`📝 Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;

    try {
      // Execute on remote D1 database
      await db.exec(statement);
      console.log(`✓ [${i + 1}/${statements.length}] Executed`);
    } catch (error) {
      // Ignore "already exists" errors
      if (
        error.message?.includes("already exists") ||
        error.message?.includes("duplicate") ||
        error.message?.includes("UNIQUE constraint") ||
        error.message?.includes("already in use")
      ) {
        console.log(
          `⚠ [${i + 1}/${statements.length}] Already exists (skipped)`
        );
      } else {
        console.error(
          `✗ [${i + 1}/${statements.length}] Error:`,
          error.message
        );
        console.error(
          `  Statement preview: ${statement
            .substring(0, 150)
            .replace(/\n/g, " ")}...`
        );
        throw error;
      }
    }
  }
};

// Helper to create default admin user
const createDefaultAdmin = async (db) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne(db, { role: "admin" });
    if (existingAdmin && existingAdmin.id) {
      console.log(
        "ℹ️  Admin user already exists:",
        existingAdmin.email || existingAdmin.username || existingAdmin.id
      );
      return;
    }

    // Get admin credentials from environment or use defaults
    const username = process.env.ADMIN_USERNAME || "admin";
    const email = process.env.ADMIN_EMAIL || "unico@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Unico@2025";

    // Hash password
    const hashedPassword = await hash(password);

    // Create admin user
    const admin = await User.create(db, {
      username,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    if (admin && admin.id) {
      console.log("✅ Default admin user created successfully!");
      console.log("📧 Email:", admin.email);
      console.log("👤 Username:", admin.username);
      console.log("🔑 Password:", password);
      console.log("⚠️  Please change the password after first login!");
    } else {
      console.error("⚠️  Warning: Admin user creation returned invalid result");
      console.error("   Result:", admin);
    }
  } catch (error) {
    console.error("⚠️  Warning: Could not create admin user:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    // Don't fail the entire script if admin creation fails
  }
};

const initD1 = async () => {
  try {
    const db = await getD1Client();
    console.log("✅ Connected to D1 Database");

    // Read SQL schema
    const schema = readFileSync("./migrations/001_initial_schema.sql", "utf-8");

    console.log("📝 Executing SQL schema...");
    await executeSQL(db, schema);

    console.log("✅ Database schema initialized successfully!");

    // Read and execute additional migrations
    try {
      const migration2 = readFileSync("./migrations/002_company_and_services.sql", "utf-8");
      console.log("\n📝 Executing migration 002 (company and services)...");
      await executeSQL(db, migration2);
      console.log("✅ Migration 002 completed successfully!");
    } catch (error) {
      // Migration file might not exist yet, that's okay
      if (error.code !== "ENOENT") {
        console.error("⚠️  Warning: Could not execute migration 002:", error.message);
      }
    }

    // Create default admin user
    console.log("\n👤 Creating default admin user...");
    await createDefaultAdmin(db);

    console.log("\n🎉 Database initialization complete!");
    console.log("\n💡 Next step: Run 'bun utils/seed-data.js' to seed initial company and service data");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

initD1();
