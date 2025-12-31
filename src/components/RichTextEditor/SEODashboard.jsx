import React, { useState, useEffect } from 'react';
import { calculateSEOScore, analyzeKeywords } from './seoUtils';
import { X, CheckCircle, AlertCircle, Search } from 'lucide-react';

export const SEODashboard = ({ editor, title, description, onClose }) => {
    const [keyword, setKeyword] = useState('');
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        if (editor) {
            const content = editor.getText();
            const result = calculateSEOScore({ title, description, content, keyword });
            const keyAnalysis = analyzeKeywords(content, keyword);
            setAnalysis({ ...result, ...keyAnalysis });
        }
    }, [editor, title, description, keyword, editor?.getText()]);

    if (!analysis) return null;

    const { score, checks, readability, density, count } = analysis;

    return (
        <div className="seo-modal-overlay" onClick={onClose}>
            <div className="seo-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3><Search size={20} /> SEO Dashboard</h3>
                    <button className="modal-close" onClick={onClose}><X size={18} /></button>
                </div>

                <div className="seo-content">
                    {/* Top Row: Score & Inputs */}
                    <div className="seo-grid">
                        <div className="seo-score-card">
                            <div className="score-circle" style={{ '--score': score }}>
                                <span>{score}</span>
                                <small>/100</small>
                            </div>
                            <div className="readability-badge">
                                Grade {readability.toFixed(1)}
                            </div>
                        </div>

                        <div className="seo-inputs">
                            <div className="input-group">
                                <label>Target Keyword</label>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    placeholder="e.g. react hooks"
                                />
                                <small>Density: {density.toFixed(2)}% ({count} times)</small>
                            </div>
                        </div>
                    </div>

                    {/* Google Preview */}
                    <div className="google-preview-card">
                        <h4>Google Search Preview</h4>
                        <div className="google-result">
                            <div className="google-url">example.com › blog › {title.toLowerCase().replace(/\s+/g, '-')}</div>
                            <div className="google-title">{title || 'Your Page Title'}</div>
                            <div className="google-desc">
                                {description || 'Your page description will appear here in search results.'}
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="seo-checklist">
                        <h4>SEO Checklist</h4>
                        {checks.map((check, index) => (
                            <div key={index} className={`check-item ${check.passed ? 'passed' : 'failed'}`}>
                                {check.passed ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                <div>
                                    <div className="check-label">{check.label}</div>
                                    {!check.passed && <div className="check-hint">{check.hint}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
