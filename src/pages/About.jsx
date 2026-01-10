import { motion } from 'framer-motion';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="container">
                <motion.div
                    className="about-hero"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>About <span className="gradient-text">NerDism</span></h1>
                    <p className="lead">Where Curiosity Becomes Culture</p>
                </motion.div>

                <div className="about-content">
                    {/* Mission Statement */}
                    <motion.div
                        className="mission-section"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h2>Our Mission</h2>
                        <p>
                            At NerDism, we believe that being a "nerd" isn't just a label—it's a celebration of passion.
                            Founded in 2025 by Quazi Sahil Mahammad, this platform was created to bridge the gap between
                            technical complexity and cultural impact. We dive deep into the worlds of Technology, Gaming,
                            Artificial Intelligence, and Anime to provide our readers with more than just news; we provide insight.
                        </p>
                        <p>
                            In an era of "fast content" and AI-generated noise, NerDism focuses on high-quality, human-led
                            storytelling. We research every topic—from the latest JavaScript frameworks to the lore of your
                            favorite RPGs—to ensure our community gets accurate and engaging information. Our goal is to
                            create a space where clean design meets deep content. No clutter, no distractions—just pure
                            knowledge and enthusiasm.
                        </p>
                    </motion.div>

                    {/* Content Pillars */}
                    <motion.div
                        className="pillars-section"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <h2>What We Cover</h2>
                        <div className="pillars-grid">
                            <div className="pillar-card">
                                <h3>🖥️ Technology</h3>
                                <p>
                                    From web development tutorials to hardware deep-dives, we break down complex tech
                                    concepts into digestible, actionable insights. Whether you're a beginner or an
                                    experienced developer, you'll find value in our carefully researched articles.
                                </p>
                            </div>
                            <div className="pillar-card">
                                <h3>🎮 Gaming</h3>
                                <p>
                                    In-depth game reviews, industry analysis, and gaming culture commentary. We don't
                                    just tell you if a game is good—we explore the design decisions, storytelling
                                    techniques, and player experiences that make games memorable.
                                </p>
                            </div>
                            <div className="pillar-card">
                                <h3>🤖 Artificial Intelligence</h3>
                                <p>
                                    AI is reshaping our world. We cover the latest developments in machine learning,
                                    practical AI tools you can use today, and thoughtful analysis of how AI impacts
                                    society, creativity, and the future of work.
                                </p>
                            </div>
                            <div className="pillar-card">
                                <h3>🎌 Anime & Culture</h3>
                                <p>
                                    Anime reviews, manga recommendations, and deep explorations of Japanese pop culture.
                                    We analyze storytelling, art styles, and the cultural phenomena that make anime
                                    a global sensation.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Editorial Standards */}
                    <motion.div
                        className="standards-section"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2>The NerDism Editorial Standard</h2>
                        <p>We hold ourselves to a high standard of content quality:</p>
                        <ul className="standards-list">
                            <li>
                                <strong>100% Original Content:</strong> Every article on this site is written and
                                edited by our internal team. We never publish AI-generated or plagiarized content.
                            </li>
                            <li>
                                <strong>Fact-Checked & Accurate:</strong> We verify our tech and AI insights against
                                current industry standards, official documentation, and credible sources.
                            </li>
                            <li>
                                <strong>Community First:</strong> We write for the curious. If an article doesn't
                                add value to your life or your hobby, we don't publish it. Quality over quantity, always.
                            </li>
                            <li>
                                <strong>No Sponsored Fluff:</strong> Our reviews and recommendations are honest.
                                When we cover a product, we tell you both the good and the bad.
                            </li>
                        </ul>
                    </motion.div>

                    {/* Author Bio */}
                    <motion.div
                        className="author-section"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <h2>Meet the Creator</h2>
                        <div className="author-card">
                            <div className="author-info">
                                <h3>Quazi Sahil Mahammad</h3>
                                <p className="author-title">Founder, Writer & Developer</p>
                                <p>
                                    I'm a passionate content writer and web developer based in India. With a deep
                                    love for technology, anime, and creative storytelling, I started NerDism to
                                    share my enthusiasm with fellow nerds around the world. When I'm not writing,
                                    you'll find me exploring new JavaScript frameworks, playing story-driven games,
                                    or catching up on the latest anime season.
                                </p>
                                <p>
                                    I believe that technology should be accessible to everyone, and that's why I
                                    focus on breaking down complex topics into clear, engaging explanations. My
                                    goal is to inspire curiosity and help readers discover new interests.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="stats-grid"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        <div className="stat-card">
                            <h3>2025</h3>
                            <span>Founded</span>
                        </div>
                        <div className="stat-card">
                            <h3>100+</h3>
                            <span>Articles</span>
                        </div>
                        <div className="stat-card">
                            <h3>4</h3>
                            <span>Content Pillars</span>
                        </div>
                        <div className="stat-card">
                            <h3>∞</h3>
                            <span>Curiosity</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
