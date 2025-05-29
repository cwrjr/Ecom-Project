import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartTest() {
  const [cartCount, setCartCount] = useState(0);

  const addItem = () => {
    setCartCount(prev => prev + 1);
  };

  const removeItem = () => {
    setCartCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Cart Badge Test</h3>
      
      {/* Cart Icon with Badge */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="p-4 bg-blue-100 rounded-full">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-7 w-7 flex items-center justify-center font-bold shadow-lg">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={addItem}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        
        <Button 
          onClick={removeItem}
          disabled={cartCount === 0}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 disabled:bg-gray-300"
        >
          <Minus className="h-4 w-4 mr-2" />
          Remove Item
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Items in cart: <span className="font-bold text-blue-600">{cartCount}</span>
        </p>
      </div>
    </div>
  );
}