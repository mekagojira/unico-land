import { Content } from "../models/Content.js";
import { User } from "../models/User.js";
import { getD1Client } from "../config/database.js";

// Helper to populate author (safe for public - no password)
const populateAuthor = async (content, db) => {
  if (content.authorId) {
    const author = await User.findById(db, content.authorId);
    if (author) {
      const { password, ...safeAuthor } = author;
      content.author = safeAuthor;
    }
  }
  return content;
};

// @desc    List published blog posts (public)
// @route   GET /api/blog
// @access  Public
export const listPosts = async (c) => {
  try {
    const { locale, page = "1", limit = "10" } = c.req.query();

    const query = { type: "post", status: "published" };
    if (locale) query.locale = locale;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = Math.min(parseInt(limit, 10) || 10, 50);

    const db = await getD1Client(c.env || {});
    const posts = await Content.find(db, query, {
      skip,
      limit: limitNum,
      sort: { publishedAt: -1 },
    });

    const total = await Content.count(db, query);

    const postsWithAuthors = await Promise.all(
      posts.map((post) => populateAuthor(post, db))
    );

    return c.json({
      success: true,
      data: postsWithAuthors,
      pagination: {
        page: parseInt(page, 10) || 1,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get single published blog post by slug (public)
// @route   GET /api/blog/:slug
// @access  Public
export const getPostBySlug = async (c) => {
  try {
    const { slug } = c.req.param();
    const { locale } = c.req.query();

    const db = await getD1Client(c.env || {});
    const filter = { slug, type: "post", status: "published" };
    if (locale) filter.locale = locale;

    const post = await Content.findOne(db, filter);

    if (!post) {
      return c.json(
        { success: false, message: "Post not found" },
        404
      );
    }

    await populateAuthor(post, db);

    return c.json({ success: true, data: post });
  } catch (error) {
    throw error;
  }
};
