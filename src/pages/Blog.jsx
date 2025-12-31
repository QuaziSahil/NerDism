import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader } from 'lucide-react';
import PostCard from '../components/PostCard/PostCard';
import { getPublishedPosts } from '../firebase';
import { CATEGORIES } from '../constants/categories';
import './Blog.css';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch posts from Firebase
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const fetchedPosts = await getPublishedPosts();
            setPosts(fetchedPosts);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    // Updated categories including Anime, Movies, AI
    const filters = ['All', ...CATEGORIES];

    // Filter by category and search
    const filteredPosts = posts.filter(post => {
        const matchesCategory = filter === 'All' || post.category === filter;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="blog-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="blog-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>The <span className="gradient-text">Blog</span></h1>
                    <p>Explore tech, gaming, anime, movies, AI, and everything nerdy.</p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className="search-bar"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    className="category-filters"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {filters.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <Loader size={32} className="spin" />
                        <p>Loading posts...</p>
                    </div>
                )}

                {/* Posts Grid */}
                {!loading && (
                    <div className="posts-grid">
                        {filteredPosts.map((post, index) => (
                            <PostCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && filteredPosts.length === 0 && (
                    <motion.div
                        className="no-posts"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h3>No posts found</h3>
                        <p>Try a different search term or category.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Blog;
