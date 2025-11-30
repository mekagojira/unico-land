/**
 * CompanyInfo model using ORM pattern
 * Single record for company information
 */

import { BaseModel } from "../orm/BaseModel.js";

export class CompanyInfo extends BaseModel {
  constructor(data = {}) {
    super(data);
  }

  /**
   * Get table name
   */
  static getTableName() {
    return "company_info";
  }

  /**
   * Get primary key
   */
  static getPrimaryKey() {
    return "id";
  }

  /**
   * Get company info (always returns the single record)
   */
  static async getCompanyInfo(db) {
    const company = await this.findById(db, "company");
    if (!company) {
      // Create default company info if it doesn't exist
      return await this.create(db, {
        id: "company",
        name: "Uni-Co 株式会社",
        nameEn: "Uni-Co Co., Ltd.",
        address: "〒333-0851 埼玉県川口市芝新町 14-12",
        address2: "クレール蕨２F",
        established: "2020年12月",
        representative: "代表取締役 グエン・テー・ホアン",
        license: "宅地建物取引業 埼玉県知事（1）第 25774 号",
        organization: "社団法人 全日本不動産協会 ほか",
        phone: "048-242-5907",
        email: "unico@gmail.com",
        hours: "9:00〜18:00",
        closed: "水曜日",
        greeting: "地域に根ざし、グローバルに対応する不動産パートナー",
        description: "",
      });
    }
    return company;
  }

  /**
   * Update company info (always updates the single record)
   */
  static async updateCompanyInfo(db, data) {
    const company = await this.getCompanyInfo(db);
    Object.assign(company, data);
    return await company.save(db);
  }
}
