import { motion } from 'framer-motion';
import './Legal.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <motion.div
                    className="legal-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Privacy <span className="gradient-text">Policy</span></h1>
                    <p className="last-updated">Last updated: January 2026</p>

                    <section>
                        <h2>Introduction</h2>
                        <p>
                            Welcome to NerDism ("we," "our," or "us"). We are committed to protecting your privacy
                            and ensuring you have a positive experience on our website nerdism.me (the "Site").
                        </p>
                    </section>

                    <section>
                        <h2>Information We Collect</h2>
                        <h3>Information You Provide</h3>
                        <ul>
                            <li><strong>Contact Form:</strong> When you use our contact form, we collect your name, email address, and message content.</li>
                            <li><strong>Newsletter:</strong> If you subscribe to our newsletter, we collect your email address.</li>
                            <li><strong>Comments:</strong> If you comment on posts, we may collect your name and email.</li>
                        </ul>

                        <h3>Information Collected Automatically</h3>
                        <ul>
                            <li><strong>Cookies:</strong> We use cookies to improve your browsing experience and for analytics purposes.</li>
                            <li><strong>Log Data:</strong> Our servers may automatically log information including your IP address, browser type, and pages visited.</li>
                            <li><strong>Analytics:</strong> We use analytics services to understand how visitors interact with our Site.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Third-Party Services</h2>
                        <p>We use the following third-party services that may collect information:</p>
                        <ul>
                            <li><strong>Google AdSense:</strong> We display advertisements through Google AdSense. Google may use cookies to serve ads based on your prior visits to our Site or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
                            <li><strong>Google Analytics:</strong> We use Google Analytics to analyze website traffic and usage patterns.</li>
                            <li><strong>Firebase:</strong> Our Site is powered by Firebase for hosting and data storage.</li>
                            <li><strong>EmailJS:</strong> We use EmailJS to process contact form submissions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>How We Use Your Information</h2>
                        <ul>
                            <li>To respond to your inquiries and provide customer support</li>
                            <li>To send newsletters if you've subscribed</li>
                            <li>To improve our Site and content</li>
                            <li>To display relevant advertisements</li>
                            <li>To analyze site usage and trends</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Cookies</h2>
                        <p>
                            Cookies are small text files stored on your device. We use cookies for:
                        </p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how you use our Site</li>
                            <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant ads</li>
                        </ul>
                        <p>
                            You can control cookies through your browser settings. However, disabling cookies may affect site functionality.
                        </p>
                    </section>

                    <section>
                        <h2>Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information. However,
                            no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2>Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt out of marketing communications</li>
                            <li>Opt out of personalized advertising</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Children's Privacy</h2>
                        <p>
                            Our Site is not intended for children under 13. We do not knowingly collect information
                            from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2>Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes
                            by posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2>Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <ul>
                            <li>Email: <a href="mailto:nerdism.me@gmail.com">nerdism.me@gmail.com</a></li>
                            <li>Twitter: <a href="https://x.com/NerDismme" target="_blank" rel="noopener noreferrer">@NerDismme</a></li>
                        </ul>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
