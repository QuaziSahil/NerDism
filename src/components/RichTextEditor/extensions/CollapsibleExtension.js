import { Node, mergeAttributes } from '@tiptap/core';

export const Details = Node.create({
    name: 'details',
    group: 'block',
    content: 'summary detailsContent',
    defining: true,
    isolating: true,

    addAttributes() {
        return {
            open: {
                default: true,
                parseHTML: element => element.hasAttribute('open'),
                renderHTML: attributes => {
                    if (attributes.open) {
                        return { open: '' };
                    }
                    return {};
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: 'details' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['details', mergeAttributes(HTMLAttributes, { class: 'editor-details' }), 0];
    },

    addCommands() {
        return {
            setDetails: () => ({ commands }) => {
                return commands.insertContent({
                    type: 'details',
                    content: [
                        { type: 'summary', content: [{ type: 'text', text: 'Toggle me' }] },
                        { type: 'detailsContent', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'To show details...' }] }] },
                    ],
                });
            },
        };
    },
});

export const Summary = Node.create({
    name: 'summary',
    content: 'text*',
    marks: '',
    defining: true,
    isolating: true,

    parseHTML() {
        return [{ tag: 'summary' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['summary', mergeAttributes(HTMLAttributes, { class: 'editor-summary' }), 0];
    },
});

export const DetailsContent = Node.create({
    name: 'detailsContent',
    group: 'block',
    content: 'block+',
    defining: true,
    isolating: true,

    parseHTML() {
        return [{ tag: 'div', getAttrs: element => element.classList.contains('details-content') && null }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { class: 'details-content' }), 0];
    },
});
