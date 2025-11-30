import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { servicesAPI, Service } from '../services/api';

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await servicesAPI.delete(id);
        fetchServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Xóa dịch vụ thất bại');
      }
    }
    handleMenuClose();
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesAPI.update(service.id, {
        ...service,
        isActive: service.isActive === 1 ? 0 : 1,
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to update service:', error);
      alert('Cập nhật dịch vụ thất bại');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Quản lý dịch vụ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/services/new')}
        >
          Thêm dịch vụ
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Biểu tượng</TableCell>
              <TableCell>Tiêu đề (JP)</TableCell>
              <TableCell>Tiêu đề (VI)</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Kích hoạt</TableCell>
              <TableCell>Cập nhật</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không tìm thấy dịch vụ
                </TableCell>
              </TableRow>
            ) : (
              services
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((service) => (
                  <TableRow key={service.id} hover>
                    <TableCell>
                      <Chip label={service.id} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">{service.icon || '—'}</Typography>
                    </TableCell>
                    <TableCell>{service.titleJp}</TableCell>
                    <TableCell>{service.titleVi}</TableCell>
                    <TableCell>{service.orderIndex}</TableCell>
                    <TableCell>
                      <Switch
                        checked={service.isActive === 1}
                        onChange={() => handleToggleActive(service)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(service.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, service.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            if (selectedId) navigate(`/services/${selectedId}`);
            handleMenuClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedId) handleDelete(selectedId);
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  );
}

