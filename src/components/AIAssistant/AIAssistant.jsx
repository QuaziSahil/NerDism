import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Sparkles, Wand2, FileText, Heading, ListChecks,
    RefreshCw, Copy, Check, X, Loader, ChevronDown, ChevronUp,
    Send, Bot, Maximize2, Minimize2, ArrowRight
} from 'lucide-react';
import './AIAssistant.css';

// Google Gemini API - Key loaded from Vercel environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const callGeminiAPI = async (prompt) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
        throw new Error('API_KEY_MISSING');
    }
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Gemini API] Error Response:', data);
            throw new Error(data.error?.message || response.statusText);
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        console.error('[Gemini API] Unexpected Response Structure:', data);
        throw new Error('Invalid response structure from AI');
    } catch (error) {
        console.error('[Gemini API] Request Failed:', error);
        throw error;
    }
};

const QUICK_ACTIONS = [
    { label: 'Simplify', prompt: 'Rewrite the above text to be simpler and easier to understand.' },
    { label: 'Expand', prompt: 'Expand on the above text with more details and examples.' },
    { label: 'Shorten', prompt: 'Summarize the above text concisely.' },
    { label: 'Fix Grammar', prompt: 'Correct any grammar and spelling errors in the above text.' },
    { label: 'Tone: Pro', prompt: 'Rewrite the above text in a professional tone.' },
    { label: 'Tone: Fun', prompt: 'Rewrite the above text in a fun and engaging tone.' },
];

