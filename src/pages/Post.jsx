import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Share2, Twitter, Facebook, Linkedin, ArrowLeft, Loader } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '../firebase';
import SEO from '../components/SEO/SEO';
import TableOfContents from '../components/TableOfContents/TableOfContents';
import Comments from '../components/Comments/Comments';
import './Post.css';

const Post = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readProgress, setReadProgress] = useState(0);

    // Fetch post from Firebase
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const fetchedPost = await getPostBySlug(slug);
            setPost(fetchedPost);

            // Fetch related posts
            if (fetchedPost) {
                const allPosts = await getPublishedPosts();
                const related = allPosts
                    .filter(p => p.category === fetchedPost.category && p.id !== fetchedPost.id)
                    .slice(0, 3);
                setRelatedPosts(related);
            }

            setLoading(false);
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="container post-loading">
                <Loader size={32} className="spin" />
                <p>Loading post...</p>
            </div>
        );
    }

    // Not found
    if (!post) {
        return (
            <div className="container post-not-found">
                <h1>Post not found</h1>
                <p>The article you're looking for doesn't exist.</p>
                <Link to="/blog" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Blog
                </Link>
            </div>
        );
    }

    // Render markdown content with IDs for TOC
    const renderContent = (text) => {
        if (!text) return '';

        // Helper to slugify text for IDs
        const slugify = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return text
            // Add IDs to headers for TOC
            .replace(/^### (.*$)/gim, (match, title) => `<h3 id="${slugify(title)}">${title}</h3>`)
            .replace(/^## (.*$)/gim, (match, title) => `<h2 id="${slugify(title)}">${title}</h2>`)
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/\n/g, '<br/>');
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return '';
        // Handle Firebase Timestamp objects
        let date;
        if (dateValue?.seconds) {
            date = new Date(dateValue.seconds * 1000);
        } else if (dateValue?.toDate) {
            date = dateValue.toDate();
        } else {
            date = new Date(dateValue);
        }
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Share handlers
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post?.title || 'Check out this article';

    const handleShare = (platform) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        };
        if (platform === 'native' && navigator.share) {
            navigator.share({ title: shareTitle, url: shareUrl });
        } else if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <article className="post-page">
            {/* Reading Progress Bar */}
            <div className="reading-progress" style={{ width: `${readProgress}%` }} />

            <SEO
                title={post.title}
                description={post.excerpt}
                image={post.image}
                url={`/blog/${slug}`}
                publishDate={post.publishedAt}
                modifiedDate={post.updatedAt}
            />

            {/* Hero Section */}
            <div className="post-hero">
                <div className="hero-content container">
                    <Link to="/blog" className="back-to-blog">
                        <ArrowLeft size={16} />
                        Back to Blog
                    </Link>

                    <motion.span
                        className="post-category-tag"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {post.category}
                    </motion.span>

                    <motion.h1
                        className="post-title-main"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {post.title}
                    </motion.h1>

                    <motion.div
                        className="post-meta-detailed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="meta-group">
                            <User size={18} />
                            <span>{post.author?.name || 'Sahil'}</span>
                        </div>
                        <div className="meta-group">
                            <Calendar size={18} />
                            <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="meta-group">
                            <Clock size={18} />
                            <span>{post.readTime}</span>
                        </div>
                    </motion.div>
                </div>

                {post.image && (
                    <div className="hero-image-wrapper">
                        <motion.img
                            src={post.image}
                            alt={post.title}
                            className="hero-image"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        />
                        <div className="overlay"></div>
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="container post-container">
                {/* Sidebar */}
                <aside className="post-sidebar">
                    <div className="sticky-sidebar">
                        <div className="share-buttons">
                            <button className="share-btn twitter" onClick={() => handleShare('twitter')} title="Share on Twitter">
                                <Twitter size={20} />
                            </button>
                            <button className="share-btn facebook" onClick={() => handleShare('facebook')} title="Share on Facebook">
                                <Facebook size={20} />
                            </button>
                            <button className="share-btn linkedin" onClick={() => handleShare('linkedin')} title="Share on LinkedIn">
                                <Linkedin size={20} />
                            </button>
                            <button className="share-btn native" onClick={() => handleShare('native')} title="Share">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="post-content-body">
                    {post.excerpt && <p className="lead-paragraph">{post.excerpt}</p>}

                    {/* Render actual content */}
                    <div
                        className="post-content-rendered"
                        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
                    />

                    {/* Author Box */}
                    <div className="author-box">
                        <div className="author-avatar">
                            {post.author?.avatar ? (
                                <img src={post.author.avatar} alt={post.author.name} />
                            ) : (
                                <User size={32} />
                            )}
                        </div>
                        <div className="author-info">
                            <h4>Written by {post.author?.name || 'Sahil'}</h4>
                            <p>Technologist, gamer, and professional nerd. Exploring the intersection of code and culture.</p>
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="related-posts">
                            <h3>Related Posts</h3>
                            <div className="related-grid">
                                {relatedPosts.map(relatedPost => (
                                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="related-card">
                                        <img src={relatedPost.image} alt={relatedPost.title} />
                                        <h4>{relatedPost.title}</h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    {post && <Comments postId={post.id} />}
                </div>
            </div>
        </article>
    );
};

export default Post;
