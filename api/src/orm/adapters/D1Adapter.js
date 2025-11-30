/**
 * D1 Database Adapter
 * Implements ORM operations for Cloudflare D1 (SQLite)
 */

export class D1Adapter {
  constructor(db) {
    this.db = db;
  }

  /**
   * Find one document
   */
  async findOne(Model, filter) {
    const tableName = Model.getTableName();
    const { query, params } = this.buildWhereClause(filter, tableName);
    const sql = `SELECT * FROM ${tableName} WHERE ${query} LIMIT 1`;

    const stmt = this.db.prepare(sql);
    const result = await stmt.bind(...params).first();

    if (!result) return null;

    // Handle different response formats from D1 API
    // Sometimes first() returns the row directly, sometimes it's wrapped
    let row = result;

    // If result is the entire D1 API response object, extract the first row
    if (
      result.results &&
      Array.isArray(result.results) &&
      result.results.length > 0
    ) {
      row = result.results[0];
    } else if (
      result.result &&
      Array.isArray(result.result) &&
      result.result.length > 0
    ) {
      row = result.result[0];
    } else if (result.success !== undefined) {
      // This is a D1 API response object, not a row
      // Try to get the first result from results array
      if (result.results && result.results.length > 0) {
        row = result.results[0];
      } else {
        // No results found
        return null;
      }
    }

    // Parse JSON fields if they exist (for Content model metadata/tags)
    const parsed = this.parseJSONFields(row);
    return new Model(parsed);
  }

  /**
   * Find multiple documents
   */
  async find(Model, filter = {}, options = {}) {
    const tableName = Model.getTableName();
    let sql = `SELECT * FROM ${tableName}`;
    const params = [];

    // Build WHERE clause
    if (Object.keys(filter).length > 0) {
      const { query, params: filterParams } = this.buildWhereClause(
        filter,
        tableName
      );
      sql += ` WHERE ${query}`;
      params.push(...filterParams);
    }

    // Add ORDER BY
    if (options.sort) {
      const sortKeys = Object.keys(options.sort);
      if (sortKeys.length > 0) {
        const sortDir = options.sort[sortKeys[0]] === -1 ? "DESC" : "ASC";
        sql += ` ORDER BY ${sortKeys[0]} ${sortDir}`;
      }
    } else {
      // Default sort by createdAt DESC
      sql += ` ORDER BY createdAt DESC`;
    }

    // Add LIMIT and OFFSET
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
    }
    if (options.skip) {
      sql += ` OFFSET ${options.skip}`;
    }

    const stmt = this.db.prepare(sql);
    let result;
    if (params.length > 0) {
      result = await stmt.bind(...params).all();
    } else {
      result = await stmt.all();
    }

    // Extract results from D1 API response
    // D1 returns { results: [...], success: true, meta: {...} }
    let rows = [];

    // Handle different response formats
    if (Array.isArray(result)) {
      // If result is directly an array
      rows = result;
    } else if (result && Array.isArray(result.results)) {
      // Standard D1 API response format
      rows = result.results;
    } else if (result && Array.isArray(result.result)) {
      // Alternative D1 API response format
      rows = result.result;
    } else if (result && result.results) {
      // Fallback: try to get results
      rows = result.results;
    }

