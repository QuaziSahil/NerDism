import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Twitter, Send, Check, ExternalLink, AlertCircle } from 'lucide-react';
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
                            Have a question, suggestion, or just want to geek out about something?
                            Drop us a line.
                        </p>

                        <div className="contact-details">
                            {/* Email - Opens Gmail/Mail app */}
                            <a href="mailto:nerdism.me@gmail.com" className="detail-item clickable">
                                <Mail className="icon" />
                                <span>nerdism.me@gmail.com</span>
                                <ExternalLink size={14} className="external-icon" />
                            </a>

                            {/* Twitter - Opens X profile */}
                            <a
                                href="https://x.com/OfficialNerDism"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detail-item clickable"
                            >
                                <Twitter className="icon" />
                                <span>@OfficialNerDism</span>
                                <ExternalLink size={14} className="external-icon" />
                            </a>

                            <div className="detail-item">
                                <MapPin className="icon" />
                                <span>Internet, Earth</span>
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
