import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'article', publishDate, modifiedDate }) => {
    const siteTitle = 'NerDism - The Modern Nerd';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = 'https://ner-dism.vercel.app'; // Your domain
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const metaDescription = description || 'Minimalist design, insane animations, and everything a nerd loves. Explorations in tech, gaming, and code.';
    const metaImage = image || `${siteUrl}/logo.png`;

    // Generate JSON-LD Schema
    const schemaData = {
        "@context": "https://schema.org",
        "@type": type === 'article' ? "BlogPosting" : "WebSite",
        "headline": title || siteTitle,
        "image": [metaImage],
        "datePublished": publishDate || new Date().toISOString(),
        "dateModified": modifiedDate || new Date().toISOString(),
        "author": [{
            "@type": "Person",
            "name": "Sahil",
            "url": "https://nerdism.me/about"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "NerDism",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        },
        "description": metaDescription,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
        }
    };

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

            {/* Schema Markup */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;
