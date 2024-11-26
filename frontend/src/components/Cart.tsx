import {
  Box,
  Button,
  NumberInput,
  NumberInputField,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const toast = useToast();

  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          total,
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      toast({
        title: "Order placed successfully!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to place order",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Quantity</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.items.map((item) => (
            <Tr key={item.product._id}>
              <Td>{item.product.name}</Td>
              <Td>
                <NumberInput
                  min={1}
                  max={item.product.stockQuantity}
                  value={item.quantity}
                  onChange={(value) =>
                    updateQuantity(item.product._id, parseInt(value))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </Td>
              <Td>${(item.product.price * item.quantity).toFixed(2)}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={4}>
        <Text fontSize="xl" fontWeight="bold">
          Total: ${total.toFixed(2)}
        </Text>
        <Button
          mt={2}
          colorScheme="green"
          onClick={handleOrder}
          isDisabled={state.items.length === 0}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
