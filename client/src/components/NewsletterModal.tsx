import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive exclusive updates and offers.",
      });
      setEmail("");
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Mail className="h-6 w-6 text-blue-600" />
            Subscribe to Our Newsletter
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Get exclusive updates, special offers, and the latest product releases delivered to your inbox.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              data-testid="input-newsletter-email"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              data-testid="button-subscribe"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              data-testid="button-cancel"
            >
              Maybe Later
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
