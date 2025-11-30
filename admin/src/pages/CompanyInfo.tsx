import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Save as SaveIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  ContactMail as ContactIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { companyAPI, CompanyInfo } from "../services/api";
import ImageUpload from "../components/ImageUpload";

export default function CompanyInfoPage() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await companyAPI.get();
      setCompany(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tải thông tin công ty thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    if (company) {
      setCompany({ ...company, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await companyAPI.update(company);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Cập nhật thông tin công ty thất bại"
      );
    } finally {
      setSaving(false);
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

  if (!company) {
    return (
      <Box>
        <Alert severity="error">Không tìm thấy thông tin công ty</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Thông tin công ty
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setError(null)}
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
            Cập nhật thông tin công ty thành công!
          </Alert>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Company Information */}
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
                <BusinessIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thông tin công ty
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Tên công ty (JP)"
                    value={company.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Tên công ty (EN)"
                    value={company.nameEn}
                    onChange={(e) => handleChange("nameEn", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Thành lập"
                    value={company.established}
                    onChange={(e) =>
                      handleChange("established", e.target.value)
                    }
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Người đại diện"
                    value={company.representative}
                    onChange={(e) =>
                      handleChange("representative", e.target.value)
                    }
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Giấy phép"
                    value={company.license}
                    onChange={(e) => handleChange("license", e.target.value)}
                    required
                    multiline
                    rows={2}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Tổ chức"
                    value={company.organization || ""}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Address Information */}
          <Box>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  bgcolor: "success.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Địa chỉ
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={company.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Địa chỉ 2"
                    value={company.address2 || ""}
                    onChange={(e) => handleChange("address2", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Contact Information */}
          <Box>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box
                sx={{
                  bgcolor: "warning.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ContactIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thông tin liên hệ
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Điện thoại"
                    value={company.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={company.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    type="email"
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Giờ làm việc"
                    value={company.hours}
                    onChange={(e) => handleChange("hours", e.target.value)}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Ngày nghỉ"
                    value={company.closed || ""}
                    onChange={(e) => handleChange("closed", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}
                    >
                      Logo công ty
                    </Typography>
                    <ImageUpload
                      value={company.logoUrl ? [company.logoUrl] : []}
                      onChange={(keys) =>
                        handleChange("logoUrl", keys[0] || "")
                      }
                      displayUrls={company.logoUrl ? [company.logoUrl] : []} // Pass logoUrl as displayUrl (comes as presigned URL from GET API)
                      multiple={false}
                      folder="company"
                      label=""
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Description Section */}
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
                <DescriptionIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Mô tả & Lời chào
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Lời chào"
                    value={company.greeting || ""}
                    onChange={(e) => handleChange("greeting", e.target.value)}
                    multiline
                    rows={2}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả"
                    value={company.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    multiline
                    rows={4}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>
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
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
