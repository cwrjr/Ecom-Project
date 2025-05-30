
import { useCart } from "@/components/CartContext";

export default function CartTest() {
  const { cartCount, cartTotal } = useCart();

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      <div className="text-sm">
        <div>Cart Items: {cartCount}</div>
        <div>Total: ${cartTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}
