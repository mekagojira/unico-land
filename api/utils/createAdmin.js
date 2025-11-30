/**
 * Utility script to create an admin user
 * Run with: bun utils/createAdmin.js
 */

import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
config({ path: resolve(__dirname, "../.env") });
import { User } from "../src/models/User.js";
import { getD1Client } from "../src/config/database.js";
import { hash } from "../src/utils/password.js";

const createAdmin = async () => {
  let db;
  try {
    // Get D1 client
    db = await getD1Client();
    console.log("✅ Connected to D1 Database");

    // Check if admin already exists
    const existingAdmin = await User.findOne(db, { role: "admin" });
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists:", existingAdmin.email);
      process.exit(0);
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

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("👤 Username:", admin.username);
    console.log("🔑 Password:", password);
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

createAdmin();
