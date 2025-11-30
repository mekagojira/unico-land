import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { servicesAPI, type Service } from "../services/api";
import ImageUpload from "../components/ImageUpload";

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [service, setService] = useState<Partial<Service>>({
    id: "",
    titleJp: "",
    titleVi: "",
    descriptionJp: "",
    descriptionVi: "",
    contentJp: "",
    contentVi: "",
    images: [],
    icon: "",
    orderIndex: 0,
    isActive: 1,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (isEdit && id) {
      fetchService();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesAPI.getById(id!);
      const data = response.data;
      setService({
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Tải dịch vụ thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Service, value: unknown) => {
    setService({ ...service, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.id || !service.titleJp || !service.titleVi) {
      setError("ID, Tiêu đề (JP) và Tiêu đề (VI) là bắt buộc");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEdit) {
        await servicesAPI.update(id!, service);
      } else {
        await servicesAPI.create(service);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/services");
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Lưu dịch vụ thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      return;
    }

    try {
      await servicesAPI.delete(id!);
      navigate("/services");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Xóa dịch vụ thất bại");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/services")}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
            </Typography>
          </Box>
          {isEdit && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ borderRadius: 2 }}
            >
              Xóa
            </Button>
          )}
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setError(null)}
            icon={<InfoIcon />}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setSuccess(false)}
          >
            Dịch vụ đã được {isEdit ? "cập nhật" : "tạo"} thành công!
          </Alert>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Basic Information Section */}
          <Box>
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
                <InfoIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thông tin cơ bản
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="ID Dịch vụ"
                    value={service.id}
                    onChange={(e) => handleChange("id", e.target.value)}
                    required
                    disabled={isEdit}
                    helperText="VD: sales, rental, management, foreignSupport"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Biểu tượng (Emoji)"
                    value={service.icon || ""}
                    onChange={(e) => handleChange("icon", e.target.value)}
                    placeholder="🏛️"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <FormControl
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  >
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={service.isActive}
                      label="Trạng thái"
                      onChange={(e) =>
                        handleChange("isActive", e.target.value === 1 ? 1 : 0)
                      }
                    >
                      <MenuItem value={1}>Kích hoạt</MenuItem>
                      <MenuItem value={0}>Vô hiệu</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Content Section */}
          <Box>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
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
                <DescriptionIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Nội dung dịch vụ
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Tiêu đề (Tiếng Nhật)"
                    value={service.titleJp}
                    onChange={(e) => handleChange("titleJp", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Tiêu đề (Tiếng Việt)"
                    value={service.titleVi}
                    onChange={(e) => handleChange("titleVi", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả (Tiếng Nhật)"
                    value={service.descriptionJp}
                    onChange={(e) =>
                      handleChange("descriptionJp", e.target.value)
                    }
                    required
                    multiline
                    rows={3}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả (Tiếng Việt)"
                    value={service.descriptionVi}
                    onChange={(e) =>
                      handleChange("descriptionVi", e.target.value)
                    }
                    required
                    multiline
                    rows={3}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Nội dung (Tiếng Nhật)"
                    value={service.contentJp || ""}
                    onChange={(e) => handleChange("contentJp", e.target.value)}
                    multiline
                    rows={4}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Nội dung (Tiếng Việt)"
                    value={service.contentVi || ""}
                    onChange={(e) => handleChange("contentVi", e.target.value)}
                    multiline
                    rows={4}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
          {/* Images Section */}
          <Box>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  bgcolor: "info.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ImageIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Hình ảnh
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <ImageUpload
                  value={service.images || []}
                  onChange={(keys) => handleChange("images", keys)}
                  displayUrls={service.images || []} // Pass images array as displayUrls (they come as presigned URLs from GET API)
                  folder="services"
                  multiple={true}
                  label="Hình ảnh dịch vụ"
                />
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons */}
          <Box>
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
                  onClick={() => navigate("/services")}
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
                  {saving ? "Đang lưu..." : "Lưu dịch vụ"}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
