
import { useState, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Input, Select, Modal, Form, message } from "antd";
import { useForm } from "react-hook-form";
import axios from "axios";

const { Option } = Select;

interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    description: string;
    images: string[];
}


type SortAction =
    | { type: "PRICE_ASC" }
    | { type: "PRICE_DESC" }
    | { type: "TITLE_ASC" }
    | { type: "TITLE_DESC" };


const sortReducer = (state: Product[], action: SortAction): Product[] => {
    switch (action.type) {
        case "PRICE_ASC":
            return [...state].sort((a, b) => a.price - b.price);
        case "PRICE_DESC":
            return [...state].sort((a, b) => b.price - a.price);
        case "TITLE_ASC":
            return [...state].sort((a, b) => a.title.localeCompare(b.title));
        case "TITLE_DESC":
            return [...state].sort((a, b) => b.title.localeCompare(a.title));
        default:
            return state;
    }
};

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, dispatch] = useReducer(sortReducer, products);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const { register, handleSubmit, reset } = useForm<Product>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://dummyjson.com/products")
            .then((response) => {
                setProducts(response.data.products);
                dispatch({ type: "PRICE_ASC" });
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const handleSort = (type: SortAction["type"]) => {
        dispatch({ type });
    };

    const handleAddProduct = (data: Product) => {
        axios.post("https://dummyjson.com/products/add", data)
            .then((response) => {
                setProducts([...products, response.data]);
                message.success("Product added successfully!");
                setIsModalOpen(false);
                reset();
            })
            .catch(() => message.error("Error adding product"));
    };

    const handleDelete = (id: number) => {
        axios.delete(`https://dummyjson.com/products/${id}`)
            .then(() => {
                setProducts(products.filter((product) => product.id !== id));
                message.success("Product deleted successfully!");
            })
            .catch(() => message.error("Error deleting product"));
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleUpdateProduct = (data: Product) => {
        axios.put(`https://dummyjson.com/products/${editingProduct?.id}`, data)
            .then((response) => {
                setProducts(
                    products.map((p) => (p.id === editingProduct?.id ? response.data : p))
                );
                message.success("Product updated successfully!");
                setIsModalOpen(false);
                setEditingProduct(null);
                reset();
            })
            .catch(() => message.error("Error updating product"));
    };

    const displayedProducts = products
        .filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === "" || product.category === selectedCategory)
        );

    return (
        <div style={{ padding: "20px" }}>
            <h2>Products</h2>
            <Input
                placeholder="Search Products"
                onChange={handleSearch}
                style={{ width: 200, marginRight: 10 }}
            />
            <Select
                placeholder="Filter by Category"
                onChange={handleCategoryChange}
                style={{ width: 200, marginRight: 10 }}
            >
                <Option value="">All</Option>
                {[...new Set(products.map((p) => p.category))].map((category) => (
                    <Option key={category} value={category}>{category}</Option>
                ))}
            </Select>
            <Select placeholder="Sort By" onChange={handleSort} style={{ width: 200 }}>
                <Option value="PRICE_ASC">Price: Low to High</Option>
                <Option value="PRICE_DESC">Price: High to Low</Option>
                <Option value="TITLE_ASC">Title: A-Z</Option>
                <Option value="TITLE_DESC">Title: Z-A</Option>
            </Select>
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginLeft: 10 }}>
                Add Product
            </Button>

            <Table
                dataSource={displayedProducts}
                rowKey="id"
                columns={[
                    {
                        title: "Image",
                        dataIndex: "images",
                        key: "images",
                        render: (images: string[]) => (
                            <img src={images[0]} alt="Product" width={50} />
                        ),
                    },
                    { title: "Title", dataIndex: "title", key: "title" },
                    { title: "Category", dataIndex: "category", key: "category" },
                    { title: "Price", dataIndex: "price", key: "price", render: (price) => `$${price}` },
                    {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                            <>
                                <Button onClick={() => handleEdit(record)}>Edit</Button>
                                <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                                <Button type="link" onClick={() => navigate(`/dashboard/products/${record.id}`)}>
                                    View Details
                                </Button>
                            </>
                        ),
                    },
                ]}
            />

            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form onFinish={editingProduct ? handleUpdateProduct : handleAddProduct}>
                    <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input {...register("title", { required: true })} />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                        <Input {...register("category", { required: true })} />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                        <Input type="number" {...register("price", { required: true })} />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea {...register("description")} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingProduct ? "Update" : "Add"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Products;
