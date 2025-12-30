import { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { addComment, getComments } from '../../firebase';
import './Comments.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            if (!postId) return;
            const fetched = await getComments(postId);
            setComments(fetched);
            setLoading(false);
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const result = await addComment(postId, {
            name: name.trim() || 'Anonymous',
            content: newComment
        });

        if (result.success) {
            setNewComment('');
            // Refresh comments
            const refreshed = await getComments(postId);
            setComments(refreshed);
        }
        setSubmitting(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h3><MessageSquare size={20} /> Comments ({comments.length})</h3>
            </div>

            {/* Comment Form */}
            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name (Optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="comment-input name-input"
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Join the discussion..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="comment-input msg-input"
                        rows="3"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting}
                >
                    {submitting ? 'Posting...' : <><Send size={16} /> Post Comment</>}
                </button>
            </form>

            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <p className="loading-text">Loading comments...</p>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-card">
                            <div className="comment-avatar">
                                <User size={24} />
                            </div>
                            <div className="comment-content">
                                <div className="comment-meta">
                                    <span className="comment-author">{comment.author}</span>
                                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="comment-text">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
};

export default Comments;
