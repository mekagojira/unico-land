import { Service } from "../models/Service.js";
import { getD1Client } from "../config/database.js";
import {
  convertImageKeysToPresignedUrls,
  extractKeyFromUrl,
  getPresignedUrlForKey,
} from "../utils/imageUtils.js";

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getAllServices = async (c) => {
  try {
    const { active } = c.req.query();
    const db = await getD1Client(c.env || {});

    let services;
    if (active === "true") {
      services = await Service.findActive(db);
    } else {
      services = await Service.findAll(db);
    }

    // Convert to JSON format - return full data for admin, locale-specific for public
    const locale = c.req.query("locale") || "jp";
    const isAdmin = c.get("user"); // Check if user is authenticated

    // Convert image keys to presigned URLs
    const servicesData = await Promise.all(
      services.map(async (service) => {
        // Parse images if it's a string
        let images = service.images;
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

        // Convert image keys to presigned URLs
        const presignedImages = await convertImageKeysToPresignedUrls(
          c.env || {},
          images
        );

        if (isAdmin) {
          // Return full data for admin
          return {
            id: service.id,
            titleJp: service.titleJp || "",
            titleVi: service.titleVi || "",
            descriptionJp: service.descriptionJp || "",
            descriptionVi: service.descriptionVi || "",
            contentJp: service.contentJp || "",
            contentVi: service.contentVi || "",
            images: presignedImages,
            icon: service.icon || "",
            orderIndex: service.orderIndex || 0,
            isActive: service.isActive !== undefined ? service.isActive : 1,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
          };
        } else {
          // Return locale-specific data for public
          const serviceData = service.toJSON(locale);
          serviceData.images = presignedImages;
          return serviceData;
        }
      })
    );

    return c.json({
      success: true,
      data: servicesData,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = async (c) => {
  try {
    const { id } = c.req.param();
    const locale = c.req.query("locale") || "jp";
    const db = await getD1Client(c.env || {});

    const service = await Service.findById(db, id);

    if (!service) {
      return c.json(
        {
          success: false,
          message: "Service not found",
        },
        404
      );
    }

    // Parse images if it's a string
    let images = service.images;
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

    // Convert image keys to presigned URLs
    const presignedImages = await convertImageKeysToPresignedUrls(
      c.env || {},
      images
    );

    const serviceData = service.toJSON(locale);
    serviceData.images = presignedImages;

    return c.json({
      success: true,
      data: serviceData,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Editor/Admin)
export const createService = async (c) => {
  try {
    const body = await c.req.json();
    const db = await getD1Client(c.env || {});

    // Extract keys from image URLs if they're URLs
    if (Array.isArray(body.images)) {
      body.images = body.images.map((img) => extractKeyFromUrl(img) || img);
    }

    const service = await Service.create(db, body);

    return c.json(
      {
        success: true,
        data: service,
        message: "Service created successfully",
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Editor/Admin)
export const updateService = async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const db = await getD1Client(c.env || {});

    // Remove computed fields that don't exist in the database
    const { title, description, content, order, ...updateData } = body;

    // Extract keys from image URLs if they're URLs
    if (Array.isArray(updateData.images)) {
      updateData.images = updateData.images.map(
        (img) => extractKeyFromUrl(img) || img
      );
    }

    const service = await Service.findByIdAndUpdate(db, id, updateData);

    if (!service) {
      return c.json(
        {
          success: false,
          message: "Service not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: service,
      message: "Service updated successfully",
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
export const deleteService = async (c) => {
  try {
    const { id } = c.req.param();
    const db = await getD1Client(c.env || {});

    const deleted = await Service.findByIdAndDelete(db, id);

    if (!deleted) {
      return c.json(
        {
          success: false,
          message: "Service not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
