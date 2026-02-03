import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  MarkEmailRead as ReadIcon,
  MarkEmailUnread as UnreadIcon,
} from "@mui/icons-material";
import { contactAPI, ContactMessage } from "../services/api";

export default function ContactMessagesList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [isReadFilter, setIsReadFilter] = useState<string>("");
  const navigate = useNavigate();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.list({
        page: page + 1,
        limit: rowsPerPage,
        ...(isReadFilter !== "" && { isRead: isReadFilter }),
      });
      setMessages(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, rowsPerPage, isReadFilter]);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await contactAPI.markRead(id, isRead);
      fetchMessages();
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Tin nhắn liên hệ</Typography>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={isReadFilter}
            label="Trạng thái"
            onChange={(e) => {
              setIsReadFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="0">Chưa đọc</MenuItem>
            <MenuItem value="1">Đã đọc</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Người gửi</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có tin nhắn
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id} hover sx={{ bgcolor: msg.isRead ? undefined : "grey.50" }}>
                  <TableCell>
                    <Chip
                      label={msg.isRead ? "Đã đọc" : "Chưa đọc"}
                      size="small"
                      color={msg.isRead ? "default" : "primary"}
                    />
                  </TableCell>
                  <TableCell>{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{msg.subject || "—"}</TableCell>
                  <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleMarkRead(msg.id, !msg.isRead)}
                      title={msg.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                    >
                      {msg.isRead ? <UnreadIcon fontSize="small" /> : <ReadIcon fontSize="small" />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/messages/${msg.id}`)}
                      title="Xem chi tiết"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>
    </Box>
  );
}
