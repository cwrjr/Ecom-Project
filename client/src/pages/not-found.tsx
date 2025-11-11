import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO 
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to our homepage to continue shopping premium products at Trellis."
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              The page you're looking for doesn't exist. Please check the URL or return to our homepage.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
