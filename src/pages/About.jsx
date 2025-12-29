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
                    <p className="lead">Where curiosity becomes culture.</p>
                </motion.div>

                <div className="about-content">
                    <motion.div
                        className="mission-section"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h2>The Mission</h2>
                        <p>
                            NerDism isn't just a blog; it's a celebration of curiosity.
                            We believe that being a "nerd" means being passionately interested in the world—whether
                            that's the latest Javascript framework, the physics of black holes, or the lore of an RPG.
                        </p>
                        <p>
                            Our goal is to create a space where clean design meets deep content. No clutter,
                            no distractions—just pure knowledge and enthusiasm.
                        </p>
                    </motion.div>

                    <motion.div
                        className="stats-grid"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
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