const AIAssistant = ({ title, excerpt, content, focusKeyword, onApply }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [loading, setLoading] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [copied, setCopied] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const chatRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages, isFullScreen]);

    const generateSuggestion = async (type) => {
        setLoading(type);
        setSuggestion(null);

        try {
            let prompt, result;

            switch (type) {
                case 'outline':
                    prompt = `Create a detailed blog post outline for the topic: "${title || 'blog post'}". 
                    ${focusKeyword ? `Focus keyword: ${focusKeyword}` : ''}
                    
                    Format it in Markdown with ## for main sections and bullet points for key points.
                    Include: Introduction, 3-5 main sections, and Conclusion.
                    Make it SEO-friendly and engaging.`;

                    const outlineResult = await callGeminiAPI(prompt);
                    result = {
                        type: 'outline',
                        title: '📝 AI-Generated Outline',
                        content: outlineResult
                    };
                    break;

                case 'titles':
                    prompt = `Generate 5 SEO-optimized blog post titles for: "${title || 'a blog post'}"
                    ${focusKeyword ? `Include the keyword: ${focusKeyword}` : ''}
                    
                    Requirements:
                    - Each title should be 50-60 characters
                    - Make them engaging and click-worthy
                    - Include power words
                    - Format: Just list the titles, one per line, no numbering`;

                    const titlesResult = await callGeminiAPI(prompt);
                    result = {
                        type: 'titles',
                        title: '✨ AI Title Suggestions',
                        content: titlesResult.split('\n').filter(t => t.trim().length > 0).slice(0, 5)
                    };
                    break;

                case 'excerpt':
                    prompt = `Write a compelling meta description for this blog post:
                    Title: "${title}"
                    ${focusKeyword ? `Keyword: ${focusKeyword}` : ''}
                    ${content ? `Content preview: ${content.substring(0, 500)}` : ''}
                    
                    Requirements:
                    - Exactly 150-160 characters
                    - Include a call to action
                    - Be engaging and informative
                    - Include the focus keyword naturally
                    - Return ONLY the description text`;

                    const excerptResult = await callGeminiAPI(prompt);
                    result = {
                        type: 'excerpt',
                        title: '📋 AI Meta Description',
                        content: excerptResult.trim()
                    };
                    break;

                case 'keywords':
                    prompt = `Suggest 8 focus keywords for a blog post titled: "${title}"
                    
                    Requirements:
                    - Mix of short-tail and long-tail keywords
                    - High search potential
                    - Relevant to the topic
                    - Format: Just list keywords separated by commas`;

                    const keywordsResult = await callGeminiAPI(prompt);
                    result = {
                        type: 'keywords',
                        title: '🎯 AI Keyword Suggestions',
                        content: keywordsResult.split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 8)
                    };
                    break;

                case 'improve':
                    prompt = `Improve this blog post content while keeping the same meaning:
                    
                    ${content}
                    
                    Requirements:
                    - Fix any grammar issues
                    - Make it more engaging
                    - Improve readability
                    - Keep the same structure
                    - Return only the improved content in Markdown format`;

                    const improvedResult = await callGeminiAPI(prompt);
                    result = {
                        type: 'improve',
                        title: '✏️ Improved Content',
                        content: improvedResult
                    };
                    break;
            }

            setSuggestion(result);
            if (!isFullScreen) setIsExpanded(true);
        } catch (error) {
            setSuggestion({
                type: 'error',
                title: '❌ Error',
                content: error.message === 'API_KEY_MISSING'
                    ? 'Gemini API Key is missing. Check your Vercel settings.'
                    : 'Failed to generate content. Please try again.'
            });
        }

        setLoading(null);
    };

    const handleChatSubmit = async (e, customPrompt = null) => {
        if (e) e.preventDefault();
        const messageText = customPrompt || chatInput.trim();

        if (!messageText || chatLoading) return;

        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: customPrompt ? customPrompt : messageText }]);
        setChatLoading(true);

        try {
            const context = `You are an AI writing assistant for a blog editor. 
            
Current Post Context:
- Title: ${title || 'Not set'}
- Keyword: ${focusKeyword || 'Not set'}
- Excerpt: ${excerpt || 'Not set'}
- Content Length: ${content?.length || 0} chars

User Request: ${messageText}

Response Guidelines:
- Be helpful, concise, and professional.
- Use Markdown for formatting (headings, lists, bold).
- If writing content, aim for high quality and engagement.`;

            const response = await callGeminiAPI(context);
            setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Error: ' + (error.message || 'Something went wrong.')
            }]);
        }

        setChatLoading(false);
    };

    const handleApply = (value, field) => {
        onApply(field, value);
        if (!isFullScreen) setSuggestion(null);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(typeof text === 'string' ? text : text.join(', '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleFullScreen = (e) => {
        e.stopPropagation();
        setIsFullScreen(!isFullScreen);
        setIsExpanded(true);
    };

    return (
        <div className={`ai-assistant ${isFullScreen ? 'fullscreen' : ''}`}>
            {/* Header */}
            <div className="ai-header" onClick={() => !isFullScreen && setIsExpanded(!isExpanded)}>
                <div className="ai-title-row">
                    <Sparkles size={18} className="ai-icon-sparkle" />
                    <h3>AI Assistant</h3>
                    <span className="ai-badge">Gemini Pro</span>
                </div>
                <div className="header-actions">
                    <button className="icon-btn" onClick={toggleFullScreen} title={isFullScreen ? "Minimize" : "Expand"}>
                        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    {!isFullScreen && (
                        isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />
                    )}
                    {isFullScreen && (
                        <button className="icon-btn close-fs" onClick={() => setIsFullScreen(false)}>
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {(isExpanded || isFullScreen) && (
                <div className="ai-body">
                    {/* Quick Tools Panel */}
                    <div className="ai-tools-panel">
                        <div className="grid-actions">
                            <button
                                onClick={() => generateSuggestion('outline')}
                                disabled={!title || loading}
                                className={loading === 'outline' ? 'loading' : ''}
                            >
                                <ListChecks size={18} />
                                <span>Outline</span>
                            </button>
                            <button
                                onClick={() => generateSuggestion('titles')}
                                disabled={!title || loading}
                                className={loading === 'titles' ? 'loading' : ''}
                            >
                                <Heading size={18} />
                                <span>Titles</span>
                            </button>
                            <button
                                onClick={() => generateSuggestion('excerpt')}
                                disabled={!title || loading}
                                className={loading === 'excerpt' ? 'loading' : ''}
                            >
                                <FileText size={18} />
                                <span>Excerpt</span>
                            </button>
                            <button
                                onClick={() => generateSuggestion('keywords')}
                                disabled={!title || loading}
                                className={loading === 'keywords' ? 'loading' : ''}
                            >
                                <Wand2 size={18} />
                                <span>Keywords</span>
                            </button>
                        </div>

                        {content && content.length > 50 && (
                            <button
                                className="improve-btn-full"
                                onClick={() => generateSuggestion('improve')}
                                disabled={loading}
                            >
                                <RefreshCw size={16} />
                                <span>Improve Content</span>
                                {loading === 'improve' && <Loader size={14} className="spin" />}
                            </button>
                        )}
                    </div>

                    {/* Suggestions Display */}
                    {suggestion && (
                        <div className="ai-result-card">
                            <div className="result-header">
                                <h4>{suggestion.title}</h4>
                                <button onClick={() => setSuggestion(null)}><X size={14} /></button>
                            </div>
                            <div className="result-content">
                                {suggestion.type === 'titles' ? (
                                    <div className="list-options">
                                        {suggestion.content.map((t, i) => (
                                            <div key={i} className="list-item" onClick={() => handleApply(t, 'title')}>
                                                <span className="text">{t}</span>
                                                <span className="apply-hint">Use</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : suggestion.type === 'keywords' ? (
                                    <div className="chips-container">
                                        {suggestion.content.map((k, i) => (
                                            <span key={i} className="chip" onClick={() => handleApply(k, 'focusKeyword')}>
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="markdown-preview">
                                        <ReactMarkdown>{suggestion.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            {/* Result Actions */}
                            <div className="result-actions">
                                <button onClick={() => handleCopy(suggestion.content)}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                                {suggestion.type !== 'titles' && suggestion.type !== 'keywords' && (
                                    <button className="primary-apply" onClick={() => handleApply(suggestion.content, suggestion.type === 'excerpt' ? 'excerpt' : 'content')}>
                                        <ArrowRight size={14} />
                                        Apply to Editor
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Chat Section */}
                    <div className="chat-interface">
                        <div className="chat-messages-area" ref={chatRef}>
                            {chatMessages.length === 0 && !suggestion && (
                                <div className="empty-state">
                                    <Bot size={48} />
                                    <p>How can I help you write better today?</p>
                                    <div className="quick-starts">
                                        <button onClick={(e) => handleChatSubmit(e, 'Suggest 3 engaging hooks for this post')}>
                                            Write an intro hook
                                        </button>
                                        <button onClick={(e) => handleChatSubmit(e, 'Give me some pros and cons for this topic')}>
                                            List Pros & Cons
                                        </button>
                                    </div>
                                </div>
                            )}

                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`message-bubble ${msg.role}`}>
                                    <div className="bubble-content">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                    {msg.role === 'assistant' && (
                                        <div className="msg-actions">
                                            <button onClick={() => handleCopy(msg.content)} title="Copy">
                                                <Copy size={12} />
                                            </button>
                                            <button onClick={() => handleApply(msg.content, 'content')} title="Insert to Editor">
                                                <ArrowRight size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="message-bubble assistant loading">
                                    <Loader size={16} className="spin" />
                                    <span>Thinking...</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Action Chips */}
                        <div className="quick-chips">
                            {QUICK_ACTIONS.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => handleChatSubmit(e, action.prompt)}
                                    disabled={chatLoading}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form className="chat-input-row" onSubmit={(e) => handleChatSubmit(e)}>
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type a message or command..."
                                disabled={chatLoading}
                            />
                            <button type="submit" disabled={!chatInput.trim() || chatLoading} className="send-btn">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
