# R2 CORS Manual Setup

If the automated CORS setup script doesn't work, you can configure CORS manually via the Cloudflare Dashboard.

## Steps:

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select your account

2. **Navigate to R2**
   - Click on "R2" in the left sidebar
   - Select your bucket: `unico-land`

3. **Open Settings**
   - Click on "Settings" tab
   - Scroll down to "CORS Policy" section

4. **Add CORS Policy**
   - Click "Add CORS policy" or "Edit CORS policy"
   - Paste the following JSON:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://uni-co-group.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD",
      "OPTIONS"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-request-id",
      "x-amz-id-2",
      "x-amz-version-id"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

5. **Save the configuration**
   - Click "Save" or "Update"
   - Wait a few seconds for the changes to propagate

## Important Notes:

- **Wildcards**: R2 CORS doesn't support wildcard patterns like `https://*.uni-co-group.com` in `AllowedOrigins`. You must list each origin explicitly.
- **AllowedHeaders**: Using `"*"` allows all headers, which is necessary for presigned URL uploads that include various AWS signature headers.
- **Propagation**: CORS changes may take a few seconds to propagate. If you still see errors, wait 30-60 seconds and try again.
- **Browser Cache**: Clear your browser cache or try in an incognito window if CORS errors persist after configuration.

## Verify CORS Configuration:

Run the check script:
```bash
bun utils/check-r2-cors.js
```

Or test manually with curl:
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type,content-length" \
  -v \
  "https://unico-land.aaf162b2efd6cd5cf6644ecb892b89c3.r2.cloudflarestorage.com/unico-land/test"
```

You should see `Access-Control-Allow-Origin: http://localhost:5173` in the response headers.

