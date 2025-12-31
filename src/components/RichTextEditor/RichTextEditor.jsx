import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Extension } from '@tiptap/core';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, List, ListOrdered,
    Quote, Code, Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Undo, Redo, Minus, Palette, Highlighter, Type,
    ChevronDown, CaseSensitive, Keyboard, Search, X, Check, Save,
    Table as TableIcon, PlusCircle, Trash2, Info, AlertTriangle, Lightbulb, FileCode,
    Youtube as YoutubeIcon, Twitter as TwitterIcon, Video
} from 'lucide-react';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import './RichTextEditor.css';

const MenuButton = ({ onClick, isActive, disabled, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`menu-btn ${isActive ? 'active' : ''}`}
        disabled={disabled}
        title={title}
    >
        {children}
    </button>
);

// Define FontSize extension manually to ensure it works
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run();
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

const COLORS = [
    { name: 'Default', value: null },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#6b7280' },
];

const FONT_SIZES = [
    { name: 'Small', value: '14px' },
    { name: 'Normal', value: '16px' },
    { name: 'Large', value: '20px' },
    { name: 'Huge', value: '28px' },
];

const FONTS = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Oswald', value: 'Oswald, sans-serif' },
    { name: 'Serif', value: '"Crimson Text", serif' },
    { name: 'Playfair', value: '"Playfair Display", serif' },
    { name: 'Monospace', value: '"Space Mono", monospace' },
    { name: 'Lobster', value: 'Lobster, cursive' },
];

