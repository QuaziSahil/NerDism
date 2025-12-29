import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import './PostPreview.css';

const PostPreview = ({ post, onClose }) => {
    const { title, excerpt, content, category, image, focusKeyword } = post;

    // Calculate reading time
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Render markdown to HTML
    const renderMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="content-image" />')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br/>');
    };

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="post-preview-overlay">
            <div className="post-preview-container">
                {/* Close Button */}
                <button className="preview-close-btn" onClick={onClose}>
                    <ArrowLeft size={18} />
                    Back to Editor
                </button>

                {/* Preview Header */}
                <div className="preview-header-bar">
                    <span className="preview-badge">📱 Live Preview</span>
                </div>

                {/* Mock Website Preview */}
                <article className="post-preview-frame">
                    {/* Hero Section */}
                    <div className="preview-hero">
                        {image && (
                            <div className="preview-hero-image">
                                <img src={image} alt={title} />
                                <div className="preview-hero-overlay" />
                            </div>
                        )}
                        <div className="preview-hero-content">
                            <span className="preview-category">{category}</span>
                            <h1 className="preview-title">{title || 'Your Post Title'}</h1>
                            <div className="preview-meta">
                                <div className="meta-item">
                                    <User size={16} />
                                    <span>Sahil</span>
                                </div>
                                <div className="meta-item">
                                    <Calendar size={16} />
                                    <span>{today}</span>
                                </div>
                                <div className="meta-item">
                                    <Clock size={16} />
                                    <span>{readingTime} min read</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="preview-body">
                        {excerpt && (
                            <p className="preview-excerpt">{excerpt}</p>
                        )}

                        <div
                            className="preview-content"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                        />

                        {/* Tags */}
                        {focusKeyword && (
                            <div className="preview-tags">
                                <span className="preview-tag">#{focusKeyword.replace(/\s+/g, '')}</span>
                                <span className="preview-tag">#NerDism</span>
                            </div>
                        )}

                        {/* Author Box */}
                        <div className="preview-author-box">
                            <div className="author-avatar">
                                <img
                                    src="https://ui-avatars.com/api/?name=Sahil&background=6366f1&color=fff&size=128"
                                    alt="Sahil"
                                />
                            </div>
                            <div className="author-info">
                                <h4>Written by Sahil</h4>
                                <p>Technologist, gamer, and professional nerd. Exploring the intersection of code and culture.</p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PostPreview;
