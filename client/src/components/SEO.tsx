import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
  keywords?: string;
}

export function SEO({ 
  title = "Trellis - Premium E-commerce Platform",
  description = "Discover premium products at Trellis. Shop our curated collection of electronics, accessories, and innovative tech solutions with fast shipping and excellent customer service.",
  image = "/og-image.jpg",
  type = "website",
  url,
  keywords = "e-commerce, online shopping, electronics, tech products, premium gadgets"
}: SEOProps) {
  const fullTitle = title.includes('Trellis') ? title : `${title} | Trellis`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet prioritizeSeoTags>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}
    </Helmet>
  );
}
