import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">

                {/* Stylish Logo Text */}
                <NavLink to="/" className="logo">
                    <motion.span
                        className="logo-text"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="logo-ner">Ner</span>
                        <span className="logo-dism">Dism</span>
                    </motion.span>
                </NavLink>

                {/* Desktop Links */}
                <div className="nav-links">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Actions */}
                <div className="nav-actions">
                    <motion.button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.button>

                    {/* Mobile Toggle */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className="nav-link"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
