
import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { Button, List, message, Image } from "antd";
import { CartItem } from "../types";

const Cart = () => {
    const { carts, fetchCarts, removeFromCart, totalPrice } = useCartStore();

    useEffect(() => {
        fetchCarts();
    }, [fetchCarts]);

    const handleRemove = async (cartId: number) => {
        await removeFromCart(cartId);
        message.success("Item removed from cart");
    };

    return (
        <div>
            <h2>Cart</h2>
            <List
                dataSource={carts}
                renderItem={(item: CartItem) => (
                    <List.Item>
                        {/* Product Image */}
                        <Image width={80} src={item.thumbnail} alt={item.title} style={{ borderRadius: "8px" }} />

                        {/* Product Details */}
                        <div style={{ flex: 1, marginLeft: "20px" }}>
                            <h4>{item.title}</h4>
                            <p>${item.price} x {item.quantity} = ${item.price * item.quantity}</p>
                        </div>

                        {/* Remove Button */}
                        <Button onClick={() => handleRemove(item.id)} danger>
                            Remove
                        </Button>
                    </List.Item>
                )}
            />

            {/* Cart Summary */}
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>
    );
};

export default Cart;
