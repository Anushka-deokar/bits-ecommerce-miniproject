//src>pages>Users.tsx
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const { users, fetchUsers } = useUserStore();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleViewUserDetails = (id: number) => {
        navigate(`/dashboard/users/${id}`);
    };

    return (
        <Box p={3}>
            <TextField
                label="Search Users"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {users.length === 0 ? (
                <Typography variant="h6" align="center">Loading users...</Typography>  // ✅ Fallback for empty data
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users
                                .filter(user =>
                                    user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                                    user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                                    user?.email?.toLowerCase().includes(search.toLowerCase())
                                )
                                .map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" onClick={() => handleViewUserDetails(user.id)}>
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default Users;
