import React from 'react';
import { Share2, Globe, Calendar } from 'lucide-react';
import './SocialPreview.css';

const SocialPreview = ({ title, excerpt, image, slug }) => {
    const displayUrl = `nerdism.com/blog/${slug || 'your-post-url'}`;
    const displayTitle = title || 'Your Amazing Post Title';
    const displayDesc = excerpt || 'This is how your post description will appear on social media. Write a catchy summary to get more clicks!';
    const displayImage = image || 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=60';

    return (
        <div className="social-preview-container">
            <div className="preview-header">
                <Share2 size={16} />
                <span>Social Media Preview</span>
            </div>

            <div className="preview-card">
                {/* Image Area */}
                <div className="card-image">
                    <img src={displayImage} alt="Preview" />
                </div>

                {/* Text Area */}
                <div className="card-content">
                    <span className="card-domain">NERDISM.COM</span>
                    <h3 className="card-title">{displayTitle}</h3>
                    <p className="card-desc">{displayDesc}</p>
                </div>
            </div>

            <div className="google-preview">
                <div className="google-header">
                    <Globe size={14} />
                    <span>Google Search Result</span>
                </div>
                <div className="google-card">
                    <div className="google-url">
                        <span className="site-name">NerDism</span>
                        <span className="url-path"> › blog › {slug || 'post-url'}</span>
                    </div>
                    <a href="#" className="google-title">{displayTitle}</a>
                    <p className="google-desc">
                        <span className="date">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
                        {displayDesc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SocialPreview;
