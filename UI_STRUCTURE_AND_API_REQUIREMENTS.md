# UI Structure and API Requirements Documentation

## Table of Contents
1. [Application Architecture](#application-architecture)
2. [Page Structure](#page-structure)
3. [Component Structure](#component-structure)
4. [Content Data Models](#content-data-models)
5. [API Requirements](#api-requirements)
6. [Translation Structure](#translation-structure)

---

## Application Architecture

### Framework & Stack
- **Framework**: Next.js 14+ (App Router)
- **Internationalization**: next-intl
- **Languages**: Japanese (jp) - default, Vietnamese (vi)
- **Styling**: Tailwind CSS
- **Image Optimization**: Next.js Image component

### Directory Structure
```
ui/
├── app/
│   ├── [locale]/              # Locale-specific routes
│   │   ├── layout.tsx         # Locale layout with i18n provider
│   │   ├── page.tsx           # Home page
│   │   ├── company/
│   │   │   └── page.tsx       # Company information page
│   │   ├── contact/
│   │   │   └── page.tsx       # Contact page
│   │   ├── foreign-support/
│   │   │   └── page.tsx       # Foreign support page
│   │   ├── service/
│   │   │   ├── page.tsx       # Services list page
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Service detail page
│   │   └── plan/
│   │       └── [id]/
│   │           └── page.tsx   # Plan detail page
│   ├── components/            # Reusable components
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── i18n/
│   ├── routing.ts             # i18n routing config
│   └── request.ts             # i18n request config
└── messages/
    ├── jp.json                # Japanese translations
    └── vi.json                # Vietnamese translations
```

---

## Page Structure

### 1. Home Page (`/[locale]/page.tsx`)
**Route**: `/` or `/jp/` or `/vi/`

**Components Used**:
- `Navigation`
- `Hero` (with slideshow)
- `LuxuryGallery`
- `About`
- `Plans` (Services overview)
- `Blog`
- `News`
- `Footer`

**Content Sections**:
- Hero section with slideshow background
- Gallery showcase
- About company
- Services preview
- Blog posts preview
- News items preview

---

### 2. Company Page (`/[locale]/company/page.tsx`)
**Route**: `/company` or `/jp/company` or `/vi/company`

**Components Used**:
- `Navigation`
- `Company`
- `Footer`

**Content**:
- Company greeting/introduction
- Company information (name, address, established date, representative, license, organization)
- Business activities (4 activities)
- Contact information

---

### 3. Contact Page (`/[locale]/contact/page.tsx`)
**Route**: `/contact` or `/jp/contact` or `/vi/contact`

**Components Used**:
- `Navigation`
- `Contact`
- `Footer`

**Content**:
- Contact form with fields:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Subject (required dropdown: sales, rental, management, foreign, corporate, other)
  - Message (required)
- Contact information display
- Map placeholder

**Form Submission**: Currently simulated, needs API endpoint

---

### 4. Foreign Support Page (`/[locale]/foreign-support/page.tsx`)
**Route**: `/foreign-support` or `/jp/foreign-support` or `/vi/foreign-support`

**Components Used**:
- `Navigation`
- `ForeignSupport`
- `Footer`

**Content**:
- Introduction/description
- Features (4 features):
  - Contract translation/explanation
  - Guarantor company selection support
  - Bank account & utility procedures
  - Post-move-in lifestyle support
- Tagline/Closing message
- CTA to contact

---

### 5. Services List Page (`/[locale]/service/page.tsx`)
**Route**: `/service` or `/jp/service` or `/vi/service`

**Components Used**:
- `Navigation`
- `ServicesList`
- `Footer`

**Content**:
- List of 4 services:
  - Sales (不動産売買仲介)
  - Rental (賃貸仲介)
  - Management (賃貸管理)
  - Foreign Support (外国籍サポート)
- Each service card shows:
  - Image
  - Icon
  - Title
  - Description
  - Link to detail page

---

### 6. Service Detail Page (`/[locale]/service/[id]/page.tsx`)
**Route**: `/service/[id]` where id ∈ {sales, rental, management, foreignSupport}

**Components Used**:
- `Navigation`
- `ServiceDetail`
- `Footer`

**Content**:
- Service title and description
- Hero image
- Image gallery (2-3 additional images)
- Detailed description
- CTA to contact

**Valid IDs**: `sales`, `rental`, `management`, `foreignSupport`

---

### 7. Plan Detail Page (`/[locale]/plan/[id]/page.tsx`)
**Route**: `/plan/[id]` where id ∈ {simple, natural, designers}

**Components Used**:
- `Navigation`
- `PlanDetail`
- `Footer`

**Content**:
- Plan title and description
- Hero image
- Image gallery (2 additional images)
- Detailed information (detail1, detail2, detail3)
- CTA to contact

**Valid IDs**: `simple`, `natural`, `designers`

---

## Component Structure

### 1. Navigation Component
**File**: `app/components/Navigation.tsx`
**Type**: Client Component

**Features**:
- Fixed top navigation
- Logo (from API: `https://svc.uni-co-jinzai.com/api/image/1710811080191916f93c44cef41299b052827fa8582f1.png`)
- Navigation items:
  - Home (anchor to #)
  - About (link to /company)
  - Services (link to /service)
  - News (anchor to #news)
  - Blog (anchor to #blog)
  - Contact (link to /contact)
- Language switcher
- Mobile responsive with sidebar

**API Needs**:
- Logo image URL (currently hardcoded)

---

### 2. Hero Component
**File**: `app/components/Hero.tsx`
**Type**: Client Component

**Features**:
- Full-screen hero section
- Background slideshow (`HeroSlideshow` component)
- Loading screen with progress
- Badge, title, subtitle, descriptions
- CTA buttons (About, Services)

**API Needs**:
- Hero images for slideshow
- Content text (currently from translations)

---

### 3. LuxuryGallery Component
**File**: `app/components/LuxuryGallery.tsx`
**Type**: Server Component

**Features**:
- Grid of service images
- Links to service detail pages
- Hover effects

**API Needs**:
- Service images (currently using Unsplash placeholders)

---

### 4. About Component
**File**: `app/components/About.tsx`
**Type**: Server Component

**Features**:
- Company description
- 3 feature cards:
  - Feature 1: Excellence
  - Feature 2: International perspective
  - Feature 3: Reliability

**API Needs**:
- Company description and features (currently from translations)

---

### 5. Plans Component
**File**: `app/components/Plans.tsx`
**Type**: Server Component

**Features**:
- Services overview grid
- 4 service cards with icons

**API Needs**:
- Service data (currently from translations)

---

### 6. Blog Component
**File**: `app/components/Blog.tsx`
**Type**: Server Component

**Features**:
- Blog posts grid (4 posts)
- Each post shows:
  - Image placeholder
  - Category
  - Title
  - Excerpt
  - Read more link

**API Needs**:
- Blog posts list
- Blog post images
- Blog post content

---

### 7. News Component
**File**: `app/components/News.tsx`
**Type**: Server Component

**Features**:
- News items list (2 items shown)
- Each item shows:
  - Date
  - Title
  - Details link

**API Needs**:
- News items list

---

### 8. Contact Component
**File**: `app/components/Contact.tsx`
**Type**: Client Component

**Features**:
- Contact form
- Form validation
- Form submission (currently simulated)
- Contact information display
- Map placeholder

**API Needs**:
- POST endpoint for contact form submission
- Contact information (currently from translations)

---

### 9. ServicesList Component
**File**: `app/components/ServicesList.tsx`
**Type**: Client Component

**Features**:
- Services grid
- Service cards with images
- Links to service detail pages

**API Needs**:
- Services list
- Service images

---

### 10. ServiceDetail Component
**File**: `app/components/ServiceDetail.tsx`
**Type**: Server Component

**Features**:
- Service title and description
- Hero image
- Image gallery
- Detailed content
- CTA button

**API Needs**:
- Service detail by ID
- Service images

---

### 11. PlanDetail Component
**File**: `app/components/PlanDetail.tsx`
**Type**: Server Component

**Features**:
- Plan title and description
- Hero image
- Image gallery
- Detailed information (3 detail paragraphs)
- CTA button

**API Needs**:
- Plan detail by ID
- Plan images

---

### 12. Company Component
**File**: `app/components/Company.tsx`
**Type**: Server Component

**Features**:
- Company greeting
- Company information
- Business activities
- Contact information

**API Needs**:
- Company information
- Business activities

---

### 13. ForeignSupport Component
**File**: `app/components/ForeignSupport.tsx`
**Type**: Server Component

**Features**:
- Introduction
- 4 feature cards
- Tagline
- CTA button

**API Needs**:
- Foreign support content

---

### 14. Footer Component
**File**: `app/components/Footer.tsx`
**Type**: Server Component

**Features**:
- Company information
- Navigation links
- Contact information
- Copyright

**API Needs**:
- Company information (currently from translations)

---

## Content Data Models

### 1. Company Information
```typescript
interface CompanyInfo {
  name: string;                    // "Uni-Co 株式会社"
  nameEn: string;                  // "Uni-Co Co., Ltd."
  address: string;                 // "〒333-0851 埼玉県川口市芝新町 14-12"
  address2: string;                // "クレール蕨２F"
  established: string;            // "2020年12月"
  representative: string;         // "代表取締役 グエン・テー・ホアン"
  license: string;                // "宅地建物取引業 埼玉県知事（1）第 25774 号"
  organization: string;            // "社団法人 全日本不動産協会 ほか"
  phone: string;                  // "048-242-5907"
  email: string;                  // "unico@gmail.com"
  hours: string;                  // "9:00〜18:00"
  closed: string;                 // "水曜日"
  logoUrl: string;                // Logo image URL
}
```

### 2. Service
```typescript
interface Service {
  id: string;                     // "sales" | "rental" | "management" | "foreignSupport"
  title: {
    jp: string;
    vi: string;
  };
  description: {
    jp: string;
    vi: string;
  };
  images: string[];               // Array of image URLs
  icon?: string;                  // Emoji icon
  order: number;                  // Display order
}
```

### 3. Plan
```typescript
interface Plan {
  id: string;                     // "simple" | "natural" | "designers"
  name: {
    jp: string;
    vi: string;
  };
  title: {
    jp: string;
    vi: string;
  };
  description: {
    jp: string;
    vi: string;
  };
  detail1: {
    jp: string;
    vi: string;
  };
  detail2: {
    jp: string;
    vi: string;
  };
  detail3: {
    jp: string;
    vi: string;
  };
  images: string[];               // Array of image URLs
  order: number;                  // Display order
}
```

### 4. Blog Post
```typescript
interface BlogPost {
  id: string;
  title: {
    jp: string;
    vi: string;
  };
  excerpt: {
    jp: string;
    vi: string;
  };
  content: {
    jp: string;
    vi: string;
  };
  imageUrl: string;
  category: {
    jp: string;
    vi: string;
  };
  publishedAt: string;           // ISO date string
  createdAt: string;
  updatedAt: string;
}
```

### 5. News Item
```typescript
interface NewsItem {
  id: string;
  title: {
    jp: string;
    vi: string;
  };
  content: {
    jp: string;
    vi: string;
  };
  date: string;                  // ISO date string
  createdAt: string;
  updatedAt: string;
}
```

### 6. Contact Form Submission
```typescript
interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: "sales" | "rental" | "management" | "foreign" | "corporate" | "other";
  message: string;
  submittedAt: string;           // ISO date string
}
```

### 7. Hero Image
```typescript
interface HeroImage {
  id: string;
  url: string;
  alt: {
    jp: string;
    vi: string;
  };
  order: number;
  isActive: boolean;
}
```

### 8. Gallery Item
```typescript
interface GalleryItem {
  id: string;
  title: {
    jp: string;
    vi: string;
  };
  category: {
    jp: string;
    vi: string;
  };
  imageUrl: string;
  order: number;
}
```

---

## API Requirements

### Base URL
- Development: `http://localhost:3000/api` (or configured API URL)
- Production: Configured API URL

### Authentication
- Admin endpoints require JWT authentication
- Public endpoints are open

---

### 1. Company Information API

#### GET `/api/company`
Get company information.

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "Uni-Co 株式会社",
    "nameEn": "Uni-Co Co., Ltd.",
    "address": "〒333-0851 埼玉県川口市芝新町 14-12",
    "address2": "クレール蕨２F",
    "established": "2020年12月",
    "representative": "代表取締役 グエン・テー・ホアン",
    "license": "宅地建物取引業 埼玉県知事（1）第 25774 号",
    "organization": "社団法人 全日本不動産協会 ほか",
    "phone": "048-242-5907",
    "email": "unico@gmail.com",
    "hours": "9:00〜18:00",
    "closed": "水曜日",
    "logoUrl": "https://svc.uni-co-jinzai.com/api/image/..."
  }
}
```

#### PUT `/api/company` (Admin)
Update company information.

**Request Body**: Same as GET response

---

### 2. Services API

#### GET `/api/services`
Get all services.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "sales",
      "title": { "jp": "...", "vi": "..." },
      "description": { "jp": "...", "vi": "..." },
      "images": ["url1", "url2", "url3"],
      "icon": "🏛️",
      "order": 1
    },
    ...
  ]
}
```

#### GET `/api/services/:id`
Get service by ID.

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "sales",
    "title": { "jp": "...", "vi": "..." },
    "description": { "jp": "...", "vi": "..." },
    "images": ["url1", "url2", "url3"],
    "icon": "🏛️",
    "order": 1
  }
}
```

#### POST `/api/services` (Admin)
Create new service.

**Request Body**:
```json
{
  "id": "new-service",
  "title": { "jp": "...", "vi": "..." },
  "description": { "jp": "...", "vi": "..." },
  "images": ["url1", "url2"],
  "icon": "🏛️",
  "order": 5
}
```

#### PUT `/api/services/:id` (Admin)
Update service.

**Request Body**: Same as POST

#### DELETE `/api/services/:id` (Admin)
Delete service.

---

### 3. Plans API

#### GET `/api/plans`
Get all plans.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "simple",
      "name": { "jp": "...", "vi": "..." },
      "title": { "jp": "...", "vi": "..." },
      "description": { "jp": "...", "vi": "..." },
      "detail1": { "jp": "...", "vi": "..." },
      "detail2": { "jp": "...", "vi": "..." },
      "detail3": { "jp": "...", "vi": "..." },
      "images": ["url1", "url2", "url3"],
      "order": 1
    },
    ...
  ]
}
```

#### GET `/api/plans/:id`
Get plan by ID.

**Response**: Single plan object

#### POST `/api/plans` (Admin)
Create new plan.

#### PUT `/api/plans/:id` (Admin)
Update plan.

#### DELETE `/api/plans/:id` (Admin)
Delete plan.

---

### 4. Blog Posts API

#### GET `/api/blog`
Get blog posts (paginated).

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `locale`: "jp" | "vi" (optional, for filtering)

**Response**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post-1",
        "title": { "jp": "...", "vi": "..." },
        "excerpt": { "jp": "...", "vi": "..." },
        "content": { "jp": "...", "vi": "..." },
        "imageUrl": "url",
        "category": { "jp": "...", "vi": "..." },
        "publishedAt": "2024-01-15T00:00:00Z",
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### GET `/api/blog/:id`
Get blog post by ID.

**Response**: Single blog post object

#### POST `/api/blog` (Admin)
Create new blog post.

**Request Body**:
```json
{
  "title": { "jp": "...", "vi": "..." },
  "excerpt": { "jp": "...", "vi": "..." },
  "content": { "jp": "...", "vi": "..." },
  "imageUrl": "url",
  "category": { "jp": "...", "vi": "..." },
  "publishedAt": "2024-01-15T00:00:00Z"
}
```

#### PUT `/api/blog/:id` (Admin)
Update blog post.

#### DELETE `/api/blog/:id` (Admin)
Delete blog post.

---

### 5. News API

#### GET `/api/news`
Get news items (paginated).

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `locale`: "jp" | "vi" (optional)

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "news-1",
        "title": { "jp": "...", "vi": "..." },
        "content": { "jp": "...", "vi": "..." },
        "date": "2024-01-15T00:00:00Z",
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

#### GET `/api/news/:id`
Get news item by ID.

**Response**: Single news item object

#### POST `/api/news` (Admin)
Create new news item.

**Request Body**:
```json
{
  "title": { "jp": "...", "vi": "..." },
  "content": { "jp": "...", "vi": "..." },
  "date": "2024-01-15T00:00:00Z"
}
```

#### PUT `/api/news/:id` (Admin)
Update news item.

#### DELETE `/api/news/:id` (Admin)
Delete news item.

---

### 6. Contact Form API

#### POST `/api/contact`
Submit contact form.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "090-1234-5678",
  "subject": "sales",
  "message": "I'm interested in..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "contact-123",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET `/api/contact` (Admin)
Get contact submissions (paginated).

**Query Parameters**:
- `page`: number
- `limit`: number

**Response**:
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "contact-123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "090-1234-5678",
        "subject": "sales",
        "message": "...",
        "submittedAt": "2024-01-15T10:30:00Z"
      },
      ...
    ],
    "pagination": { ... }
  }
}
```

---

### 7. Hero Images API

#### GET `/api/hero-images`
Get active hero images for slideshow.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "hero-1",
      "url": "https://...",
      "alt": { "jp": "...", "vi": "..." },
      "order": 1,
      "isActive": true
    },
    ...
  ]
}
```

#### POST `/api/hero-images` (Admin)
Upload/create hero image.

#### PUT `/api/hero-images/:id` (Admin)
Update hero image.

#### DELETE `/api/hero-images/:id` (Admin)
Delete hero image.

---

### 8. Gallery API

#### GET `/api/gallery`
Get gallery items.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "gallery-1",
      "title": { "jp": "...", "vi": "..." },
      "category": { "jp": "...", "vi": "..." },
      "imageUrl": "https://...",
      "order": 1
    },
    ...
  ]
}
```

#### POST `/api/gallery` (Admin)
Create gallery item.

#### PUT `/api/gallery/:id` (Admin)
Update gallery item.

#### DELETE `/api/gallery/:id` (Admin)
Delete gallery item.

---

### 9. Image Upload API

#### POST `/api/upload`
Upload image file.

**Request**: multipart/form-data
- `file`: File
- `type`: string (e.g., "service", "plan", "blog", "gallery", "hero")

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "filename": "image.jpg",
    "size": 123456,
    "type": "image/jpeg"
  }
}
```

