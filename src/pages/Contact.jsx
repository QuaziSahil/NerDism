import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Twitter, Send, Check, ExternalLink, AlertCircle, User } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './Contact.css';

// EmailJS Configuration (using existing CyberNotes setup)
const EMAILJS_SERVICE_ID = 'service_cybernotes';
const EMAILJS_TEMPLATE_ID = 'template_contact';
const EMAILJS_PUBLIC_KEY = 'Sy-Wr2EyFohZ12FaC';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Limit message to 1000 characters
        if (name === 'message' && value.length > 1000) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            // Send email via EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: 'nerdism.me@gmail.com'
                },
                EMAILJS_PUBLIC_KEY
            );

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('[Contact] Failed to send message:', error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again or email us directly.');
        }
    };

    return (
        <div className="contact-page">
            <div className="container">
                <div className="contact-grid">

                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1>Get in <span className="gradient-text">Touch</span></h1>
                        <p className="contact-desc">
                            Have a question about a recent tech deep-dive? Want to suggest a game for us to review,
                            or just want to geek out about the latest AI trends? We're always listening. At NerDism,
                            we value community feedback and aim to build a space where curiosity is always rewarded.
                        </p>

                        <div className="contact-message-section">
                            <h3>How to Reach Us</h3>
                            <p>
                                While we have the contact form for your convenience, you can also reach out through
                                the following official channels to ensure a direct response:
                            </p>
                            <ul className="contact-types">
                                <li>
                                    <strong>General Inquiries:</strong> For site feedback, questions about our articles,
                                    or suggestions for topics you'd like us to cover.
                                </li>
                                <li>
                                    <strong>Editorial & Tips:</strong> If you have a scoop on a new anime release,
                                    tech breakthrough, or gaming news, please label your subject line as "Editorial Tip".
                                </li>
                                <li>
                                    <strong>Collaborations:</strong> Interested in partnering with NerDism? We're
                                    always looking for fellow creators in the tech, gaming, and anime space.
                                </li>
                                <li>
                                    <strong>Bug Reports:</strong> Found a broken link or technical issue on our site?
                                    Let us know and we'll fix it promptly.
                                </li>
                            </ul>
                        </div>

                        <div className="response-info">
                            <h3>Response Time</h3>
                            <p>
                                We are a human-led team based in India. We strive to read every message we receive
                                and typically respond within <strong>24–48 hours</strong> during business days. For
                                urgent matters, reaching out via Twitter/X often gets a faster response.
                            </p>
                        </div>

                        <div className="contact-details">
                            {/* Email - Opens Gmail/Mail app */}
                            <a href="mailto:nerdism.me@gmail.com" className="detail-item clickable">
                                <Mail className="icon" />
                                <span>nerdism.me@gmail.com</span>
                                <ExternalLink size={14} className="external-icon" />
                            </a>

                            {/* Twitter - Opens X profile */}
                            <a
                                href="https://x.com/NerDismme"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detail-item clickable"
                            >
                                <Twitter className="icon" />
                                <span>@NerDismme</span>
                                <ExternalLink size={14} className="external-icon" />
                            </a>

                            {/* Portfolio - Opens Sahil's Portfolio */}
                            <a
                                href="https://sahil-me.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detail-item clickable"
                            >
                                <User className="icon" />
                                <span>sahil-me.vercel.app</span>
                                <ExternalLink size={14} className="external-icon" />
                            </a>

                            <div className="detail-item">
                                <MapPin className="icon" />
                                <span>India</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form
                        className="contact-form"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        onSubmit={handleSubmit}
                    >
                        {status === 'success' ? (
                            <motion.div
                                className="success-message"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <div className="success-icon">
                                    <Check size={32} />
                                </div>
                                <h3>Message Sent!</h3>
                                <p>Thanks for reaching out. We'll get back to you soon.</p>
                                <button
                                    type="button"
                                    className="reset-btn"
                                    onClick={() => setStatus('idle')}
                                >
                                    Send Another
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Error Message */}
                                {status === 'error' && (
                                    <div className="error-message">
                                        <AlertCircle size={18} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">
                                        Message
                                        <span className="char-count">{formData.message.length}/1000</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="What's on your mind?"
                                        required
                                        disabled={status === 'loading'}
                                    ></textarea>
                                </div>

                                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                                    {status === 'loading' ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </motion.form>

                </div>
            </div>
        </div>
    );
};

export default Contact;
