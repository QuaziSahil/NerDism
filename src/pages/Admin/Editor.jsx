import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Save, Eye, Layout, Bold, Italic, Heading1, Heading2, Heading3,
    Code, List, Link as LinkIcon, Quote, LogOut, Check, AlertCircle,
    Loader, Undo, Redo, Smile, Table, Clock, FileText, Hash,
    Monitor, Image as ImageIcon, Maximize2
} from 'lucide-react';
import { createPost, setAdminAuthenticated } from '../../firebase';
import SEOAnalyzer from '../../components/SEOAnalyzer/SEOAnalyzer';
import AIAssistant from '../../components/AIAssistant/AIAssistant';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import PostPreview from '../../components/PostPreview/PostPreview';
import './Editor.css';

// Common emojis for quick access
const EMOJIS = ['🔥', '✨', '🚀', '💡', '🎮', '🎬', '🤖', '💻', '📱', '⚡', '🎯', '👀', '💪', '🎉', '❤️', '👍'];

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
    const [showEmojis, setShowEmojis] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [lastSaved, setLastSaved] = useState(null);
    const contentRef = useRef(null);

    const categories = ['Tech', 'Gaming', 'Coding', 'Anime', 'Movies', 'AI'];

    // Calculate stats
    const words = post.content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = post.content.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!contentRef.current || document.activeElement !== contentRef.current) return;

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        insertFormat('**', '**');
                        break;
                    case 'i':
                        e.preventDefault();
                        insertFormat('*', '*');
                        break;
                    case 'k':
                        e.preventDefault();
                        insertLink();
                        break;
                    case 'z':
                        if (e.shiftKey) {
                            e.preventDefault();
                            redo();
                        } else {
                            e.preventDefault();
                            undo();
                        }
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [post.content, historyIndex, history]);

    // History for undo/redo
    const saveToHistory = useCallback((content) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
        if (name === 'content') {
            saveToHistory(value);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setPost(prev => ({ ...prev, content: history[historyIndex - 1] }));
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setPost(prev => ({ ...prev, content: history[historyIndex + 1] }));
        }
    };

    // Formatting functions
    const insertFormat = (before, after = '') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = post.content.substring(start, end);
        const newText = post.content.substring(0, start) + before + selectedText + after + post.content.substring(end);

        setPost(prev => ({ ...prev, content: newText }));
        saveToHistory(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const insertEmoji = (emoji) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newText = post.content.substring(0, start) + emoji + post.content.substring(start);
        setPost(prev => ({ ...prev, content: newText }));
        setShowEmojis(false);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    const insertTable = () => {
        const tableMarkdown = '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n';
        insertFormat(tableMarkdown);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            const text = prompt('Enter link text:', 'Click here');
            insertFormat(`[${text || 'Link'}](${url})`);
        }
    };

    const insertImage = () => {
        const url = prompt('Enter image URL (paste from Unsplash, etc.):');
        if (url) {
            const alt = prompt('Enter image description:', 'Image');
            insertFormat(`\n![${alt || 'Image'}](${url})\n`);
        }
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

    // Full Website Preview
    if (showFullPreview) {
        return <PostPreview post={post} onClose={() => setShowFullPreview(false)} />;
    }

    return (
        <div className="editor-page-enhanced">
            {/* Header */}
            <div className="editor-top-bar">
                <div className="editor-branding">
                    <h1>New <span className="gradient-text">Post</span></h1>
                    {lastSaved && (
                        <span className="auto-saved">
                            <Check size={12} /> Auto-saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                </div>
                <div className="editor-actions">
                    <button className="action-btn logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={18} />
                    </button>
                    <button
                        className={`action-btn ${isPreview ? 'active' : ''}`}
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        {isPreview ? <Layout size={18} /> : <Eye size={18} />}
                        {isPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => setShowFullPreview(true)}
                        title="Full Website Preview"
                    >
                        <Monitor size={18} />
                        Live
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
                <span>💡 Shortcuts: <kbd>Ctrl+B</kbd> Bold • <kbd>Ctrl+I</kbd> Italic • <kbd>Ctrl+K</kbd> Link • <kbd>Ctrl+Z</kbd> Undo</span>
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

                    {/* Formatting Toolbar */}
                    {!isPreview && (
                        <div className="formatting-toolbar">
                            <div className="toolbar-group">
                                <button onClick={() => insertFormat('**', '**')} title="Bold (Ctrl+B)"><Bold size={16} /></button>
                                <button onClick={() => insertFormat('*', '*')} title="Italic (Ctrl+I)"><Italic size={16} /></button>
                            </div>
                            <div className="toolbar-divider" />
                            <div className="toolbar-group">
                                <button onClick={() => insertFormat('# ')} title="H1"><Heading1 size={16} /></button>
                                <button onClick={() => insertFormat('## ')} title="H2"><Heading2 size={16} /></button>
                                <button onClick={() => insertFormat('### ')} title="H3"><Heading3 size={16} /></button>
                            </div>
                            <div className="toolbar-divider" />
                            <div className="toolbar-group">
                                <button onClick={() => insertFormat('`', '`')} title="Code"><Code size={16} /></button>
                                <button onClick={() => insertFormat('- ')} title="List"><List size={16} /></button>
                                <button onClick={() => insertFormat('> ')} title="Quote"><Quote size={16} /></button>
                                <button onClick={insertLink} title="Link (Ctrl+K)"><LinkIcon size={16} /></button>
                                <button onClick={insertImage} title="Insert Image"><ImageIcon size={16} /></button>
                            </div>
                            <div className="toolbar-divider" />
                            <div className="toolbar-group">
                                <button onClick={insertTable} title="Table"><Table size={16} /></button>
                                <div className="emoji-wrapper">
                                    <button onClick={() => setShowEmojis(!showEmojis)} title="Emoji"><Smile size={16} /></button>
                                    {showEmojis && (
                                        <div className="emoji-picker">
                                            {EMOJIS.map(e => (
                                                <button key={e} onClick={() => insertEmoji(e)}>{e}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="toolbar-divider" />
                            <div className="toolbar-group">
                                <button onClick={undo} title="Undo (Ctrl+Z)" disabled={historyIndex <= 0}><Undo size={16} /></button>
                                <button onClick={redo} title="Redo (Ctrl+Shift+Z)" disabled={historyIndex >= history.length - 1}><Redo size={16} /></button>
                            </div>
                        </div>
                    )}

                    {/* Content Editor / Preview */}
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
                                placeholder="Write your masterpiece here... Use Markdown or the toolbar above!"
                            />
                        </div>
                    )}

                    {/* Stats Bar */}
                    <div className="stats-bar">
                        <span><FileText size={14} /> {words} words</span>
                        <span>{characters} characters</span>
                        <span><Clock size={14} /> {readingTime} min read</span>
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
