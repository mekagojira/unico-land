/**
 * User model using ORM pattern
 * Extends BaseModel for database-agnostic operations
 */

import { BaseModel } from "../orm/BaseModel.js";
import { compare } from "../utils/password.js";

export class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    // Set defaults
    this.role = data.role || "viewer";
    this.isActive = data.isActive !== undefined ? data.isActive : 1;
  }

  /**
   * Get table name
   */
  static getTableName() {
    return "users";
  }

  /**
   * Convert to JSON (exclude password)
   */
  toJSON() {
    const obj = { ...this };
    delete obj.password;
    return obj;
  }

  /**
   * Compare password with hashed password
   */
  async comparePassword(candidatePassword) {
    return await compare(candidatePassword, this.password);
  }

  /**
   * Custom findOne that handles $or operator for email/username
   */
  static async findOne(db, filter) {
    // Handle $or operator specially for login queries
    if (filter.$or) {
      const adapter = this.getAdapter(db);
      const tableName = this.getTableName();
      const { query, params } = adapter.buildWhereClause(filter, tableName);
      const sql = `SELECT * FROM ${tableName} WHERE ${query} LIMIT 1`;

      const stmt = db.prepare(sql);
      const result = await stmt.bind(...params).first();

      return result ? new User(result) : null;
    }

    // Use base implementation for other queries
    return await super.findOne(db, filter);
  }
}
