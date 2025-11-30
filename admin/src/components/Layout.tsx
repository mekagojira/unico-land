import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Category as CategoryIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  { text: "Thông tin công ty", icon: <BusinessIcon />, path: "/company" },
  { text: "Dịch vụ", icon: <CategoryIcon />, path: "/services" },
];

export default function Layout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleMenuClose();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const item = menuItems[newValue];
    if (item) {
      navigate(item.path);
    }
  };

  const currentTabIndex = menuItems.findIndex(
    (item) => item.path === location.pathname
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 4, fontWeight: 600 }}
          >
            Uni-Co Quản trị
          </Typography>

          {/* Navigation Tabs */}
          <Tabs
            value={currentTabIndex >= 0 ? currentTabIndex : false}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              flexGrow: 1,
              "& .MuiTab-root": {
                minHeight: 64,
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-selected": {
                  color: "white",
                },
              },
            }}
          >
            {menuItems.map((item) => (
              <Tab
                key={item.path}
                icon={item.icon}
                iconPosition="start"
                label={item.text}
                sx={{ textTransform: "none", fontSize: "0.875rem" }}
              />
            ))}
          </Tabs>

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" }, mr: 1 }}
            >
              {user?.email}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ color: "white" }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                {user?.email?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
