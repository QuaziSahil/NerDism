import { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Loader, ExternalLink } from 'lucide-react';
import './ImageUploader.css';

const ImageUploader = ({ value, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef(null);

    // Upload to ImgBB (free image hosting)
    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be less than 10MB');
            return;
        }

        setError('');
        setUploading(true);

        try {
            // Use ImgBB free API
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('https://api.imgbb.com/1/upload?key=d36eb9f8e9f8d4f2b9e6d4c0a8f7c3e1', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                onChange(data.data.url);
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error('[ImageUploader] Error:', err);
            // Fallback: Convert to base64 data URL (works offline too)
            const reader = new FileReader();
            reader.onload = (e) => {
                onChange(e.target.result);
            };
            reader.readAsDataURL(file);
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput('');
            setShowUrlInput(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-uploader">
            {value ? (
                <div className="image-preview">
                    <img src={value} alt="Featured" />
                    <button className="remove-btn" onClick={handleRemove}>
                        <X size={16} />
                    </button>
                </div>
            ) : uploading ? (
                <div className="upload-progress">
                    <Loader size={24} className="spin" />
                    <span>Uploading...</span>
                </div>
            ) : showUrlInput ? (
                <div className="url-input-wrapper">
                    <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    />
                    <button onClick={handleUrlSubmit} className="url-submit">Add</button>
                    <button onClick={() => setShowUrlInput(false)} className="url-cancel">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="upload-options">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} />
                        <span>Upload Image</span>
                    </button>
                    <button className="url-btn" onClick={() => setShowUrlInput(true)}>
                        <LinkIcon size={18} />
                        <span>Paste URL</span>
                    </button>
                </div>
            )}

            {error && <p className="upload-error">{error}</p>}

            <p className="upload-hint">
                <ExternalLink size={12} />
                Tip: Use <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a> for free images
            </p>
        </div>
    );
};

export default ImageUploader;
