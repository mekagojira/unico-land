# Uni-Co CMS API

Backend API service for managing the company website content.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Content Management**: Full CRUD operations for website content
- **Multi-language Support**: Content can be stored in different locales (jp, vi)
- **Role-based Access**: Three user roles (admin, editor, viewer)
- **File Upload**: Cloudflare R2 integration for file storage

## Setup

### 1. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

Using Bun (recommended):

```bash
bun install
```

Or using pnpm:

```bash
pnpm install
```

### 3. MongoDB Setup

For **local development**, you only need the MongoDB connection string. See [MONGODB-SETUP.md](./MONGODB-SETUP.md) for detailed instructions.

**Quick setup:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add database name: `mongodb+srv://.../uni-co-cms?...`

### 4. Environment Variables

Create a `.env` file in the root of the `api` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database: Using D1 (SQLite) - Remote D1 only
# D1 database is configured in wrangler.toml
# For local development, requires D1_ACCOUNT_ID, D1_DATABASE_ID, and D1_API_TOKEN in .env file

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:3001

# Cloudflare R2 Configuration (for Node.js)
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 3. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
```

Or using npm:

```bash
npm install -g bun
```

### 5. Run the Server

#### Development (with live reload)

```bash
bun dev
# or
pnpm dev
```

This will start the server with Bun's built-in watch mode, which automatically restarts when you make changes to files.

#### Production

```bash
bun start
# or
pnpm start
```

The API will be available at `http://localhost:3000`

#### Cloudflare Workers (alternative)

To run as a Cloudflare Worker locally:

```bash
pnpm dev:workers
```

To deploy to Cloudflare Workers:

```bash
pnpm deploy
```

## Why Bun?

- ⚡ **Fast**: Bun is significantly faster than Node.js
- 🔥 **Hot Reload**: Built-in watch mode with instant restarts
- 📦 **Fast Install**: Package installation is much faster
- 🎯 **Native Support**: Native TypeScript, ES modules, and more
- 🚀 **Better Performance**: Optimized JavaScript runtime

## Creating Admin User

If you encounter TLS errors with Bun (known compatibility issue), use the Node.js version:

```bash
# Try with Bun first
bun run create-admin

# If that fails, use Node.js version
bun run create-admin:node
# or
node utils/createAdmin.node.js
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Content Management

All content endpoints require authentication.

- `GET /api/content` - Get all content (with pagination, filters)
- `GET /api/content/:id` - Get content by ID
- `GET /api/content/slug/:slug` - Get content by slug
- `POST /api/content` - Create new content (editor/admin only)
- `PUT /api/content/:id` - Update content (editor/admin only)
- `DELETE /api/content/:id` - Delete content (admin only)

### File Upload

All upload endpoints require authentication and editor/admin role.

- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files (max 10)
- `DELETE /api/upload/:key` - Delete file from R2

**Upload Request Format:**

- Single file: `multipart/form-data` with field name `file`
- Multiple files: `multipart/form-data` with field name `files`
- Optional: `folder` parameter to specify upload folder (default: `uploads`)

**File Restrictions:**

- Maximum file size: 10MB
- Allowed types: Images (JPEG, PNG, GIF, WebP, SVG), Documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX), Text files, Archives (ZIP, RAR)

### Health Check

- `GET /health` - Server health check

## User Roles

- **admin**: Full access to all operations
- **editor**: Can create and update content
- **viewer**: Can only view content

## Content Types

- `page` - Static pages
- `post` - Blog posts
- `news` - News articles
- `announcement` - Announcements

## Content Status

- `draft` - Not published
- `published` - Published and visible
- `archived` - Archived content

## Example API Usage

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Create Content (with token)

```bash
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Welcome to Uni-Co",
    "slug": "welcome-to-uni-co",
    "content": "This is the welcome content...",
    "type": "page",
    "status": "published",
    "locale": "jp"
  }'
```

### Upload File (with token)

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg" \
  -F "folder=images"
```

### Upload Multiple Files (with token)

```bash
curl -X POST http://localhost:3000/api/upload/multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.png" \
  -F "folder=documents"
```

### Delete File (with token)

```bash
curl -X DELETE http://localhost:3000/api/upload/uploads/image-1234567890-abc123.jpg \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
api/
├── config/
│   ├── database.js          # MongoDB connection
│   └── r2.js                # Cloudflare R2 configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── contentController.js # Content management logic
│   └── uploadController.js  # File upload logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── upload.js            # File upload middleware (multer)
├── models/
│   ├── User.js              # User model
│   └── Content.js           # Content model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── content.js           # Content routes
│   ├── upload.js            # File upload routes
│   └── index.js             # Root route
├── app.js                   # Express app configuration
└── package.json
```

## Cloudflare R2 Setup

1. Create an R2 bucket in your Cloudflare dashboard
2. Create an API token with R2 read/write permissions
3. Get your R2 endpoint URL (format: `https://<account-id>.r2.cloudflarestorage.com`)
4. Set up a public domain for your R2 bucket (optional but recommended)
5. Add all R2 configuration variables to your `.env` file

## Security Notes

- Always use a strong `JWT_SECRET` in production
- Change default MongoDB connection string for production
- Configure CORS properly for your frontend domain
- Use HTTPS in production
- Keep dependencies updated
- Secure your R2 credentials - never commit them to version control
- Configure R2 bucket CORS policies if needed for direct browser uploads
