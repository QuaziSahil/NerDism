export const calculateFleschKincaid = (text) => {
    if (!text) return 0;

    // Simple syllable counter (heuristic)
    const countSyllables = (word) => {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        return word.match(/[aeiouy]{1,2}/g)?.length || 1;
    };

    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const words = text.trim().split(/\s+/).length || 1;
    const syllables = text.trim().split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0);

    // Flesch-Kincaid Grade Level
    const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
    return Math.max(0, Math.min(grade, 18)); // Clamp between 0-18
};

export const analyzeKeywords = (text, targetKeyword) => {
    if (!text) return { density: 0, count: 0 };

    const words = text.toLowerCase().split(/\s+/);
    const keyword = targetKeyword.toLowerCase();
    const count = words.filter(w => w === keyword).length;
    const density = (count / words.length) * 100;

    return { count, density };
};

export const calculateSEOScore = ({ title, description, content, keyword }) => {
    let score = 0;
    const checks = [];

    // Title Checks (20 pts)
    if (title.length >= 30 && title.length <= 60) {
        score += 20;
        checks.push({ label: 'Title length is optimal (30-60 chars)', passed: true });
    } else {
        checks.push({ label: 'Title length check (30-60 chars)', passed: false, hint: 'Keep title between 30 and 60 characters.' });
    }

    // Description Checks (20 pts)
    if (description.length >= 120 && description.length <= 160) {
        score += 20;
        checks.push({ label: 'Description length is optimal (120-160 chars)', passed: true });
    } else {
        checks.push({ label: 'Description length check (120-160 chars)', passed: false, hint: 'Keep description between 120 and 160 characters.' });
    }

    // Keyword Checks (30 pts)
    if (keyword) {
        const titleHasKeyword = title.toLowerCase().includes(keyword.toLowerCase());
        const descHasKeyword = description.toLowerCase().includes(keyword.toLowerCase());
        const contentHasKeyword = content.toLowerCase().includes(keyword.toLowerCase());

        if (titleHasKeyword) score += 10;
        checks.push({ label: 'Keyword in title', passed: titleHasKeyword });

        if (descHasKeyword) score += 10;
        checks.push({ label: 'Keyword in description', passed: descHasKeyword });

        if (contentHasKeyword) score += 10;
        checks.push({ label: 'Keyword in content', passed: contentHasKeyword });
    } else {
        checks.push({ label: 'No target keyword set', passed: false, hint: 'Set a target keyword to analyze.' });
    }

    // Content Length Check (20 pts)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount >= 300) {
        score += 20;
        checks.push({ label: 'Content length good (>300 words)', passed: true });
    } else {
        score += Math.floor((wordCount / 300) * 20);
        checks.push({ label: 'Content length (>300 words)', passed: false, hint: 'Write at least 300 words.' });
    }

    // Readability Check (10 pts)
    const readability = calculateFleschKincaid(content);
    if (readability <= 10) { // grade 10 or lower is easier to read
        score += 10;
        checks.push({ label: 'Readability is good', passed: true });
    } else {
        checks.push({ label: 'Content is hard to read', passed: false, hint: 'Simplify sentences and word choice.' });
    }

    return { score, checks, readability };
};
