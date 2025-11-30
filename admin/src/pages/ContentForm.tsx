import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { contentAPI, Content } from "../services/api";

export default function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<Partial<Content>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    type: "post",
    status: "draft",
    locale: "jp",
    tags: [],
    metadata: {},
  });

  useEffect(() => {
    if (id && id !== "new") {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await contentAPI.getById(id || "");
      if (response.success) {
        setContent(response.data);
      }
    } catch (error: Error | unknown | any) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load content";
      setError(error.response?.data?.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setContent({
      ...content,
      title,
      slug: content.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (id && id !== "new") {
        await contentAPI.update(id, content);
      } else {
        await contentAPI.create(content);
      }
      navigate("/content");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton
            onClick={() => navigate("/content")}
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {id === "new" ? "Tạo nội dung mới" : "Chỉnh sửa nội dung"}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Main Content */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 66.666%" } }}>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ArticleIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Nội dung
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Tiêu đề"
                    value={content.title}
                    onChange={handleTitleChange}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Slug"
                    value={content.slug}
                    onChange={(e) =>
                      setContent({ ...content, slug: e.target.value })
                    }
                    required
                    helperText="Phiên bản URL-friendly của tiêu đề"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Tóm tắt"
                    value={content.excerpt || ""}
                    onChange={(e) =>
                      setContent({ ...content, excerpt: e.target.value })
                    }
                    multiline
                    rows={3}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Nội dung"
                    value={content.content}
                    onChange={(e) =>
                      setContent({ ...content, content: e.target.value })
                    }
                    required
                    multiline
                    rows={15}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar Settings */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 33.333%" } }}>
            <Card
              elevation={2}
              sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}
            >
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <SettingsIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Cài đặt
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <InputLabel>Loại</InputLabel>
                    <Select
                      value={content.type}
                      label="Loại"
                      onChange={(e) =>
                        setContent({ ...content, type: e.target.value as any })
                      }
                    >
                      <MenuItem value="post">Bài viết</MenuItem>
                      <MenuItem value="page">Trang</MenuItem>
                      <MenuItem value="news">Tin tức</MenuItem>
                      <MenuItem value="announcement">Thông báo</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={content.status}
                      label="Trạng thái"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <MenuItem value="draft">Bản nháp</MenuItem>
                      <MenuItem value="published">Đã xuất bản</MenuItem>
                      <MenuItem value="archived">Đã lưu trữ</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <InputLabel>Ngôn ngữ</InputLabel>
                    <Select
                      value={content.locale}
                      label="Ngôn ngữ"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          locale: e.target.value as any,
                        })
                      }
                    >
                      <MenuItem value="jp">Tiếng Nhật</MenuItem>
                      <MenuItem value="vi">Tiếng Việt</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="URL Hình ảnh nổi bật"
                    value={content.featuredImage || ""}
                    onChange={(e) =>
                      setContent({ ...content, featuredImage: e.target.value })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Thẻ (phân cách bằng dấu phẩy)"
                    value={
                      Array.isArray(content.tags) ? content.tags.join(", ") : ""
                    }
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag.length > 0);
                      setContent({ ...content, tags });
                    }}
                    helperText="Phân cách các thẻ bằng dấu phẩy"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ width: "100%", mt: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "grey.50",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate("/content")}
                disabled={saving}
                sx={{ borderRadius: 2, minWidth: 120 }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={saving}
                size="large"
                sx={{ borderRadius: 2, minWidth: 150, px: 4 }}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </form>
    </Box>
  );
}
