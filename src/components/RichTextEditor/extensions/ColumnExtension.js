import { Node, mergeAttributes } from '@tiptap/core';

export const Column = Node.create({
    name: 'column',

    content: 'block+',
    isolating: true,

    addAttributes() {
        return {
            style: {
                default: 'flex: 1; min-width: 0;',
                parseHTML: element => element.getAttribute('style'),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="column"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column', class: 'editor-column' }), 0];
    },
});

export const Columns = Node.create({
    name: 'columns',

    group: 'block',
    content: 'column column', // Exactly 2 columns for now
    isolating: true,

    parseHTML() {
        return [
            {
                tag: 'div[data-type="columns"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'columns', class: 'editor-columns' }), 0];
    },

    addCommands() {
        return {
            insertColumns: () => ({ commands }) => {
                return commands.insertContent({
                    type: 'columns',
                    content: [
                        { type: 'column', content: [{ type: 'paragraph' }] },
                        { type: 'column', content: [{ type: 'paragraph' }] },
                    ],
                });
            },
        };
    },
});
