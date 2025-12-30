import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, FileText } from 'lucide-react'; // Added icons
import { motion, AnimatePresence } from 'framer-motion';
import { getPublishedPosts } from '../../firebase';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    // Fetch posts once when opened
    useEffect(() => {
        if (isOpen) {
            const fetchPosts = async () => {
                const allPosts = await getPublishedPosts();
                setPosts(allPosts);
            };
            fetchPosts();
            // Focus input
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Filter logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.category.toLowerCase().includes(lowerQuery) ||
            post.excerpt?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5); // Limit to 5 results
        setResults(filtered);
    }, [query, posts]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="search-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="search-container container">
                        <div className="search-header">
                            <Search className="search-icon-large" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search articles, topics, or code..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="search-input-main"
                            />
                            <button className="close-search-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="search-results">
                            {query && results.length === 0 && (
                                <p className="no-results">No matches found for "{query}"</p>
                            )}

                            {results.map(post => (
                                <Link
                                    to={`/blog/${post.slug}`}
                                    key={post.id}
                                    className="search-result-item"
                                    onClick={onClose}
                                >
                                    <div className="result-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="result-info">
                                        <h4>{post.title}</h4>
                                        <span className="result-category">{post.category}</span>
                                    </div>
                                    <ArrowRight size={16} className="result-arrow" />
                                </Link>
                            ))}

                            {!query && (
                                <div className="search-quick-links">
                                    <p>Try searching for:</p>
                                    <div className="tags-cloud">
                                        {['React', 'Gaming', 'AI', 'Setup', 'Review'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="tag-pill"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
