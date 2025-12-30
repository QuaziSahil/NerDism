import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Save, Eye, Layout, LogOut, Check, AlertCircle,
    Loader, Clock, FileText, Hash, Monitor, Maximize2
} from 'lucide-react';
import { createPost, setAdminAuthenticated } from '../../firebase';
import SEOAnalyzer from '../../components/SEOAnalyzer/SEOAnalyzer';
import AIAssistant from '../../components/AIAssistant/AIAssistant';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import PostPreview from '../../components/PostPreview/PostPreview';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import './Editor.css';

const Editor = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Tech',
        image: '',
        focusKeyword: ''
    });

    const [isPreview, setIsPreview] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');
    const [saveMessage, setSaveMessage] = useState('');
    const [lastSaved, setLastSaved] = useState(null);

    const categories = ['Tech', 'Gaming', 'Coding', 'Anime', 'Movies', 'AI'];

    // Calculate stats - Strip HTML tags for accurate word count
    const textContent = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(/\s+/).filter(w => w.length > 0).length;
    const characters = textContent.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const keywordDensity = (() => {
        if (!post.focusKeyword || !textContent || words === 0) return 0;
        const escapedKeyword = post.focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
        const matches = textContent.match(regex);
        return matches ? ((matches.length / words) * 100).toFixed(1) : 0;
    })();

    // Auto-save to localStorage
    useEffect(() => {
        const saved = localStorage.getItem('nerdism_draft');
        if (saved) {
            try {
                const draft = JSON.parse(saved);
                setPost(draft);
                setLastSaved(new Date(draft.savedAt));
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (post.title || post.content) {
                localStorage.setItem('nerdism_draft', JSON.stringify({
                    ...post,
                    savedAt: new Date().toISOString()
                }));
                setLastSaved(new Date());
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    // AI Assistant apply function
    const handleAIApply = (field, value) => {
        setPost(prev => ({ ...prev, [field]: value }));
    };

    const handlePublish = async () => {
        if (!post.title.trim() || !post.content.trim()) {
            setSaveStatus('error');
            setSaveMessage('Title and content are required');
            return;
        }

        setSaveStatus('saving');
        setSaveMessage('');

        const result = await createPost(post);

        if (result.success) {
            setSaveStatus('success');
            setSaveMessage(`Published! View at /blog/${result.slug}`);
            localStorage.removeItem('nerdism_draft');

            setTimeout(() => {
                setPost({ title: '', excerpt: '', content: '', category: 'Tech', image: '', focusKeyword: '' });
                setSaveStatus('idle');
                setSaveMessage('');
            }, 3000);
        } else {
            setSaveStatus('error');
            setSaveMessage(result.message);
        }
    };

    const handleLogout = () => {
        setAdminAuthenticated(false);
        navigate('/admin');
    };

    const clearDraft = () => {
        localStorage.removeItem('nerdism_draft');
        setPost({ title: '', excerpt: '', content: '', category: 'Tech', image: '', focusKeyword: '' });
        setLastSaved(null);
    };

    return (
        <div className="editor-container">
            {/* Full Preview Modal */}
            {showFullPreview && (
                <PostPreview
                    post={post}
                    onClose={() => setShowFullPreview(false)}
                />
            )}

            {/* Top Bar */}
            <div className="editor-topbar">
                <div className="topbar-left">
                    <h1>✍️ NerDism Editor</h1>
                    {lastSaved && (
                        <span className="auto-saved">
                            Draft saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                </div>
                <div className="topbar-actions">
                    <button
                        className={`action-btn ${isPreview ? 'active' : ''}`}
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        <Eye size={18} />
                        {isPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => setShowFullPreview(true)}
                    >
                        <Maximize2 size={18} />
                        Full Preview
                    </button>
                    <button className="action-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                    <button
                        className="action-btn primary"
                        onClick={handlePublish}
                        disabled={saveStatus === 'saving'}
                    >
                        {saveStatus === 'saving' ? (
                            <><Loader size={18} className="spin" /> Publishing...</>
                        ) : saveStatus === 'success' ? (
                            <><Check size={18} /> Published!</>
                        ) : (
                            <><Save size={18} /> Publish</>
                        )}
                    </button>
                </div>
            </div>

            {/* Status Message */}
            {saveMessage && (
                <motion.div
                    className={`save-message ${saveStatus}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {saveStatus === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
                    <span>{saveMessage}</span>
                </motion.div>
            )}

            {/* Keyboard Shortcuts Hint */}
            <div className="shortcuts-hint">
                <span>💡 Shortcuts: <kbd>Ctrl+B</kbd> Bold • <kbd>Ctrl+I</kbd> Italic • <kbd>Ctrl+U</kbd> Underline</span>
            </div>

            <div className="editor-layout">
                {/* Main Editor */}
                <div className="editor-main-panel">
                    {/* Title */}
                    <div className="form-group title-group">
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            placeholder="Enter an awesome title..."
                            className="title-input"
                        />
                        <span className={`char-hint ${post.title.length > 60 ? 'warning' : ''}`}>
                            {post.title.length}/60
                        </span>
                    </div>

                    {/* Meta Row */}
                    <div className="meta-row">
                        <div className="form-group">
                            <label><Hash size={14} /> Focus Keyword</label>
                            <input
                                type="text"
                                name="focusKeyword"
                                value={post.focusKeyword}
                                onChange={handleChange}
                                placeholder="e.g., web animations"
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={post.category} onChange={handleChange}>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="form-group">
                        <label>Featured Image</label>
                        <ImageUploader
                            value={post.image}
                            onChange={(url) => setPost(prev => ({ ...prev, image: url }))}
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="form-group">
                        <label>
                            <FileText size={14} /> Meta Description (Excerpt)
                            <span className={`char-hint ${post.excerpt.length > 160 ? 'warning' : ''}`}>
                                {post.excerpt.length}/160
                            </span>
                        </label>
                        <textarea
                            name="excerpt"
                            value={post.excerpt}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Short summary for search results..."
                        />
                    </div>

                    {/* Content Editor / Preview */}
                    {isPreview ? (
                        <div className="preview-pane">
                            <h1>{post.title}</h1>
                            {post.image && <img src={post.image} alt="Cover" className="preview-cover" />}
                            <div
                                className="preview-content"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>
                    ) : (
                        <RichTextEditor
                            content={post.content}
                            onChange={(html) => setPost(prev => ({ ...prev, content: html }))}
                            placeholder="Start writing your amazing content..."
                        />
                    )}

                    {/* Stats Bar */}
                    <div className="stats-bar">
                        <span><FileText size={14} /> {words} words</span>
                        <span>{characters} characters</span>
                        <span><Clock size={14} /> {readingTime} min read</span>
                        <span className={`density ${keywordDensity > 2.5 ? 'warning' : ''}`}>
                            🎯 Density: {keywordDensity}%
                        </span>
                        {lastSaved && (
                            <button className="clear-draft-btn" onClick={clearDraft}>Clear Draft</button>
                        )}
                    </div>
                </div>

                {/* SEO & AI Sidebar */}
                <aside className="editor-sidebar">
                    <SEOAnalyzer
                        title={post.title}
                        excerpt={post.excerpt}
                        content={post.content}
                        focusKeyword={post.focusKeyword}
                        hasImage={!!post.image}
                    />
                    <AIAssistant
                        title={post.title}
                        excerpt={post.excerpt}
                        content={post.content}
                        focusKeyword={post.focusKeyword}
                        onApply={handleAIApply}
                    />
                </aside>
            </div>
        </div>
    );
};

export default Editor;
