import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import axios from "axios";

const Orders = () => {
    const { orders, fetchOrders, updateOrderStatus } = useOrderStore();
    const [userDetails, setUserDetails] = useState<{ [key: number]: any }>({});

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const usersData: { [key: number]: any } = {};
            for (let order of orders) {
                if (!usersData[order.userId]) {
                    const response = await axios.get(
                        `https://dummyjson.com/users/${order.userId}`
                    );
                    usersData[order.userId] = response.data;
                }
            }
            setUserDetails(usersData);
        };
        if (orders.length > 0) {
            fetchUserDetails();
        }
    }, [orders]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Order History</h2>
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Order ID: {order.id}</Typography>
                                <Typography variant="body2">
                                    User: {userDetails[order.userId]?.firstName}{" "}
                                    {userDetails[order.userId]?.lastName} ({userDetails[order.userId]?.email})
                                </Typography>
                                <Typography variant="body2">Total: ${order.total}</Typography>
                                <Typography variant="body2">Status: {order.status}</Typography>
                                <Typography variant="body2">Products:</Typography>
                                <ul>
                                    {order.products.map((product) => (
                                        <li key={product.id}>
                                            {product.title} - ${product.price} x {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => updateOrderStatus(order.id, "Shipped")}
                                >
                                    Mark as Shipped
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Orders;
