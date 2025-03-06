
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
    Box, Typography, Button, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, IconButton, Divider
} from "@mui/material";
import { ShoppingCart, People, ListAlt, ExitToApp, Store, Description, FormatQuote, Menu } from "@mui/icons-material";
import { useState } from "react";

const DashboardLayout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const menuItems = [
        { text: "Products", icon: <Store />, path: "/dashboard/products" },
        { text: "Users", icon: <People />, path: "/dashboard/users" },
        { text: "Cart", icon: <ShoppingCart />, path: "/dashboard/cart" },
        { text: "Orders", icon: <ListAlt />, path: "/dashboard/orders" },
        { text: "Blogs & Comments", icon: <Description />, path: "/dashboard/blogs" },
        { text: "Quotes & Recipes", icon: <FormatQuote />, path: "/dashboard/quotes-recipes" }
    ];

    return (
        <Box display="flex" minHeight="100vh">
            { }
            <Drawer
                variant="permanent"
                open={isSidebarOpen}
                sx={{
                    width: isSidebarOpen ? 250 : 60,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: isSidebarOpen ? 250 : 60,
                        transition: "width 0.3s",
                        boxSizing: "border-box",
                        bgcolor: "#f5f5f5",
                        color: "black",
                    }
                }}
            >
                <Box p={2} display="flex" justifyContent={isSidebarOpen ? "space-between" : "center"} alignItems="center">
                    {isSidebarOpen && <Typography variant="h6" fontWeight="bold">Admin Panel</Typography>}
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)}>
                                <ListItemIcon sx={{ color: "black" }}>
                                    {item.icon}
                                </ListItemIcon>
                                {isSidebarOpen && <ListItemText primary={item.text} />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <Box p={2} textAlign="center">
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<ExitToApp />}
                        fullWidth
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>

            { }
            <Box flex={1} p={3}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
