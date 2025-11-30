import { getR2Client, getR2PublicUrl } from "../config/r2.js";

// Helper to handle R2 client differences between Workers and Node.js
const uploadToR2 = async (r2Client, key, buffer, options) => {
  // Both Workers binding and Node.js wrapper have put method
  return await r2Client.put(key, buffer, options);
};

const deleteFromR2 = async (r2Client, key) => {
  // Both Workers binding and Node.js wrapper have delete method
  return await r2Client.delete(key);
};

// Generate unique filename
const generateFileName = (originalName) => {
  const ext = originalName.substring(originalName.lastIndexOf("."));
  const name = originalName.substring(0, originalName.lastIndexOf("."));
  const timestamp = Date.now();
  const randomString = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${name}-${timestamp}-${randomString}${ext}`;
};

// @desc    Generate presigned URL for direct upload
// @route   POST /api/upload/presigned
// @access  Private (Editor/Admin)
export const generatePresignedUrl = async (c) => {
  try {
    const body = await c.req.json();
    const { fileName, contentType, folder } = body;

    if (!fileName || !contentType) {
      return c.json(
        {
          success: false,
          message: "fileName and contentType are required",
        },
        400
      );
    }

    const generatedFileName = generateFileName(fileName);
    const key = `${folder || "uploads"}/${generatedFileName}`;
    const publicUrl = getR2PublicUrl(c.env || {});

    // Get R2 client
    const r2Client = getR2Client(c.env || {});

    // Check if we're in Node.js (has s3Client) or Workers (binding)
    let presignedUrl;
    if (r2Client.s3Client && r2Client.getPresignedUrl) {
      // Node.js: Generate presigned URL using AWS SDK
      presignedUrl = await r2Client.getPresignedUrl(key, contentType, 3600); // 1 hour expiry
    } else {
      // Workers: R2 bindings don't support presigned URLs directly
      // Return an error that the client can catch and fallback to regular upload
      return c.json(
        {
          success: false,
          message:
            "Presigned URLs are only available in Node.js environment. Please use regular upload endpoint.",
          code: "PRESIGNED_NOT_AVAILABLE",
        },
        400
      );
    }

    const fileUrl = `${publicUrl}/${key}`;

    return c.json({
      success: true,
      data: {
        presignedUrl,
        url: fileUrl,
        key: key,
        fileName: generatedFileName,
        originalName: fileName,
        contentType: contentType,
        folder: folder || "uploads",
      },
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return c.json(
      {
        success: false,
        message: error.message || "Failed to generate presigned URL",
      },
      500
    );
  }
};

// @desc    Upload single file to R2
// @route   POST /api/upload
// @access  Private (Editor/Admin)
export const uploadFile = async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json(
        {
          success: false,
          message: "No file uploaded",
        },
        400
      );
    }

    const folder = formData.get("folder")?.toString() || "uploads";
    const fileName = generateFileName(file.name);
    const key = `${folder}/${fileName}`;

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Get R2 bucket from environment
    const r2Bucket = getR2Client(c.env || {});

    // Upload to R2
    await uploadToR2(r2Bucket, key, buffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedBy: c.get("user")._id?.toString() || c.get("user").id,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Generate presigned GET URL for immediate preview (optional)
    let presignedUrl = null;
    if (r2Bucket.s3Client && r2Bucket.getPresignedGetUrl) {
      try {
        presignedUrl = await r2Bucket.getPresignedGetUrl(key, 3600 * 24 * 7); // 7 days expiry
      } catch (error) {
        console.error("Error generating presigned GET URL:", error);
      }
    }

    return c.json(
      {
        success: true,
        data: {
          key: key, // Store only the key in database
          presignedUrl: presignedUrl, // Temporary presigned URL for immediate preview
          fileName: fileName,
          originalName: file.name,
          size: file.size,
          mimetype: file.type,
          folder: folder,
        },
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

// @desc    Upload multiple files to R2
// @route   POST /api/upload/multiple
// @access  Private (Editor/Admin)
export const uploadMultipleFiles = async (c) => {
  try {
    const formData = await c.req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return c.json(
        {
          success: false,
          message: "No files uploaded",
        },
        400
      );
    }

    // Limit to 10 files
    if (files.length > 10) {
      return c.json(
        {
          success: false,
          message: "Too many files. Maximum is 10 files",
        },
        400
      );
    }

    const folder = formData.get("folder")?.toString() || "uploads";
    const uploadedFiles = [];
    const r2Bucket = getR2Client(c.env || {});
    const publicUrl = getR2PublicUrl(c.env || {});

    // Upload all files
    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        continue; // Skip files that are too large
      }

      const fileName = generateFileName(file.name);
      const key = `${folder}/${fileName}`;

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      await uploadToR2(r2Bucket, key, buffer, {
        httpMetadata: {
          contentType: file.type,
        },
        customMetadata: {
          originalName: file.name,
          uploadedBy: c.get("user")._id?.toString() || c.get("user").id,
          uploadedAt: new Date().toISOString(),
        },
      });

      // Generate presigned GET URL for immediate preview (optional)
      let presignedUrl = null;
      if (r2Bucket.s3Client && r2Bucket.getPresignedGetUrl) {
        try {
          presignedUrl = await r2Bucket.getPresignedGetUrl(key, 3600 * 24 * 7); // 7 days expiry
        } catch (error) {
          console.error("Error generating presigned GET URL:", error);
        }
      }

      // Return only the key - presigned URLs will be generated on GET requests
      uploadedFiles.push({
        key: key, // Store only the key in database
        presignedUrl: presignedUrl, // Temporary presigned URL for immediate preview
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        mimetype: file.type,
        folder: folder,
      });
    }

    return c.json(
      {
        success: true,
        data: uploadedFiles,
        count: uploadedFiles.length,
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

// @desc    Delete file from R2
// @route   DELETE /api/upload/:key
// @access  Private (Editor/Admin)
export const deleteFile = async (c) => {
  try {
    const key = c.req.param("key");

    if (!key) {
      return c.json(
        {
          success: false,
          message: "File key is required",
        },
        400
      );
    }

    // Decode URL-encoded key
    const decodedKey = decodeURIComponent(key);

    const r2Bucket = getR2Client(c.env || {});
    await deleteFromR2(r2Bucket, decodedKey);

    return c.json({
      success: true,
      message: "File deleted successfully",
      key: decodedKey,
    });
  } catch (error) {
    throw error;
  }
};
