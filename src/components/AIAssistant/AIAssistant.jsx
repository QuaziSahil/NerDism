import { useState } from 'react';
import {
    Sparkles, Wand2, FileText, Heading, ListChecks,
    RefreshCw, Copy, Check, X, Loader, ChevronDown, ChevronUp
} from 'lucide-react';
import './AIAssistant.css';

// AI Suggestions (template-based without external API)
const AI_TEMPLATES = {
    generateOutline: (title, keyword) => {
        const outlines = [
            `## Introduction\nHook the reader with a compelling opening about ${keyword || title}.\n\n## What is ${title.split(' ').slice(0, 3).join(' ')}?\nDefine and explain the core concept.\n\n## Key Benefits\n- Benefit 1\n- Benefit 2\n- Benefit 3\n\n## How to Get Started\nStep-by-step guide for beginners.\n\n## Best Practices\nExpert tips and recommendations.\n\n## Common Mistakes to Avoid\nHelp readers avoid pitfalls.\n\n## Conclusion\nSummarize key takeaways and call to action.`,
            `## Introduction\nWhy ${keyword || title} matters today.\n\n## The Problem\nWhat challenge does this solve?\n\n## The Solution\nHow ${keyword || 'this'} addresses the issue.\n\n## Step-by-Step Guide\n1. First step\n2. Second step\n3. Third step\n\n## Real-World Examples\nCase studies and examples.\n\n## FAQs\nCommon questions answered.\n\n## Conclusion\nFinal thoughts and next steps.`
        ];
        return outlines[Math.floor(Math.random() * outlines.length)];
    },

    improveTitle: (title) => {
        const patterns = [
            `${title}: The Complete Guide [${new Date().getFullYear()}]`,
            `How to Master ${title} in ${new Date().getFullYear()}`,
            `${title}: Everything You Need to Know`,
            `The Ultimate ${title} Guide for Beginners`,
            `${title}: Tips, Tricks & Best Practices`
        ];
        return patterns.filter(p => p.length <= 60);
    },

    generateExcerpt: (title, keyword) => {
        return `Discover everything about ${keyword || title.toLowerCase()}. This comprehensive guide covers key concepts, best practices, and expert tips to help you succeed. Perfect for beginners and pros alike.`;
    },

    suggestKeywords: (title) => {
        const words = title.toLowerCase().split(' ').filter(w => w.length > 3);
        const suggestions = [
            ...words,
            words.slice(0, 2).join(' '),
            words.slice(-2).join(' ')
        ].filter((v, i, a) => a.indexOf(v) === i);
        return suggestions.slice(0, 5);
    }
};

const AIAssistant = ({ title, excerpt, content, focusKeyword, onApply }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [loading, setLoading] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [copied, setCopied] = useState(false);

    const generateSuggestion = async (type) => {
        setLoading(type);
        setSuggestion(null);

        // Simulate AI processing
        await new Promise(r => setTimeout(r, 800));

        let result;
        switch (type) {
            case 'outline':
                result = {
                    type: 'outline',
                    title: '📝 Content Outline',
                    content: AI_TEMPLATES.generateOutline(title, focusKeyword)
                };
                break;
            case 'titles':
                result = {
                    type: 'titles',
                    title: '✨ Title Suggestions',
                    content: AI_TEMPLATES.improveTitle(title)
                };
                break;
            case 'excerpt':
                result = {
                    type: 'excerpt',
                    title: '📋 Meta Description',
                    content: AI_TEMPLATES.generateExcerpt(title, focusKeyword)
                };
                break;
            case 'keywords':
                result = {
                    type: 'keywords',
                    title: '🎯 Keyword Suggestions',
                    content: AI_TEMPLATES.suggestKeywords(title)
                };
                break;
        }

        setSuggestion(result);
        setLoading(null);
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
                            title="Improve your title"
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
                            title="Suggest focus keywords"
                        >
                            <Wand2 size={16} />
                            <span>Keywords</span>
                            {loading === 'keywords' && <Loader size={14} className="spin" />}
                        </button>
                    </div>

                    {/* Suggestion Result */}
                    {suggestion && (
                        <div className="ai-suggestion">
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
                                                    Use as Starting Point
                                                </button>
                                            )}
                                            {suggestion.type === 'excerpt' && (
                                                <button onClick={() => handleApply(suggestion.content, 'excerpt')}>
                                                    <Check size={14} />
                                                    Apply
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Hint */}
                    {!suggestion && (
                        <p className="ai-hint">
                            Enter a title to unlock AI suggestions
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
