import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post, index }) => {
    // Format date handling Firebase Timestamps
    const formatDate = (dateValue) => {
        if (!dateValue) return 'No Date';
        let date;
        if (dateValue?.seconds) {
            date = new Date(dateValue.seconds * 1000);
        } else if (dateValue?.toDate) {
            date = dateValue.toDate();
        } else {
            date = new Date(dateValue);
        }
        if (isNaN(date.getTime())) return 'No Date';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <motion.article
            className="post-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
        >
            <Link to={`/blog/${post.slug}`} className="post-card-link">
                <div className="post-image-container">
                    <img src={post.image} alt={post.title} className="post-image" loading="lazy" />
                    <span className="post-category">{post.category}</span>
                </div>

                <div className="post-content">
                    <div className="post-meta">
                        <span className="meta-item">
                            <Calendar size={14} />
                            {formatDate(post.publishedAt || post.date)}
                        </span>
                        <span className="meta-item">
                            <Clock size={14} />
                            {post.readTime}
                        </span>
                    </div>

                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>

                    <span className="read-more">Read Article →</span>
                </div>
            </Link>
        </motion.article>
    );
};

export default PostCard;
