// Database configuration for Cloudflare Workers and Bun
// Using D1 Database (SQLite) - Remote D1 only

// Helper to get env value (works in both Workers and Node.js/Bun)
const getEnv = (env, key, defaultValue = null) => {
  if (env && env[key]) return env[key];
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return defaultValue;
};

// Get D1 Database client
export const getD1Client = async (env = null) => {
  // In Workers (including wrangler dev), D1 is available via binding
  // Check for DB binding first
  if (env && env.DB) {
    console.log("✅ Using D1 binding from Workers environment");
    return env.DB;
  }

  // For local development (Bun/Node.js), connect to remote D1 database via HTTP API
  const d1AccountId = getEnv(env, "D1_ACCOUNT_ID");
  const d1DatabaseId = getEnv(env, "D1_DATABASE_ID");
  const d1ApiToken = getEnv(env, "D1_API_TOKEN");

  if (d1AccountId && d1DatabaseId && d1ApiToken) {
    console.log("✅ Using D1 HTTP API for local development");
    // Use D1 HTTP API for local development
    return createD1HttpClient(d1AccountId, d1DatabaseId, d1ApiToken);
  }

  // Debug: log what we received
  console.error("❌ D1 Database not configured");
  console.error("   env:", env ? Object.keys(env) : "null/undefined");
  console.error("   env.DB:", env?.DB ? "exists" : "missing");
  console.error("   D1_ACCOUNT_ID:", d1AccountId ? "set" : "missing");
  console.error("   D1_DATABASE_ID:", d1DatabaseId ? "set" : "missing");
  console.error("   D1_API_TOKEN:", d1ApiToken ? "set" : "missing");

  throw new Error(
    "D1 Database not configured. " +
      "For Workers: Configure D1 binding in wrangler.toml. " +
      "For local development: Set D1_ACCOUNT_ID, D1_DATABASE_ID, and D1_API_TOKEN environment variables in .env file. " +
      "Get your API token from: https://dash.cloudflare.com/profile/api-tokens"
  );
};

// D1 HTTP API client for local development
const createD1HttpClient = (accountId, databaseId, apiToken) => {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

  // Helper function to execute queries with error handling
  const executeQuery = async (sql, params = []) => {
    const response = await fetch(`${baseUrl}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));

      // Log detailed error information for debugging
      console.error("D1 API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        error: error,
        sql: sql.substring(0, 200), // First 200 chars of SQL
        paramsCount: params.length,
        params: params.map((p) =>
          typeof p === "string" ? p.substring(0, 50) : p
        ), // First 50 chars of each param
      });

      console.error(error);

      throw new Error(
        `D1 API error: ${error.message || response.statusText} (${
          response.status
        })`
      );
    }

    const result = await response.json();
    if (!result.success && result.errors && result.errors.length > 0) {
      throw new Error(`D1 query error: ${result.errors[0].message}`);
    }

    // D1 HTTP API returns data in result.result array (singular)
    // But some responses might use result.results (plural)
    // Normalize to always use result.result for consistency
    if (result.results && !result.result) {
      result.result = result.results;
    }

    // Return the full result object for compatibility
    return result;
  };

  return {
    type: "d1-http",
    // prepare should be synchronous to match D1 API
    prepare(query) {
      // Return a statement object immediately (synchronous)
      const statement = {
        bind: (...params) => {
          // Return a bound statement with the params
          return {
            async run() {
              const result = await executeQuery(query, params);
              return result;
            },
            async all() {
              const result = await executeQuery(query, params);
              // D1 HTTP API returns data in result.result array (singular)
              // But some responses might use result.results (plural)
              const rows = result.result || result.results || [];
              return { results: rows };
            },
            async first() {
              const result = await executeQuery(query, params);
              // D1 HTTP API returns data in result.result array (singular)
              // But some responses might use result.results (plural)
              const rows = result.result || result.results || [];
              // Return the first row, or null if no rows
              if (rows.length > 0) {
                return rows[0];
              }
              return null;
            },
          };
        },
        async run() {
          const result = await executeQuery(query, []);
          return result;
        },
        async all() {
          const result = await executeQuery(query, []);
          // D1 HTTP API returns data in result.result array (singular)
          // But some responses might use result.results (plural)
          const rows = result.result || result.results || [];
          return { results: rows };
        },
        async first() {
          const result = await executeQuery(query, []);
          // D1 HTTP API returns data in result.result array (singular)
          // But some responses might use result.results (plural)
          const rows = result.result || result.results || [];
          return rows.length > 0 ? rows[0] : null;
        },
      };
      return statement;
    },
    async exec(query) {
      // exec can handle multiple statements separated by semicolons
      // Split and execute each statement
      const statements = query
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const statement of statements) {
        await executeQuery(statement, []);
      }

      return { success: true };
    },
  };
};

// Main function - use D1 instead of MongoDB
export const getMongoClient = async (env = null) => {
  // Return D1 client (keeping function name for compatibility)
  return getD1Client(env);
};
