import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import './TableOfContents.css';

const TableOfContents = ({ content }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Parse content string to find headers
        // This regex finds ## and ### markdown headers
        // Since we render markdown to HTML, we should really look for HTMl tags if we are parsing the rendered output,
        // but here we are parsing the raw markdown source for simplicity and speed before render.

        const lines = content.split('\n');
        const extractedHeadings = [];

        lines.forEach((line) => {
            if (line.startsWith('## ')) {
                const title = line.replace('## ', '').trim();
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                extractedHeadings.push({ id, title, level: 2 });
            } else if (line.startsWith('### ')) {
                const title = line.replace('### ', '').trim();
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                extractedHeadings.push({ id, title, level: 3 });
            }
        });

        setHeadings(extractedHeadings);
    }, [content]);

    // Scroll spy effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    const handleClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveId(id);
        }
    };

    return (
        <nav className="table-of-contents">
            <div className="toc-header">
                <List size={18} />
                <span>Table of Contents</span>
            </div>
            <ul className="toc-list">
                {headings.map(({ id, title, level }) => (
                    <li key={id} className={`toc-item level-${level}`}>
                        <a
                            href={`#${id}`}
                            className={activeId === id ? 'active' : ''}
                            onClick={(e) => handleClick(e, id)}
                        >
                            {title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;
