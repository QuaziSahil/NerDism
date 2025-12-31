import React from 'react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { CommandList } from './CommandList';
import {
    Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
    Quote, Code, Table, Minus, Image, Youtube, Twitter, Info, Type,
    Layout, ChevronRight
} from 'lucide-react';

const getSuggestionItems = ({ query }) => {
    return [
        {
            title: 'Paragraph',
            icon: <Type size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setParagraph().run();
            },
        },
        {
            title: 'Heading 1',
            icon: <Heading1 size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
            },
        },
        {
            title: 'Heading 2',
            icon: <Heading2 size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
            },
        },
        {
            title: 'Heading 3',
            icon: <Heading3 size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
            },
        },
        {
            title: 'Bullet List',
            icon: <List size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: 'Ordered List',
            icon: <ListOrdered size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: 'Blockquote',
            icon: <Quote size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run();
            },
        },
        {
            title: 'Code Block',
            icon: <Code size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            },
        },
        {
            title: 'Divider',
            icon: <Minus size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setHorizontalRule().run();
            },
        },
        {
            title: 'Table',
            icon: <Table size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            },
        },
        {
            title: 'Info Box',
            icon: <Info size={18} className="text-blue-500" />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertContent('<blockquote class="callout callout-info"><p>ℹ️ <strong>Info:</strong> </p></blockquote>').run();
            },
        },
        {
            title: 'YouTube',
            icon: <Youtube size={18} />,
            command: ({ editor, range }) => {
                const url = prompt('Enter YouTube URL:');
                if (url) {
                    editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
                }
            },
        },
        {
            title: 'Columns',
            icon: <Layout size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertColumns().run();
            },
        },
        {
            title: 'Collapsible',
            icon: <ChevronRight size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setDetails().run();
            },
        },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()));
};

const renderSuggestion = () => {
    let component;
    let popup;

    return {
        onStart: props => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            if (!props.clientRect) {
                return;
            }

            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
            });
        },

        onUpdate(props) {
            component.updateProps(props);

            if (!props.clientRect) {
                return;
            }

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },

        onKeyDown(props) {
            if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
            }

            return component.ref?.onKeyDown(props);
        },

        onExit() {
            popup[0].destroy();
            component.destroy();
        },
    };
};

export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export const getSlashCommandExtension = () => {
    return SlashCommand.configure({
        suggestion: {
            items: getSuggestionItems,
            render: renderSuggestion,
        },
    });
};
