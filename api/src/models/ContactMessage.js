/**
 * ContactMessage model – messages sent via contact form (to page admin)
 */

import { BaseModel } from "../orm/BaseModel.js";

export class ContactMessage extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.isRead = data.isRead !== undefined ? data.isRead : 0;
  }

  static getTableName() {
    return "contact_messages";
  }

  static getPrimaryKey() {
    return "id";
  }
}
