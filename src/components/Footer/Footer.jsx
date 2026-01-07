import { Link } from 'react-router-dom';
import { Twitter, Mail, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-ner">Ner</span>
                            <span className="logo-dism">Dism</span>
                        </Link>
                        <p className="footer-tagline">Where curiosity becomes culture.</p>
                    </div>

                    {/* Links */}
                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Explore</h4>
                            <Link to="/blog">Blog</Link>
                            <Link to="/about">About</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                        <div className="link-group">
                            <h4>Legal</h4>
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="footer-social">
                        <a href="https://x.com/NerDismme" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter size={20} />
                        </a>
                        <a href="mailto:nerdism.me@gmail.com" aria-label="Email">
                            <Mail size={20} />
                        </a>
                        <a href="https://github.com/QuaziSahil" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github size={20} />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p>&copy; {currentYear} NerDism. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
