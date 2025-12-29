import { useMemo } from 'react';
import {
    Target, FileText, Hash, Image, BookOpen,
    CheckCircle2, AlertCircle, XCircle, TrendingUp
} from 'lucide-react';
import './SEOAnalyzer.css';

const SEOAnalyzer = ({ title, excerpt, content, focusKeyword, hasImage }) => {
    // Calculate all SEO metrics
    const analysis = useMemo(() => {
        const metrics = [];
        let totalScore = 0;
        let maxScore = 0;

        // 1. Title Length (50-60 chars ideal)
        const titleLength = title.length;
        let titleScore = 0;
        let titleStatus = 'bad';
        let titleMessage = '';

        if (titleLength === 0) {
            titleMessage = 'Add a title';
        } else if (titleLength < 30) {
            titleScore = 5;
            titleMessage = `Too short (${titleLength}/50-60 chars)`;
        } else if (titleLength >= 30 && titleLength < 50) {
            titleScore = 7;
            titleStatus = 'okay';
            titleMessage = `Good, but could be longer (${titleLength}/50-60)`;
        } else if (titleLength >= 50 && titleLength <= 60) {
            titleScore = 10;
            titleStatus = 'good';
            titleMessage = `Perfect length! (${titleLength} chars)`;
        } else {
            titleScore = 6;
            titleStatus = 'okay';
            titleMessage = `Slightly long (${titleLength}/60 chars)`;
        }

        metrics.push({
            name: 'Title Length',
            icon: FileText,
            score: titleScore,
            maxScore: 10,
            status: titleStatus,
            message: titleMessage
        });
        totalScore += titleScore;
        maxScore += 10;

        // 2. Meta Description (Excerpt) - 150-160 chars ideal
        const excerptLength = excerpt.length;
        let excerptScore = 0;
        let excerptStatus = 'bad';
        let excerptMessage = '';

        if (excerptLength === 0) {
            excerptMessage = 'Add an excerpt for meta description';
        } else if (excerptLength < 120) {
            excerptScore = 5;
            excerptMessage = `Too short (${excerptLength}/150-160 chars)`;
        } else if (excerptLength >= 120 && excerptLength < 150) {
            excerptScore = 7;
            excerptStatus = 'okay';
            excerptMessage = `Good, add more (${excerptLength}/150-160)`;
        } else if (excerptLength >= 150 && excerptLength <= 160) {
            excerptScore = 10;
            excerptStatus = 'good';
            excerptMessage = `Perfect! (${excerptLength} chars)`;
        } else {
            excerptScore = 6;
            excerptStatus = 'okay';
            excerptMessage = `Will be truncated (${excerptLength}/160)`;
        }

        metrics.push({
            name: 'Meta Description',
            icon: Hash,
            score: excerptScore,
            maxScore: 10,
            status: excerptStatus,
            message: excerptMessage
        });
        totalScore += excerptScore;
        maxScore += 10;

        // 3. Content Length (300+ words)
        const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
        let contentScore = 0;
        let contentStatus = 'bad';
        let contentMessage = '';

        if (words < 50) {
            contentMessage = `Very short (${words} words, need 300+)`;
        } else if (words < 150) {
            contentScore = 4;
            contentMessage = `Too short (${words}/300 words)`;
        } else if (words < 300) {
            contentScore = 6;
            contentStatus = 'okay';
            contentMessage = `Getting there (${words}/300 words)`;
        } else if (words < 600) {
            contentScore = 8;
            contentStatus = 'good';
            contentMessage = `Good length (${words} words)`;
        } else {
            contentScore = 10;
            contentStatus = 'good';
            contentMessage = `Excellent! (${words} words)`;
        }

        metrics.push({
            name: 'Content Length',
            icon: BookOpen,
            score: contentScore,
            maxScore: 10,
            status: contentStatus,
            message: contentMessage
        });
        totalScore += contentScore;
        maxScore += 10;

        // 4. Focus Keyword
        let keywordScore = 0;
        let keywordStatus = 'bad';
        let keywordMessage = '';

        if (!focusKeyword) {
            keywordMessage = 'Add a focus keyword';
        } else {
            const keyword = focusKeyword.toLowerCase();
            const titleHas = title.toLowerCase().includes(keyword);
            const contentHas = content.toLowerCase().includes(keyword);
            const excerptHas = excerpt.toLowerCase().includes(keyword);

            const keywordCount = (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
            const density = words > 0 ? ((keywordCount / words) * 100).toFixed(1) : 0;

            if (titleHas && contentHas) {
                if (density >= 1 && density <= 3) {
                    keywordScore = 10;
                    keywordStatus = 'good';
                    keywordMessage = `Perfect! In title & content (${density}% density)`;
                } else if (density > 3) {
                    keywordScore = 6;
                    keywordStatus = 'okay';
                    keywordMessage = `Overused (${density}% - aim for 1-3%)`;
                } else {
                    keywordScore = 7;
                    keywordStatus = 'okay';
                    keywordMessage = `Good, add more (${density}% density)`;
                }
            } else if (titleHas || contentHas) {
                keywordScore = 5;
                keywordStatus = 'okay';
                keywordMessage = titleHas ? 'Add to content too' : 'Add to title too';
            } else {
                keywordMessage = 'Not found in title or content';
            }
        }

        metrics.push({
            name: 'Focus Keyword',
            icon: Target,
            score: keywordScore,
            maxScore: 10,
            status: keywordStatus,
            message: keywordMessage
        });
        totalScore += keywordScore;
        maxScore += 10;

        // 5. Featured Image
        let imageScore = hasImage ? 10 : 0;
        let imageStatus = hasImage ? 'good' : 'bad';
        let imageMessage = hasImage ? 'Featured image set!' : 'Add a featured image';

        metrics.push({
            name: 'Featured Image',
            icon: Image,
            score: imageScore,
            maxScore: 10,
            status: imageStatus,
            message: imageMessage
        });
        totalScore += imageScore;
        maxScore += 10;

        // Calculate overall percentage
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

        return { metrics, percentage, totalScore, maxScore };
    }, [title, excerpt, content, focusKeyword, hasImage]);

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return '#22c55e';
        if (percentage >= 60) return '#eab308';
        if (percentage >= 40) return '#f97316';
        return '#ef4444';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'good': return <CheckCircle2 size={14} />;
            case 'okay': return <AlertCircle size={14} />;
            default: return <XCircle size={14} />;
        }
    };

    return (
        <div className="seo-analyzer">
            <div className="seo-header">
                <TrendingUp size={18} />
                <span>SEO Score</span>
            </div>

            {/* Score Circle */}
            <div className="seo-score-circle">
                <svg viewBox="0 0 100 100">
                    <circle
                        className="score-bg"
                        cx="50"
                        cy="50"
                        r="42"
                    />
                    <circle
                        className="score-progress"
                        cx="50"
                        cy="50"
                        r="42"
                        style={{
                            strokeDasharray: `${analysis.percentage * 2.64} 264`,
                            stroke: getScoreColor(analysis.percentage)
                        }}
                    />
                </svg>
                <div className="score-text">
                    <span className="score-value" style={{ color: getScoreColor(analysis.percentage) }}>
                        {analysis.percentage}
                    </span>
                    <span className="score-label">/ 100</span>
                </div>
            </div>

            {/* Metrics List */}
            <div className="seo-metrics">
                {analysis.metrics.map((metric, index) => (
                    <div key={index} className={`seo-metric ${metric.status}`}>
                        <div className="metric-header">
                            <div className="metric-icon">
                                <metric.icon size={14} />
                            </div>
                            <span className="metric-name">{metric.name}</span>
                            <div className={`metric-status ${metric.status}`}>
                                {getStatusIcon(metric.status)}
                            </div>
                        </div>
                        <p className="metric-message">{metric.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SEOAnalyzer;