---

## Translation Structure

### Current Implementation
- Translations stored in JSON files: `messages/jp.json` and `messages/vi.json`
- Structure follows nested keys: `section.subsection.key`
- All user-facing text is translated

### Translation Keys Structure
```
{
  "nav": { ... },
  "hero": { ... },
  "about": { ... },
  "services": {
    "badge": "...",
    "title": "...",
    "subtitle": "...",
    "sales": { "title": "...", "description": "..." },
    "rental": { ... },
    "management": { ... },
    "foreignSupport": { ... },
    "simple": { ... },
    "natural": { ... },
    "designers": { ... }
  },
  "blog": { ... },
  "news": { ... },
  "company": { ... },
  "contact": { ... },
  "footer": { ... },
  "gallery": { ... }
}
```

### API Integration for Translations
Currently, translations are static JSON files. For dynamic content:
- Blog posts, news, services, plans should have multilingual fields in database
- Static UI text can remain in JSON files
- Content from CMS should support both locales

---

## Database Schema Recommendations

### Tables Needed

1. **company_info** - Company information
2. **services** - Services with multilingual fields
3. **plans** - Plans with multilingual fields
4. **blog_posts** - Blog posts with multilingual fields
5. **news_items** - News items with multilingual fields
6. **contact_submissions** - Contact form submissions
7. **hero_images** - Hero slideshow images
8. **gallery_items** - Gallery items
9. **images** - Image metadata and URLs

