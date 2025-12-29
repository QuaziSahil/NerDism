import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PostCard from '../components/PostCard/PostCard';
import postsData from '../data/posts.json';
import './Blog.css';

const Blog = () => {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Updated categories including Anime, Movies, AI
    const categories = ['All', 'Tech', 'Gaming', 'Coding', 'Anime', 'Movies', 'AI'];

    // Filter by category and search
    const filteredPosts = postsData.filter(post => {
        const matchesCategory = filter === 'All' || post.category === filter;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
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
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Posts Grid */}
                <div className="posts-grid">
                    {filteredPosts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
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
