import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'article' }) => {
    const siteTitle = 'NerDism - The Modern Nerd';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = 'https://nerdism.me'; // Your domain
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const metaDescription = description || 'Minimalist design, insane animations, and everything a nerd loves. Explorations in tech, gaming, and code.';
    const metaImage = image || `${siteUrl}/logo.png`;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="NerDism" />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@OfficialNerDism" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
        </Helmet>
    );
};

export default SEO;
