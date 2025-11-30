# Uni-Co CMS API - Cloudflare Workers

This API has been converted to run on Cloudflare Workers, providing edge computing capabilities and global distribution.

## Key Changes from Express.js

1. **Runtime**: Uses Cloudflare Workers V8 isolates instead of Node.js
2. **Framework**: Uses Hono instead of Express (similar API, Workers-compatible)
3. **Modules**: ES modules instead of CommonJS
4. **Database**: Uses MongoDB HTTP API (Atlas Data API) instead of Mongoose
5. **Storage**: Uses Cloudflare R2 bindings instead of AWS SDK
6. **JWT**: Custom implementation using Web Crypto API
7. **Password Hashing**: Uses Web Crypto API (PBKDF2) instead of bcrypt

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Wrangler

The `wrangler.toml` file contains the Workers configuration. Update it with your settings:

```toml
name = "unico-land-api"
main = "src/index.js"
compatibility_date = "2024-11-01"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "unico-land"
```

### 3. Set Environment Variables

Use Wrangler secrets for sensitive values:

```bash
# JWT Secret
wrangler secret put JWT_SECRET

# MongoDB API Key
wrangler secret put MONGODB_API_KEY

# MongoDB Cluster Name
wrangler secret put MONGODB_CLUSTER_NAME

# MongoDB Database
wrangler secret put MONGODB_DATABASE
```

Or set them in `wrangler.toml` for non-sensitive values:

```toml
[vars]
R2_PUBLIC_URL = "https://s3.uni-co-group.com"
CORS_ORIGIN = "*"
JWT_EXPIRE = "30d"
```

### 4. MongoDB Atlas Data API Setup

1. Go to your MongoDB Atlas dashboard
2. Navigate to Data API section
3. Create an API key
4. Get your cluster name
5. Set the secrets as shown above

The API uses MongoDB's HTTP Data API, which is compatible with Workers.

### 5. Run Locally

```bash
pnpm dev
```

This starts the Wrangler dev server at `http://localhost:8787`

### 6. Deploy

```bash
pnpm deploy
```

Or:

```bash
wrangler deploy
```

## API Endpoints

All endpoints remain the same as the Express version:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Content Management

- `GET /api/content` - Get all content (with pagination, filters)
- `GET /api/content/:id` - Get content by ID
- `GET /api/content/slug/:slug` - Get content by slug
- `POST /api/content` - Create new content (editor/admin only)
- `PUT /api/content/:id` - Update content (editor/admin only)
- `DELETE /api/content/:id` - Delete content (admin only)

### File Upload

- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files (max 10)
- `DELETE /api/upload/:key` - Delete file from R2

### Health Check

- `GET /health` - Server health check

## Project Structure

```
api/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB HTTP API client
│   │   └── r2.js            # R2 configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contentController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js          # User model (MongoDB)
│   │   └── Content.js       # Content model (MongoDB)
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── content.js
│   │   └── upload.js
│   ├── utils/
│   │   ├── jwt.js           # JWT implementation (Web Crypto)
│   │   └── password.js      # Password hashing (Web Crypto)
│   └── index.js             # Main entry point
├── wrangler.toml            # Workers configuration
└── package.json
```

## Differences from Express Version

### Request/Response

- Uses Hono's context (`c`) instead of Express `req`/`res`
- `c.req.json()` instead of `req.body`
- `c.req.param()` instead of `req.params`
- `c.req.query()` instead of `req.query`
- `c.json()` instead of `res.json()`

### Database

- No Mongoose ODM - uses MongoDB HTTP API directly
- Models are plain classes with static methods
- ObjectId handling is different (uses `$oid` format for MongoDB Data API)

### File Upload

- Uses `FormData` API instead of Multer
- Files are accessed via `c.req.formData()`
- R2 bindings are accessed via `c.env.R2_BUCKET`

### Environment Variables

- Access via `c.env` in Workers context
- Use `wrangler secret put` for sensitive values
- Non-sensitive values can go in `wrangler.toml` `[vars]`

## Limitations

1. **MongoDB Data API**: Some MongoDB features may not be available via HTTP API
2. **File Size**: Workers have a 100MB request/response limit
3. **Execution Time**: Workers have a 30-second CPU time limit (unlimited wall-clock time for HTTP requests)
4. **Memory**: Workers have memory limits (128MB default)

## Migration Notes

If migrating from the Express version:

1. Update your MongoDB connection to use the Data API
2. Update environment variable access to use `c.env`
3. Update file uploads to use FormData
4. Test all endpoints thoroughly
5. Update any client code if response formats changed

## Development

### Local Development

```bash
pnpm dev
```

### Production Deployment

```bash
pnpm deploy
```

### View Logs

```bash
wrangler tail
```

## Troubleshooting

### R2 Binding Not Found

Make sure `R2_BUCKET` is configured in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "unico-land"
```

### MongoDB Connection Issues

- Verify your MongoDB API key is set: `wrangler secret list`
- Check that your cluster name is correct
- Ensure the Data API is enabled in MongoDB Atlas

### JWT Errors

- Verify `JWT_SECRET` is set: `wrangler secret list`
- Check token expiration settings

## Performance Benefits

- **Global Distribution**: Workers run at the edge, close to unicoland_users
- **Fast Cold Starts**: V8 isolates start in milliseconds
- **Auto-scaling**: Workers scale automatically
- **Cost Effective**: Pay only for what you use
