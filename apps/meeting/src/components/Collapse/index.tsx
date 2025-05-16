import React, { useState } from 'react';

const collapseStyles: React.CSSProperties = {
    border: '1px solid var(--mdc-theme-surface-3, rgba(0, 0, 0, 0.12))',
    borderRadius: '16px',
    marginBottom: '1rem',
    overflow: 'hidden',
    fontFamily: 'var(--mdc-typography-font-family, Syne, sans-serif)',
    backgroundColor: 'var(--mdc-theme-surface, #fff)',
};

const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    cursor: 'pointer',
    backgroundColor: 'var(--mdc-theme-surface, #fff)',
    color: 'var(--mdc-theme-on-surface, #000)',
    fontSize: 'var(--mdc-typography-subtitle1-font-size, 1rem)',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
    borderRadius: '16px 16px 0 0',
};

const contentStyles: React.CSSProperties = {
    padding: '0 1rem',
    backgroundColor: 'var(--mdc-theme-background, #fafafa)',
    maxHeight: '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, padding 0.3s ease',
};

const contentOpenStyles: React.CSSProperties = {
    maxHeight: '600px',
    padding: '1rem',
};

const iconStyles: React.CSSProperties = {
    transition: 'transform 0.3s ease',
    fontSize: '24px',
    color: 'var(--mdc-theme-on-surface, #000)',
};

const iconOpenStyles: React.CSSProperties = {
    transform: 'rotate(180deg)',
};

const titleIconStyles: React.CSSProperties = {
    fontSize: '24px',
    color: 'var(--mdc-theme-on-surface, #000)',
    marginRight: '8px', // Space between icon and title
};

interface CollapseProps {
    title: string;
    icon?: string; // New optional prop for title icon
    children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => setIsOpen(!isOpen);

    return (
        <div style={collapseStyles}>
            <div style={headerStyles} onClick={toggleCollapse}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    {icon && (
                        <span className="material-symbols-outlined" style={titleIconStyles}>
                            {icon}
                        </span>
                    )}
                    {title}
                </span>
                <span
                    style={{ ...iconStyles, ...(isOpen ? iconOpenStyles : {}) }}
                    className="material-symbols-outlined"
                >
                    expand_more
                </span>
            </div>
            <div style={{ ...contentStyles, ...(isOpen ? contentOpenStyles : {}) }}>
                {children}
            </div>
        </div>
    );
};