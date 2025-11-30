import { CompanyInfo } from "../models/CompanyInfo.js";
import { getD1Client } from "../config/database.js";
import {
  extractKeyFromUrl,
  getPresignedUrlForKey,
} from "../utils/imageUtils.js";

// @desc    Get company information
// @route   GET /api/company
// @access  Public
export const getCompanyInfo = async (c) => {
  try {
    const db = await getD1Client(c.env || {});
    const company = await CompanyInfo.getCompanyInfo(db);

    // Generate presigned GET URL for logo if it exists
    if (company.logoUrl) {
      const logoKey = extractKeyFromUrl(company.logoUrl);
      if (logoKey) {
        const presignedLogoUrl = await getPresignedUrlForKey(
          c.env || {},
          logoKey,
          3600 * 24 * 7
        );
        if (presignedLogoUrl) {
          company.logoUrl = presignedLogoUrl;
        }
      }
    }

    return c.json({
      success: true,
      data: company,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Update company information
// @route   PUT /api/company
// @access  Private (Admin)
export const updateCompanyInfo = async (c) => {
  try {
    const body = await c.req.json();
    const db = await getD1Client(c.env || {});

    // Extract key from logoUrl if it's a URL
    const updateData = { ...body };
    if (updateData.logoUrl) {
      updateData.logoUrl = extractKeyFromUrl(updateData.logoUrl) || updateData.logoUrl;
    }

    const company = await CompanyInfo.updateCompanyInfo(db, {
      ...updateData,
      id: "company", // Always use "company" as ID
    });

    return c.json({
      success: true,
      data: company,
      message: "Company information updated successfully",
    });
  } catch (error) {
    throw error;
  }
};
