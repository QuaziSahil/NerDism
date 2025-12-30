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
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, List, ListOrdered,
    Quote, Code, Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Undo, Redo, Minus, Palette, Highlighter, Type,
    ChevronDown, CaseSensitive
} from 'lucide-react';
import { useState, useCallback } from 'react';
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

const RichTextEditor = ({ content, onChange, placeholder = "Write your masterpiece here..." }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [showFontFamily, setShowFontFamily] = useState(false);

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

    const addImage = useCallback(() => {
        const url = prompt('Enter image URL:');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    // Close dropdowns when clicking outside
    const closeDropdowns = () => {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowFontSize(false);
        setShowFontFamily(false);
    };

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
                    <MenuButton onClick={addImage} title="Insert Image">
                        <ImageIcon size={16} />
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
        </div>
    );
};

export default RichTextEditor;
