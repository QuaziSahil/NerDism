import { Twitter, Facebook, Linkedin, Link2, MessageCircle, Check } from 'lucide-react';
import { useState } from 'react';
import './ShareButtons.css';

const ShareButtons = ({ title, url, description }) => {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || '');

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: '#1DA1F2',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: '#4267B2',
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
            color: '#0A66C2',
        },
        {
            name: 'Reddit',
            icon: MessageCircle,
            url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
            color: '#FF4500',
        },
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="share-buttons">
            <span className="share-label">Share this post:</span>
            <div className="share-icons">
                {shareLinks.map(({ name, icon: Icon, url, color }) => (
                    <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn"
                        title={`Share on ${name}`}
                        style={{ '--hover-color': color }}
                    >
                        <Icon size={18} />
                    </a>
                ))}
                <button
                    className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyLink}
                    title="Copy link"
                >
                    {copied ? <Check size={18} /> : <Link2 size={18} />}
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
