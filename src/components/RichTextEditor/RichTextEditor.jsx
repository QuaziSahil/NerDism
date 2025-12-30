import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, List, ListOrdered,
    Quote, Code, Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Undo, Redo, Minus
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

const RichTextEditor = ({ content, onChange, placeholder = "Write your masterpiece here..." }) => {
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

    if (!editor) {
        return <div className="rich-text-editor">Loading editor...</div>;
    }

    return (
        <div className="rich-text-editor">
            {/* Toolbar */}
            <div className="editor-toolbar">
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

                {/* Headings */}
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
