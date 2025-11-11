import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, ShoppingBag, Home, Phone, Star } from "lucide-react";
import type { Product } from "@shared/schema";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: open,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search products, pages..." data-testid="input-command-search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          <CommandItem
            onSelect={() => runCommand(() => navigate("/"))}
            data-testid="command-item-home"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/shop"))}
            data-testid="command-item-shop"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Shop</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/contact"))}
            data-testid="command-item-contact"
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Products">
          {products.slice(0, 8).map((product) => (
            <CommandItem
              key={product.id}
              value={product.name}
              onSelect={() => runCommand(() => navigate(`/product/${product.id}`))}
              data-testid={`command-item-product-${product.id}`}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>{product.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                ${product.price.toFixed(2)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        {products.filter(p => p.featured).length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Featured Products">
              {products
                .filter(p => p.featured)
                .slice(0, 5)
                .map((product) => (
                  <CommandItem
                    key={`featured-${product.id}`}
                    value={`featured ${product.name}`}
                    onSelect={() => runCommand(() => navigate(`/product/${product.id}`))}
                    data-testid={`command-item-featured-${product.id}`}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{product.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
