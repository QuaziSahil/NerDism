import { motion } from 'framer-motion';
import './Legal.css';

const Terms = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <motion.div
                    className="legal-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Terms of <span className="gradient-text">Service</span></h1>
                    <p className="last-updated">Last updated: January 2026</p>

                    <section>
                        <h2>Agreement to Terms</h2>
                        <p>
                            By accessing and using NerDism (nerdism.me), you agree to be bound by these
                            Terms of Service. If you do not agree with any part of these terms, please
                            do not use our website.
                        </p>
                    </section>

                    <section>
                        <h2>Use of Our Service</h2>
                        <p>You agree to use NerDism only for lawful purposes. You must not:</p>
                        <ul>
                            <li>Use our Site in any way that violates applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Transmit any malware, viruses, or harmful code</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Copy, reproduce, or scrape our content without permission</li>
                            <li>Use automated systems to access our Site excessively</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Intellectual Property</h2>
                        <p>
                            All content on NerDism, including articles, images, logos, and design elements,
                            is the property of NerDism or its content creators and is protected by copyright
                            and other intellectual property laws.
                        </p>
                        <p>
                            You may share our content on social media with proper attribution and a link back
                            to the original article. Commercial use of our content without written permission
                            is prohibited.
                        </p>
                    </section>

                    <section>
                        <h2>User-Generated Content</h2>
                        <p>
                            When you submit comments or other content to our Site, you grant us a non-exclusive,
                            royalty-free license to use, reproduce, and display that content. You are responsible
                            for ensuring your submissions do not violate any third-party rights.
                        </p>
                    </section>

                    <section>
                        <h2>Third-Party Links</h2>
                        <p>
                            Our Site may contain links to third-party websites. We are not responsible for the
                            content, privacy policies, or practices of these external sites. Visiting these links
                            is at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2>Advertisements</h2>
                        <p>
                            NerDism displays advertisements through Google AdSense and may include other
                            advertising partners. These ads may use cookies to serve personalized content.
                            We are not responsible for the content of third-party advertisements.
                        </p>
                    </section>

                    <section>
                        <h2>Disclaimer</h2>
                        <p>
                            The content on NerDism is provided "as is" for informational and entertainment
                            purposes only. We make no warranties about the accuracy, completeness, or reliability
                            of any information on our Site.
                        </p>
                        <p>
                            Our articles about technology, gaming, anime, and other topics represent the opinions
                            of the authors and should not be taken as professional advice.
                        </p>
                    </section>

                    <section>
                        <h2>Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, NerDism and its operators shall not be
                            liable for any indirect, incidental, special, or consequential damages arising
                            from your use of our Site.
                        </p>
                    </section>

                    <section>
                        <h2>Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless NerDism and its operators from any claims,
                            damages, or expenses arising from your violation of these Terms or your use of our Site.
                        </p>
                    </section>

                    <section>
                        <h2>Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. Changes will be effective
                            immediately upon posting. Your continued use of the Site after changes constitutes
                            acceptance of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2>Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with applicable laws,
                            without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2>Contact Us</h2>
                        <p>
                            If you have questions about these Terms, please contact us at:
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

export default Terms;
