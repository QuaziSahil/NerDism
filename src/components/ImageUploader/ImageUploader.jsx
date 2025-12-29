import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, Link as LinkIcon } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './ImageUploader.css';

const ImageUploader = ({ value, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError('');
        setUploading(true);
        setProgress(0);

        try {
            const storage = getStorage();
            const fileName = `nerdism_posts/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(prog);
                },
                (error) => {
                    console.error('[ImageUploader] Upload error:', error);
                    setError('Upload failed. Please try again.');
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    onChange(downloadURL);
                    setUploading(false);
                    setProgress(0);
                }
            );
        } catch (err) {
            console.error('[ImageUploader] Error:', err);
            setError('Upload failed. Please try again.');
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
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span>{progress}%</span>
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
                        <span>Use URL</span>
                    </button>
                </div>
            )}

            {error && <p className="upload-error">{error}</p>}
        </div>
    );
};

export default ImageUploader;
