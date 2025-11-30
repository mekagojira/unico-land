// Error handler for Hono

export const errorHandler = (err, c) => {
  console.error(err);

  // Handle specific error types
  if (err.name === "CastError" || err.message?.includes("not found")) {
    return c.json(
      {
        success: false,
        message: "Resource not found",
      },
      404
    );
  }

  if (err.code === 11000 || err.message?.includes("already exists")) {
    const field = err.keyPattern
      ? Object.keys(err.keyPattern)[0]
      : "field";
    return c.json(
      {
        success: false,
        message: `${field} already exists`,
      },
      400
    );
  }

  if (err.name === "ValidationError") {
    const message =
      err.errors && typeof err.errors === "object"
        ? Object.values(err.errors)
            .map((val) => val.message)
            .join(", ")
        : err.message || "Validation error";
    return c.json(
      {
        success: false,
        message,
      },
      400
    );
  }

  // Default error response
  const isDevelopment = typeof process !== "undefined" && process.env?.NODE_ENV === "development";
  return c.json(
    {
      success: false,
      message: err.message || "Server Error",
      ...(isDevelopment && { stack: err.stack }),
    },
    err.statusCode || 500
  );
};

