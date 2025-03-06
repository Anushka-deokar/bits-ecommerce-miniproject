
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, Button, Input, Form, message, Spin } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

const fetchUserById = async (id: string) => {
    const response = await axios.get(`https://dummyjson.com/users/${id}`);
    return response.data;
};

const UserDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUserById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (user) {
            setUserData(user);
            form.setFieldsValue({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
            });
        }
    }, [user, form]);

    const editUserMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            await axios.put(`https://dummyjson.com/users/${id}`, updatedData);
            return updatedData;
        },
        onSuccess: (updatedData) => {
            setUserData(updatedData);
            message.success("User details edited!");
            setIsEditing(false);
        },
    });

    if (isLoading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
    if (isError) return <p>Error fetching user details.</p>;

    return (
        <Card
            title={userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}
            style={{ width: 400, margin: "20px auto" }}
        >
            {isEditing ? (
                <Form form={form} onFinish={(values) => editUserMutation.mutate(values)}>
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Save Changes</Button>
                </Form>
            ) : (
                <>
                    <p><strong>Email:</strong> {userData?.email || "N/A"}</p>
                    <p><strong>Gender:</strong> {userData?.gender || "N/A"}</p>
                    <Button type="primary" onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button onClick={() => navigate("/dashboard/users")} style={{ marginLeft: "10px" }}>Back</Button>
                </>
            )}
        </Card>
    );
};

export default UserDetails;
