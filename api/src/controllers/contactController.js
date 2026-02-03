import { ContactMessage } from "../models/ContactMessage.js";
import { getD1Client } from "../config/database.js";

// Simple validation helpers
const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// @desc    Send contact message (public)
// @route   POST /api/contact
// @access  Public
export const sendMessage = async (c) => {
  try {
    const body = await c.req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject =
      typeof body.subject === "string" ? body.subject.trim() : null;
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length < 1) {
      return c.json(
        { success: false, message: "Name is required" },
        400
      );
    }
    if (!email) {
      return c.json(
        { success: false, message: "Email is required" },
        400
      );
    }
    if (!isValidEmail(email)) {
      return c.json(
        { success: false, message: "Invalid email address" },
        400
      );
    }
    if (!message || message.length < 1) {
      return c.json(
        { success: false, message: "Message is required" },
        400
      );
    }

    const db = await getD1Client(c.env || {});
    const doc = await ContactMessage.create(db, {
      name,
      email,
      subject: subject || null,
      message,
    });

    return c.json(
      {
        success: true,
        message: "Message sent successfully",
        data: { id: doc.id },
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

// @desc    List contact messages (admin)
// @route   GET /api/contact
// @access  Private (admin)
export const listMessages = async (c) => {
  try {
    const { page = "1", limit = "20", isRead } = c.req.query();

    const filter = {};
    if (isRead !== undefined && isRead !== "") {
      filter.isRead = isRead === "1" || isRead === "true" ? 1 : 0;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);

    const db = await getD1Client(c.env || {});
    const messages = await ContactMessage.find(db, filter, {
      skip,
      limit: limitNum,
      sort: { createdAt: -1 },
    });

    const total = await ContactMessage.count(db, filter);

    return c.json({
      success: true,
      data: messages,
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

// @desc    Get single contact message (admin)
// @route   GET /api/contact/:id
// @access  Private (admin)
export const getMessage = async (c) => {
  try {
    const { id } = c.req.param();
    const db = await getD1Client(c.env || {});

    const msg = await ContactMessage.findById(db, id);

    if (!msg) {
      return c.json(
        { success: false, message: "Message not found" },
        404
      );
    }

    return c.json({ success: true, data: msg });
  } catch (error) {
    throw error;
  }
};

// @desc    Mark message as read/unread (admin)
// @route   PATCH /api/contact/:id/read
// @access  Private (admin)
export const markRead = async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json().catch(() => ({}));
    const isRead = body.isRead === true || body.isRead === 1;

    const db = await getD1Client(c.env || {});
    const msg = await ContactMessage.findById(db, id);

    if (!msg) {
      return c.json(
        { success: false, message: "Message not found" },
        404
      );
    }

    msg.isRead = isRead ? 1 : 0;
    await msg.save(db);

    return c.json({
      success: true,
      data: msg,
    });
  } catch (error) {
    throw error;
  }
};
