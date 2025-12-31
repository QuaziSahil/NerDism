import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const CustomHeading = Heading.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            id: {
                default: null,
                parseHTML: element => element.getAttribute('id'),
                renderHTML: attributes => {
                    if (!attributes.id) {
                        return {};
                    }
                    return {
                        id: attributes.id,
                    };
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('headingId'),
                appendTransaction: (transactions, oldState, newState) => {
                    const docChanged = transactions.some(transaction => transaction.docChanged);
                    if (!docChanged) {
                        return;
                    }

                    const tr = newState.tr;
                    let modified = false;

                    newState.doc.descendants((node, pos) => {
                        if (node.type.name === this.name && !node.attrs.id) {
                            const id = node.textContent
                                .toLowerCase()
                                .trim()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/\s+/g, '-');

                            if (id) {
                                tr.setNodeMarkup(pos, undefined, { ...node.attrs, id });
                                modified = true;
                            }
                        }
                    });

                    if (modified) {
                        return tr;
                    }
                },
            }),
        ];
    },
});