const RichTextEditor = ({ content, onChange, placeholder = "Write your masterpiece here...", onAutoSave }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [showFontFamily, setShowFontFamily] = useState(false);

    // Phase 1: New State
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showFindReplace, setShowFindReplace] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [lastSaved, setLastSaved] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const autoSaveTimerRef = useRef(null);

    // Phase 2: New State
    const [showTableMenu, setShowTableMenu] = useState(false);
    const [showCalloutMenu, setShowCalloutMenu] = useState(false);

    // Phase 3: Embed State
    const [showEmbedMenu, setShowEmbedMenu] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontFamily,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            FontSize,
            // Phase 2: Table Extensions
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            // Phase 3: YouTube
            Youtube.configure({
                controls: false,
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'rich-editor-content',
            },
        },
    });

    const addLink = useCallback(() => {
        const url = prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    // Phase 3: Embed Handlers
    const addYoutube = useCallback(() => {
        const url = prompt('Enter YouTube URL:');
        if (url) {
            editor?.chain().focus().setYoutubeVideo({ src: url }).run();
            setShowEmbedMenu(false);
        }
    }, [editor]);

    const addTwitter = useCallback(() => {
        // Twitter embed (basic blockquote method for now)
        const url = prompt('Enter Tweet URL:');
        if (url) {
            const tweetId = url.split('/').pop().split('?')[0];
            // We can't easily auto-embed scripts in basic editor without more complex handling,
            // so we'll just insert a link that looks like an embed or use OEmbed if we had a backend.
            // For now, let's insert a styled visual link/card.
            editor?.chain().focus().insertContent(`<blockquote class="twitter-tweet"><a href="${url}">View Tweet</a></blockquote>`).run();
            setShowEmbedMenu(false);
        }
    }, [editor]);

    // Hidden file input ref for image upload
    const imageInputRef = useRef(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Handle image file upload to Firebase Storage
    const handleImageUpload = useCallback(async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setIsUploadingImage(true);
        try {
            // Create unique filename
            const timestamp = Date.now();
            const fileName = `inline-images/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const storageRef = ref(storage, fileName);

            // Upload to Firebase Storage
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            // Prompt for Alt Text
            const altText = prompt('Enter image description (Alt Text):', file.name.split('.')[0]);

            // Insert image into editor
            editor?.chain().focus().setImage({ src: url, alt: altText || '' }).run();
        } catch (error) {
            console.error('Image upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploadingImage(false);
            // Reset input for same file re-upload
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        }
    }, [editor]);

    const triggerImageUpload = () => {
        imageInputRef.current?.click();
    };

    // Close dropdowns when clicking outside
    const closeDropdowns = () => {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowFontSize(false);
        setShowFontFamily(false);
        setShowTableMenu(false);
        setShowCalloutMenu(false);
        setShowEmbedMenu(false);
    };

    // Word and Character Count
    const wordCount = useMemo(() => {
        if (!editor) return { words: 0, chars: 0, charsNoSpaces: 0 };
        const text = editor.getText();
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        return { words, chars, charsNoSpaces };
    }, [editor?.getText()]);

    // Auto-save effect (every 30 seconds)
    useEffect(() => {
        if (!editor || !onAutoSave) return;

        // Clear existing timer
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        // Set new timer
        autoSaveTimerRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                await onAutoSave(editor.getHTML());
                setLastSaved(new Date());
            } catch (error) {
                console.error('Auto-save failed:', error);
            } finally {
                setIsSaving(false);
            }
        }, 30000); // 30 seconds

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [editor?.getHTML(), onAutoSave]);

    // Keyboard shortcuts listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+/ or Cmd+/ for shortcuts panel
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                setShowShortcuts(prev => !prev);
            }
            // Ctrl+F or Cmd+F for find
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setShowFindReplace(true);
            }
            // Escape to close modals
            if (e.key === 'Escape') {
                setShowShortcuts(false);
                setShowFindReplace(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Find in editor
    const handleFind = useCallback(() => {
        if (!editor || !findText) return;
        // Use browser's find - TipTap doesn't have built-in search
        if (window.find) {
            window.find(findText);
        }
    }, [editor, findText]);

    // Replace in editor
    const handleReplace = useCallback(() => {
        if (!editor || !findText) return;
        const content = editor.getHTML();
        const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
        editor.commands.setContent(newContent);
        onChange(newContent);
        setShowFindReplace(false);
    }, [editor, findText, replaceText, onChange]);

    if (!editor) {
        return <div className="rich-text-editor">Loading editor...</div>;
    }

    return (
        <div className="rich-text-editor" onClick={closeDropdowns}>
            {/* Toolbar */}
            <div className="editor-toolbar" onClick={(e) => e.stopPropagation()}>
                {/* Text Style */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough size={16} />
                    </MenuButton>
                </div>

                <div className="toolbar-divider" />

                {/* Headings & Font Controls */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 size={16} />
                    </MenuButton>

                    {/* Font Family Dropdown */}
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFontFamily(!showFontFamily);
                                setShowFontSize(false);
                                setShowColorPicker(false);
                                setShowHighlightPicker(false);
                            }}
                            title="Font Family"
                            isActive={showFontFamily}
                        >
                            <Type size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showFontFamily && (
                            <div className="color-dropdown font-family-dropdown">
                                {FONTS.map((font) => (
                                    <button
                                        key={font.name}
                                        className="font-family-option"
                                        style={{ fontFamily: font.value }}
                                        onClick={() => {
                                            editor.chain().focus().setFontFamily(font.value).run();
                                            setShowFontFamily(false);
                                        }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                                <button
                                    className="font-family-option reset"
                                    onClick={() => {
                                        editor.chain().focus().unsetFontFamily().run();
                                        setShowFontFamily(false);
                                    }}
                                >
                                    Default Font
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Font Size Dropdown */}
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFontSize(!showFontSize);
                                setShowFontFamily(false);
                                setShowColorPicker(false);
                                setShowHighlightPicker(false);
                            }}
                            title="Font Size"
                        >
                            <CaseSensitive size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showFontSize && (
                            <div className="color-dropdown font-size-dropdown">
                                {FONT_SIZES.map((size) => (
                                    <button
                                        key={size.name}
                                        className="font-size-option"
                                        style={{ fontSize: size.value }}
                                        onClick={() => {
                                            editor.chain().focus().setFontSize(size.value).run();
                                            setShowFontSize(false);
                                        }}
                                    >
                                        {size.name} ({size.value})
                                    </button>
                                ))}
                                <button
                                    className="font-size-option reset"
                                    onClick={() => {
                                        editor.chain().focus().unsetFontSize().run();
                                        setShowFontSize(false);
                                    }}
                                >
                                    Default Size
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Text Color */}
                <div className="toolbar-group">
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowColorPicker(!showColorPicker);
                                setShowHighlightPicker(false);
                                setShowFontSize(false);
                                setShowFontFamily(false);
                            }}
                            title="Text Color"
                            isActive={editor.isActive('textStyle', { color: /./ })}
                        >
                            <Palette size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showColorPicker && (
                            <div className="color-dropdown">
                                <div className="dropdown-title">Text Color</div>
                                <div className="color-grid">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.name}
                                            className={`color-swatch ${color.value === null ? 'reset' : ''}`}
                                            style={{ backgroundColor: color.value || '#374151' }}
                                            onClick={() => {
                                                if (color.value) {
                                                    editor.chain().focus().setColor(color.value).run();
                                                } else {
                                                    editor.chain().focus().unsetColor().run();
                                                }
                                                setShowColorPicker(false);
                                            }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Highlight Color */}
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowHighlightPicker(!showHighlightPicker);
                                setShowColorPicker(false);
                                setShowFontSize(false);
                                setShowFontFamily(false);
                            }}
                            isActive={editor.isActive('highlight')}
                            title="Highlight"
                        >
                            <Highlighter size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showHighlightPicker && (
                            <div className="color-dropdown">
                                <div className="dropdown-title">Highlight</div>
                                <div className="color-grid">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.name}
                                            className={`color-swatch ${color.value === null ? 'reset' : ''}`}
                                            style={{ backgroundColor: color.value || '#374151' }}
                                            onClick={() => {
                                                if (color.value) {
                                                    editor.chain().focus().toggleHighlight({ color: color.value }).run();
                                                } else {
                                                    editor.chain().focus().unsetHighlight().run();
                                                }
                                                setShowHighlightPicker(false);
                                            }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Lists & Blocks */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Blockquote"
                    >
                        <Quote size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <Code size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Horizontal Line"
                    >
                        <Minus size={16} />
                    </MenuButton>
                </div>

                <div className="toolbar-divider" />

                {/* Alignment */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justify"
                    >
                        <AlignJustify size={16} />
                    </MenuButton>
                </div>

                <div className="toolbar-divider" />

                {/* Insert */}
                <div className="toolbar-group">
                    <MenuButton onClick={addLink} isActive={editor.isActive('link')} title="Insert Link">
                        <LinkIcon size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={triggerImageUpload}
                        title="Insert Image from Device"
                        disabled={isUploadingImage}
                    >
                        {isUploadingImage ? (
                            <span className="upload-spinner">⏳</span>
                        ) : (
                            <ImageIcon size={16} />
                        )}
                    </MenuButton>
                    {/* Hidden file input for image upload */}
                    <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />

                    {/* Table Dropdown */}
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowTableMenu(!showTableMenu);
                                setShowCalloutMenu(false);
                            }}
                            isActive={editor.isActive('table')}
                            title="Insert Table"
                        >
                            <TableIcon size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showTableMenu && (
                            <div className="color-dropdown table-dropdown">
                                <div className="dropdown-title">Table Options</div>
                                <button
                                    className="dropdown-btn"
                                    onClick={() => {
                                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                                        setShowTableMenu(false);
                                    }}
                                >
                                    <PlusCircle size={14} /> Insert 3×3 Table
                                </button>
                                {editor.isActive('table') && (
                                    <>
                                        <div className="dropdown-divider" />
                                        <button
                                            className="dropdown-btn"
                                            onClick={() => {
                                                editor.chain().focus().addRowAfter().run();
                                                setShowTableMenu(false);
                                            }}
                                        >
                                            Add Row Below
                                        </button>
                                        <button
                                            className="dropdown-btn"
                                            onClick={() => {
                                                editor.chain().focus().addColumnAfter().run();
                                                setShowTableMenu(false);
                                            }}
                                        >
                                            Add Column Right
                                        </button>
                                        <button
                                            className="dropdown-btn danger"
                                            onClick={() => {
                                                editor.chain().focus().deleteRow().run();
                                                setShowTableMenu(false);
                                            }}
                                        >
                                            <Trash2 size={14} /> Delete Row
                                        </button>
                                        <button
                                            className="dropdown-btn danger"
                                            onClick={() => {
                                                editor.chain().focus().deleteColumn().run();
                                                setShowTableMenu(false);
                                            }}
                                        >
                                            <Trash2 size={14} /> Delete Column
                                        </button>
                                        <button
                                            className="dropdown-btn danger"
                                            onClick={() => {
                                                editor.chain().focus().deleteTable().run();
                                                setShowTableMenu(false);
                                            }}
                                        >
                                            <Trash2 size={14} /> Delete Table
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Callout Dropdown */}
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCalloutMenu(!showCalloutMenu);
                                setShowTableMenu(false);
                                setShowEmbedMenu(false);
                            }}
                            title="Insert Callout Box"
                        >
                            <Info size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showCalloutMenu && (
                            <div className="color-dropdown callout-dropdown">
                                <div className="dropdown-title">Callout Boxes</div>
                                <button
                                    className="dropdown-btn callout-info"
                                    onClick={() => {
                                        editor.chain().focus().insertContent('<blockquote class="callout callout-info"><p>ℹ️ <strong>Info:</strong> Your information here...</p></blockquote>').run();
                                        setShowCalloutMenu(false);
                                    }}
                                >
                                    <Info size={14} /> Info Box
                                </button>
                                <button
                                    className="dropdown-btn callout-warning"
                                    onClick={() => {
                                        editor.chain().focus().insertContent('<blockquote class="callout callout-warning"><p>⚠️ <strong>Warning:</strong> Your warning here...</p></blockquote>').run();
                                        setShowCalloutMenu(false);
                                    }}
                                >
                                    <AlertTriangle size={14} /> Warning Box
                                </button>
                                <button
                                    className="dropdown-btn callout-tip"
                                    onClick={() => {
                                        editor.chain().focus().insertContent('<blockquote class="callout callout-tip"><p>💡 <strong>Tip:</strong> Your tip here...</p></blockquote>').run();
                                        setShowCalloutMenu(false);
                                    }}
                                >
                                    <Lightbulb size={14} /> Tip Box
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Media Embed Dropdown */}
                    <div className="dropdown-wrapper">
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEmbedMenu(!showEmbedMenu);
                                setShowTableMenu(false);
                                setShowCalloutMenu(false);
                            }}
                            isActive={editor.isActive('youtube')}
                            title="Embed Media"
                        >
                            <Video size={16} />
                            <ChevronDown size={12} />
                        </MenuButton>
                        {showEmbedMenu && (
                            <div className="color-dropdown callout-dropdown">
                                <div className="dropdown-title">Embed Media</div>
                                <button
                                    className="dropdown-btn"
                                    onClick={addYoutube}
                                >
                                    <YoutubeIcon size={14} /> YouTube
                                </button>
                                <button
                                    className="dropdown-btn"
                                    onClick={addTwitter}
                                >
                                    <TwitterIcon size={14} /> Twitter / X
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Code Block Button */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <FileCode size={16} />
                    </MenuButton>
                </div>

                <div className="toolbar-divider" />

                {/* Undo/Redo */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo size={16} />
                    </MenuButton>
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} className="editor-content-wrapper" />

            {/* Editor Footer - Word Count & Status */}
            <div className="editor-footer">
                <div className="footer-stats">
                    <span className="stat-item">
                        <strong>{wordCount.words}</strong> words
                    </span>
                    <span className="stat-item">
                        <strong>{wordCount.chars}</strong> chars
                    </span>
                    <span className="stat-item muted">
                        ~{Math.ceil(wordCount.words / 200)} min read
                    </span>
                </div>
                <div className="footer-actions">
                    {isSaving && (
                        <span className="save-indicator saving">
                            <Save size={14} /> Saving...
                        </span>
                    )}
                    {lastSaved && !isSaving && (
                        <span className="save-indicator saved">
                            <Check size={14} /> Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        className="footer-btn"
                        onClick={() => setShowShortcuts(true)}
                        title="Keyboard Shortcuts (Ctrl+/)"
                    >
                        <Keyboard size={16} />
                    </button>
                    <button
                        className="footer-btn"
                        onClick={() => setShowFindReplace(true)}
                        title="Find & Replace (Ctrl+F)"
                    >
                        <Search size={16} />
                    </button>
                </div>
            </div>

            {/* Keyboard Shortcuts Modal */}
            {showShortcuts && (
                <div className="editor-modal-overlay" onClick={() => setShowShortcuts(false)}>
                    <div className="editor-modal shortcuts-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Keyboard size={20} /> Keyboard Shortcuts</h3>
                            <button className="modal-close" onClick={() => setShowShortcuts(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="shortcuts-grid">
                            <div className="shortcut-group">
                                <h4>Text Formatting</h4>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>B</kbd> Bold</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>I</kbd> Italic</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>U</kbd> Underline</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> Strikethrough</div>
                            </div>
                            <div className="shortcut-group">
                                <h4>Structure</h4>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1</kbd> Heading 1</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>2</kbd> Heading 2</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>3</kbd> Heading 3</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>7</kbd> Numbered List</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>8</kbd> Bullet List</div>
                            </div>
                            <div className="shortcut-group">
                                <h4>Actions</h4>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Y</kbd> Redo</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>F</kbd> Find</div>
                                <div className="shortcut-item"><kbd>Ctrl</kbd>+<kbd>/</kbd> This Panel</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Find & Replace Modal */}
            {showFindReplace && (
                <div className="editor-modal-overlay" onClick={() => setShowFindReplace(false)}>
                    <div className="editor-modal find-replace-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Search size={20} /> Find & Replace</h3>
                            <button className="modal-close" onClick={() => setShowFindReplace(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="find-replace-inputs">
                            <div className="input-group">
                                <label>Find</label>
                                <input
                                    type="text"
                                    value={findText}
                                    onChange={e => setFindText(e.target.value)}
                                    placeholder="Search text..."
                                    autoFocus
                                />
                            </div>
                            <div className="input-group">
                                <label>Replace with</label>
                                <input
                                    type="text"
                                    value={replaceText}
                                    onChange={e => setReplaceText(e.target.value)}
                                    placeholder="Replacement text..."
                                />
                            </div>
                        </div>
                        <div className="find-replace-actions">
                            <button className="btn-find" onClick={handleFind}>
                                <Search size={16} /> Find Next
                            </button>
                            <button className="btn-replace" onClick={handleReplace} disabled={!findText}>
                                Replace All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