    // Map rows to Model instances
    return (rows[0]?.results || []).map((row) => {
      const parsed = this.parseJSONFields(row);
      return new Model(parsed);
    });
  }

  /**
   * Count documents
   */
  async count(Model, filter = {}) {
    const tableName = Model.getTableName();
    let sql = `SELECT COUNT(*) as count FROM ${tableName}`;
    const params = [];

    if (Object.keys(filter).length > 0) {
      const { query, params: filterParams } = this.buildWhereClause(
        filter,
        tableName
      );
      sql += ` WHERE ${query}`;
      params.push(...filterParams);
    }

    const stmt = this.db.prepare(sql);
    let result;
    if (params.length > 0) {
      result = await stmt.bind(...params).first();
    } else {
      result = await stmt.first();
    }

    return result ? result.count : 0;
  }

  /**
   * Create a new document
   */
  async create(Model, data) {
    const tableName = Model.getTableName();
    const primaryKey = Model.getPrimaryKey();

    // Generate ID if not provided
    if (!data[primaryKey]) {
      data[primaryKey] = crypto.randomUUID();
    }

    // Add timestamps
    const now = new Date().toISOString();
    if (!data.createdAt) data.createdAt = now;
    if (!data.updatedAt) data.updatedAt = now;

    // Handle special case for company_info (single record)
    if (tableName === "company_info" && !data.id) {
      data.id = "company";
    }

    // Build INSERT query
    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((col) => data[col]);

    // Convert boolean to integer for SQLite
    const processedValues = values.map((val) => {
      if (typeof val === "boolean") return val ? 1 : 0;
      if (typeof val === "object" && val !== null) return JSON.stringify(val);
      return val;
    });

    const sql = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    const stmt = this.db.prepare(sql);
    const insertResult = await stmt.bind(...processedValues).run();

    // Verify the insert was successful
    if (insertResult && insertResult.success === false) {
      throw new Error(
        `Failed to insert into ${tableName}: ${
          insertResult.error || "Unknown error"
        }`
      );
    }

    // Return the created model with all data
    const createdModel = new Model(data);
    return createdModel;
  }

  /**
   * Save (update) a document
   */
  async save(model) {
    const Model = model.constructor;
    const tableName = Model.getTableName();
    const primaryKey = Model.getPrimaryKey();

    if (!model[primaryKey]) {
      throw new Error(`Cannot save: ${primaryKey} is required`);
    }

    // Update timestamp
    model.updatedAt = new Date().toISOString();

    // Known computed/non-column fields to exclude
    // These are fields that exist on the model but not in the database
    const excludedFields = new Set([
      primaryKey, // Don't update primary key
      "createdAt", // Don't update createdAt
      "author", // Populated author (not a column)
      "order", // Computed field (use orderIndex instead)
      "title", // Computed field (use titleJp/titleVi instead)
      "description", // Computed field (use descriptionJp/descriptionVi instead)
      "content", // Computed field (use contentJp/contentVi instead)
    ]);

    // Build UPDATE query - only include own properties, not methods
    // Get all enumerable properties from the model
    const data = {};
    for (const key in model) {
      // Only include own properties (not from prototype)
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        // Skip methods (functions) and excluded fields
        if (
          typeof model[key] !== "function" &&
          !excludedFields.has(key) &&
          model[key] !== undefined
        ) {
          data[key] = model[key];
        }
      }
    }

    // Filter out undefined values and get column names
    const columns = Object.keys(data).filter((col) => {
      return data[col] !== undefined;
    });

    if (columns.length === 0) {
      return model; // Nothing to update
    }

    const setClause = columns.map((col) => `${col} = ?`).join(", ");
    const values = columns.map((col) => {
      const val = data[col];
      if (typeof val === "boolean") return val ? 1 : 0;
      if (Array.isArray(val)) {
        // Stringify arrays (like images)
        return JSON.stringify(val);
      }
      if (typeof val === "object" && val !== null) {
        // Stringify objects
        return JSON.stringify(val);
      }
      return val;
    });

    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${primaryKey} = ?`;
    values.push(model[primaryKey]);

    const stmt = this.db.prepare(sql);
    await stmt.bind(...values).run();

    return model;
  }

  /**
   * Update a document by ID
   */
  async findByIdAndUpdate(Model, id, update) {
    const doc = await this.findOne(Model, { [Model.getPrimaryKey()]: id });
    if (!doc) return null;

    Object.assign(doc, update);
    return await this.save(doc);
  }

  /**
   * Delete a document
   */
  async delete(model) {
    const Model = model.constructor;
    const tableName = Model.getTableName();
    const primaryKey = Model.getPrimaryKey();

    if (!model[primaryKey]) {
      throw new Error(`Cannot delete: ${primaryKey} is required`);
    }

    const sql = `DELETE FROM ${tableName} WHERE ${primaryKey} = ?`;
    const stmt = this.db.prepare(sql);
    await stmt.bind(model[primaryKey]).run();

    return true;
  }

  /**
   * Delete a document by ID
   */
  async findByIdAndDelete(Model, id) {
    const doc = await this.findOne(Model, { [Model.getPrimaryKey()]: id });
    if (!doc) return false;

    return await this.delete(doc);
  }

  /**
   * Build WHERE clause from filter object
   * Exposed as public method for custom queries
   */
  buildWhereClause(filter, tableName) {
    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(filter)) {
      if (key === "$or") {
        // Handle $or operator
        const orConditions = value
          .map((or) => {
            for (const [orKey, orValue] of Object.entries(or)) {
              params.push(orValue);
              return `${orKey} = ?`;
            }
            return null;
          })
          .filter(Boolean);
        if (orConditions.length > 0) {
          conditions.push(`(${orConditions.join(" OR ")})`);
        }
      } else {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (conditions.length === 0) {
      return { query: "1=1", params: [] };
    }

    return { query: conditions.join(" AND "), params };
  }

  /**
   * Parse JSON fields from database result
   * Handles fields like metadata and tags that are stored as JSON strings
   */
  parseJSONFields(row) {
    if (!row) return row;

    const parsed = { ...row };

    // Common JSON field names
    const jsonFields = ["metadata", "tags", "settings", "config", "images"];

    for (const field of jsonFields) {
      if (parsed[field] && typeof parsed[field] === "string") {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          // If parsing fails, keep the original value
          console.warn(`Failed to parse JSON field ${field}:`, e.message);
        }
      }
    }

    return parsed;
  }
}
