/**
 * Content model using ORM pattern
 * Extends BaseModel for database-agnostic operations
 */

import { BaseModel } from "../orm/BaseModel.js";

export class Content extends BaseModel {
  constructor(data = {}) {
    super(data);

    // Parse JSON fields if they come as strings from database
    if (typeof data.metadata === "string") {
      try {
        this.metadata = JSON.parse(data.metadata);
      } catch (e) {
        this.metadata = {};
      }
    } else {
      this.metadata = data.metadata || {};
    }

    if (typeof data.tags === "string") {
      try {
        this.tags = JSON.parse(data.tags);
      } catch (e) {
        this.tags = [];
      }
    } else {
      this.tags = data.tags || [];
    }

    // Set defaults
    this.type = data.type || "post";
    this.status = data.status || "draft";
    this.locale = data.locale || "jp";
    this.authorId = data.authorId || data.author;
    this.author = data.author; // Populated author object
  }

  /**
   * Get table name
   */
  static getTableName() {
    return "contents";
  }

  /**
   * Count documents (alias for backward compatibility)
   */
  static async countDocuments(db, filter = {}) {
    return await this.count(db, filter);
  }

  /**
   * Find content by slug
   */
  static async findBySlug(db, slug, locale = null) {
    const filter = { slug };
    if (locale) {
      filter.locale = locale;
    }
    return await this.findOne(db, filter);
  }

  /**
   * Custom create to handle author field
   */
  static async create(db, data) {
    // If author is provided as an object, extract the ID
    if (data.author && typeof data.author === "object" && data.author.id) {
      data.authorId = data.author.id;
    } else if (data.author && typeof data.author === "string") {
      data.authorId = data.author;
    }

    // Set publishedAt if status is published
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    return await super.create(db, data);
  }

  /**
   * Custom save to handle JSON fields
   */
  async save(db) {
    // Create a copy for saving with stringified JSON fields
    const dataToSave = { ...this };

    // Stringify JSON fields before saving
    if (this.metadata && typeof this.metadata === "object") {
      dataToSave.metadata = JSON.stringify(this.metadata);
    }

    if (this.tags && Array.isArray(this.tags)) {
      dataToSave.tags = JSON.stringify(this.tags);
    }

    // Set publishedAt if status is published
    if (this.status === "published" && !this.publishedAt) {
      dataToSave.publishedAt = new Date().toISOString();
      this.publishedAt = dataToSave.publishedAt;
    }

    // Use the adapter directly to save with stringified JSON
    const adapter = this.constructor.getAdapter(db);
    const Model = this.constructor;
    const tableName = Model.getTableName();
    const primaryKey = Model.getPrimaryKey();

    if (!this[primaryKey]) {
      throw new Error(`Cannot save: ${primaryKey} is required`);
    }

    // Update timestamp
    dataToSave.updatedAt = new Date().toISOString();
    this.updatedAt = dataToSave.updatedAt;

    // Build UPDATE query
    const columns = Object.keys(dataToSave);
    const setClause = columns
      .filter(
        (col) => col !== primaryKey && col !== "createdAt" && col !== "author"
      )
      .map((col) => `${col} = ?`)
      .join(", ");

    const values = columns
      .filter(
        (col) => col !== primaryKey && col !== "createdAt" && col !== "author"
      )
      .map((col) => {
        const val = dataToSave[col];
        if (typeof val === "boolean") return val ? 1 : 0;
        return val;
      });

    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${primaryKey} = ?`;
    values.push(this[primaryKey]);

    const stmt = db.prepare(sql);
    await stmt.bind(...values).run();

    return this;
  }

  /**
   * Delete content (alias for backward compatibility)
   */
  async deleteOne(db) {
    return await this.delete(db);
  }
}
