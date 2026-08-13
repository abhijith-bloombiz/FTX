/**
 * FTX Premium Motion System - Centralized Tokens
 * Precision engineered timing, custom cubic-bezier easings, and stagger presets.
 */

export const ANIMATION_DURATIONS = {
    FAST: 150, // Micro-interactions, button hover states
    NORMAL: 300, // Standard UI transitions, tooltips, dropdowns
    SMOOTH: 500, // Section reveals, card expansions
    CINEMATIC: 900, // Hero reveals, major page transitions
} as const;

export const ANIMATION_EASINGS = {
    // Ultra-smooth exponential ease-out for luxurious automotive feel
    EASE_OUT_EXPO: "cubic-bezier(0.16, 1, 0.3, 1)",
    // Fluid ease-in-out for seamless state changes
    EASE_IN_OUT_SMOOTH: "cubic-bezier(0.4, 0, 0.2, 1)",
    // Crisp acceleration for subtle exit animations
    EASE_IN_FAST: "cubic-bezier(0.7, 0, 0.84, 0)",
    // Precision linear timing for steady sweeps
    LINEAR: "linear",
} as const;

export const HERO_STAGGER_DELAYS = {
    BACKGROUND: 0,
    AUTOMOTIVE_SUBJECT: 100,
    LOGO: 200,
    HEADLINE: 350,
    DESCRIPTION: 500,
    PRIMARY_CTA: 650,
    SECONDARY_CTA: 750,
    DECORATIVE: 900,
} as const;

export const SERVICE_STAGGER_DELAYS = {
    NUMBER: 0,
    IMAGE: 100,
    HEADING: 180,
    DESCRIPTION: 280,
    CTA: 380,
} as const;

export const REVEAL_TYPES = {
    EDITORIAL: "editorial",
    IMAGE_MASK: "image-mask",
    HORIZONTAL: "horizontal",
    SCALE: "scale",
    HEADING_INSET: "heading-inset",
} as const;

export type RevealType = (typeof REVEAL_TYPES)[keyof typeof REVEAL_TYPES];
