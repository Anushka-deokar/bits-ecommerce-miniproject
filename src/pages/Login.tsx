// >src>pages>Login.tsx

// src/pages/Login.tsx


import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Input, Button, message, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Login = () => {
    const { login, isAuthenticated } = useAuthStore();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            message.success("✅ Login successful!");
            navigate("/dashboard/products"); // Redirect to Products inside Dashboard
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await login(credentials);
        } catch {
            message.error("❌ Invalid username or password");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Card style={{ width: 400, padding: 24, borderRadius: 10, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</Title>
                <Input
                    name="username"
                    prefix={<UserOutlined />}
                    placeholder="Username"
                    onChange={handleChange}
                    size="large"
                    style={{ marginBottom: 16 }}
                />
                <Input.Password
                    name="password"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    onChange={handleChange}
                    size="large"
                    style={{ marginBottom: 24 }}
                />
                <Button type="primary" block size="large" onClick={handleSubmit}>
                    Login
                </Button>
            </Card>
        </div>
    );
};

export default Login;