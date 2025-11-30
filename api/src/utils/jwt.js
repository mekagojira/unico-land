// JWT implementation using Web Crypto API (Workers-compatible)

const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const base64UrlDecode = (str) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return atob(str);
};

// Get JWT secret from environment
const getSecret = (env = null) => {
  let secret;
  if (env && env.JWT_SECRET) {
    secret = env.JWT_SECRET;
  } else if (typeof process !== 'undefined' && process.env && process.env.JWT_SECRET) {
    secret = process.env.JWT_SECRET;
  } else {
    secret = "your-secret-key-change-in-production";
  }
  return new TextEncoder().encode(secret);
};

// Sign JWT token
export const sign = async (payload, expiresIn = "30d", env = null) => {
  const secret = getSecret(env);
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // Calculate expiration
  const now = Math.floor(Date.now() / 1000);
  let exp = now;
  if (expiresIn.endsWith("d")) {
    exp += parseInt(expiresIn) * 24 * 60 * 60;
  } else if (expiresIn.endsWith("h")) {
    exp += parseInt(expiresIn) * 60 * 60;
  } else if (expiresIn.endsWith("m")) {
    exp += parseInt(expiresIn) * 60;
  } else {
    exp += parseInt(expiresIn);
  }

  payload.exp = exp;
  payload.iat = now;

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const message = `${encodedHeader}.${encodedPayload}`;
  const messageBytes = new TextEncoder().encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageBytes);
  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${message}.${encodedSignature}`;
};

// Verify JWT token
export const verify = async (token, env = null) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // Verify signature
    const message = `${encodedHeader}.${encodedPayload}`;
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = new Uint8Array(
      base64UrlDecode(encodedSignature)
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const secret = getSecret(env);
    const key = await crypto.subtle.importKey(
      "raw",
      secret,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      messageBytes
    );

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (error) {
    if (error.message === "Token expired") {
      const expiredError = new Error("Token expired");
      expiredError.name = "TokenExpiredError";
      throw expiredError;
    }
    if (error.message === "Invalid signature" || error.message === "Invalid token format") {
      const invalidError = new Error("Invalid token");
      invalidError.name = "JsonWebTokenError";
      throw invalidError;
    }
    throw error;
  }
};

