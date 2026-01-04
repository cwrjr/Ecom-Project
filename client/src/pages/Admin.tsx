
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";

export default function Admin() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ["/api/user"],
    });

    const { data: products, isLoading: isProductsLoading } = useQuery<Product[]>({
        queryKey: ["/api/products"],
    });

    const createMutation = useMutation({
        mutationFn: async (newProduct: InsertProduct) => {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });
            if (!res.ok) throw new Error("Failed to create product");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({ title: "Product created successfully" });
            setIsDialogOpen(false);
        },
        onError: () => {
            toast({ variant: "destructive", title: "Failed to create product" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (product: Product) => {
            const res = await fetch(`/api/products/${product.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
            if (!res.ok) throw new Error("Failed to update product");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({ title: "Product updated successfully" });
            setIsDialogOpen(false);
            setEditingProduct(null);
        },
        onError: () => {
            toast({ variant: "destructive", title: "Failed to update product" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete product");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({ title: "Product deleted successfully" });
        },
        onError: () => {
            toast({ variant: "destructive", title: "Failed to delete product" });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await fetch("/api/logout", { method: "POST" });
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            setLocation("/login");
        },
    });

    if (isUserLoading) return <div>Loading...</div>;

    if (!user) {
        setLocation("/login");
        return null;
    }

    // Simple form handling state
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string),
            category: formData.get("category") as string,
            image: formData.get("image") as string,
            inStock: true,
            featured: false,
        };

        if (editingProduct) {
            updateMutation.mutate({ ...data, id: editingProduct.id } as Product);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <div className="flex gap-4">
                    <Button onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                    <Button variant="outline" onClick={() => logoutMutation.mutate()}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isProductsLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Loading products...</TableCell>
                            </TableRow>
                        ) : products?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this product?")) {
                                                deleteMutation.mutate(product.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to {editingProduct ? "update" : "create"} a product.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required defaultValue={editingProduct?.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" required defaultValue={editingProduct?.description} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" name="price" type="number" step="0.01" required defaultValue={editingProduct?.price} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" required defaultValue={editingProduct?.category} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input id="image" name="image" required defaultValue={editingProduct?.image} />
                        </div>
                        <DialogFooter>
                            <Button type="submit">
                                {editingProduct ? "Update Product" : "Create Product"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
