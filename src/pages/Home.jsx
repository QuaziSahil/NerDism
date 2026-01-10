import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader, Star } from 'lucide-react';
import PostCard from '../components/PostCard/PostCard';
import Newsletter from '../components/Newsletter/Newsletter';
import { getPublishedPosts } from '../firebase';
import './Home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [featuredPost, setFeaturedPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch posts from Firebase
    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPublishedPosts();
            // Set featured post (first/newest post)
            if (fetchedPosts.length > 0) {
                setFeaturedPost(fetchedPosts[0]);
                setPosts(fetchedPosts.slice(1, 10)); // Get next 9 posts (total 10 on page)
            } else {
                setPosts([]);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="container hero-content">
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Sparkles size={16} />
                        <span>Welcome to NerDism</span>
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Discover the <span className="gradient-text">Nerd</span> Inside You.
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Where code meets culture. Dive deep into Tech, Gaming, Anime, Movies, and AI.
                        Your journey into the nerdiverse starts here. We publish in-depth articles,
                        reviews, tutorials, and insights for passionate enthusiasts who love to learn.
                    </motion.p>

                    <motion.div
                        className="hero-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <Link to="/blog" className="btn btn-primary">
                            Explore the Blog
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/about" className="btn btn-secondary">
                            About Us
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Article Section */}
            {!loading && featuredPost && (
                <section className="featured-section">
                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2><Star size={24} /> Featured <span className="gradient-text">Article</span></h2>
                            <p>Our top pick for you this week</p>
                        </motion.div>

                        <motion.div
                            className="featured-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Link to={`/blog/${featuredPost.slug}`} className="featured-link">
                                {featuredPost.image && (
                                    <div className="featured-image">
                                        <img src={featuredPost.image} alt={featuredPost.title} />
                                    </div>
                                )}
                                <div className="featured-content">
                                    <span className="featured-category">{featuredPost.category}</span>
                                    <h3>{featuredPost.title}</h3>
                                    <p className="featured-excerpt">
                                        {featuredPost.excerpt || 'Discover insights, analysis, and expert opinions in this comprehensive article. Click to read the full story and expand your knowledge on this fascinating topic.'}
                                    </p>
                                    <span className="read-more">
                                        Read Full Article <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Latest Posts Section */}
            {loading ? (
                <section className="loading-section">
                    <div className="container">
                        <Loader size={32} className="spin" />
                    </div>
                </section>
            ) : posts.length > 0 ? (
                <section className="latest-posts-section">
                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2>Latest <span className="gradient-text">Posts</span></h2>
                            <p>Fresh content from across the nerdiverse — tech tutorials, gaming news, anime reviews, and more</p>
                        </motion.div>

                        <div className="posts-grid">
                            {posts.map((post, index) => (
                                <PostCard key={post.id} post={post} index={index} />
                            ))}
                        </div>

                        <motion.div
                            className="view-all"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link to="/blog" className="btn btn-outline">
                                View All Posts
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            ) : (
                <section className="empty-state">
                    <div className="container">
                        <h2>Coming Soon</h2>
                        <p>New content is on its way. Stay tuned!</p>
                    </div>
                </section>
            )}

            {/* Newsletter Signup */}
            <div className="container">
                <Newsletter />
            </div>
        </div>
    );
};

export default Home;
