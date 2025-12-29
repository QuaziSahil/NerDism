import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Share2, Twitter, Facebook, Linkedin, ArrowLeft } from 'lucide-react';
import postsData from '../data/posts.json';
import SEO from '../components/SEO/SEO';
import AdSlot from '../components/AdSlot/AdSlot';
import './Post.css';

const Post = () => {
    const { slug } = useParams();
    const post = postsData.find(p => p.slug === slug);
    const [readProgress, setReadProgress] = useState(0);

    useEffect(() => {
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

    // Get related posts (same category, excluding current)
    const relatedPosts = postsData
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    return (
        <article className="post-page">
            {/* Reading Progress Bar */}
            <div className="reading-progress" style={{ width: `${readProgress}%` }} />

            <SEO
                title={post.title}
                description={post.excerpt}
                image={post.image}
                url={`/blog/${slug}`}
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
                            <span>{post.author}</span>
                        </div>
                        <div className="meta-group">
                            <Calendar size={18} />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-group">
                            <Clock size={18} />
                            <span>{post.readTime}</span>
                        </div>
                    </motion.div>
                </div>

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
            </div>

            {/* Post Content */}
            <div className="container post-container">
                {/* Sidebar */}
                <aside className="post-sidebar">
                    <div className="sticky-sidebar">
                        <div className="share-buttons">
                            <button className="share-btn twitter">
                                <Twitter size={20} />
                            </button>
                            <button className="share-btn facebook">
                                <Facebook size={20} />
                            </button>
                            <button className="share-btn linkedin">
                                <Linkedin size={20} />
                            </button>
                            <button className="share-btn native">
                                <Share2 size={20} />
                            </button>
                        </div>
                        <AdSlot slotId="SIDEBAR_SLOT_ID" className="ad-sidebar" />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="post-content-body">
                    <p className="lead-paragraph">{post.excerpt}</p>

                    <AdSlot slotId="CONTENT_TOP_ID" />

                    {/* Mock Content Structure */}
                    <h2>The Beginning of Something Great</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <blockquote>
                        "Clean code always looks like it was written by someone who cares."
                    </blockquote>

                    <h3>Why This Matters</h3>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>

                    <div className="post-tags">
                        <span className="tag">#WebDev</span>
                        <span className="tag">#Design</span>
                        <span className="tag">#NerDism</span>
                    </div>

                    {/* Author Box */}
                    <div className="author-box">
                        <div className="author-avatar">
                            <User size={32} />
                        </div>
                        <div className="author-info">
                            <h4>Written by {post.author}</h4>
                            <p>Technologist, gamer, and professional nerd. Exploring the intersection of code and culture.</p>
                        </div>
                    </div>

                    <AdSlot slotId="CONTENT_BOTTOM_ID" />

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
                </div>
            </div>
        </article>
    );
};

export default Post;
