import { Content } from "../models/Content.js";
import { User } from "../models/User.js";
import { getD1Client } from "../config/database.js";

// Helper to populate author
const populateAuthor = async (content, db) => {
  if (content.authorId) {
    const author = await User.findById(db, content.authorId);
    if (author) {
      content.author = author.toJSON();
    }
  }
  return content;
};

// @desc    Get all content
// @route   GET /api/content
// @access  Private
export const getAllContent = async (c) => {
  try {
    const { type, status, locale, page = "1", limit = "10" } = c.req.query();

    // Build query
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (locale) query.locale = locale;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const db = await getD1Client(c.env || {});
    const contents = await Content.find(db, query, {
      skip,
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    });

    const total = await Content.count(db, query);

    // Populate authors
    const contentsWithAuthors = await Promise.all(
      contents.map((content) => populateAuthor(content, db))
    );

    return c.json({
      success: true,
      data: contentsWithAuthors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Private
export const getContent = async (c) => {
  try {
    const { id } = c.req.param();
    const db = await getD1Client(c.env || {});

    const content = await Content.findById(db, id);

    if (!content) {
      return c.json(
        {
          success: false,
          message: "Content not found",
        },
        404
      );
    }

    await populateAuthor(content, db);

    return c.json({
      success: true,
      data: content,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get content by slug
// @route   GET /api/content/slug/:slug
// @access  Private
export const getContentBySlug = async (c) => {
  try {
    const { slug } = c.req.param();
    const { locale } = c.req.query();

    const db = await getD1Client(c.env || {});
    const content = await Content.findBySlug(db, slug, locale);

    if (!content) {
      return c.json(
        {
          success: false,
          message: "Content not found",
        },
        404
      );
    }

    await populateAuthor(content, db);

    return c.json({
      success: true,
      data: content,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private (Editor/Admin)
export const createContent = async (c) => {
  try {
    const body = await c.req.json();
    const user = c.get("user");

    // Add author from authenticated user
    body.author = user.id;

    const db = await getD1Client(c.env || {});
    const content = await Content.create(db, body);

    await populateAuthor(content, db);

    return c.json(
      {
        success: true,
        data: content,
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Editor/Admin)
export const updateContent = async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const user = c.get("user");

    const db = await getD1Client(c.env || {});
    let content = await Content.findById(db, id);

    if (!content) {
      return c.json(
        {
          success: false,
          message: "Content not found",
        },
        404
      );
    }

    // Check if user is the author or admin
    const authorId = content.authorId || content.author;
    if (authorId !== user.id && user.role !== "admin") {
      return c.json(
        {
          success: false,
          message: "Not authorized to update this content",
        },
        403
      );
    }

    content = await Content.findByIdAndUpdate(db, id, body);
    await populateAuthor(content, db);

    return c.json({
      success: true,
      data: content,
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (Admin only)
export const deleteContent = async (c) => {
  try {
    const { id } = c.req.param();
    const db = await getD1Client(c.env || {});

    const content = await Content.findById(db, id);

    if (!content) {
      return c.json(
        {
          success: false,
          message: "Content not found",
        },
        404
      );
    }

    await content.delete(db);

    return c.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