### Key Design Considerations
- All content tables should have multilingual text fields (jp, vi)
- Use JSON columns or separate columns for translations
- Include timestamps (createdAt, updatedAt)
- Include order/position fields for sorting
- Include isActive/published flags for content management
- Image URLs should be stored, not files directly

---

## Implementation Priority

### Phase 1: Core Content APIs
1. Company Information API
2. Services API
3. Plans API
4. Contact Form API

### Phase 2: Content Management APIs
5. Blog Posts API
6. News API
7. Hero Images API
8. Gallery API

### Phase 3: Image Management
9. Image Upload API
10. Image optimization and CDN integration

### Phase 4: Admin Features
11. Admin authentication
12. Admin dashboard for content management
13. Content editing interfaces

---

## Notes

1. **Image Handling**: Currently using Unsplash placeholders. Need to implement proper image upload and storage (R2 or similar).

2. **Form Submission**: Contact form currently simulated. Needs real API endpoint.

3. **Content Management**: Most content is currently in translation files. Should move dynamic content to database.

4. **SEO**: Pages have metadata generation. Ensure API supports SEO fields.

5. **Caching**: Consider implementing caching for frequently accessed content.

6. **Error Handling**: All API responses should follow consistent error format:
   ```json
   {
     "success": false,
     "error": {
       "code": "ERROR_CODE",
       "message": "Error message"
     }
   }
   ```

---

## End of Documentation

This document should be used as a reference for:
- Understanding the UI structure
- Designing API endpoints
- Planning database schema
- Implementing content management features

