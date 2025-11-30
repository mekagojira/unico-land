/**
 * Base Model class for ORM-like functionality
 * Supports multiple database backends (D1, MongoDB, PostgreSQL, etc.)
 */

import { D1Adapter } from "./adapters/D1Adapter.js";

export class BaseModel {
  constructor(data = {}) {
    // Copy all properties from data to this instance
    Object.assign(this, data);
  }

  /**
   * Convert model instance to JSON (exclude sensitive fields)
   */
  toJSON() {
    const obj = { ...this };
    // Override in subclasses to exclude sensitive fields
    return obj;
  }

  /**
   * Get the table/collection name for this model
   * Override in subclasses
   */
  static getTableName() {
    throw new Error("getTableName() must be implemented in subclass");
  }

  /**
   * Get the primary key field name
   * Override in subclasses if different
   */
  static getPrimaryKey() {
    return "id";
  }

  /**
   * Find a single document by filter
   * @param {Object} db - Database connection/adapter
   * @param {Object} filter - Query filter
   * @returns {Promise<Model|null>}
   */
  static async findOne(db, filter) {
    const adapter = this.getAdapter(db);
    return await adapter.findOne(this, filter);
  }

  /**
   * Find multiple documents by filter
   * @param {Object} db - Database connection/adapter
   * @param {Object} filter - Query filter
   * @param {Object} options - Query options (sort, limit, skip)
   * @returns {Promise<Array<Model>>}
   */
  static async find(db, filter = {}, options = {}) {
    const adapter = this.getAdapter(db);
    return await adapter.find(this, filter, options);
  }

  /**
   * Find a document by ID
   * @param {Object} db - Database connection/adapter
   * @param {string|number} id - Document ID
   * @returns {Promise<Model|null>}
   */
  static async findById(db, id) {
    const adapter = this.getAdapter(db);
    const primaryKey = this.getPrimaryKey();
    return await adapter.findOne(this, { [primaryKey]: id });
  }

  /**
   * Count documents matching filter
   * @param {Object} db - Database connection/adapter
   * @param {Object} filter - Query filter
   * @returns {Promise<number>}
   */
  static async count(db, filter = {}) {
    const adapter = this.getAdapter(db);
    return await adapter.count(this, filter);
  }

  /**
   * Create a new document
   * @param {Object} db - Database connection/adapter
   * @param {Object} data - Document data
   * @returns {Promise<Model>}
   */
  static async create(db, data) {
    const adapter = this.getAdapter(db);
    return await adapter.create(this, data);
  }

  /**
   * Update this document
   * @param {Object} db - Database connection/adapter
   * @returns {Promise<Model>}
   */
  async save(db) {
    const adapter = this.constructor.getAdapter(db);
    return await adapter.save(this);
  }

  /**
   * Update a document by ID
   * @param {Object} db - Database connection/adapter
   * @param {string|number} id - Document ID
   * @param {Object} update - Update data
   * @returns {Promise<Model|null>}
   */
  static async findByIdAndUpdate(db, id, update) {
    const adapter = this.getAdapter(db);
    return await adapter.findByIdAndUpdate(this, id, update);
  }

  /**
   * Delete this document
   * @param {Object} db - Database connection/adapter
   * @returns {Promise<boolean>}
   */
  async delete(db) {
    const adapter = this.constructor.getAdapter(db);
    return await adapter.delete(this);
  }

  /**
   * Delete a document by ID
   * @param {Object} db - Database connection/adapter
   * @param {string|number} id - Document ID
   * @returns {Promise<boolean>}
   */
  static async findByIdAndDelete(db, id) {
    const adapter = this.getAdapter(db);
    return await adapter.findByIdAndDelete(this, id);
  }

  /**
   * Get the appropriate adapter for the database
   * @param {Object} db - Database connection
   * @returns {Object} Database adapter
   */
  static getAdapter(db) {
    if (!db) {
      throw new Error("Database connection is required");
    }

    // For now, always use D1Adapter since it's the only implementation
    // In the future, we can add adapter detection logic here:
    // - Check db.type or db.constructor.name
    // - Return appropriate adapter (MongoDBAdapter, PostgreSQLAdapter, etc.)

    return new D1Adapter(db);
  }
}
