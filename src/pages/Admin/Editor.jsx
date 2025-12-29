import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Save, Eye, Layout, Image as ImageIcon, Bold, Italic,
    Heading1, Heading2, Code, List, Link as LinkIcon, Quote,
    LogOut, Check, AlertCircle, Loader
} from 'lucide-react';
import { createPost, setAdminAuthenticated } from '../../firebase';
import './Editor.css';

const Editor = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Tech',
        image: ''
    });

    const [isPreview, setIsPreview] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error
    const [saveMessage, setSaveMessage] = useState('');
    const contentRef = useRef(null);

    // Updated categories including Anime, Movies, AI
    const categories = ['Tech', 'Gaming', 'Coding', 'Anime', 'Movies', 'AI'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    // Formatting toolbar functions
    const insertFormat = (before, after = '') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = post.content.substring(start, end);
        const newText = post.content.substring(0, start) + before + selectedText + after + post.content.substring(end);

        setPost(prev => ({ ...prev, content: newText }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const formatBold = () => insertFormat('**', '**');
    const formatItalic = () => insertFormat('*', '*');
    const formatH1 = () => insertFormat('# ');
    const formatH2 = () => insertFormat('## ');
    const formatCode = () => insertFormat('`', '`');
    const formatCodeBlock = () => insertFormat('```\n', '\n```');
    const formatList = () => insertFormat('- ');
    const formatQuote = () => insertFormat('> ');
    const formatLink = () => insertFormat('[', '](url)');

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

            // Reset form after 2 seconds
            setTimeout(() => {
                setPost({ title: '', excerpt: '', content: '', category: 'Tech', image: '' });
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

    // Simple markdown to HTML converter for preview
    const renderMarkdown = (text) => {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div className="editor-page">
            <div className="editor-header">
                <h1>New <span className="gradient-text">Post</span></h1>
                <div className="editor-actions">
                    <button className="action-btn logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                    <button
                        className={`action-btn ${isPreview ? 'active' : ''}`}
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        {isPreview ? <Layout size={20} /> : <Eye size={20} />}
                        {isPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        className="action-btn primary"
                        onClick={handlePublish}
                        disabled={saveStatus === 'saving'}
                    >
                        {saveStatus === 'saving' ? (
                            <>
                                <Loader size={20} className="spin" />
                                Publishing...
                            </>
                        ) : saveStatus === 'success' ? (
                            <>
                                <Check size={20} />
                                Published!
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Publish
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Status Messages */}
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

            <div className="editor-container">
                {/* Meta Fields */}
                <div className="editor-meta">
                    <div className="form-group">
                        <label>Post Title</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            placeholder="Enter an awesome title..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={post.category} onChange={handleChange}>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Featured Image URL</label>
                            <div className="input-icon-wrapper">
                                <ImageIcon size={18} />
                                <input
                                    type="text"
                                    name="image"
                                    value={post.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Excerpt (Short summary)</label>
                        <textarea
                            name="excerpt"
                            value={post.excerpt}
                            onChange={handleChange}
                            rows={3}
                            placeholder="What is this post about? (Optional - auto-generated if empty)"
                        />
                    </div>
                </div>

                {/* Content Editor / Preview */}
                <div className="editor-main">
                    {/* Formatting Toolbar */}
                    {!isPreview && (
                        <div className="formatting-toolbar">
                            <button onClick={formatBold} title="Bold"><Bold size={18} /></button>
                            <button onClick={formatItalic} title="Italic"><Italic size={18} /></button>
                            <div className="toolbar-divider" />
                            <button onClick={formatH1} title="Heading 1"><Heading1 size={18} /></button>
                            <button onClick={formatH2} title="Heading 2"><Heading2 size={18} /></button>
                            <div className="toolbar-divider" />
                            <button onClick={formatCode} title="Inline Code"><Code size={18} /></button>
                            <button onClick={formatCodeBlock} title="Code Block">{'{ }'}</button>
                            <div className="toolbar-divider" />
                            <button onClick={formatList} title="List"><List size={18} /></button>
                            <button onClick={formatQuote} title="Quote"><Quote size={18} /></button>
                            <button onClick={formatLink} title="Link"><LinkIcon size={18} /></button>
                        </div>
                    )}

                    {isPreview ? (
                        <div className="preview-pane">
                            <h1>{post.title}</h1>
                            {post.image && <img src={post.image} alt="Cover" className="preview-cover" />}
                            <div
                                className="preview-content"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                            />
                        </div>
                    ) : (
                        <div className="editor-pane">
                            <textarea
                                ref={contentRef}
                                name="content"
                                value={post.content}
                                onChange={handleChange}
                                placeholder="Write your masterpiece here... Use the toolbar above or Markdown syntax!"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;
