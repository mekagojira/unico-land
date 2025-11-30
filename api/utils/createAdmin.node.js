/**
 * Utility script to create an admin user (Node.js version)
 * Use this if Bun has TLS issues
 * Run with: node utils/createAdmin.node.js
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");
const crypto = require("crypto");

// Simple password hash for Node.js (using built-in crypto)
const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 100000, 32, "sha256", (err, derivedKey) => {
      if (err) reject(err);
      const combined = Buffer.concat([salt, derivedKey]);
      resolve(combined.toString("base64"));
    });
  });
};

const createAdmin = async () => {
  let client;
  try {
    const mongoUri = process.env.MONGODB_URI;
    const databaseName = process.env.MONGODB_DATABASE || "uni-co-cms";

    if (!mongoUri) {
      console.error("❌ MONGODB_URI not set in .env file");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(databaseName);
    const usersCollection = db.collection("unicoland_users");

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists:", existingAdmin.email);
      await client.close();
      process.exit(0);
    }

    // Get admin credentials from environment or use defaults
    const username = process.env.ADMIN_USERNAME || "admin";
    const email = process.env.ADMIN_EMAIL || "unico@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "Unico@2025";

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const now = new Date().toISOString();
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("👤 Username:", username);
    console.log("🔑 Password:", password);
    console.log("⚠️  Please change the password after first login!");

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        // Ignore close errors
      }
    }
    process.exit(1);
  }
};

createAdmin();
