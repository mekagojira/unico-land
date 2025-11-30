/**
 * Seed initial data for company info and services
 * Run with: bun utils/seed-data.js
 */

import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
config({ path: resolve(__dirname, "../.env") });

import { getD1Client } from "../src/config/database.js";
import { CompanyInfo } from "../src/models/CompanyInfo.js";
import { Service } from "../src/models/Service.js";

const seedData = async () => {
  try {
    const db = await getD1Client();
    console.log("✅ Connected to D1 Database");

    // 1. Seed Company Info
    console.log("\n📝 Seeding company information...");
    const companyData = {
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
      description:
        "Uni-Co 株式会社は、卓越したサービス品質と国際的な視点を兼ね備えた、プレミアム不動産パートナーです。日本人のお客様から国際的なお客様まで、あらゆるニーズに応える、洗練されたソリューションを提供いたします。",
    };

    const existingCompany = await CompanyInfo.findById(db, "company");
    if (existingCompany) {
      console.log("  ℹ️  Company info already exists, updating...");
      // Remove id from update data
      const updateData = { ...companyData };
      delete updateData.id;
      Object.assign(existingCompany, updateData);
      await existingCompany.save(db);
      console.log("  ✅ Company info updated");
    } else {
      await CompanyInfo.create(db, companyData);
      console.log("  ✅ Company info created");
    }

    // 2. Seed Services
    console.log("\n📝 Seeding services...");
    const services = [
      {
        id: "sales",
        titleJp: "不動産売買仲介",
        titleVi: "Môi giới mua bán bất động sản",
        descriptionJp:
          "住宅・投資用物件の購入・売却をサポート。外国籍の方の住宅ローン相談も対応。",
        descriptionVi:
          "Hỗ trợ mua bán nhà ở và bất động sản đầu tư. Tư vấn vay mua nhà cho người nước ngoài.",
        contentJp:
          "高品質な住宅から投資用物件まで、戦略的な資産形成をサポート。国際的なお客様の住宅ローン相談にも専門的に対応いたします。",
        contentVi:
          "Hỗ trợ hình thành tài sản chiến lược từ nhà ở chất lượng cao đến bất động sản đầu tư. Chúng tôi cũng chuyên tư vấn vay mua nhà cho khách hàng quốc tế.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90",
        ]),
        icon: "🏛️",
        orderIndex: 1,
        isActive: 1,
      },
      {
        id: "rental",
        titleJp: "賃貸仲介",
        titleVi: "Môi giới cho thuê",
        descriptionJp:
          "日本語・英語対応で、国内外のお客様に最適な物件をご提案。",
        descriptionVi:
          "Đề xuất bất động sản phù hợp nhất cho khách hàng trong và ngoài nước với hỗ trợ tiếng Nhật và tiếng Anh.",
        contentJp:
          "日本語・英語対応で、国内外のお客様に最適な物件をご提案。多様なニーズに応える豊富な物件ラインナップをご用意しております。",
        contentVi:
          "Đề xuất bất động sản phù hợp nhất cho khách hàng trong và ngoài nước với hỗ trợ tiếng Nhật và tiếng Anh. Chúng tôi có danh mục bất động sản phong phú đáp ứng nhu cầu đa dạng.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=90",
        ]),
        icon: "🔑",
        orderIndex: 2,
        isActive: 1,
      },
      {
        id: "management",
        titleJp: "賃貸管理",
        titleVi: "Quản lý cho thuê",
        descriptionJp:
          "オーナー様向けに、入居者対応・家賃管理・修繕手配などを一括代行。",
        descriptionVi:
          "Thay mặt chủ sở hữu, chúng tôi xử lý toàn bộ từ ứng phó với người thuê, quản lý tiền thuê đến sắp xếp sửa chữa.",
        contentJp:
          "オーナー様の資産価値を最大化するため、入居者対応から家賃管理、修繕手配まで、包括的な管理サービスを提供いたします。",
        contentVi:
          "Để tối đa hóa giá trị tài sản của chủ sở hữu, chúng tôi cung cấp dịch vụ quản lý toàn diện từ ứng phó với người thuê, quản lý tiền thuê đến sắp xếp sửa chữa.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=90",
        ]),
        icon: "📊",
        orderIndex: 3,
        isActive: 1,
      },
      {
        id: "foreignSupport",
        titleJp: "外国籍サポート",
        titleVi: "Hỗ trợ người nước ngoài",
        descriptionJp:
          "在留資格確認、保証会社対応、契約書の翻訳など、外国籍の方が安心して契約できる体制を整えています。",
        descriptionVi:
          "Xác nhận tư cách lưu trú, ứng phó với công ty bảo lãnh, dịch hợp đồng - chúng tôi có hệ thống để người nước ngoài có thể ký hợp đồng yên tâm.",
        contentJp:
          "英語・中国語・ベトナム語など多言語対応。在留資格確認、保証会社選定、契約書の多言語翻訳など、国際的なお客様が安心して取引できる完全なサポート体制を整備。",
        contentVi:
          "Hỗ trợ đa ngôn ngữ như tiếng Anh, tiếng Trung, tiếng Việt. Xác nhận tư cách lưu trú, lựa chọn công ty bảo lãnh, dịch hợp đồng đa ngôn ngữ - chúng tôi có hệ thống hỗ trợ hoàn chỉnh để khách hàng quốc tế có thể giao dịch yên tâm.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=90",
        ]),
        icon: "🌍",
        orderIndex: 4,
        isActive: 1,
      },
    ];

    for (const serviceData of services) {
      const existing = await Service.findById(db, serviceData.id);
      if (existing) {
        console.log(`  ℹ️  Service "${serviceData.id}" already exists, updating...`);
        // Update existing service
        Object.assign(existing, serviceData);
        await existing.save(db);
        console.log(`  ✅ Service "${serviceData.id}" updated`);
      } else {
        await Service.create(db, serviceData);
        console.log(`  ✅ Service "${serviceData.id}" created`);
      }
    }

    console.log("\n🎉 Data seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

seedData();

