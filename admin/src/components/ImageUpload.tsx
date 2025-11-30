import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { uploadAPI } from "../services/api";

interface ImageUploadProps {
  value: string[]; // Array of keys (or presigned URLs for display)
  onChange: (keys: string[]) => void; // Callback with array of keys
  folder?: string;
  multiple?: boolean;
  label?: string;
  displayUrls?: string[]; // Optional array of presigned URLs for display (from GET API)
}

export default function ImageUpload({
  value = [],
  onChange,
  folder = "services",
  multiple = true,
  label = "Tải lên hình ảnh",
  displayUrls = [], // Presigned URLs for display (from GET API)
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({}); // Map of key -> presigned URL for newly uploaded images
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      if (multiple) {
        const fileArray = Array.from(files);
        const response = await uploadAPI.uploadMultiple(fileArray, folder);
        if (response.success && response.data) {
          // Store only keys (not URLs) - presigned URLs will be generated on GET requests
          const newKeys: string[] = [];
          const newPreviewUrls: Record<string, string> = {};
          (
            response.data as Array<{ key: string; presignedUrl?: string }>
          ).forEach((file) => {
            newKeys.push(file.key);
            if (file.presignedUrl) {
              newPreviewUrls[file.key] = file.presignedUrl;
              console.log(
                "Stored presigned URL for key:",
                file.key,
                file.presignedUrl
              );
            } else {
              console.warn("No presigned URL returned for key:", file.key);
            }
          });
          setPreviewUrls((prev) => {
            const updated = { ...prev, ...newPreviewUrls };
            console.log("Updated previewUrls:", updated);
            return updated;
          });
          onChange([...value, ...newKeys]);
        }
      } else {
        const response = await uploadAPI.upload(files[0], folder);
        if (response.success && response.data) {
          // Store only key (not URL) - presigned URL will be generated on GET requests
          const key = response.data.key;
          if (response.data.presignedUrl) {
            setPreviewUrls((prev) => {
              const updated = { ...prev, [key]: response.data.presignedUrl! };
              console.log(
                "Stored presigned URL for single upload:",
                key,
                response.data.presignedUrl
              );
              console.log("Updated previewUrls:", updated);
              return updated;
            });
          } else {
            console.warn(
              "No presigned URL returned for single upload key:",
              key
            );
          }
          onChange([key]);
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Tải lên hình ảnh thất bại");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          bgcolor: "grey.50",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <Stack spacing={2} alignItems="center">
          <ImageIcon sx={{ fontSize: 48, color: "text.secondary" }} />
          <Box>
            <Button
              variant="contained"
              component="span"
              startIcon={
                uploading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CloudUploadIcon />
                )
              }
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              sx={{ borderRadius: 2 }}
            >
              {uploading
                ? "Đang tải lên..."
                : multiple
                ? "Chọn hình ảnh"
                : "Chọn hình ảnh"}
            </Button>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              {multiple
                ? "Có thể chọn nhiều hình ảnh"
                : "Chỉ chọn một hình ảnh"}{" "}
              (JPG, PNG, GIF)
            </Typography>
          </Box>
        </Stack>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {value.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
          >
            Hình ảnh đã tải lên ({value.length})
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {value.map((key, index) => {
              // Get display URL: prefer displayUrls from GET API (if it's a valid URL), then previewUrls from upload, fallback to key
              // For newly uploaded images, previewUrls should have the presigned URL
              // Check if displayUrls[index] exists and is a valid URL (starts with http)
              const displayUrlFromIndex =
                displayUrls[index] && displayUrls[index].startsWith("http")
                  ? displayUrls[index]
                  : null;
              const displayUrl = displayUrlFromIndex || previewUrls[key] || key;
              const displayKey =
                key.length > 30 ? `${key.substring(0, 30)}...` : key;

              return (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                    width: 120,
                    height: 120,
                  }}
                >
                  <img
                    src={displayUrl}
                    alt={`Upload ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      // If image fails to load, try using the key as a fallback
                      if (displayUrl !== key) {
                        (e.target as HTMLImageElement).src = key;
                      }
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(index)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <Chip
                    label={displayKey}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      right: 4,
                      fontSize: "0.65rem",
                      height: 20,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
