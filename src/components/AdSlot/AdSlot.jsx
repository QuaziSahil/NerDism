import { useEffect, useRef } from 'react';
import './AdSlot.css';

const AdSlot = ({ slotId, format = 'auto', className = '' }) => {
    const adRef = useRef(null);

    useEffect(() => {
        // Check if AdSense script is already loaded
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
            const script = document.createElement('script');
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8144222817767750";
            script.async = true;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        }

        try {
            if (window.adsbygoogle) {
                window.adsbygoogle.push({});
            }
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className={`ad-container ${className}`}>
            <span className="ad-label">Advertisement</span>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-8144222817767750"
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
                ref={adRef}
            ></ins>
        </div>
    );
};

export default AdSlot;
