import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
    Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
    Quote, Code, Table, Minus, Image, Youtube, Twitter, Info
} from 'lucide-react';

export const CommandList = React.forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    return (
        <div className="slash-command-menu">
            {props.items.length ? (
                props.items.map((item, index) => (
                    <button
                        className={`slash-command-item ${index === selectedIndex ? 'is-selected' : ''}`}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        <div className="slash-icon">
                            {item.icon}
                        </div>
                        <div className="slash-label">
                            {item.title}
                        </div>
                    </button>
                ))
            ) : (
                <div className="slash-command-empty">No results</div>
            )}
        </div>
    );
});
