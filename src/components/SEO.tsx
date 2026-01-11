import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
}

const BASE_URL = "https://printkitnyc.com";
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

const SEO = ({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: SEOProps) => {
  const canonicalUrl = `${BASE_URL}${path}`;
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || description;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content="PrintKit NYC" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedOgTitle} />
      <meta name="twitter:description" content={resolvedOgDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:site" content="@PrintKitNYC" />
    </Helmet>
  );
};

export default SEO;
