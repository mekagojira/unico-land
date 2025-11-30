import { sign } from "../utils/jwt.js";
import { hash, compare } from "../utils/password.js";
import { User } from "../models/User.js";
import { getD1Client } from "../config/database.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (c) => {
  try {
    const body = await c.req.json();
    const { username, email, password, role } = body;

    // Validation
    if (!username || !email || !password) {
      return c.json(
        {
          success: false,
          message: "Please provide username, email, and password",
        },
        400
      );
    }

    const db = await getD1Client(c.env || {});

    console.log(db);

    // Check if user exists
    const userExists = await User.findOne(db, {
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return c.json(
        {
          success: false,
          message: "User already exists with this email or username",
        },
        400
      );
    }

    // Hash password
    const hashedPassword = await hash(password);

    // Create user
    const user = await User.create(db, {
      username,
      email,
      password: hashedPassword,
      role: role || "viewer",
    });

    // Generate token
    const expiresIn =
      c.env?.JWT_EXPIRE ||
      (typeof process !== "undefined" && process.env?.JWT_EXPIRE) ||
      "30d";
    const token = await sign({ id: user.id }, expiresIn, c.env || {});

    return c.json(
      {
        success: true,
        data: {
          user: user.toJSON(),
          token,
        },
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return c.json(
        {
          success: false,
          message: "Please provide email and password",
        },
        400
      );
    }

    const db = await getD1Client(c.env || {});

    // Check for user - we need to get the password field
    // Note: MongoDB Data API doesn't support select, so we get all fields
    const user = await User.findOne(db, { email });

    if (!user || !user.password) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        401
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return c.json(
        {
          success: false,
          message: "Account is inactive. Please contact administrator",
        },
        401
      );
    }

    // Check password
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        401
      );
    }

    // Generate token
    const expiresIn =
      c.env?.JWT_EXPIRE ||
      (typeof process !== "undefined" && process.env?.JWT_EXPIRE) ||
      "30d";
    const token = await sign({ id: user.id }, expiresIn, c.env || {});

    return c.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    throw error;
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (c) => {
  try {
    const user = c.get("user");

    return c.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    throw error;
  }
};
