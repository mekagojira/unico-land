import { verify } from "../utils/jwt.js";
import { User } from "../models/User.js";
import { getD1Client } from "../config/database.js";

// Verify JWT token
export const authenticate = async (c, next) => {
  try {
    // Get token from header
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        {
          success: false,
          message: "No token provided, authorization denied",
        },
        401
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = await verify(token, c.env);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return c.json(
          {
            success: false,
            message: "Token expired",
          },
          401
        );
      }
      if (error.name === "JsonWebTokenError") {
        return c.json(
          {
            success: false,
            message: "Invalid token",
          },
          401
        );
      }
      throw error;
    }

    // Get user from token
    const db = await getD1Client(c.env || {});
    const user = await User.findById(db, decoded.id);

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
        },
        401
      );
    }

    if (!user.isActive || user.isActive === 0) {
      return c.json(
        {
          success: false,
          message: "User account is inactive",
        },
        401
      );
    }

    // Attach user to context
    c.set("user", user);
    await next();
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Server error during authentication",
      },
      500
    );
  }
};

// Check if user has required role
export const authorize = (...roles) => {
  return async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401
      );
    }

    if (!roles.includes(user.role)) {
      return c.json(
        {
          success: false,
          message: `Access denied. Required role: ${roles.join(" or ")}`,
        },
        403
      );
    }

    await next();
  };
};
