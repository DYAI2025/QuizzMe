'use client';

import React from 'react';

/**
 * AlchemyCard Component
 * 
 * Cream/parchment background card with gold border
 * for "Modern Alchemy" grimoire-style UI elements.
 */

interface AlchemyCardProps {
    children: React.ReactNode;
    variant?: 'default' | 'parchment' | 'elevated';
    size?: 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    className?: string;
    as?: 'div' | 'article' | 'section';
}

export function AlchemyCard({
    children,
    variant = 'default',
    size = 'md',
    hoverable = false,
    className = '',
    as: Component = 'div',
}: AlchemyCardProps) {
    // Size padding classes
    const sizeStyles = {
        sm: 'p-4',
        md: 'p-6 md:p-8',
        lg: 'p-8 md:p-12',
    };

    // Variant styles
    const variantStyles = {
        default: {
            background: 'var(--alchemy-cream)',
            borderColor: 'var(--alchemy-gold-primary)',
        },
        parchment: {
            background: 'linear-gradient(135deg, var(--alchemy-cream) 0%, var(--alchemy-parchment) 100%)',
            borderColor: 'var(--alchemy-gold-dark)',
        },
        elevated: {
            background: 'var(--alchemy-cream-light)',
            borderColor: 'var(--alchemy-gold-light)',
        },
    };

    const style = variantStyles[variant];

    return (
        <Component
            className={`
        rounded-2xl
        border
        ${sizeStyles[size]}
        ${hoverable ? 'transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
            style={{
                background: style.background,
                borderColor: style.borderColor,
                borderWidth: '1px',
                boxShadow: 'var(--shadow-md)',
                color: 'var(--alchemy-text-dark)',
                ...(hoverable ? {} : {}),
            }}
            onMouseEnter={hoverable ? (e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = 'var(--shadow-lg), var(--glow-gold-subtle)';
            } : undefined}
            onMouseLeave={hoverable ? (e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'var(--shadow-md)';
            } : undefined}
        >
            {children}
        </Component>
    );
}

/**
 * AlchemyCardHeader - Optional header section for cards
 */
interface AlchemyCardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function AlchemyCardHeader({ children, className = '' }: AlchemyCardHeaderProps) {
    return (
        <div
            className={`border-b pb-4 mb-4 ${className}`}
            style={{ borderColor: 'var(--alchemy-gold-muted)' }}
        >
            {children}
        </div>
    );
}

/**
 * AlchemyCardTitle - Serif title for card headers
 */
interface AlchemyCardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function AlchemyCardTitle({
    children,
    className = '',
    as: Component = 'h2'
}: AlchemyCardTitleProps) {
    return (
        <Component
            className={`font-serif font-semibold text-xl md:text-2xl ${className}`}
            style={{
                color: 'var(--alchemy-text-dark)',
                fontFamily: 'var(--font-serif)',
            }}
        >
            {children}
        </Component>
    );
}

/**
 * AlchemyCardContent - Main content area
 */
interface AlchemyCardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function AlchemyCardContent({ children, className = '' }: AlchemyCardContentProps) {
    return (
        <div
            className={`font-sans ${className}`}
            style={{
                fontFamily: 'var(--font-sans)',
                lineHeight: 'var(--leading-relaxed)',
            }}
        >
            {children}
        </div>
    );
}

/**
 * AlchemyCardFooter - Optional footer with actions
 */
interface AlchemyCardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function AlchemyCardFooter({ children, className = '' }: AlchemyCardFooterProps) {
    return (
        <div
            className={`border-t pt-4 mt-4 flex items-center gap-4 ${className}`}
            style={{ borderColor: 'var(--alchemy-gold-muted)' }}
        >
            {children}
        </div>
    );
}
