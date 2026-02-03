import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MarkEmailRead as ReadIcon,
  MarkEmailUnread as UnreadIcon,
} from "@mui/icons-material";
import { contactAPI, ContactMessage } from "../services/api";

export default function ContactMessageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await contactAPI.getById(id);
      if (response.success) setMessage(response.data);
    } catch (error) {
      console.error("Failed to fetch message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async () => {
    if (!message) return;
    setUpdating(true);
    try {
      await contactAPI.markRead(message.id, !message.isRead);
      setMessage({ ...message, isRead: message.isRead ? 0 : 1 });
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!message) {
    return (
      <Box>
        <Typography color="text.secondary">Không tìm thấy tin nhắn.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/messages")} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/messages")}>
          Quay lại
        </Button>
        <Chip
          label={message.isRead ? "Đã đọc" : "Chưa đọc"}
          size="small"
          color={message.isRead ? "default" : "primary"}
        />
        <Button
          size="small"
          variant="outlined"
          startIcon={message.isRead ? <UnreadIcon /> : <ReadIcon />}
          onClick={handleToggleRead}
          disabled={updating}
        >
          {message.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Người gửi
        </Typography>
        <Typography variant="h6">{message.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {message.email}
        </Typography>

        <Typography variant="overline" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Chủ đề
        </Typography>
        <Typography variant="body1">{message.subject || "—"}</Typography>

        <Typography variant="overline" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Nội dung
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", mt: 1 }}
        >
          {message.message}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
          Gửi lúc: {new Date(message.createdAt).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
}
