# D1 Database Setup Guide

This project now uses **Cloudflare D1** (SQLite) instead of MongoDB. D1 is:

- ✅ Native to Cloudflare Workers
- ✅ Works perfectly with Bun
- ✅ No TLS issues
- ✅ Free tier available
- ✅ Fast and reliable

## Setup

### 1. Create D1 Database

```bash
# Create a D1 database
wrangler d1 create unico-land-db
```

This will output:

```
✅ Successfully created DB 'unico-land-db'!

[[d1_databases]]
binding = "DB"
database_name = "unico-land-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. Update wrangler.toml

Copy the `database_id` from the output above and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "unico-land-db"
database_id = "your-database-id-here"
```

### 3. Set Up Environment Variables

Create a `.env` file with your D1 credentials:

```env
D1_ACCOUNT_ID=aaf162b2efd6cd5cf6644ecb892b89c3
D1_DATABASE_ID=b7b01265-4d55-4261-809c-6a19626c9e0f
D1_API_TOKEN=your-cloudflare-api-token
```

Get your API token from: https://dash.cloudflare.com/profile/api-tokens

### 4. Initialize Database Schema

Run the migration to create tables:

```bash
# Using wrangler (recommended for production)
wrangler d1 execute DB --remote --file=migrations/001_initial_schema.sql

# Or use the init script (requires .env file)
bun run init-d1
```

### 5. Create Admin User

```bash
bun run create-admin
```

## Local Development

For local development, you **must** connect to the remote D1 database using the HTTP API.

### Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```env
# D1 Database Configuration (Required for local development)
D1_ACCOUNT_ID=aaf162b2efd6cd5cf6644ecb892b89c3
D1_DATABASE_ID=b7b01265-4d55-4261-809c-6a19626c9e0f
D1_API_TOKEN=your-cloudflare-api-token

# Admin User Creation (Optional)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@unicoland.com
ADMIN_PASSWORD=admin123

# Server Configuration (Optional)
PORT=3000
NODE_ENV=development
```

### Getting Your Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Click **"Create Custom Token"** (recommended for D1 access)
4. Configure the token:
   - **Token name**: `D1 Database Access` (or any name you prefer)
   - **Permissions**:
     - **Account** → **D1** → **Edit**
   - **Account Resources**:
     - **Include** → **Specific account** → Select your account: `Manh Nguyen (aaf162b2efd6cd5cf6644ecb892b89c3)`
   - **Zone Resources**: Leave as default (All zones) or set to "None" if you only need D1
5. Click **"Continue to summary"** then **"Create Token"**
6. **Copy the token immediately** (you won't be able to see it again!)
7. Add it to your `.env` file as `D1_API_TOKEN`

**Alternative**: You can also use the **"Edit Cloudflare Workers"** template, which may include D1 permissions, but a custom token with explicit D1 permissions is recommended for better security.

## D1 Commands

```bash
# Execute SQL on remote database
wrangler d1 execute DB --remote --command="SELECT * FROM users"

# Execute SQL file on remote database
wrangler d1 execute DB --remote --file=migrations/001_initial_schema.sql

# Open D1 console (remote)
wrangler d1 execute DB --remote --interactive
```

## Migration from MongoDB

The schema has been converted from MongoDB to SQLite:

- `_id` → `id` (TEXT, UUID)
- `ObjectId` → `TEXT` (UUID strings)
- Nested objects → JSON strings
- Arrays → JSON strings
- Boolean → INTEGER (0/1)

All existing functionality works the same, just using SQLite instead of MongoDB.

## Benefits of D1

1. **No TLS Issues**: Works perfectly with Bun
2. **Native Integration**: Built for Cloudflare Workers
3. **Fast**: SQLite is very fast for read operations
4. **Free Tier**: Generous free tier
5. **Simple**: No complex connection strings
6. **Reliable**: SQLite is battle-tested

## Troubleshooting

### Database not found

Make sure you've created the D1 database and updated `wrangler.toml` with the correct `database_id`.

### Schema errors

Run the migration:

```bash
wrangler d1 execute DB --remote --file=migrations/001_initial_schema.sql
```

### Authentication errors

Make sure you have:

1. Set `D1_ACCOUNT_ID`, `D1_DATABASE_ID`, and `D1_API_TOKEN` in your `.env` file
2. Created a valid Cloudflare API token with D1 permissions
3. The token is associated with the correct account (check `account_id` in `wrangler.toml`)

### Connection errors

- Verify your API token is valid and not expired
- Check that the `database_id` in `wrangler.toml` matches your D1 database
- Ensure the account ID matches the one in `wrangler.toml`
