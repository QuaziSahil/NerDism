import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import PostCard from '../components/PostCard/PostCard';
import Newsletter from '../components/Newsletter/Newsletter';
import postsData from '../data/posts.json';
import './Home.css';

const Home = () => {
    // Get latest 3 posts
    const latestPosts = postsData.slice(0, 3);

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
                        Your journey into the nerdiverse starts here.
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

            {/* Latest Posts Section */}
            {latestPosts.length > 0 && (
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
                            <p>Fresh content from across the nerdiverse</p>
                        </motion.div>

                        <div className="posts-grid">
                            {latestPosts.map((post, index) => (
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
            )}

            {/* Empty State for no posts */}
            {latestPosts.length === 0 && (
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
