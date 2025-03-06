//src>pages>ProductDetails.tsx
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, Button, message, Spin } from "antd";
import axios from "axios";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    images: string[];
}

const fetchProductDetails = async (id: string): Promise<Product> => {
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`);
    return data;
};

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();

    // Fetch product details
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductDetails(id!),
        enabled: !!id, // Only fetch if ID is available
    });

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: async () => {
            await axios.post("https://dummyjson.com/carts/add", {
                userId: 1, // Dummy user ID
                products: [{ id: product?.id, quantity: 1 }],
            });
        },
        onSuccess: () => message.success("Product added to cart successfully!"),
        onError: () => message.error("Error adding product to cart"),
    });

    if (isLoading) return <Spin size="large" />;
    if (isError) return <p>Error loading product details</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <Card
            title={product.title}
            style={{ width: 400, margin: "auto", textAlign: "center" }}
            cover={<img src={product.images[0]} alt={product.title} style={{ height: 200, objectFit: "cover" }} />}
        >
            <p><strong>Price:</strong> ${product.price}</p>
            <p>{product.description}</p>
            <Button type="primary" onClick={() => addToCartMutation.mutate()}>
                Add to Cart
            </Button>
        </Card>
    );
};

export default ProductDetails;

