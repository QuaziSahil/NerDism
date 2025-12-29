import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1000);
    };

    return (
        <section className="newsletter-section">
            <motion.div
                className="newsletter-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="newsletter-icon">
                    <Mail size={32} />
                </div>
                <h2>Join the <span className="gradient-text">Nerdiverse</span></h2>
                <p>Get the latest posts, tutorials, and nerd culture insights delivered to your inbox.</p>

                {status === 'success' ? (
                    <motion.div
                        className="success-message"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <Check size={24} />
                        <span>You're in! Welcome to NerDism.</span>
                    </motion.div>
                ) : (
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Subscribe
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <p className="privacy-note">No spam, unsubscribe anytime.</p>
            </motion.div>
        </section>
    );
};

export default Newsletter;
