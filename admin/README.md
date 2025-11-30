# Uni-Co CMS Admin Panel

Admin panel for managing content on the Uni-Co website. Built with React, TypeScript, Material UI, and Vite.

## Features

- 🔐 **Authentication** - Secure login with JWT tokens
- 📊 **Dashboard** - Overview of content statistics
- 📝 **Content Management** - Full CRUD operations for content
- 🎨 **Material UI** - Modern, responsive design
- 🌐 **Multi-language** - Support for Japanese and Vietnamese content
- 🔍 **Filtering & Search** - Filter content by type, status, and locale

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Or with npm
npm install
```

### Environment Variables

Create a `.env` file in the `admin` directory:

```env
VITE_API_URL=http://localhost:3000
```

### Development

```bash
# Start development server
pnpm dev

# The admin panel will be available at http://localhost:3001
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Default Login Credentials

After running `bun run init-d1` in the `api` directory, you can login with:

- **Email**: `unico@gmail.com`
- **Password**: `Unico@2025`

⚠️ **Important**: Change the password after first login!

## Project Structure

```
admin/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.tsx   # Main layout with sidebar
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── contexts/      # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/          # Page components
│   │   ├── Login.tsx   # Login page
│   │   ├── Dashboard.tsx  # Dashboard
│   │   ├── ContentList.tsx  # Content list
│   │   └── ContentForm.tsx  # Create/Edit content
│   ├── services/       # API services
│   │   └── api.ts      # API client and endpoints
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── package.json
```

## Features Overview

### Authentication

- JWT-based authentication
- Automatic token refresh
- Protected routes
- Session persistence

### Content Management

- **List View**: Browse all content with filtering
- **Create**: Add new content with rich form
- **Edit**: Update existing content
- **Delete**: Remove content (with confirmation)
- **Filtering**: Filter by type, status, and locale
- **Pagination**: Navigate through large content lists

### Dashboard

- Content statistics overview
- Quick access to common actions
- Visual indicators for content status

## API Integration

The admin panel communicates with the backend API at `http://localhost:3000` (configurable via `VITE_API_URL`).

### Endpoints Used

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/content` - List content (with pagination and filters)
- `GET /api/content/:id` - Get single content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

## Development Tips

1. **Hot Reload**: Vite provides instant HMR (Hot Module Replacement)
2. **TypeScript**: Full type safety for API responses
3. **Material UI**: Use MUI components for consistent design
4. **Error Handling**: API errors are handled automatically with user-friendly messages

## Troubleshooting

### Cannot connect to API

- Ensure the API server is running on `http://localhost:3000`
- Check `VITE_API_URL` in `.env` file
- Check CORS settings in the API

### Login fails

- Verify the admin user exists in the database
- Check API logs for errors
- Ensure the API is accessible

### Build errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm run build`

## License

Private project for Uni-Co Group.
