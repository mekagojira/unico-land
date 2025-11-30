/**
 * Service model using ORM pattern
 * Services with multilingual content
 */

import { BaseModel } from "../orm/BaseModel.js";

export class Service extends BaseModel {
  constructor(data = {}) {
    super(data);

    // Parse JSON fields if they come as strings from database
    // Note: parseJSONFields in D1Adapter should handle this, but ensure it's an array
    if (typeof this.images === "string") {
      try {
        this.images = JSON.parse(this.images);
      } catch (e) {
        this.images = [];
      }
    } else if (!Array.isArray(this.images)) {
      this.images = this.images || [];
    }

    // Don't override values that were set by super(data) from database
    // Only set defaults for fields that are truly missing (not null, not empty string)
    // The super(data) call already did Object.assign(this, data), so all DB values are already set
  }

  /**
   * Get table name
   */
  static getTableName() {
    return "services";
  }

  /**
   * Get all active services ordered by orderIndex
   */
  static async findActive(db) {
    return await this.find(db, { isActive: 1 }, { sort: { orderIndex: 1 } });
  }

  /**
   * Get all services (including inactive) ordered by orderIndex
   */
  static async findAll(db) {
    const result = await this.find(db, {}, { sort: { orderIndex: 1 } });
    return result;
  }

  /**
   * Custom create to handle JSON fields
   */
  static async create(db, data) {
    // Stringify images array
    if (Array.isArray(data.images)) {
      data.images = JSON.stringify(data.images);
    }

    return await super.create(db, data);
  }

  /**
   * Custom save to handle JSON fields
   */
  async save(db) {
    // Stringify images array before saving (if it's an array)
    const dataToSave = { ...this };

    if (Array.isArray(this.images)) {
      dataToSave.images = JSON.stringify(this.images);
    } else if (typeof this.images === "string") {
      // Already a string, keep it as is
      dataToSave.images = this.images;
    }

    // Temporarily replace this object's properties for save
    const originalImages = this.images;
    this.images = dataToSave.images;

    try {
      const result = await super.save(db);
      // Restore original values (parse back to array if it was an array)
      if (Array.isArray(originalImages)) {
        this.images = originalImages;
      } else {
        // Try to parse back to array if it was a string
        try {
          this.images = JSON.parse(this.images);
        } catch (e) {
          this.images = originalImages;
        }
      }
      return result;
    } catch (error) {
      // Restore original values on error
      this.images = originalImages;
      throw error;
    }
  }

  /**
   * Get title in specific locale
   */
  getTitle(locale = "jp") {
    return locale === "vi" ? this.titleVi : this.titleJp;
  }

  /**
   * Get description in specific locale
   */
  getDescription(locale = "jp") {
    return locale === "vi" ? this.descriptionVi : this.descriptionJp;
  }

  /**
   * Get content in specific locale
   */
  getContent(locale = "jp") {
    return locale === "vi" ? this.contentVi : this.contentJp;
  }

  /**
   * Convert to JSON with locale-specific fields
   */
  toJSON(locale = "jp") {
    // Ensure images is always an array
    let images = this.images;
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [];
      }
    }
    if (!Array.isArray(images)) {
      images = [];
    }

    return {
      id: this.id,
      title: this.getTitle(locale),
      titleJp: this.titleJp || "",
      titleVi: this.titleVi || "",
      description: this.getDescription(locale),
      descriptionJp: this.descriptionJp || "",
      descriptionVi: this.descriptionVi || "",
      content: this.getContent(locale),
      contentJp: this.contentJp || "",
      contentVi: this.contentVi || "",
      images: images,
      orderIndex: this.orderIndex || 0,
      isActive: this.isActive !== undefined ? this.isActive : 1,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
