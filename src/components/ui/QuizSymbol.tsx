import React from 'react';
import Image from 'next/image';

export type QuizSymbolVariant =
    | 'love'
    | 'social-role'
    | 'rpg'
    | 'personality'
    | 'celebrity'
    | 'destiny';

export type QuizSymbolSize = 'small' | 'medium' | 'large' | 'hero';

interface QuizSymbolProps {
    variant: QuizSymbolVariant;
    size?: QuizSymbolSize;
    interactive?: boolean;
    isCta?: boolean;
    className?: string;
}

/**
 * QuizSymbol
 * 
 * Renders a "Glowing-Outlines" symbol using internal SVGs and the global CSS design tokens.
 * 
 * @param variant - Which symbol to show (determines SVG source and glow color)
 * @param size - 'small' | 'medium' | 'large' | 'hero'
 * @param interactive - Adds hover glow effects
 * @param isCta - Adds pulse animation
 */
export function QuizSymbol({
    variant,
    size = 'medium',
    interactive = false,
    isCta = false,
    className = ''
}: QuizSymbolProps) {

    const classes = [
        'quiz-symbol',
        `quiz-symbol--${variant}`,
        `quiz-symbol--${size}`,
        interactive ? 'quiz-symbol--interactive' : 'quiz-symbol--default',
        isCta ? 'quiz-symbol--cta' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <Image
                src={`/assets/symbol-${variant}.svg`}
                alt={`${variant} symbol`}
                fill
                className="object-contain"
                unoptimized // SVGs usually don't need optimization and might look better raw
            />
        </div>
    );
}
