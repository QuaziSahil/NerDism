import { useState, useRef } from 'react';
import {
    Sparkles, Wand2, FileText, Heading, ListChecks,
    RefreshCw, Copy, Check, X, Loader, ChevronDown, ChevronUp,
    Send, Bot, MessageSquare
} from 'lucide-react';
import './AIAssistant.css';

// Google Gemini API
const GEMINI_API_KEY = 'AIzaSyDCIcvrLZsrcrZGrt0y3pRsFzC-c6CVofo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const callGeminiAPI = async (prompt) => {
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
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error('Invalid response');
    } catch (error) {
        console.error('[Gemini API] Error:', error);
        throw error;
    }
};

const AIAssistant = ({ title, excerpt, content, focusKeyword, onApply }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [loading, setLoading] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [copied, setCopied] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const chatRef = useRef(null);

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
                    
                    Just provide the meta description text, nothing else.`;

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
        } catch (error) {
            setSuggestion({
                type: 'error',
                title: '❌ Error',
                content: 'Failed to generate content. Please try again.'
            });
        }

        setLoading(null);
    };

    // Chat with AI
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);

        try {
            const context = `You are an AI writing assistant for a blog editor. The user is writing a blog post.
            
Current post details:
- Title: ${title || 'Not set'}
- Focus Keyword: ${focusKeyword || 'Not set'}
- Excerpt: ${excerpt || 'Not set'}
- Content length: ${content?.length || 0} characters

The user's request: ${userMessage}

Respond helpfully and concisely. If they ask you to write content, format it in Markdown.
If they ask for improvements or changes, provide the updated text directly.`;

            const response = await callGeminiAPI(context);
            setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);

            // Scroll to bottom
            setTimeout(() => {
                if (chatRef.current) {
                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                }
            }, 100);
        } catch (error) {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        }

        setChatLoading(false);
    };

    const handleApply = (value, field) => {
        onApply(field, value);
        setSuggestion(null);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(typeof text === 'string' ? text : text.join(', '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="ai-assistant">
            <div className="ai-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="ai-title">
                    <Sparkles size={18} />
                    <span>AI Assistant</span>
                    <span className="ai-badge">Gemini</span>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {isExpanded && (
                <div className="ai-content">
                    {/* Quick Actions */}
                    <div className="ai-actions">
                        <button
                            onClick={() => generateSuggestion('outline')}
                            disabled={!title || loading}
                            title="Generate article outline"
                        >
                            <ListChecks size={16} />
                            <span>Outline</span>
                            {loading === 'outline' && <Loader size={14} className="spin" />}
                        </button>
                        <button
                            onClick={() => generateSuggestion('titles')}
                            disabled={!title || loading}
                            title="Generate title ideas"
                        >
                            <Heading size={16} />
                            <span>Titles</span>
                            {loading === 'titles' && <Loader size={14} className="spin" />}
                        </button>
                        <button
                            onClick={() => generateSuggestion('excerpt')}
                            disabled={!title || loading}
                            title="Generate meta description"
                        >
                            <FileText size={16} />
                            <span>Excerpt</span>
                            {loading === 'excerpt' && <Loader size={14} className="spin" />}
                        </button>
                        <button
                            onClick={() => generateSuggestion('keywords')}
                            disabled={!title || loading}
                            title="Suggest keywords"
                        >
                            <Wand2 size={16} />
                            <span>Keywords</span>
                            {loading === 'keywords' && <Loader size={14} className="spin" />}
                        </button>
                    </div>

                    {/* Improve Content Button */}
                    {content && content.length > 50 && (
                        <button
                            className="improve-btn"
                            onClick={() => generateSuggestion('improve')}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Improve My Content
                            {loading === 'improve' && <Loader size={14} className="spin" />}
                        </button>
                    )}

                    {/* Suggestion Result */}
                    {suggestion && (
                        <div className={`ai-suggestion ${suggestion.type === 'error' ? 'error' : ''}`}>
                            <div className="suggestion-header">
                                <span>{suggestion.title}</span>
                                <button className="close-btn" onClick={() => setSuggestion(null)}>
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="suggestion-content">
                                {suggestion.type === 'titles' ? (
                                    <div className="title-options">
                                        {suggestion.content.map((t, i) => (
                                            <button
                                                key={i}
                                                className="title-option"
                                                onClick={() => handleApply(t, 'title')}
                                            >
                                                {t}
                                                <span className="char-count">{t.length}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : suggestion.type === 'keywords' ? (
                                    <div className="keyword-options">
                                        {suggestion.content.map((k, i) => (
                                            <button
                                                key={i}
                                                className="keyword-chip"
                                                onClick={() => handleApply(k, 'focusKeyword')}
                                            >
                                                {k}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-suggestion">
                                        <pre>{suggestion.content}</pre>
                                        <div className="suggestion-actions">
                                            <button onClick={() => handleCopy(suggestion.content)}>
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                            {suggestion.type === 'outline' && (
                                                <button onClick={() => handleApply(suggestion.content, 'content')}>
                                                    <RefreshCw size={14} />
                                                    Use as Content
                                                </button>
                                            )}
                                            {suggestion.type === 'excerpt' && (
                                                <button onClick={() => handleApply(suggestion.content, 'excerpt')}>
                                                    <Check size={14} />
                                                    Apply
                                                </button>
                                            )}
                                            {suggestion.type === 'improve' && (
                                                <button onClick={() => handleApply(suggestion.content, 'content')}>
                                                    <Check size={14} />
                                                    Replace Content
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* AI Chat */}
                    <div className="ai-chat">
                        <div className="chat-header">
                            <Bot size={16} />
                            <span>Ask AI Anything</span>
                        </div>

                        {chatMessages.length > 0 && (
                            <div className="chat-messages" ref={chatRef}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`chat-message ${msg.role}`}>
                                        {msg.role === 'assistant' && <Bot size={14} />}
                                        <div className="message-content">
                                            <pre>{msg.content}</pre>
                                        </div>
                                        {msg.role === 'assistant' && (
                                            <button
                                                className="copy-msg-btn"
                                                onClick={() => handleCopy(msg.content)}
                                                title="Copy"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="chat-message assistant loading">
                                        <Bot size={14} />
                                        <Loader size={14} className="spin" />
                                    </div>
                                )}
                            </div>
                        )}

                        <form className="chat-input-form" onSubmit={handleChatSubmit}>
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask AI to write, improve, or help..."
                                disabled={chatLoading}
                            />
                            <button type="submit" disabled={!chatInput.trim() || chatLoading}>
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
